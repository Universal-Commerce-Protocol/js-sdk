// Copyright 2026 UCP Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Post-generation fixes for value constraints quicktype's `typescript-zod`
 * target ignores.
 *
 * quicktype emits object shape + `z.enum` only. It drops every JSON Schema
 * value constraint (`minimum`, `maximum`, `pattern`, `minLength`, `minItems`,
 * `type: integer`, `uniqueItems`, `contains`/`minContains`/`maxContains`, ...),
 * so the generated schemas accept spec-invalid data (e.g.
 * `PriceSchema.parse({ amount: -50 })` succeeds, though `amount` is
 * `{ type: integer, minimum: 0 }`). See js-sdk#33. The python-sdk enforces the
 * same constraints (datamodel-code-generator emits most natively); this script
 * is the JS-side analogue of python-sdk's `postprocess_models.py`.
 *
 * Scalar/length/items constraints render as chained zod methods (`.int()`,
 * `.gte()`, `.regex()`, `.min()`, ...). Array set/cardinality constraints that
 * zod has no native method for render as an appended `.refine()` /
 * `.superRefine()`: `uniqueItems` -> a uniqueness refine; `contains` +
 * `minContains`/`maxContains` -> a cardinality superRefine (e.g. a checkout
 * `totals` array MUST contain exactly one `subtotal` and one `total`). These
 * stay object-scoped like the scalar constraints, so a checkout `totals`
 * (references `types/totals.json`, which carries the `contains` rules) is
 * constrained while a fulfillment-option/line-item `totals` (an inline
 * `total.json` array with no `contains`) is left untouched.
 *
 * Approach (object-scoped, zero-false-positive by construction):
 *   1. Scan the UCP JSON Schemas, resolving `$ref`/`allOf`, and index every
 *      object schema by the sorted set of its property names. For each such
 *      property-set, record each property's value constraints.
 *   2. Discard any property whose constraints are ambiguous within a
 *      property-set (the same shape appearing with conflicting constraints);
 *      those are reported and left untouched.
 *   3. Parse the generated TS (TypeScript compiler API) and, for each
 *      top-level `z.object({...})` whose property-name set exactly matches an
 *      indexed set, splice the corresponding zod constraint methods onto the
 *      matching fields -- only when the generated field's base type agrees
 *      with the constraint (number/string/array), so schema drift can never
 *      produce a wrong or ill-typed injection.
 *
 * Runs from generate_models.sh after normalize-generated-schemas.mjs.
 * Idempotent: constraints already present are detected and skipped.
 *
 * Usage: node scripts/inject-schema-constraints.mjs <schema_dir> <file.ts>
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const [, , schemaDirArg, targetArg] = process.argv;

if (!schemaDirArg || !targetArg) {
  console.error(
    "Usage: node scripts/inject-schema-constraints.mjs <schema_dir> <generated.ts>"
  );
  process.exit(1);
}

const schemaDir = path.resolve(schemaDirArg);
const targetPath = path.resolve(targetArg);

// --- JSON Schema loading + $ref resolution ---------------------------------

const documentCache = new Map();

function loadDocument(file) {
  const absolute = path.resolve(file);
  if (documentCache.has(absolute)) {
    return documentCache.get(absolute);
  }
  const parsed = JSON.parse(fs.readFileSync(absolute, "utf8"));
  documentCache.set(absolute, parsed);
  return parsed;
}

function resolvePointer(document, pointer) {
  let node = document;
  for (const rawSegment of pointer.split("/").filter(Boolean)) {
    const segment = rawSegment.replace(/~1/g, "/").replace(/~0/g, "~");
    node = node?.[segment];
  }
  return node;
}

function resolveRef(ref, baseFile) {
  const hashIndex = ref.indexOf("#");
  const filePart = hashIndex >= 0 ? ref.slice(0, hashIndex) : ref;
  const pointer = hashIndex >= 0 ? ref.slice(hashIndex + 1) : "";
  const targetFile = filePart
    ? path.resolve(path.dirname(baseFile), filePart)
    : baseFile;
  const document = loadDocument(targetFile);
  const node = pointer ? resolvePointer(document, pointer) : document;
  return { node, file: targetFile };
}

// Constraint keywords we can express in zod today. `contains` /
// `minContains` / `maxContains` are array cardinality rules recovered
// separately (see collectContainsGroups) because they may appear more than
// once per array (via `allOf`), which a flat keyword merge cannot represent.
const CONSTRAINT_KEYS = [
  "type",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "pattern",
  "minItems",
  "maxItems",
  "uniqueItems",
];

