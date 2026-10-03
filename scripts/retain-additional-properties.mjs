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
 * Keep the unknown keys that an open object schema admits.
 *
 * quicktype renders every object as a bare `z.object({...})`, and a bare
 * z.object strips unknown keys on parse. An object the spec declares open
 * (`additionalProperties: true`) therefore silently lost data: a complete
 * checkout request dropped `payment.instruments[].credential.token` (the
 * instrument credential is the open payment_credential.json base), and a
 * checkout parsed with the base schema dropped every extension field
 * (`fulfillment`, `discounts`, ...). This splices `.catchall(z.any())` directly
 * after each such `z.object(...)` call, ahead of any refinement the constraint
 * injector chained there (a refined schema no longer has `.catchall`), the same
 * retention inject-schema-constraints.mjs renders alongside `propertyNames` and
 * `minProperties`.
 *
 * Matching follows the constraint injector: every object schema is indexed by
 * its sorted property-name set, and a generated `z.object` whose set matches
 * is judged by every source occurrence of that set. Each occurrence is "open"
 * (`true` on it or on a schema it composes via `$ref`/`allOf`), "closed"
 * (`false` anywhere in that composition), "schema" (a schema-valued keyword)
 * or "default" (no keyword). JSON Schema treats an absent keyword as open too;
 * this step acts on the explicit keyword only, so an object that says neither
 * keeps its current behavior.
 *
 * Only a set whose occurrences are ALL open is retained. quicktype merges
 * structurally identical objects, so one generated schema can stand for
 * several sources, and an unrelated object can share a property set by
 * coincidence; either way, extra keys are kept only when every source admits
 * them. A set that is also closed somewhere, or also belongs to a source that
 * never declared itself open, is left as generated: `{methods}` is both the
 * open catalog fulfillment and the checkout fulfillment request, which is not,
 * and the generated object is the latter.
 *
 * The decision is taken over every tree the models are generated from at once
 * (the authored tree, the request/response projection and the discovery
 * shapes), because a generated object can stand for sources in more than one
 * of them. Composition branches (`allOf`/`anyOf`/`oneOf` members) are not
 * occurrences: a branch only ever applies together with the schema that
 * composes it, so its own keyword says nothing about the composed object.
 *
 * Runs from generate_models.sh after inject-schema-constraints.mjs.
 * Idempotent: an object whose chain already carries `.catchall`,
 * `.passthrough`, `.strict` or `.strip` is left alone.
 *
 * Usage:
 *   node scripts/retain-additional-properties.mjs <generated.ts> <schema_dir>...
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const [, , targetArg, ...schemaDirArgs] = process.argv;

if (!targetArg || !schemaDirArgs.length) {
  console.error(
    "Usage: node scripts/retain-additional-properties.mjs <generated.ts> <schema_dir>..."
  );
  process.exit(1);
}

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

/** Property names of an object schema, own plus those composed via allOf. */
function resolvePropertyNames(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 32) {
    return new Set();
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return new Set();
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    return resolvePropertyNames(resolved.node, resolved.file, seen, depth + 1);
  }
  const names = new Set();
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      for (const name of resolvePropertyNames(
        sub,
        file,
        new Set(seen),
        depth + 1
      )) {
        names.add(name);
      }
    }
  }
  if (node.properties && typeof node.properties === "object") {
    for (const name of Object.keys(node.properties)) {
      names.add(name);
    }
  }
  return names;
}

/**
 * Every `additionalProperties` value that applies to an object instance: the
 * node's own plus those of the schemas it composes via `$ref` and `allOf`.
 * token_credential.json declares no keyword of its own but composes
 * payment_credential.json, which is open, so a token credential is open too.
 */
function collectAdditionalProperties(node, file, seen = new Set(), depth = 0) {
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
    return collectAdditionalProperties(
      resolved.node,
      resolved.file,
      seen,
      depth + 1
    );
  }
  const values = [];
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      values.push(
        ...collectAdditionalProperties(sub, file, new Set(seen), depth + 1)
      );
    }
  }
  if ("additionalProperties" in node) {
    values.push(node.additionalProperties);
  }
  return values;
}

function disposition(node, file) {
  const values = collectAdditionalProperties(node, file);
  if (values.includes(false)) return "closed";
  if (values.some((value) => value && typeof value === "object")) {
    return "schema";
  }
  if (values.includes(true)) return "open";
  return "default";
}

// --- Index every object occurrence by property set --------------------------

// setKey -> Set(disposition)
const dispositionIndex = new Map();

const SCHEMA_KEYWORDS = [
  "$ref",
  "type",
  "properties",
  "items",
  "allOf",
  "anyOf",
  "oneOf",
];

