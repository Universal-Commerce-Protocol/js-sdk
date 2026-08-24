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
  "minProperties",
  "format",
];

/**
 * JSON Schema `format` values with a direct zod string refinement.
 *
 * Deliberately partial. `uri-reference` is absent because a relative
 * reference is not a URL and `.url()` would reject valid values. An unlisted
 * format contributes no constraint rather than a wrong one.
 *
 * `date-time` is special: the spec type is `string` (RFC 3339 date-time), but
 * quicktype emits `z.coerce.date()` for it, which accepts a raw number and a
 * date-only string, and parses to a JS `Date` so a round-trip re-serializes a
 * changed value. When the schema says `format: date-time` and the generated
 * base is `z.coerce.date()`, the injector REPLACES the base with `z.string()`
 * and then chains this method, restoring both the wire type and the format.
 */
const STRING_FORMAT_METHODS = {
  uri: ".url()",
  "date-time": ".datetime({ offset: true })",
};

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
  let propertyFiles = {};
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      const resolved = resolveObject(sub, file, new Set(seen), depth + 1);
      if (resolved) {
        properties = { ...resolved.properties, ...properties };
        propertyFiles = { ...resolved.propertyFiles, ...propertyFiles };
      }
    }
  }
  if (node.properties && typeof node.properties === "object") {
    properties = { ...properties, ...node.properties };
    // Own properties live in this file, so their (possibly relative) $refs
    // resolve against it, not against the object that inherits them via allOf.
    for (const name of Object.keys(node.properties)) {
      propertyFiles[name] = file;
    }
  }
  return Object.keys(properties).length
    ? { properties, propertyFiles, file }
    : null;
}

/**
 * Resolve a `propertyNames` subschema to its literal regex `pattern`, following
 * a `$ref` (e.g. `signals.json` inlines the pattern; `ucp.json` maps `$ref`
 * `reverse_domain_name.json`). Returns the pattern string exactly as authored in
 * the source schema (never a hand-copied literal), or null when the constraint
 * is not a plain string pattern we can express as a zod key check.
 */
function resolvePropertyNamesPattern(node, file, seen = new Set(), depth = 0) {
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
    return resolvePropertyNamesPattern(
      resolved.node,
      resolved.file,
      seen,
      depth + 1
    );
  }
  return typeof node.pattern === "string" ? node.pattern : null;
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
      groups.push(
        ...collectContainsGroups(sub, file, new Set(seen), depth + 1)
      );
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
  // Only a format this generator can express is carried; anything else is
  // dropped here so it can never reach methodsFor or alter a signature.
  if (STRING_FORMAT_METHODS[eff.format] !== undefined)
    descriptor.format = eff.format;
  if (eff.minItems !== undefined) descriptor.minItems = eff.minItems;
  if (eff.maxItems !== undefined) descriptor.maxItems = eff.maxItems;
  if (eff.uniqueItems === true) descriptor.uniqueItems = true;
  if (eff.minProperties !== undefined)
    descriptor.minProperties = eff.minProperties;
  const propertyNamesPattern = resolvePropertyNamesPattern(
    propertyNode.propertyNames,
    file
  );
  if (propertyNamesPattern !== null)
    descriptor.propertyNamesPattern = propertyNamesPattern;
  const containsGroups = collectContainsGroups(propertyNode, file);
  if (containsGroups.length) descriptor.containsGroups = containsGroups;
  const signature = JSON.stringify(descriptor);
  return Object.keys(descriptor).length ? { descriptor, signature } : null;
}

/**
 * Recover the constrained oneOf shape quicktype renders as a scalar union:
 *   string | non-empty array<string>
 *
 * capability.json's `extends` field is the pinned example. Each branch carries
 * its own value constraints (the scalar string's reverse-domain pattern, the
 * array branch's minItems, and the array item pattern), but the generic field
 * injector only sees one generated `z.union(...)` base and cannot attach those
 * branch-local methods safely. Keep this index separate and deliberately narrow:
 * exactly one string branch and one array-of-string branch, with no guessing for
 * richer unions.
 */
function describeStringArrayUnionConstraint(
  propertyNode,
  file,
  seen = new Set(),
  depth = 0
) {
  if (!propertyNode || typeof propertyNode !== "object" || depth > 32) {
    return null;
  }
  if (typeof propertyNode.$ref === "string") {
    const key = `${file}|${propertyNode.$ref}`;
    if (seen.has(key)) {
      return null;
    }
    seen.add(key);
    const resolved = resolveRef(propertyNode.$ref, file);
    return describeStringArrayUnionConstraint(
      resolved.node,
      resolved.file,
      seen,
      depth + 1
    );
  }
  const branches = Array.isArray(propertyNode.oneOf)
    ? propertyNode.oneOf
    : propertyNode.anyOf;
  if (!Array.isArray(branches) || branches.length !== 2) {
    return null;
  }
  let stringBranch = null;
  let arrayBranch = null;
  let arrayItemBranch = null;
  for (const branch of branches) {
    const eff = effectiveConstraints(branch, file);
    const type = Array.isArray(eff.type)
      ? eff.type.find((entry) => entry !== "null")
      : eff.type;
    if (type === "string" && stringBranch === null) {
      const described = describeConstraint(branch, file);
      if (!described) return null;
      stringBranch = described.descriptor;
      continue;
    }
    if (type === "array" && arrayBranch === null) {
      if (!branch.items || typeof branch.items !== "object") return null;
      const itemEff = effectiveConstraints(branch.items, file);
      const itemType = Array.isArray(itemEff.type)
        ? itemEff.type.find((entry) => entry !== "null")
        : itemEff.type;
      if (itemType !== "string") return null;
      const describedArray = describeConstraint(branch, file);
      const describedItem = describeConstraint(branch.items, file);
      if (!describedArray || !describedItem) return null;
      arrayBranch = describedArray.descriptor;
      arrayItemBranch = describedItem.descriptor;
      continue;
    }
    return null;
  }
  if (!stringBranch || !arrayBranch || !arrayItemBranch) {
    return null;
  }
  const descriptor = {
    string: stringBranch,
    array: arrayBranch,
    item: arrayItemBranch,
  };
  const signature = JSON.stringify(descriptor);
  return { descriptor, signature };
}