/** Effective value constraints for a schema node, following $ref + allOf. */
function effectiveConstraints(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 32) {
    return {};
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return {};
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    const base = effectiveConstraints(
      resolved.node,
      resolved.file,
      seen,
      depth + 1
    );
    const local = {};
    for (const keyword of CONSTRAINT_KEYS) {
      if (keyword in node) {
        local[keyword] = node[keyword];
      }
    }
    return { ...base, ...local };
  }
  const out = {};
  for (const keyword of CONSTRAINT_KEYS) {
    if (keyword in node) {
      out[keyword] = node[keyword];
    }
  }
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      const merged = effectiveConstraints(sub, file, new Set(seen), depth + 1);
      for (const keyword of CONSTRAINT_KEYS) {
        if (keyword in merged && !(keyword in out)) {
          out[keyword] = merged[keyword];
        }
      }
    }
  }
  return out;
}

/** Resolve a node to its object form (own properties + allOf-merged ones). */
function resolveObject(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 32) {
    return null;
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return null;
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    return resolveObject(resolved.node, resolved.file, seen, depth + 1);
  }
  let properties = {};
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      const resolved = resolveObject(sub, file, new Set(seen), depth + 1);
      if (resolved) {
        properties = { ...resolved.properties, ...properties };
      }
    }
  }
  if (node.properties && typeof node.properties === "object") {
    properties = { ...properties, ...node.properties };
  }
  return Object.keys(properties).length ? { properties, file } : null;
}

/**
 * A single `contains` cardinality clause: the array MUST hold between `min`
 * and `max` items whose `property` equals `value`. We only recover the
 * common, unambiguous shape `{ contains: { properties: { <p>: { const: <v> }
 * }, required: [<p>] } }`; anything richer is skipped (and reported) rather
 * than guessed at.
 */
function describeContainsClause(clause) {
  const contains = clause && clause.contains;
  if (!contains || typeof contains !== "object" || !contains.properties) {
    return null;
  }
  const entries = Object.entries(contains.properties).filter(
    ([, sub]) => sub && typeof sub === "object" && "const" in sub
  );
  if (entries.length !== 1) {
    return null;
  }
  const [property, sub] = entries[0];
  const clauseObj = { property, value: sub.const };
  // JSON Schema: `contains` without `minContains` implies at least one match.
  clauseObj.min = clause.minContains !== undefined ? clause.minContains : 1;
  if (clause.maxContains !== undefined) {
    clauseObj.max = clause.maxContains;
  }
  return clauseObj;
}

/**
 * Recover every `contains` cardinality clause on an array schema, following
 * `$ref` and collecting from both the node itself and each `allOf` branch
 * (totals declares one clause per required entry type). Returns [] when none.
 */
function collectContainsGroups(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 32) {
    return [];
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return [];
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    return collectContainsGroups(resolved.node, resolved.file, seen, depth + 1);
  }
  const groups = [];
  const direct = describeContainsClause(node);
  if (direct) {
    groups.push(direct);
  }
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      groups.push(...collectContainsGroups(sub, file, new Set(seen), depth + 1));
    }
  }
  return groups;
}

/** Normalize a node's constraints into a canonical descriptor + signature. */
function describeConstraint(propertyNode, file) {
  const eff = effectiveConstraints(propertyNode, file);
  const type = Array.isArray(eff.type)
    ? eff.type.find((entry) => entry !== "null")
    : eff.type;
  const descriptor = {};
  if (type === "integer") descriptor.int = true;
  if (eff.minimum !== undefined) descriptor.minimum = eff.minimum;
  if (eff.maximum !== undefined) descriptor.maximum = eff.maximum;
  if (eff.exclusiveMinimum !== undefined)
    descriptor.exclusiveMinimum = eff.exclusiveMinimum;
  if (eff.exclusiveMaximum !== undefined)
    descriptor.exclusiveMaximum = eff.exclusiveMaximum;
  if (eff.minLength !== undefined) descriptor.minLength = eff.minLength;
  if (eff.maxLength !== undefined) descriptor.maxLength = eff.maxLength;
  if (eff.pattern !== undefined) descriptor.pattern = eff.pattern;
  if (eff.minItems !== undefined) descriptor.minItems = eff.minItems;
  if (eff.maxItems !== undefined) descriptor.maxItems = eff.maxItems;
  if (eff.uniqueItems === true) descriptor.uniqueItems = true;
  const containsGroups = collectContainsGroups(propertyNode, file);
  if (containsGroups.length) descriptor.containsGroups = containsGroups;
  const signature = JSON.stringify(descriptor);
  return Object.keys(descriptor).length ? { descriptor, signature } : null;
}