function walkSchema(node, file, seen = new Set(), depth = 0, branch = false) {
  if (!node || typeof node !== "object" || depth > 64) {
    return;
  }
  // The projected tree does not carry every authored file (capability.json,
  // for one), so a ref inside a projected capability declaration can dangle.
  // Such a node records nothing, and the rest of its file is still walked.
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    let resolved;
    try {
      resolved = resolveRef(node.$ref, file);
    } catch {
      return;
    }
    walkSchema(resolved.node, resolved.file, seen, depth + 1, branch);
    return;
  }
  if (!branch) {
    try {
      const names = resolvePropertyNames(node, file);
      if (names.size) {
        const setKey = [...names].sort().join(",");
        const value = disposition(node, file);
        if (!dispositionIndex.has(setKey)) {
          dispositionIndex.set(setKey, new Set());
        }
        dispositionIndex.get(setKey).add(value);
      }
    } catch {
      // A composed schema that does not resolve cannot be judged.
    }
  }
  if (node.properties && typeof node.properties === "object") {
    for (const child of Object.values(node.properties)) {
      walkSchema(child, file, new Set(seen), depth + 1);
    }
  }
  for (const key of ["items", "additionalProperties"]) {
    if (node[key] && typeof node[key] === "object") {
      walkSchema(node[key], file, new Set(seen), depth + 1);
    }
  }
  for (const key of ["allOf", "anyOf", "oneOf"]) {
    if (Array.isArray(node[key])) {
      for (const child of node[key]) {
        walkSchema(child, file, new Set(seen), depth + 1, true);
      }
    }
  }
  if (node.$defs && typeof node.$defs === "object") {
    for (const child of Object.values(node.$defs)) {
      walkSchema(child, file, new Set(seen), depth + 1);
      // A capability declares its platform/business/response schema roles
      // under a `$defs` key equal to its reverse domain name. That entry holds
      // schemas rather than being one, so walk its members.
      if (
        child &&
        typeof child === "object" &&
        !SCHEMA_KEYWORDS.some((keyword) => keyword in child)
      ) {
        for (const role of Object.values(child)) {
          walkSchema(role, file, new Set(seen), depth + 1);
        }
      }
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

for (const schemaDir of schemaDirArgs) {
  for (const file of collectSchemaFiles(path.resolve(schemaDir))) {
    try {
      walkSchema(loadDocument(file), file);
    } catch {
      // Ignore unreadable / non-schema JSON files.
    }
  }
}

// --- Splice `.catchall(z.any())` onto the open generated objects -------------

const sourceText = fs.readFileSync(targetPath, "utf8");
const sourceFile = ts.createSourceFile(
  targetPath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const UNKNOWN_KEY_METHODS = new Set([
  "catchall",
  "passthrough",
  "strict",
  "strip",
]);

/**
 * Whether the method chain wrapping a `z.object({...})` call already decides
 * what happens to unknown keys.
 */
function unknownKeysDecided(objectCall) {
  let outer = objectCall;
  while (
    outer.parent &&
    ts.isPropertyAccessExpression(outer.parent) &&
    outer.parent.expression === outer &&
    outer.parent.parent &&
    ts.isCallExpression(outer.parent.parent)
  ) {
    if (UNKNOWN_KEY_METHODS.has(outer.parent.name.text)) {
      return true;
    }
    outer = outer.parent.parent;
  }
  return false;
}

function objectLiteralPropertySet(objectLiteral) {
  const names = [];
  for (const prop of objectLiteral.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))
    ) {
      names.push(prop.name.text);
    } else {
      return null; // spreads / computed / shorthand -> bail out
    }
  }
  return names;
}

function owningDeclaration(node) {
  let current = node;
  while (current && !ts.isVariableDeclaration(current)) {
    current = current.parent;
  }
  return current && ts.isIdentifier(current.name) ? current.name.text : "?";
}

const edits = [];
const report = { retained: 0, alreadyDecided: 0, leftAsIs: [] };

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
    const names = objectLiteralPropertySet(node.arguments[0]);
    const dispositions = names
      ? dispositionIndex.get([...names].sort().join(","))
      : undefined;
    if (dispositions?.has("open")) {
      if (dispositions.size > 1) {
        report.leftAsIs.push(
          `${owningDeclaration(node)} (${[...dispositions].sort().join("+")})`
        );
      } else if (unknownKeysDecided(node)) {
        report.alreadyDecided += 1;
      } else {
        edits.push({ pos: node.getEnd(), text: ".catchall(z.any())" });
        report.retained += 1;
      }
    }
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

edits.sort((a, b) => b.pos - a.pos);
let output = sourceText;
for (const edit of edits) {
  output = output.slice(0, edit.pos) + edit.text + output.slice(edit.pos);
}

fs.writeFileSync(targetPath, output);

process.stdout.write(
  `retain-additional-properties: ${report.retained} open object schema(s) ` +
    `retain unknown keys; ${report.alreadyDecided} already decided.\n`
);
if (report.leftAsIs.length) {
  process.stdout.write(
    `retain-additional-properties: ${report.leftAsIs.length} object ` +
      `schema(s) left as generated (a source of the same shape is not open): ` +
      report.leftAsIs.join(", ") +
      "\n"
  );
}