// --- Build the property-set -> property -> constraint index ----------------

// setKey -> Map(propertyName -> Map(signature -> descriptor))
const constraintIndex = new Map();

// Scalar number kinds are also indexed even when they carry no value constraint.
// The generic constraint index deliberately omits an unconstrained `number`, but
// contextual splits must be able to distinguish it from `integer` when quicktype
// merges two same-shape objects.
// setKey -> Map(propertyName -> Set("number" | "integer"))
const scalarTypeIndex = new Map();

// Constrained scalar unions (`string | array<string>`) keyed like field
// constraints, but rendered by replacing the generated `z.union(...)` call
// rather than appending one method to a single base constructor.
// setKey -> Map(propertyName -> Map(signature -> descriptor))
const stringArrayUnionIndex = new Map();

// Object-level `propertyNames` (a key-name constraint, not a per-field one) for
// objects that declare it alongside named `properties` -- the extra-allow +
// named-field shape (`signals.json`: reverse-domain key pattern + named
// dev.ucp.* fields + `additionalProperties: true`) that quicktype renders as a
// plain `z.object`, dropping both the key pattern and the extra-key retention.
// Pure dict-map `propertyNames` (no named `properties`, e.g. ucp.json's
// registries) render as `z.record` and are intentionally not handled here; they
// need a distinct record-key mechanism. setKey -> Map(signature -> descriptor).
const propertyNamesIndex = new Map();

// Object-level `minProperties`, keyed by the generated object's sorted named
// property set. The descriptor also records whether unknown properties must be
// retained before counting, matching JSON Schema's default extra-key behavior.
// setKey -> Map(signature -> descriptor).
const minPropertiesIndex = new Map();

// Object-level numeric constraints guarded by a simple discriminator condition.
// Every resolved object shape records either its canonical rule list or an empty
// list, so a shape used both with and without conditions becomes ambiguous and
// is left untouched. setKey -> Map(signature -> rules).
const conditionalIndex = new Map();

// Per-variant required rules recovered from discriminated variant unions
// (recordVariantUnionRules), keyed by the UNION property set -- the property
// set of the z.object quicktype collapses the union into. Kept separate from
// conditionalIndex; see recordVariantUnionRules for the interplay rules.
// setKey -> Map(signature -> rules).
const variantUnionIndex = new Map();

function recordObject(properties, file, propertyFiles) {
  const setKey = Object.keys(properties).sort().join(",");
  if (!constraintIndex.has(setKey)) {
    constraintIndex.set(setKey, new Map());
  }
  if (!scalarTypeIndex.has(setKey)) {
    scalarTypeIndex.set(setKey, new Map());
  }
  const byProperty = constraintIndex.get(setKey);
  const scalarTypesByProperty = scalarTypeIndex.get(setKey);
  for (const [name, propertyNode] of Object.entries(properties)) {
    // Each property carries the file it was authored in (it may have been
    // inherited into this object via a cross-file `$ref`/`allOf`, in which
    // case its own relative `$ref`s must resolve against that file, not the
    // inheriting object's). Fall back to the object's file when unset.
    const propertyFile = (propertyFiles && propertyFiles[name]) || file;
    const effective = effectiveConstraints(propertyNode, propertyFile);
    const scalarType = Array.isArray(effective.type)
      ? effective.type.find((entry) => entry !== "null")
      : effective.type;
    if (scalarType === "number" || scalarType === "integer") {
      if (!scalarTypesByProperty.has(name)) {
        scalarTypesByProperty.set(name, new Set());
      }
      scalarTypesByProperty.get(name).add(scalarType);
    }
    const described = describeConstraint(propertyNode, propertyFile);
    if (described) {
      if (!byProperty.has(name)) {
        byProperty.set(name, new Map());
      }
      byProperty.get(name).set(described.signature, described.descriptor);
    }
    const describedUnion = describeStringArrayUnionConstraint(
      propertyNode,
      propertyFile
    );
    if (describedUnion) {
      if (!stringArrayUnionIndex.has(setKey)) {
        stringArrayUnionIndex.set(setKey, new Map());
      }
      const unionByProperty = stringArrayUnionIndex.get(setKey);
      if (!unionByProperty.has(name)) {
        unionByProperty.set(name, new Map());
      }
      unionByProperty
        .get(name)
        .set(describedUnion.signature, describedUnion.descriptor);
    }
  }
}

/**
 * Record an object-level `propertyNames` key constraint, keyed like the scalar
 * index by the object's sorted named-property set. Only the extra-allow +
 * named-field shape is recorded: named `properties` are present (so the
 * generated schema is a `z.object`, not a `z.record`), `additionalProperties` is
 * `true` (extras allowed, so they must be retained AND key-checked), and the
 * key constraint resolves to a literal pattern. `propertyNames` on an `allOf`
 * branch is followed like the scalar merge (first branch wins).
 */
function recordPropertyNames(node, properties, file) {
  let propertyNames = node.propertyNames;
  let additionalProperties = node.additionalProperties;
  if (propertyNames === undefined && Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      if (sub && typeof sub === "object" && sub.propertyNames !== undefined) {
        propertyNames = sub.propertyNames;
        if (additionalProperties === undefined) {
          additionalProperties = sub.additionalProperties;
        }
        break;
      }
    }
  }
  if (propertyNames === undefined || additionalProperties !== true) {
    return;
  }
  const pattern = resolvePropertyNamesPattern(propertyNames, file);
  if (pattern === null) {
    return;
  }
  const setKey = Object.keys(properties).sort().join(",");
  const descriptor = { pattern };
  const signature = JSON.stringify(descriptor);
  if (!propertyNamesIndex.has(setKey)) {
    propertyNamesIndex.set(setKey, new Map());
  }
  propertyNamesIndex.get(setKey).set(signature, descriptor);
}