// --- Build the property-set -> property -> constraint index ----------------

// setKey -> Map(propertyName -> Map(signature -> descriptor))
const constraintIndex = new Map();

function recordObject(properties, file) {
  const setKey = Object.keys(properties).sort().join(",");
  if (!constraintIndex.has(setKey)) {
    constraintIndex.set(setKey, new Map());
  }
  const byProperty = constraintIndex.get(setKey);
  for (const [name, propertyNode] of Object.entries(properties)) {
    const described = describeConstraint(propertyNode, file);
    if (!described) {
      continue;
    }
    if (!byProperty.has(name)) {
      byProperty.set(name, new Map());
    }
    byProperty.get(name).set(described.signature, described.descriptor);
  }
}

function walkSchema(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 64) {
    return;
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    walkSchema(resolved.node, resolved.file, seen, depth + 1);
    return;
  }
  const resolvedObject = resolveObject(node, file);
  if (resolvedObject) {
    recordObject(resolvedObject.properties, resolvedObject.file);
  }
  if (node.properties && typeof node.properties === "object") {
    for (const child of Object.values(node.properties)) {
      walkSchema(child, file, new Set(seen), depth + 1);
    }
  }
  for (const key of ["items", "additionalProperties", "not"]) {
    if (node[key] && typeof node[key] === "object") {
      walkSchema(node[key], file, new Set(seen), depth + 1);
    }
  }
  for (const key of ["allOf", "anyOf", "oneOf"]) {
    if (Array.isArray(node[key])) {
      for (const child of node[key]) {
        walkSchema(child, file, new Set(seen), depth + 1);
      }
    }
  }
  if (node.$defs && typeof node.$defs === "object") {
    for (const child of Object.values(node.$defs)) {
      walkSchema(child, file, new Set(seen), depth + 1);
    }
  }
}

function collectSchemaFiles(directory) {
  const out = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectSchemaFiles(full));
    } else if (entry.name.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

for (const file of collectSchemaFiles(schemaDir)) {
  try {
    walkSchema(loadDocument(file), file);
  } catch {
    // Ignore unreadable / non-schema JSON files.
  }
}

// Resolve each (setKey, property) to a single unambiguous descriptor.
// setKey -> Map(propertyName -> descriptor)
const resolvedIndex = new Map();
const ambiguous = [];
for (const [setKey, byProperty] of constraintIndex) {
  const resolvedProperties = new Map();
  for (const [name, bySignature] of byProperty) {
    if (bySignature.size === 1) {
      resolvedProperties.set(name, [...bySignature.values()][0]);
    } else {
      ambiguous.push({ setKey, name, count: bySignature.size });
    }
  }
  if (resolvedProperties.size) {
    resolvedIndex.set(setKey, resolvedProperties);
  }
}

// --- Zod method rendering --------------------------------------------------

function toRegexLiteral(pattern) {
  // Escape unescaped forward slashes so the pattern is a valid regex literal.
  let out = "";
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    if (ch === "\\") {
      out += ch + (pattern[i + 1] ?? "");
      i += 1;
      continue;
    }
    if (ch === "/") {
      out += "\\/";
      continue;
    }
    out += ch;
  }
  return `/${out}/`;
}

/** `.refine(...)` enforcing JSON Schema `uniqueItems: true`. */
function renderUniqueItemsRefine() {
  return (
    `.refine((items) => new Set(items.map((item) => JSON.stringify(item)))` +
    `.size === items.length, ` +
    `{ message: "Array items must be unique (uniqueItems)" })`
  );
}

