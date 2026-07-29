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
 * `type: integer`, ...), so the generated schemas accept spec-invalid data
 * (e.g. `PriceSchema.parse({ amount: -50 })` succeeds, though `amount` is
 * `{ type: integer, minimum: 0 }`). See js-sdk#33. The python-sdk enforces the
 * same constraints (datamodel-code-generator emits most natively); this script
 * is the JS-side analogue of python-sdk's `postprocess_models.py`.
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

// Constraint keywords we can express in zod today.
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
    descriptor.minItems !== undefined || descriptor.maxItems !== undefined;

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