function recordMinProperties(node, properties) {
  let minProperties = node.minProperties;
  let additionalProperties = node.additionalProperties;
  if (minProperties === undefined && Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      if (sub && typeof sub === "object" && sub.minProperties !== undefined) {
        minProperties = sub.minProperties;
        if (additionalProperties === undefined) {
          additionalProperties = sub.additionalProperties;
        }
        break;
      }
    }
  }
  if (minProperties === undefined) {
    return;
  }
  const setKey = Object.keys(properties).sort().join(",");
  const descriptor = {
    minimum: minProperties,
    retainAdditionalProperties: additionalProperties !== false,
  };
  const signature = JSON.stringify(descriptor);
  if (!minPropertiesIndex.has(setKey)) {
    minPropertiesIndex.set(setKey, new Map());
  }
  minPropertiesIndex.get(setKey).set(signature, descriptor);
}

function numericBounds(node) {
  if (!node || typeof node !== "object") return null;
  const descriptor = {};
  for (const keyword of [
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
  ]) {
    if (typeof node[keyword] === "number") descriptor[keyword] = node[keyword];
  }
  return Object.keys(descriptor).length ? descriptor : null;
}

function describeConditionalRule(branch, properties) {
  const condition = branch?.if;
  const consequence = branch?.then;
  if (
    !condition ||
    !consequence ||
    Object.keys(branch).some((key) => key !== "if" && key !== "then") ||
    Object.keys(condition).some(
      (key) => key !== "properties" && key !== "required"
    ) ||
    !condition.properties
  ) {
    return null;
  }
  const conditionEntries = Object.entries(condition.properties);
  if (conditionEntries.length !== 1) {
    return null;
  }
  const [discriminator, rawDiscriminatorNode] = conditionEntries[0];
  if (
    !Array.isArray(condition.required) ||
    condition.required.length !== 1 ||
    condition.required[0] !== discriminator ||
    rawDiscriminatorNode == null ||
    typeof rawDiscriminatorNode !== "object"
  ) {
    return null;
  }
  // A `not` wrapper negates the match: the rule fires for every discriminator
  // value EXCEPT the wrapped set (e.g. `type: { not: { enum: [...] } }` ->
  // custom total types, which the schema requires to carry display_text).
  let negated = false;
  let discriminatorNode = rawDiscriminatorNode;
  if (
    Object.keys(rawDiscriminatorNode).length === 1 &&
    rawDiscriminatorNode.not != null &&
    typeof rawDiscriminatorNode.not === "object" &&
    !Array.isArray(rawDiscriminatorNode.not)
  ) {
    negated = true;
    discriminatorNode = rawDiscriminatorNode.not;
  }
  if (
    Object.keys(discriminatorNode).some(
      (key) => key !== "const" && key !== "enum"
    )
  ) {
    return null;
  }
  let values;
  if ("const" in discriminatorNode) {
    values = [discriminatorNode.const];
  } else if (
    Array.isArray(discriminatorNode.enum) &&
    discriminatorNode.enum.length
  ) {
    values = discriminatorNode.enum;
  } else {
    return null;
  }
  if (
    values.some(
      (value) =>
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
    )
  ) {
    return null;
  }
  const consequenceKeys = Object.keys(consequence);
  if (
    consequenceKeys.length === 1 &&
    consequenceKeys[0] === "required" &&
    Array.isArray(consequence.required) &&
    consequence.required.length &&
    consequence.required.every(
      (name) => typeof name === "string" && name in properties
    )
  ) {
    return {
      kind: "required",
      discriminator,
      values,
      negated,
      required: [...consequence.required].sort(),
    };
  }
  if (
    consequenceKeys.length !== 1 ||
    consequenceKeys[0] !== "properties" ||
    !consequence.properties
  ) {
    return null;
  }
  const consequenceEntries = Object.entries(consequence.properties);
  if (consequenceEntries.length !== 1) {
    return null;
  }
  const [target, targetNode] = consequenceEntries[0];
  const bounds = numericBounds(targetNode);
  if (!bounds || Object.keys(targetNode).some((key) => !(key in bounds))) {
    return null;
  }
  return { kind: "numeric", discriminator, values, negated, target, ...bounds };
}

function recordConditionalRules(node, properties) {
  const branches = [];
  let unsupported = false;
  if ("if" in node || "then" in node || "else" in node) {
    if ("else" in node || !("if" in node) || !("then" in node)) {
      unsupported = true;
    } else {
      branches.push({ if: node.if, then: node.then });
    }
  }
  if (Array.isArray(node.allOf)) {
    for (const branch of node.allOf) {
      if (
        branch &&
        typeof branch === "object" &&
        ("if" in branch || "then" in branch || "else" in branch)
      ) {
        branches.push(branch);
      }
    }
  }
  const rules = [];
  for (const branch of branches) {
    const rule = describeConditionalRule(branch, properties);
    if (!rule) {
      unsupported = true;
      break;
    }
    rules.push(rule);
  }
  if (unsupported) rules.length = 0;
  rules.sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right))
  );
  const setKey = Object.keys(properties).sort().join(",");
  const signature = JSON.stringify(rules);
  if (!conditionalIndex.has(setKey)) conditionalIndex.set(setKey, new Map());
  conditionalIndex.get(setKey).set(signature, rules);
}

/**
 * Resolve a union branch to its full variant form: properties, per-property
 * source files, and the variant's own `required` list ($ref and allOf
 * followed, like resolveObject, which does not collect `required`).
 */
function resolveVariant(node, file, seen = new Set(), depth = 0) {
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
    return resolveVariant(resolved.node, resolved.file, seen, depth + 1);
  }
  let properties = {};
  let propertyFiles = {};
  let required = [];
  if (Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      const resolved = resolveVariant(sub, file, new Set(seen), depth + 1);
      if (resolved) {
        properties = { ...resolved.properties, ...properties };
        propertyFiles = { ...resolved.propertyFiles, ...propertyFiles };
        required = [...new Set([...required, ...resolved.required])];
      }
    }
  }
  if (node.properties && typeof node.properties === "object") {
    properties = { ...properties, ...node.properties };
    for (const name of Object.keys(node.properties)) {
      propertyFiles[name] = file;
    }
  }
  if (Array.isArray(node.required)) {
    const own = node.required.filter((name) => typeof name === "string");
    required = [...new Set([...required, ...own])];
  }
  return Object.keys(properties).length
    ? { properties, propertyFiles, required, file }
    : null;
}