/** `.superRefine(...)` enforcing `contains` + `minContains`/`maxContains`. */
function renderContainsRefine(groups) {
  const rules = JSON.stringify(
    groups.map((group) => {
      const rule = { property: group.property, value: group.value };
      if (group.min !== undefined) rule.min = group.min;
      if (group.max !== undefined) rule.max = group.max;
      return rule;
    })
  );
  return (
    `.superRefine((items, ctx) => {` +
    `for (const rule of ${rules}) {` +
    `const matches = items.filter((item) => item != null && ` +
    `(item as Record<string, unknown>)[rule.property] === rule.value).length;` +
    `if (rule.min !== undefined && matches < rule.min) {` +
    `ctx.addIssue({ code: z.ZodIssueCode.custom, message: ` +
    "`Array must contain at least ${rule.min} item(s) where " +
    "${rule.property} = ${JSON.stringify(rule.value)} (minContains)` });" +
    `}` +
    `if (rule.max !== undefined && matches > rule.max) {` +
    `ctx.addIssue({ code: z.ZodIssueCode.custom, message: ` +
    "`Array must contain at most ${rule.max} item(s) where " +
    "${rule.property} = ${JSON.stringify(rule.value)} (maxContains)` });" +
    `}}})`
  );
}

/**
 * Zod methods for a descriptor given the generated field's base kind.
 * Returns null when the base kind is incompatible with the constraint
 * (schema drift guard) so nothing is injected.
 */
function methodsFor(descriptor, baseKind) {
  const methods = [];
  const isNumeric =
    descriptor.int !== undefined ||
    descriptor.minimum !== undefined ||
    descriptor.maximum !== undefined ||
    descriptor.exclusiveMinimum !== undefined ||
    descriptor.exclusiveMaximum !== undefined;
  const isString =
    descriptor.minLength !== undefined ||
    descriptor.maxLength !== undefined ||
    descriptor.pattern !== undefined;
  const isArray =
    descriptor.minItems !== undefined ||
    descriptor.maxItems !== undefined ||
    descriptor.uniqueItems !== undefined ||
    descriptor.containsGroups !== undefined;

  if (isNumeric) {
    if (baseKind !== "number") return null;
    if (descriptor.int) methods.push(".int()");
    if (descriptor.minimum !== undefined)
      methods.push(`.gte(${descriptor.minimum})`);
    if (descriptor.maximum !== undefined)
      methods.push(`.lte(${descriptor.maximum})`);
    if (descriptor.exclusiveMinimum !== undefined)
      methods.push(`.gt(${descriptor.exclusiveMinimum})`);
    if (descriptor.exclusiveMaximum !== undefined)
      methods.push(`.lt(${descriptor.exclusiveMaximum})`);
  } else if (isString) {
    if (baseKind !== "string") return null;
    if (
      descriptor.minLength !== undefined &&
      descriptor.minLength === descriptor.maxLength
    ) {
      methods.push(`.length(${descriptor.minLength})`);
    } else {
      if (descriptor.minLength !== undefined)
        methods.push(`.min(${descriptor.minLength})`);
      if (descriptor.maxLength !== undefined)
        methods.push(`.max(${descriptor.maxLength})`);
    }
    if (descriptor.pattern !== undefined)
      methods.push(`.regex(${toRegexLiteral(descriptor.pattern)})`);
  } else if (isArray) {
    if (baseKind !== "array") return null;
    if (descriptor.minItems !== undefined)
      methods.push(`.min(${descriptor.minItems})`);
    if (descriptor.maxItems !== undefined)
      methods.push(`.max(${descriptor.maxItems})`);
    if (descriptor.uniqueItems) methods.push(renderUniqueItemsRefine());
    if (descriptor.containsGroups)
      methods.push(renderContainsRefine(descriptor.containsGroups));
  }
  return methods.length ? methods : null;
}

// --- Locate the base zod constructor call in a field expression ------------

/**
 * Given a property initializer expression, find the leftmost base call
 * (`z.number()`, `z.string()`, `z.array(...)`, ...) and its base kind.
 * Returns { end, kind } where `end` is the position just after the base
 * call's closing paren -- the splice point for constraint methods.
 */
function findBaseCall(expression, sourceFile) {
  // Descend the call/property-access chain to the innermost `z.<name>(...)`.
  let node = expression;
  const callStack = [];
  while (ts.isCallExpression(node)) {
    callStack.push(node);
    const callee = node.expression;
    if (ts.isPropertyAccessExpression(callee)) {
      node = callee.expression;
    } else {
      break;
    }
  }
  // The base call is the last one pushed (deepest / leftmost).
  const baseCall = callStack[callStack.length - 1];
  if (!baseCall || !ts.isCallExpression(baseCall)) {
    return null;
  }
  const callee = baseCall.expression;
  if (!ts.isPropertyAccessExpression(callee)) {
    return null;
  }
  if (!ts.isIdentifier(callee.expression) || callee.expression.text !== "z") {
    return null;
  }
  const method = callee.name.text;
  let kind = null;
  if (method === "number") kind = "number";
  else if (method === "string") kind = "string";
  else if (method === "array") kind = "array";
  else return null;
  return { end: baseCall.getEnd(), kind, baseCall };
}

/**
 * Detect whether constraint methods are already present immediately after the
 * base call (idempotency): look at the chain wrapping the base call.
 */
function alreadyConstrained(baseCall) {
  const parent = baseCall.parent;
  // base is `z.number()`; wrapped as PropertyAccess(base).name
  if (parent && ts.isPropertyAccessExpression(parent)) {
    const method = parent.name.text;
    const CONSTRAINT_METHODS = new Set([
      "int",
      "gte",
      "lte",
      "gt",
      "lt",
      "min",
      "max",
      "length",
      "regex",
      "refine",
      "superRefine",
    ]);
    if (CONSTRAINT_METHODS.has(method)) {
      return true;
    }
  }
  return false;
}

// --- Parse the generated file and compute edits ----------------------------

const sourceText = fs.readFileSync(targetPath, "utf8");
const sourceFile = ts.createSourceFile(
  targetPath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const edits = []; // { pos, text }
const report = {
  objectsMatched: 0,
  fieldsInjected: 0,
  fieldsSkippedType: 0,
  fieldsAlreadyDone: 0,
  injections: [],
};

function objectLiteralPropertySet(objectLiteral) {
  const names = [];
  for (const prop of objectLiteral.properties) {
    if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
      names.push(prop.name.text);
    } else if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.name)) {
      names.push(prop.name.text);
    } else {
      return null; // spreads / computed / shorthand -> bail out
    }
  }
  return names;
}

function handleObjectLiteral(objectLiteral) {
  const names = objectLiteralPropertySet(objectLiteral);
  if (!names) {
    return;
  }
  const setKey = [...names].sort().join(",");
  const resolvedProperties = resolvedIndex.get(setKey);
  if (!resolvedProperties) {
    return;
  }
  let matchedAny = false;
  for (const prop of objectLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }
    const name =
      ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
        ? prop.name.text
        : null;
    if (!name) {
      continue;
    }
    const descriptor = resolvedProperties.get(name);
    if (!descriptor) {
      continue;
    }
    const base = findBaseCall(prop.initializer, sourceFile);
    if (!base) {
      report.fieldsSkippedType += 1;
      continue;
    }
    if (alreadyConstrained(base.baseCall)) {
      report.fieldsAlreadyDone += 1;
      matchedAny = true;
      continue;
    }
    const methods = methodsFor(descriptor, base.kind);
    if (!methods) {
      report.fieldsSkippedType += 1;
      continue;
    }
    edits.push({ pos: base.end, text: methods.join("") });
    report.fieldsInjected += 1;
    report.injections.push(`${setKey} :: ${name} ${methods.join("")}`);
    matchedAny = true;
  }
  if (matchedAny) {
    report.objectsMatched += 1;
  }
}

function visit(node) {
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === "z" &&
    node.expression.name.text === "object" &&
    node.arguments.length === 1 &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    handleObjectLiteral(node.arguments[0]);
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

// Apply edits back-to-front so positions stay valid.
edits.sort((a, b) => b.pos - a.pos);
let output = sourceText;
for (const edit of edits) {
  output = output.slice(0, edit.pos) + edit.text + output.slice(edit.pos);
}

fs.writeFileSync(targetPath, output);

// --- Report ----------------------------------------------------------------

process.stdout.write(
  `inject-schema-constraints: ${report.fieldsInjected} field(s) constrained ` +
    `across ${report.objectsMatched} object schema(s); ` +
    `${report.fieldsAlreadyDone} already constrained; ` +
    `${report.fieldsSkippedType} skipped (base-type mismatch).\n`
);
if (ambiguous.length) {
  process.stdout.write(
    `inject-schema-constraints: ${ambiguous.length} property(ies) left ` +
      `untouched (ambiguous constraints within a property-set): ` +
      ambiguous.map((a) => `${a.name}@{${a.setKey}}`).join(", ") +
      "\n"
  );
}