/** Literal scalar `const` of a property node, following $ref. */
function resolveConstValue(node, file, seen = new Set(), depth = 0) {
  if (!node || typeof node !== "object" || depth > 32) {
    return undefined;
  }
  if (typeof node.$ref === "string") {
    const key = `${file}|${node.$ref}`;
    if (seen.has(key)) {
      return undefined;
    }
    seen.add(key);
    const resolved = resolveRef(node.$ref, file);
    return resolveConstValue(resolved.node, resolved.file, seen, depth + 1);
  }
  const value = node.const;
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
    ? value
    : undefined;
}

/**
 * A oneOf/anyOf of complete object variants discriminated by a shared
 * required const property (types/message.json: the error/warning/info
 * variants each pin `type` and declare their own `required` list). quicktype
 * collapses such a union into ONE z.object carrying the UNION of the variant
 * property sets and the INTERSECTION of their required lists, so every
 * per-variant `required` is dropped: an error message parses without its
 * mandatory `code`/`severity`. Recover the per-variant lists as
 * conditional-required rules keyed on the discriminator const and indexed
 * under the UNION property set (the collapsed object's set), enforced by the
 * existing conditional superRefine.
 *
 * The rules live in their own index (variantUnionIndex), not in
 * conditionalIndex: a union's own constituent variants are walked as plain
 * objects and record EMPTY if/then rule lists, and when one variant subsumes
 * the others its property set EQUALS the union set, so sharing the index
 * would make every such union self-ambiguous. An empty if/then record is
 * absence of evidence, not a conflict (per-field descriptors treat
 * unconstrained same-shape occurrences the same way). Real conflicts still
 * veto injection: two variant unions resolving to the same property set with
 * different rules are ambiguous, and a property set claimed by BOTH an
 * if/then rule list and a variant union injects neither.
 *
 * Strictly gated so a union this cannot faithfully represent contributes
 * nothing: every branch must resolve to an object, share a discriminator that
 * is required in every branch and carries a DISTINCT scalar const per branch
 * (fulfillment_destination and the discovery profile union have no such
 * discriminator and are skipped; the service transport anyOf never requires
 * its discriminator inside the branches and is skipped).
 */
function recordVariantUnionRules(node, file) {
  if (!node || typeof node !== "object") {
    return;
  }
  const branches = Array.isArray(node.oneOf) ? node.oneOf : node.anyOf;
  if (
    !Array.isArray(branches) ||
    branches.length < 2 ||
    node.properties !== undefined ||
    node.allOf !== undefined ||
    "if" in node ||
    "then" in node ||
    "else" in node
  ) {
    return;
  }
  const variants = [];
  for (const branch of branches) {
    const variant = resolveVariant(branch, file);
    if (!variant) {
      return;
    }
    variants.push(variant);
  }
  // Discriminator: present and required in every variant, with a distinct
  // scalar const per variant. Candidates are tried in sorted order so the
  // choice is deterministic.
  const candidateNames = Object.keys(variants[0].properties)
    .filter((name) =>
      variants.every(
        (variant) =>
          name in variant.properties && variant.required.includes(name)
      )
    )
    .sort();
  let discriminator = null;
  let values = null;
  for (const name of candidateNames) {
    const consts = variants.map((variant) =>
      resolveConstValue(
        variant.properties[name],
        variant.propertyFiles[name] || variant.file
      )
    );
    if (
      consts.every((value) => value !== undefined) &&
      new Set(consts).size === variants.length
    ) {
      discriminator = name;
      values = consts;
      break;
    }
  }
  if (!discriminator) {
    return;
  }
  const unionNames = new Set();
  for (const variant of variants) {
    for (const name of Object.keys(variant.properties)) {
      unionNames.add(name);
    }
  }
  const rules = [];
  for (const [index, variant] of variants.entries()) {
    if (!variant.required.length) {
      continue;
    }
    rules.push({
      kind: "required",
      discriminator,
      values: [values[index]],
      negated: false,
      required: [...variant.required].sort(),
    });
  }
  if (
    !rules.length ||
    !rules.every((rule) => rule.required.every((name) => unionNames.has(name)))
  ) {
    return;
  }
  rules.sort((left, right) =>
    JSON.stringify(left).localeCompare(JSON.stringify(right))
  );
  const setKey = [...unionNames].sort().join(",");
  const signature = JSON.stringify(rules);
  if (!variantUnionIndex.has(setKey)) variantUnionIndex.set(setKey, new Map());
  variantUnionIndex.get(setKey).set(signature, rules);
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
    recordObject(
      resolvedObject.properties,
      resolvedObject.file,
      resolvedObject.propertyFiles
    );
    recordPropertyNames(node, resolvedObject.properties, file);
    recordMinProperties(node, resolvedObject.properties);
    recordConditionalRules(node, resolvedObject.properties);
  }
  recordVariantUnionRules(node, file);
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

// Resolve constrained scalar-union properties using the same ambiguity guard as
// ordinary field constraints. A coincidental generated object shape reused with
// a different string|array branch contract must not inherit either contract.
const resolvedStringArrayUnions = new Map();
for (const [setKey, byProperty] of stringArrayUnionIndex) {
  const resolvedProperties = new Map();
  for (const [name, bySignature] of byProperty) {
    if (bySignature.size === 1) {
      resolvedProperties.set(name, [...bySignature.values()][0]);
    } else {
      ambiguous.push({ setKey, name, count: bySignature.size });
    }
  }
  if (resolvedProperties.size) {
    resolvedStringArrayUnions.set(setKey, resolvedProperties);
  }
}

// Resolve the object-level propertyNames index to one descriptor per set,
// dropping any set that carried conflicting patterns (mirrors the scalar
// ambiguity guard so a coincidental property-set clash never over-restricts).
// setKey -> descriptor
const resolvedPropertyNames = new Map();
for (const [setKey, bySignature] of propertyNamesIndex) {
  if (bySignature.size === 1) {
    resolvedPropertyNames.set(setKey, [...bySignature.values()][0]);
  } else {
    ambiguous.push({
      setKey,
      name: "<propertyNames>",
      count: bySignature.size,
    });
  }
}

const resolvedMinProperties = new Map();
for (const [setKey, bySignature] of minPropertiesIndex) {
  if (bySignature.size === 1) {
    resolvedMinProperties.set(setKey, [...bySignature.values()][0]);
  } else {
    ambiguous.push({
      setKey,
      name: "<minProperties>",
      count: bySignature.size,
    });
  }
}

// Only inject conditional rules when every occurrence of a property set agrees
// on the exact non-empty rule list. This includes empty signatures, preventing
// an unrelated object with the same shape from inheriting conditional logic.
const resolvedConditionals = new Map();
for (const [setKey, bySignature] of conditionalIndex) {
  if (bySignature.size === 1) {
    const rules = [...bySignature.values()][0];
    if (rules.length) resolvedConditionals.set(setKey, rules);
  } else {
    ambiguous.push({ setKey, name: "<conditional>", count: bySignature.size });
  }
}

// Variant-union rules resolve like the other indexes: a single agreed rule
// list per property set, or nothing. A set claimed by BOTH an if/then rule
// list and a variant union is a cross-index conflict: neither is injected.
const resolvedVariantUnions = new Map();
for (const [setKey, bySignature] of variantUnionIndex) {
  if (bySignature.size !== 1) {
    ambiguous.push({
      setKey,
      name: "<variant-union>",
      count: bySignature.size,
    });
    continue;
  }
  if (resolvedConditionals.has(setKey)) {
    resolvedConditionals.delete(setKey);
    ambiguous.push({ setKey, name: "<variant-union/conditional>", count: 2 });
    continue;
  }
  resolvedVariantUnions.set(setKey, [...bySignature.values()][0]);
}

// --- Shared {id,quantity} line-item reference: contextual split --------------
//
// adjustment / fulfillment_event / expectation all declare
// `line_items[].quantity` as `type: integer`, but only fulfillment_event and
// expectation also add `minimum: 1`; the adjustment quantity is deliberately
// signed (negative values represent returns/exchanges). quicktype merges the
// three into a single shared LineItemQuantityRefSchema object, so the generic
// ambiguity guard above leaves the whole set untouched (two conflicting
// quantity signatures under one property set). We split the two `minimum: 1`
// aliases into standalone objects carrying `.int().gte(1)` and keep the signed
// adjustment on the shared `.int()` alone.
//
// Gated strictly on schema evidence inside the "id,quantity" property set: a
// signed descriptor ({int}) AND a {int, minimum:1} descriptor must both be
// present. A coincidental same-shape object can never trigger the split.
const QUANTITY_SPLIT_TARGETS = ["EventLineItem", "ExpectationLineItem"];
const sharedQuantitySplitNeeded = (() => {
  const byProperty = constraintIndex.get("id,quantity");
  if (!byProperty) return false;
  const quantity = byProperty.get("quantity");
  if (!quantity || quantity.size < 2) return false;
  const signatures = [...quantity.keys()];
  return (
    signatures.includes(JSON.stringify({ int: true })) &&
    signatures.some((signature) => JSON.parse(signature).minimum === 1)
  );
})();

// --- Shared {unit,value} unit-price measure/reference: contextual split ------
//
// A catalog unit price declares two same-shape objects: `measure.value` is a
// JSON Schema `number`, while `reference.value` is an `integer`. quicktype
// merges both (and duplicate projected occurrences) into one shared measure
// object, so the generic ambiguity guard cannot choose whether `.int()` belongs
// on `value`. Keep the number-shaped measure on `z.number()` and split the two
// generated reference aliases into standalone integer-valued objects.
//
// Trigger only when the source schemas themselves contain both numeric kinds
// for `value` under the exact {unit,value} shape. Names merely identify the
// quicktype aliases to repair after that source-evidence gate has passed.
const REFERENCE_SPLIT_TARGETS = ["FluffyReference", "PurpleReference"];
const sharedMeasureSplitNeeded = (() => {
  const valueTypes = scalarTypeIndex.get("unit,value")?.get("value");
  return valueTypes?.has("number") && valueTypes.has("integer");
})();

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
 * Object-level `propertyNames` enforcement for an extra-allow object.
 *
 * `.catchall(z.any())` retains extra keys (a bare `z.object` strips them, which
 * would silently drop the `additionalProperties: true` reverse-domain extras the
 * schema means to keep), and the `.superRefine` matches every property name --
 * named fields and retained extras alike -- against the source key pattern.
 *
 * `RegExp.test` is used deliberately: it implements JSON Schema's unanchored
 * `pattern` semantics, and for the source's `^...$`-anchored pattern it matches
 * only end-of-input in ECMA-262 (no `m` flag), so a trailing-newline key is
 * rejected -- the JS analogue of python-sdk#66's `re.fullmatch` fix (Python's
 * `re.match` admits `"...\n"`). See scripts test for the pinned newline case.
 *
 * Out of scope for this per-object key check: zod-core strips an own `__proto__`
 * key from every `z.object` (a prototype-pollution safeguard) before `.catchall`
 * / `.superRefine` run, so such a key is silently dropped (safe direction: not
 * preserved, no pollution) rather than surfaced as a rejection. That is an
 * SDK-wide zod trait, not a per-schema property, and it is pinned by a test.
 */
function renderPropertyNamesRefine(pattern) {
  const regex = toRegexLiteral(pattern);
  return (
    `.catchall(z.any())` +
    `.superRefine((value, ctx) => {` +
    `for (const key of Object.keys(value)) {` +
    `if (!${regex}.test(key)) {` +
    `ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: ` +
    "`Property name ${JSON.stringify(key)} does not match the required " +
    "pattern (propertyNames)` });" +
    `}}})`
  );
}

function renderRecordKeyPattern(pattern) {
  return (
    `.refine((value) => Object.keys(value).every((key) => ${toRegexLiteral(pattern)}.test(key)), ` +
    `{ message: "Record keys must match the required pattern (propertyNames)" })`
  );
}

function renderMinPropertiesRefine(minimum, retainAdditionalProperties) {
  return (
    (retainAdditionalProperties ? `.catchall(z.any())` : "") +
    `.refine((value) => Object.keys(value).length >= ${minimum}, ` +
    `{ message: "Object must contain at least ${minimum} property(ies) (minProperties)" })`
  );
}

function renderConditionalRefine(rules) {
  const normalized = rules.map((rule) => ({
    kind: rule.kind,
    discriminator: rule.discriminator,
    values: rule.values,
    negated: rule.negated ?? false,
    required: rule.required ?? [],
    target: rule.target ?? null,
    minimum: rule.minimum ?? null,
    maximum: rule.maximum ?? null,
    exclusiveMinimum: rule.exclusiveMinimum ?? null,
    exclusiveMaximum: rule.exclusiveMaximum ?? null,
  }));
  return (
    `.superRefine((value, ctx) => {` +
    `for (const rule of ${JSON.stringify(normalized)}) {` +
    `const record = value as Record<string, unknown>;` +
    `const discriminatorVal = record[rule.discriminator];` +
    `if (discriminatorVal === undefined) continue;` +
    `const matches = (rule.values as readonly unknown[]).includes(discriminatorVal);` +
    `if (rule.negated ? matches : !matches) continue;` +
    `if (rule.kind === "required") {` +
    `for (const field of rule.required) {` +
    `if (!(field in record)) ctx.addIssue({ code: z.ZodIssueCode.custom, ` +
    `path: [field], message: "Field is required by a conditional constraint" });` +
    `}continue;}` +
    `if (rule.target === null) continue;` +
    `const target = record[rule.target];` +
    `if (typeof target !== "number") continue;` +
    `const invalid = ` +
    `(rule.minimum !== null && target < rule.minimum) || ` +
    `(rule.maximum !== null && target > rule.maximum) || ` +
    `(rule.exclusiveMinimum !== null && target <= rule.exclusiveMinimum) || ` +
    `(rule.exclusiveMaximum !== null && target >= rule.exclusiveMaximum);` +
    `if (invalid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [rule.target], ` +
    `message: "Value violates a conditional numeric constraint" });` +
    `}})`
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
    descriptor.pattern !== undefined ||
    descriptor.format !== undefined;
  const isArray =
    descriptor.minItems !== undefined ||
    descriptor.maxItems !== undefined ||
    descriptor.uniqueItems !== undefined ||
    descriptor.containsGroups !== undefined;
  const isRecord =
    descriptor.minProperties !== undefined ||
    descriptor.propertyNamesPattern !== undefined;

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
    if (descriptor.format !== undefined)
      methods.push(STRING_FORMAT_METHODS[descriptor.format]);
  } else if (isRecord) {
    if (baseKind !== "record") return null;
    if (descriptor.minProperties !== undefined) {
      methods.push(renderMinPropertiesRefine(descriptor.minProperties, false));
    }
    if (descriptor.propertyNamesPattern !== undefined) {
      methods.push(renderRecordKeyPattern(descriptor.propertyNamesPattern));
    }
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

function renderStringArrayUnion(branchDescriptor, unionCall, sourceFile) {
  if (
    !unionCall.arguments.length ||
    !ts.isArrayLiteralExpression(unionCall.arguments[0])
  ) {
    return null;
  }
  const elements = unionCall.arguments[0].elements;
  if (elements.length !== 2) {
    return null;
  }
  const rendered = [];
  let sawString = false;
  let sawArray = false;
  for (const element of elements) {
    if (!ts.isCallExpression(element)) {
      return null;
    }
    const callee = element.expression;
    if (
      ts.isPropertyAccessExpression(callee) &&
      ts.isIdentifier(callee.expression) &&
      callee.expression.text === "z" &&
      callee.name.text === "string" &&
      element.arguments.length === 0
    ) {
      if (sawString) return null;
      const methods = methodsFor(branchDescriptor.string, "string");
      if (!methods) return null;
      rendered.push(`z.string()${methods.join("")}`);
      sawString = true;
      continue;
    }
    if (
      ts.isPropertyAccessExpression(callee) &&
      ts.isIdentifier(callee.expression) &&
      callee.expression.text === "z" &&
      callee.name.text === "array" &&
      element.arguments.length === 1 &&
      ts.isCallExpression(element.arguments[0])
    ) {
      const item = element.arguments[0];
      const itemCallee = item.expression;
      if (
        !ts.isPropertyAccessExpression(itemCallee) ||
        !ts.isIdentifier(itemCallee.expression) ||
        itemCallee.expression.text !== "z" ||
        itemCallee.name.text !== "string" ||
        item.arguments.length !== 0 ||
        sawArray
      ) {
        return null;
      }
      const itemMethods = methodsFor(branchDescriptor.item, "string");
      const arrayMethods = methodsFor(branchDescriptor.array, "array");
      if (!itemMethods || !arrayMethods) return null;
      rendered.push(
        `z.array(z.string()${itemMethods.join("")})${arrayMethods.join("")}`
      );
      sawArray = true;
      continue;
    }
    return null;
  }
  if (!sawString || !sawArray) {
    return null;
  }
  return `z.union([${rendered.join(", ")}])`;
}

function findUnionCall(expression) {
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
  const baseCall = callStack[callStack.length - 1];
  if (!baseCall || !ts.isCallExpression(baseCall)) {
    return null;
  }
  const callee = baseCall.expression;
  if (
    !ts.isPropertyAccessExpression(callee) ||
    !ts.isIdentifier(callee.expression) ||
    callee.expression.text !== "z" ||
    callee.name.text !== "union"
  ) {
    return null;
  }
  const unionText = sourceText.slice(
    baseCall.getStart(sourceFile),
    baseCall.getEnd()
  );
  if (/\.min\(|\.max\(|\.regex\(|\.refine\(|\.superRefine\(/.test(unionText)) {
    return { alreadyConstrained: true, baseCall };
  }
  return { alreadyConstrained: false, baseCall };
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
  // `z.coerce.date()` -- quicktype's rendering of format: date-time. The
  // callee is one property-access deeper (`z.coerce`.date), so it is matched
  // before the plain `z.<name>()` shapes below. `start` marks the base call
  // itself so the date-time conversion can replace it in place.
  if (
    ts.isPropertyAccessExpression(callee.expression) &&
    ts.isIdentifier(callee.expression.expression) &&
    callee.expression.expression.text === "z" &&
    callee.expression.name.text === "coerce" &&
    callee.name.text === "date"
  ) {
    return {
      start: baseCall.getStart(sourceFile),
      end: baseCall.getEnd(),
      kind: "date",
      baseCall,
    };
  }
  if (!ts.isIdentifier(callee.expression) || callee.expression.text !== "z") {
    return null;
  }
  const method = callee.name.text;
  let kind = null;
  if (method === "number") kind = "number";
  else if (method === "string") kind = "string";
  else if (method === "array") kind = "array";
  else if (method === "record") kind = "record";
  else return null;
  return {
    start: baseCall.getStart(sourceFile),
    end: baseCall.getEnd(),
    kind,
    baseCall,
  };
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
      // Derived so a new entry in STRING_FORMAT_METHODS cannot reintroduce
      // double injection: ".url()" -> "url", ".datetime({ offset: true })"
      // -> "datetime" (the identifier, whatever the arguments).
      ...Object.values(STRING_FORMAT_METHODS).map(
        (method) => method.match(/^\.([A-Za-z]+)/)[1]
      ),
    ]);
    if (CONSTRAINT_METHODS.has(method)) {
      return true;
    }
  }
  return false;
}

/**
 * Idempotency for the object-level propertyNames splice: is the whole
 * `z.object({...})` call already wrapped by a key-check method chain
 * (`.catchall(...)` / `.superRefine(...)`)?
 */
function objectAlreadyConstrained(objectCall) {
  const parent = objectCall.parent;
  if (parent && ts.isPropertyAccessExpression(parent)) {
    const method = parent.name.text;
    if (
      method === "catchall" ||
      method === "superRefine" ||
      method === "refine"
    ) {
      return true;
    }
  }
  return false;
}

function conditionalAlreadyConstrained(objectCall) {
  let outer = objectCall;
  while (
    outer.parent &&
    ts.isPropertyAccessExpression(outer.parent) &&
    outer.parent.expression === outer &&
    outer.parent.parent &&
    ts.isCallExpression(outer.parent.parent)
  ) {
    outer = outer.parent.parent;
  }
  const slice = sourceText.slice(objectCall.getEnd(), outer.getEnd());
  return /conditional (?:numeric )?constraint/.test(slice);
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

const edits = []; // { pos, remove?, text }
const report = {
  objectsMatched: 0,
  fieldsInjected: 0,
  unionBranchesInjected: 0,
  propertyNamesInjected: 0,
  minPropertiesInjected: 0,
  conditionalsInjected: 0,
  sharedQuantityInjected: 0,
  sharedMeasureInjected: 0,
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
  const resolvedUnionProperties = resolvedStringArrayUnions.get(setKey);
  const propertyNamesDescriptor = resolvedPropertyNames.get(setKey);
  const minPropertiesDescriptor = resolvedMinProperties.get(setKey);
  // If/then rules and variant-union rules render through the same conditional
  // superRefine; cross-index conflicts were already resolved to neither.
  const conditionalRules =
    resolvedConditionals.get(setKey) ?? resolvedVariantUnions.get(setKey);
  if (
    !resolvedProperties &&
    !resolvedUnionProperties &&
    !propertyNamesDescriptor &&
    !minPropertiesDescriptor &&
    !conditionalRules
  ) {
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
    const unionDescriptor = resolvedUnionProperties?.get(name);
    if (unionDescriptor) {
      const union = findUnionCall(prop.initializer);
      if (!union) {
        report.fieldsSkippedType += 1;
      } else if (union.alreadyConstrained) {
        report.fieldsAlreadyDone += 1;
        matchedAny = true;
      } else {
        const text = renderStringArrayUnion(
          unionDescriptor,
          union.baseCall,
          sourceFile
        );
        if (!text) {
          report.fieldsSkippedType += 1;
        } else {
          edits.push({
            pos: union.baseCall.getStart(sourceFile),
            remove:
              union.baseCall.getEnd() - union.baseCall.getStart(sourceFile),
            text,
          });
          report.unionBranchesInjected += 1;
          report.injections.push(`${setKey} :: ${name} ${text}`);
          matchedAny = true;
        }
      }
      continue;
    }
    if (!resolvedProperties) {
      continue;
    }
    // The {unit,value} number/integer conflict is resolved by the contextual
    // split below. Do not queue the generic `.int()` edit on the shared object
    // in the same pass, because contextual edits are computed from the original
    // source text and cannot observe another pending edit.
    if (
      sharedMeasureSplitNeeded &&
      setKey === "unit,value" &&
      name === "value"
    ) {
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
    // A `z.coerce.date()` base is only ever touched when the source schema
    // says the field is a string with format: date-time; the whole base call
    // is then replaced by `z.string()` and the string methods (including
    // `.datetime(...)`) are chained onto it. Any other descriptor against a
    // date base is a drift mismatch and injects nothing.
    if (base.kind === "date") {
      const methods =
        descriptor.format === "date-time"
          ? methodsFor(descriptor, "string")
          : null;
      if (!methods) {
        report.fieldsSkippedType += 1;
        continue;
      }
      const text = `z.string()${methods.join("")}`;
      edits.push({ pos: base.start, remove: base.end - base.start, text });
      report.fieldsInjected += 1;
      report.injections.push(`${setKey} :: ${name} ${text}`);
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
  // Object-level propertyNames: splice a key-pattern check onto the whole
  // `z.object({...})` call (the property-set here is the constrained object).
  if (propertyNamesDescriptor) {
    const objectCall = objectLiteral.parent;
    if (
      objectCall &&
      ts.isCallExpression(objectCall) &&
      !objectAlreadyConstrained(objectCall)
    ) {
      const text = renderPropertyNamesRefine(propertyNamesDescriptor.pattern);
      edits.push({ pos: objectCall.getEnd(), text });
      report.propertyNamesInjected += 1;
      report.injections.push(`${setKey} :: <propertyNames> ${text}`);
      matchedAny = true;
    } else if (objectCall && objectAlreadyConstrained(objectCall)) {
      report.fieldsAlreadyDone += 1;
      matchedAny = true;
    }
  }
  if (minPropertiesDescriptor) {
    const objectCall = objectLiteral.parent;
    if (
      objectCall &&
      ts.isCallExpression(objectCall) &&
      !objectAlreadyConstrained(objectCall)
    ) {
      const text = renderMinPropertiesRefine(
        minPropertiesDescriptor.minimum,
        minPropertiesDescriptor.retainAdditionalProperties
      );
      edits.push({ pos: objectCall.getEnd(), text });
      report.minPropertiesInjected += 1;
      report.injections.push(`${setKey} :: <minProperties> ${text}`);
      matchedAny = true;
    } else if (objectCall && objectAlreadyConstrained(objectCall)) {
      report.fieldsAlreadyDone += 1;
      matchedAny = true;
    }
  }
  if (conditionalRules) {
    const objectCall = objectLiteral.parent;
    if (
      objectCall &&
      ts.isCallExpression(objectCall) &&
      !conditionalAlreadyConstrained(objectCall)
    ) {
      const text = renderConditionalRefine(conditionalRules);
      edits.push({ pos: objectCall.getEnd(), text });
      report.conditionalsInjected += 1;
      report.injections.push(`${setKey} :: <conditional> ${text}`);
      matchedAny = true;
    } else if (objectCall && conditionalAlreadyConstrained(objectCall)) {
      report.fieldsAlreadyDone += 1;
      matchedAny = true;
    }
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

// Apply the contextual {id,quantity} split: `.int()` on the shared quantity
// (all three contexts declare `type: integer`), and the two `minimum: 1`
// aliases become standalone objects. Idempotent: the shared `.int()` is
// guarded by a negative lookahead, and a split alias no longer matches the
// `= LineItemQuantityRefSchema;` pattern.
if (sharedQuantitySplitNeeded) {
  const sharedObjectStart = sourceText.indexOf(
    "export const LineItemQuantityRefSchema = z.object({"
  );
  const sharedObjectEnd =
    sharedObjectStart >= 0
      ? sourceText.indexOf("\n});", sharedObjectStart)
      : -1;
  if (sharedObjectStart >= 0 && sharedObjectEnd >= 0) {
    const sharedObjectText = sourceText.slice(
      sharedObjectStart,
      sharedObjectEnd
    );
    const quantityRef = /["']?quantity["']?: z\.number\(\)(?!\.int\(\))/.exec(
      sharedObjectText
    );
    if (quantityRef) {
      edits.push({
        pos: sharedObjectStart + quantityRef.index + quantityRef[0].length,
        text: ".int()",
      });
      report.sharedQuantityInjected += 1;
    }
  }
  for (const name of QUANTITY_SPLIT_TARGETS) {
    const aliasRef = new RegExp(
      `export const ${name}Schema = LineItemQuantityRefSchema;`
    );
    const matched = aliasRef.exec(sourceText);
    if (!matched) {
      continue;
    }
    const standalone =
      `export const ${name}Schema = z.object({\n` +
      `  id: z.string(),\n` +
      `  quantity: z.number().int().gte(1),\n` +
      `});`;
    edits.push({
      pos: matched.index,
      remove: matched[0].length,
      text: standalone,
    });
    report.sharedQuantityInjected += 1;
  }
}

// Apply the contextual {unit,value} split. The shared measure object may arrive
// as either unconstrained `z.number()` or incorrectly constrained
// `z.number().int()` depending on traversal order; normalize it to the source
// `number`, then replace reference aliases with integer-valued standalone
// objects. A second injector pass is a no-op because neither pattern remains.
if (sharedMeasureSplitNeeded) {
  const sharedObjectStart = sourceText.indexOf(
    "export const PurpleMeasureSchema = z.object({"
  );
  const sharedObjectEnd =
    sharedObjectStart >= 0
      ? sourceText.indexOf("\n});", sharedObjectStart)
      : -1;
  if (sharedObjectStart >= 0 && sharedObjectEnd >= 0) {
    const sharedObjectText = sourceText.slice(
      sharedObjectStart,
      sharedObjectEnd
    );
    const integerValue = /["']?value["']?: z\.number\(\)\.int\(\)/.exec(
      sharedObjectText
    );
    if (integerValue) {
      edits.push({
        pos: sharedObjectStart + integerValue.index,
        remove: integerValue[0].length,
        text: integerValue[0].replace(".int()", ""),
      });
      report.sharedMeasureInjected += 1;
    }
  }
  for (const name of REFERENCE_SPLIT_TARGETS) {
    const aliasRef = new RegExp(
      `export const ${name}Schema = PurpleMeasureSchema;`
    );
    const matched = aliasRef.exec(sourceText);
    if (!matched) {
      continue;
    }
    const standalone =
      `export const ${name}Schema = z.object({\n` +
      `  unit: z.string(),\n` +
      `  value: z.number().int(),\n` +
      `});`;
    edits.push({
      pos: matched.index,
      remove: matched[0].length,
      text: standalone,
    });
    report.sharedMeasureInjected += 1;
  }
}

// Apply edits back-to-front so positions stay valid.
edits.sort((a, b) => b.pos - a.pos);
let output = sourceText;
for (const edit of edits) {
  output =
    output.slice(0, edit.pos) +
    edit.text +
    output.slice(edit.pos + (edit.remove ?? 0));
}

fs.writeFileSync(targetPath, output);

// --- Report ----------------------------------------------------------------

process.stdout.write(
  `inject-schema-constraints: ${report.fieldsInjected} field(s) constrained ` +
    `across ${report.objectsMatched} object schema(s); ` +
    `${report.unionBranchesInjected} string-array union branch constraint(s); ` +
    `${report.propertyNamesInjected} propertyNames key-check(s); ` +
    `${report.minPropertiesInjected} object minProperties check(s); ` +
    `${report.conditionalsInjected} conditional check(s); ` +
    `${report.sharedQuantityInjected} shared-quantity split edit(s); ` +
    `${report.sharedMeasureInjected} shared-measure split edit(s); ` +
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
