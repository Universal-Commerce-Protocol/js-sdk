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

import fs from "node:fs";
import path from "node:path";

const [, , sourceRootArg, outputRootArg] = process.argv;

if (!sourceRootArg || !outputRootArg) {
  console.error(
    "Usage: node scripts/project-current-ucp-schemas.mjs <source-root> <output-root>"
  );
  process.exit(1);
}

const sourceRoot = path.resolve(sourceRootArg);
const outputRoot = path.resolve(outputRootArg);
const sourceSchemasRoot = path.join(sourceRoot, "schemas");

const sourceShoppingRoot = path.join(sourceSchemasRoot, "shopping");
const sourceTypesRoot = path.join(sourceShoppingRoot, "types");
const sourceCommonRoot = path.join(sourceSchemasRoot, "common");
const sourceCommonTypesRoot = path.join(sourceCommonRoot, "types");

if (!fs.existsSync(sourceShoppingRoot)) {
  console.error(`Expected shopping schemas at ${sourceShoppingRoot}`);
  process.exit(1);
}

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const outputDiscoveryRoot = path.join(outputRoot, "discovery");
const outputSchemasRoot = path.join(outputRoot, "schemas");
const outputShoppingRoot = path.join(outputSchemasRoot, "shopping");
const outputTypesRoot = path.join(outputShoppingRoot, "types");
const outputCommonRoot = path.join(outputSchemasRoot, "common");
const outputCommonTypesRoot = path.join(outputCommonRoot, "types");

fs.mkdirSync(outputDiscoveryRoot, { recursive: true });
fs.mkdirSync(outputTypesRoot, { recursive: true });
fs.mkdirSync(outputCommonTypesRoot, { recursive: true });

const CUSTOM_KEYS = new Set([
  "$comment",
  "identity_scopes",
  "name",
  "ucp_request",
  "ucp_response",
  "ucp_shared_request",
]);

const topLevelVariantMap = {
  "shopping/checkout.json": {
    create: "shopping/checkout.create_req.json",
    update: "shopping/checkout.update_req.json",
    complete: "shopping/checkout.complete_req.json",
    response: "shopping/checkout_resp.json",
  },
  "shopping/payment.json": {
    create: "shopping/payment.create_req.json",
    update: "shopping/payment.update_req.json",
    complete: "shopping/payment.complete_req.json",
    response: "shopping/payment_resp.json",
  },
  "shopping/order.json": {
    response: "shopping/order.json",
  },
  "shopping/buyer_consent.json": {
    create: "shopping/buyer_consent.create_req.json",
    update: "shopping/buyer_consent.update_req.json",
    response: "shopping/buyer_consent_resp.json",
  },
  "shopping/discount.json": {
    create: "shopping/discount.create_req.json",
    update: "shopping/discount.update_req.json",
    response: "shopping/discount_resp.json",
  },
  "shopping/fulfillment.json": {
    create: "shopping/fulfillment.create_req.json",
    update: "shopping/fulfillment.update_req.json",
    response: "shopping/fulfillment_resp.json",
  },
  "shopping/cart.json": {
    create: "shopping/cart.create_req.json",
    update: "shopping/cart.update_req.json",
    response: "shopping/cart_resp.json",
  },
  "shopping/catalog_lookup.json": {
    response: "shopping/catalog_lookup.json",
  },
  "shopping/catalog_search.json": {
    response: "shopping/catalog_search.json",
  },
};

const alwaysUnifiedTypeFiles = new Set([
  "account_info",
  "adjustment",
  "amount",
  "attribution",
  "availability",
  "available_payment_instrument",
  "binding",
  "buyer",
  "business_fulfillment_config",
  "card_credential",
  "card_payment_instrument",
  "category",
  "context",
  "description",
  "detail_option_value",
  "error_code",
  "error_response",
  "expectation",
  "fulfillment_available_method",
  "fulfillment_destination_filter",
  "fulfillment_event",
  "fulfillment_group",
  "fulfillment_option",
  "fulfillment_option_base",
  "input_correlation",
  "link",
  "media",
  "merchant_fulfillment_config",
  "message",
  "message_error",
  "message_info",
  "message_warning",
  "option_value",
  "order_confirmation",
  "order_line_item",
  "pagination",
  "payment_credential",
  "payment_identity",
  "payment_instrument",
  "platform_fulfillment_config",
  "postal_address",
  "price",
  "price_filter",
  "price_range",
  "product",
  "product_option",
  "rating",
  "reverse_domain_name",
  "search_filters",
  "selected_option",
  "shipping_destination",
  "signals",
  "signed_amount",
  "token_credential",
  "variant",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function hasKeyword(value, key) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Object.prototype.hasOwnProperty.call(value, key)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => hasKeyword(entry, key));
  }

  return Object.values(value).some((entry) => hasKeyword(entry, key));
}

// True when a schema contains a BARE same-document root back-reference
// ("$ref": "#", pointing at the whole document, not a fragment INTO it)
// ANYWHERE within itself -- the hallmark of a genuinely self-referential/
// recursive type (e.g. 2026-08-25's new common/types/constraint_expression.json:
// an Object Constraint whose own `properties.additionalProperties.oneOf` and
// `anyOf.items` both `"$ref": "#"`, letting a constraint expression nest
// arbitrarily deep inside itself). This deliberately does NOT match an
// ordinary "#/$defs/..." fragment reference into a named sub-schema (e.g.
// common/types/actions.json's `additionalProperties.items` $refs
// "#/$defs/instance") -- that is a completely normal, quicktype-safe JSON
// Schema idiom (define a reusable shape once, reference it by name) and
// must not be flagged just because it also starts with "#".
//
// quicktype's typescript-zod target cannot place a genuinely root-recursive
// type at all -- verified by isolating constraint_expression.json (and
// everything that reaches it, e.g. available_payment_instrument.json's
// "constraints" property) with ZERO other schema content in the invocation:
// quicktype still exhausts its type-ordering pass budget and silently
// emits NOTHING for it ("Exceeded maximum number of passes when
// determining output order", zero exports). This is not an interaction
// with the rest of the graph, and not something a bigger invocation or
// per-family isolation (the mechanism used for discovered capabilities)
// can fix -- the type is unrepresentable by itself. See
// dropSelfReferentialProperties below for where this is used.
function containsRootSelfRef(node) {
  if (Array.isArray(node)) {
    return node.some((entry) => containsRootSelfRef(entry));
  }
  if (!node || typeof node !== "object") {
    return false;
  }
  if (node.$ref === "#") {
    return true;
  }
  return Object.values(node).some((value) => containsRootSelfRef(value));
}

// Drops any property whose value is a $ref to a self-referential schema
// (see containsRootSelfRef) before quicktype ever sees it, logging loudly
// so the omission is never silent. Scoped to exactly this shape -- a
// property that is ONLY a $ref (optionally with sibling annotation keys
// like "description"), resolved by basename against schemaCache the same
// way every other cross-file lookup in this script already tolerates a
// reorg moving files -- so it cannot misfire on an ordinary, quicktype-
// representable property that merely happens to live near a recursive type.
function dropSelfReferentialProperties(properties, schemaCache, contextLabel) {
  if (!schemaCache) {
    return properties;
  }
  const kept = {};
  for (const [propertyName, propertySchema] of Object.entries(properties)) {
    const ref = propertySchema?.$ref;
    if (typeof ref === "string" && !ref.startsWith("#")) {
      const [refFile] = ref.split("#");
      const baseName = path.posix.basename(refFile);
      const candidates = [...schemaCache.keys()].filter(
        (rel) => path.posix.basename(rel) === baseName
      );
      if (candidates.length === 1 && containsRootSelfRef(schemaCache.get(candidates[0]))) {
        console.error(
          `project-current-ucp-schemas.mjs: dropping "${propertyName}"${contextLabel ? ` on ${contextLabel}` : ""} -- ` +
            `it $refs "${baseName}", a self-referential schema quicktype's typescript-zod target cannot represent ` +
            `(verified in total isolation: zero exports, "Exceeded maximum number of passes"). Left out rather than ` +
            "silently corrupting the rest of the invocation it's generated alongside."
        );
        continue;
      }
    }
    kept[propertyName] = propertySchema;
  }
  return kept;
}

function normalizeRequestRule(rule) {
  if (!rule) {
    return undefined;
  }

  if (typeof rule === "string") {
    return rule;
  }

  if (typeof rule === "object" && rule.transition) {
    return rule.transition.to;
  }

  return undefined;
}

function effectiveRequestRule(schema, variant) {
  const rule = schema?.ucp_request;
  if (!rule) {
    return undefined;
  }

  if (typeof rule === "string") {
    return rule;
  }

  return normalizeRequestRule(rule[variant]);
}

function splitStrategyForSchema(baseName, schema) {
  if (alwaysUnifiedTypeFiles.has(baseName)) {
    return "unified";
  }

  if (schema?.ucp_shared_request) {
    return "shared_request";
  }

  if (hasKeyword(schema, "ucp_request") || hasKeyword(schema, "ucp_response")) {
    return "create_update";
  }

  return "unified";
}

function legacyTypeOutputPath(baseName, schema, variant) {
  const strategy = splitStrategyForSchema(baseName, schema);

  if (strategy === "unified") {
    return `shopping/types/${baseName}.json`;
  }

  if (strategy === "shared_request") {
    if (variant === "response") {
      return `shopping/types/${baseName}_resp.json`;
    }

    return `shopping/types/${baseName}_req.json`;
  }

  if (variant === "response") {
    return `shopping/types/${baseName}_resp.json`;
  }

  return `shopping/types/${baseName}.${variant}_req.json`;
}

function topLevelOutputPath(sourceRel, variant) {
  return topLevelVariantMap[sourceRel]?.[variant];
}

function mapOutputPathForTarget(sourceRel, variant, sourceSchema) {
  if (sourceRel.startsWith("shopping/types/")) {
    const baseName = path.posix.basename(sourceRel, ".json");
    return legacyTypeOutputPath(baseName, sourceSchema, variant);
  }

  return topLevelOutputPath(sourceRel, variant) ?? sourceRel;
}

function rewriteRef(ref, sourceRel, outputRel, variant, schemaCache) {
  if (!ref || ref.startsWith("#") || /^[a-z]+:\/\//i.test(ref)) {
    return ref;
  }

  const [refPath, fragment = ""] = ref.split("#");
  const currentDir = path.posix.dirname(sourceRel);
  const targetSourceRel = path.posix.normalize(
    path.posix.join(currentDir, refPath)
  );
  const targetSourceSchema = schemaCache.get(targetSourceRel);
  const targetOutputRel = mapOutputPathForTarget(
    targetSourceRel,
    variant,
    targetSourceSchema
  );

  const relativeTarget = path.posix.relative(
    path.posix.dirname(outputRel),
    targetOutputRel
  );

  const normalizedTarget = relativeTarget === "" ? "." : relativeTarget;
  return fragment ? `${normalizedTarget}#${fragment}` : normalizedTarget;
}

function projectSchemaNode(node, context) {
  if (Array.isArray(node)) {
    return node.map((entry) => projectSchemaNode(entry, context));
  }

  if (!node || typeof node !== "object") {
    return node;
  }

  const output = {};

  for (const [key, value] of Object.entries(node)) {
    if (CUSTOM_KEYS.has(key)) {
      continue;
    }

    if (key === "$ref" && typeof value === "string") {
      output[key] = rewriteRef(
        value,
        context.sourceRel,
        context.outputRel,
        context.variant,
        context.schemaCache
      );
      continue;
    }

    if (key === "properties" && value && typeof value === "object") {
      const filteredValue = dropSelfReferentialProperties(
        value,
        context.schemaCache,
        context.outputRel
      );
      const properties = {};
      const required = new Set(
        Array.isArray(node.required) ? node.required : []
      );

      for (const [propertyName, propertySchema] of Object.entries(filteredValue)) {
        const requestRule = effectiveRequestRule(
          propertySchema,
          context.variant
        );
        const omitForRequest =
          context.variant !== "response" && requestRule === "omit";
        const omitForResponse =
          context.variant === "response" &&
          propertySchema &&
          typeof propertySchema === "object" &&
          propertySchema.ucp_response === "omit";

        if (omitForRequest || omitForResponse) {
          required.delete(propertyName);
          continue;
        }

        if (context.variant !== "response") {
          if (requestRule === "required") {
            required.add(propertyName);
          } else if (requestRule === "optional") {
            required.delete(propertyName);
          }
        }

        properties[propertyName] = projectSchemaNode(propertySchema, context);
      }

      output.properties = properties;

      // A property dropped by dropSelfReferentialProperties above must not
      // linger in "required" -- that would leave the schema demanding a
      // property it no longer declares.
      for (const requiredName of required) {
        if (!(requiredName in properties)) {
          required.delete(requiredName);
        }
      }

      if (required.size > 0) {
        output.required = Array.from(required);
      } else {
        delete output.required;
      }

      continue;
    }

    if (key === "required") {
      continue;
    }

    output[key] = projectSchemaNode(value, context);
  }

  return output;
}

function titleSuffixForOutput(outputRel) {
  if (outputRel.endsWith(".create_req.json")) {
    return "Create Request";
  }

  if (outputRel.endsWith(".update_req.json")) {
    return "Update Request";
  }

  if (outputRel.endsWith(".complete_req.json")) {
    return "Complete Request";
  }

  if (outputRel.endsWith("_req.json")) {
    return "Request";
  }

  if (outputRel.endsWith("_resp.json")) {
    return "Response";
  }

  return null;
}

function applyVariantTitles(node, suffix) {
  if (!suffix || !node || typeof node !== "object") {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((entry) => applyVariantTitles(entry, suffix));
  }

  const output = {};

  for (const [key, value] of Object.entries(node)) {
    if (
      key === "title" &&
      typeof value === "string" &&
      !value.endsWith(suffix)
    ) {
      output[key] = `${value} ${suffix}`;
      continue;
    }

    output[key] = applyVariantTitles(value, suffix);
  }

  return output;
}

// Walk every .json file under `root` recursively, keyed by its POSIX path
// relative to `sourceSchemasRoot`. This is a strict superset of the old
// three-directory read (shopping/types, shopping/, common/types): those keys
// come out identically, so nothing that worked before changes. What changes
// is that root-level extension/capability files that live directly under
// common/ (or any future sibling directory) -- invisible to the old
// three-directory allowlist -- are now cached too, by construction, with no
// per-directory list to keep in sync as the spec tree reorganizes.
function walkJsonFiles(root, baseDir, out) {
  if (!fs.existsSync(baseDir)) {
    return out;
  }

  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    const fullPath = path.join(baseDir, entry.name);

    if (entry.isDirectory()) {
      walkJsonFiles(root, fullPath, out);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const relKey = path.posix.relative(
      root.split(path.sep).join(path.posix.sep),
      fullPath.split(path.sep).join(path.posix.sep)
    );
    out.set(relKey, readJson(fullPath));
  }

  return out;
}

function loadSchemaCache() {
  return walkJsonFiles(sourceSchemasRoot, sourceSchemasRoot, new Map());
}

// A basename -> sourceRel index built lazily from the cache, used as the
// fallback when a hardcoded sourceRel no longer exists (the file moved
// directories but kept its filename -- e.g. shopping/payment.json ->
// common/types/payment.json in the 2026-08-25 reorg).
function buildBasenameIndex(schemaCache) {
  const index = new Map();
  for (const sourceRel of schemaCache.keys()) {
    const baseName = path.posix.basename(sourceRel);
    if (!index.has(baseName)) {
      index.set(baseName, []);
    }
    index.get(baseName).push(sourceRel);
  }
  return index;
}

// Find a cached schema by its declared reverse-domain `name` field, matching
// on the LAST dot-separated segment (e.g. "ap2_mandate" matches both
// "dev.ucp.shopping.ap2_mandate" and "dev.ucp.common.payment.ap2_mandate").
// Used when a schema was renamed as well as relocated, so even a basename
// match would miss it -- the capability's declared identity is the one thing
// a reorg is expected to preserve.
function findSchemaByNameSuffix(schemaCache, suffix) {
  for (const [sourceRel, schema] of schemaCache.entries()) {
    if (
      schema &&
      typeof schema.name === "string" &&
      schema.name.split(".").pop() === suffix
    ) {
      return [sourceRel, schema];
    }
  }
  return [undefined, undefined];
}

// Resolve a schema that a hardcoded sourceRel points at, tolerating the
// file having moved (basename fallback) or having been renamed as well
// (nameSuffix fallback). Returns [actualSourceRel, schema], or
// [undefined, undefined] if the schema cannot be found by any of them --
// callers are expected to fail loudly rather than silently degrade, the
// same "unknown registry entity fails loudly" posture already used by
// buildResponseEnvelopeSchema below.
function resolveSourceSchema(schemaCache, sourceRel, { nameSuffix } = {}) {
  if (schemaCache.has(sourceRel)) {
    return [sourceRel, schemaCache.get(sourceRel)];
  }

  const baseName = path.posix.basename(sourceRel);
  const basenameIndex = buildBasenameIndex(schemaCache);
  const candidates = basenameIndex.get(baseName) ?? [];
  if (candidates.length === 1) {
    return [candidates[0], schemaCache.get(candidates[0])];
  }

  if (nameSuffix) {
    const [foundRel, foundSchema] = findSchemaByNameSuffix(
      schemaCache,
      nameSuffix
    );
    if (foundSchema) {
      return [foundRel, foundSchema];
    }
  }

  return [undefined, undefined];
}

function writeProjectedFile(
  schema,
  sourceRel,
  outputRel,
  variant,
  schemaCache
) {
  let projected = projectSchemaNode(schema, {
    outputRel,
    schemaCache,
    sourceRel,
    variant,
  });
  projected = applyVariantTitles(projected, titleSuffixForOutput(outputRel));
  writeJson(path.join(outputSchemasRoot, outputRel), projected);
}

// --- Source-derived response envelope -------------------------------------
// The UCP response envelope (ucp.json#/$defs/base, specialized per response by
// #/$defs/response_*_schema) and its registry item shapes are DERIVED from the
// pinned source schemas rather than hand-written, so a base/entity property can
// never silently vanish from the generated envelope and each registry maps to
// its real per-entity RESPONSE shape. See buildResponseEnvelopeSchema().

// Root ($id-level) schemas that define the envelope and its entities. Loaded
// lazily so the projection still runs for the legacy layout (which supplies its
// own type files) without them.
function loadRootSchema(name) {
  const file = path.join(sourceSchemasRoot, name);
  return fs.existsSync(file) ? readJson(file) : undefined;
}

// Registry-valued base properties (object keyed by reverse-domain name whose
// values are arrays of an entity) map to the projected compat schema for that
// entity's RESPONSE shape. Keyed by the entity file the base $refs.
const RESPONSE_ITEM_COMPAT_BY_ENTITY = {
  "capability.json": "capability_response.json",
  "payment_handler.json": "payment_handler_resp.json",
  "service.json": "service_resp.json",
};

// Resolve a "#/..." or "<file>#/..." JSON-Pointer $ref against the loaded root
// schemas. Returns { node, doc } so nested local $refs resolve in their own doc.
function resolveRootRef(ref, currentDoc, rootDocs) {
  const [file, fragment = ""] = ref.split("#");
  const doc = file === "" ? currentDoc : rootDocs[file];
  if (!doc) {
    throw new Error(`Cannot resolve $ref "${ref}" while deriving the response envelope`);
  }
  let node = doc;
  for (const segment of fragment.split("/").filter(Boolean)) {
    node = node?.[segment];
  }
  if (node === undefined) {
    throw new Error(`$ref "${ref}" did not resolve to a node`);
  }
  return { node, doc };
}

// Flatten an allOf/$ref chain into a single { required:Set, properties } view.
// Only allOf composition is followed (the shape used by entity/base/*_schema);
// anyOf transport variants are intentionally not merged (their per-transport
// config typing is out of scope -- noted as a residual).
function flattenAllOf(node, currentDoc, rootDocs, acc) {
  if (!node || typeof node !== "object") {
    return acc;
  }
  if (typeof node.$ref === "string") {
    const { node: target, doc } = resolveRootRef(node.$ref, currentDoc, rootDocs);
    return flattenAllOf(target, doc, rootDocs, acc);
  }
  if (Array.isArray(node.allOf)) {
    for (const part of node.allOf) {
      flattenAllOf(part, currentDoc, rootDocs, acc);
    }
  }
  if (Array.isArray(node.required)) {
    for (const name of node.required) {
      acc.required.add(name);
    }
  }
  if (node.properties && typeof node.properties === "object") {
    for (const [name, schema] of Object.entries(node.properties)) {
      // Later allOf parts (and overlays) win, matching JSON Schema merge order.
      acc.properties[name] = schema;
    }
  }
  return acc;
}

// Normalize a source property schema to the compat leaf quicktype consumes,
// dropping annotations (format/pattern/description/default) that the pipeline's
// constraint injector re-attaches, and keeping only shape-bearing keywords.
function toCompatLeaf(schema) {
  if (!schema || typeof schema !== "object") {
    return { type: "string" };
  }
  // A $ref leaf here is a scalar alias (e.g. version -> #/$defs/version): a
  // string in the pinned schemas.
  if (typeof schema.$ref === "string") {
    return { type: "string" };
  }
  // A oneOf/anyOf leaf (e.g. capability `extends`: string | string[]) becomes a
  // z.union. Disjoint scalar/array branches are emitted as a JSON Schema
  // type-union ({ type: ["array","string"], items }) rather than an anyOf node:
  // both compile to the same z.union, but an anyOf node perturbs quicktype's
  // naming of UNRELATED anonymous types (it renamed catalog product schemas),
  // whereas the type-union does not.
  const union = schema.oneOf ?? schema.anyOf;
  if (Array.isArray(union)) {
    const branches = union.map((branch) => toCompatLeaf(branch));
    const branchTypes = branches
      .map((branch) => branch.type)
      .filter((type) => typeof type === "string");
    const disjointScalars =
      branchTypes.length === branches.length &&
      new Set(branchTypes).size === branchTypes.length;
    if (disjointScalars) {
      const leaf = { type: branchTypes.slice().sort() };
      const arrayBranch = branches.find((branch) => branch.type === "array");
      if (arrayBranch && arrayBranch.items) {
        leaf.items = arrayBranch.items;
      }
      return leaf;
    }
    return { anyOf: branches };
  }
  if (schema.type === "object") {
    return { type: "object", additionalProperties: true };
  }
  if (schema.type === "array") {
    const items =
      schema.items && typeof schema.items.$ref === "string"
        ? rewriteItemRefForDiscovery(schema.items)
        : toCompatLeaf(schema.items);
    const leaf = { type: "array", items };
    if (typeof schema.minItems === "number") {
      leaf.minItems = schema.minItems;
    }
    return leaf;
  }
  if (schema.type === "string") {
    const leaf = { type: "string" };
    if (Array.isArray(schema.enum)) {
      leaf.enum = [...schema.enum];
    }
    return leaf;
  }
  if (schema.type === "boolean" || schema.type === "integer" || schema.type === "number") {
    return { type: schema.type };
  }
  return { type: "string" };
}

// Rewrite an array item $ref from its source (schemas-root-relative) path to the
// path a discovery/ compat file uses to reach the projected type tree.
function rewriteItemRefForDiscovery(items) {
  if (items && typeof items.$ref === "string") {
    const [file, fragment = ""] = items.$ref.split("#");
    const rel = `../schemas/${file}`;
    return fragment ? { $ref: `${rel}#${fragment}` } : { $ref: rel };
  }
  return items ?? { type: "object", additionalProperties: true };
}

// Derive a flat compat schema for an entity's #/$defs/response_schema.
function buildEntityResponseSchema(title, entitySchema, rootDocs) {
  const acc = flattenAllOf(
    entitySchema.$defs.response_schema,
    entitySchema,
    rootDocs,
    { required: new Set(), properties: {} }
  );
  const properties = {};
  for (const [name, schema] of Object.entries(acc.properties)) {
    properties[name] = toCompatLeaf(schema);
  }
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title,
    type: "object",
    required: [...acc.required].sort(),
    properties,
  };
}

// Derive the shared response envelope from ucp.json#/$defs/base: every base
// property is modeled with base's OWN required-ness, registry properties map to
// their per-entity RESPONSE compat shape, and scalars/enums (version, status)
// are carried through. An unknown registry entity fails loudly rather than
// silently dropping the field.
function buildResponseEnvelopeSchema(ucpSchema, extraRequired = []) {
  const base = ucpSchema.$defs.base;
  const properties = {};
  for (const [name, schema] of Object.entries(base.properties)) {
    const items = schema?.additionalProperties?.items;
    if (items && typeof items.$ref === "string") {
      const entityFile = items.$ref.split("#")[0];
      const compat = RESPONSE_ITEM_COMPAT_BY_ENTITY[entityFile];
      if (!compat) {
        throw new Error(
          `Response envelope registry "${name}" refs unknown entity "${entityFile}"; ` +
            `add it to RESPONSE_ITEM_COMPAT_BY_ENTITY so it is not dropped.`
        );
      }
      properties[name] = {
        type: "object",
        additionalProperties: { type: "array", items: { $ref: compat } },
      };
    } else {
      properties[name] = toCompatLeaf(schema);
    }
  }
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "UCP Response",
    type: "object",
    required: [...(base.required ?? []), ...extraRequired],
    properties,
  };
}

function writeCompatibilityDiscoverySchemas() {
  const ucpSchema = loadRootSchema("ucp.json");
  const paymentHandlerSchema = loadRootSchema("payment_handler.json");
  const serviceSchema = loadRootSchema("service.json");
  const capabilitySchema = loadRootSchema("capability.json");
  const rootDocs = {
    "ucp.json": ucpSchema,
    "payment_handler.json": paymentHandlerSchema,
    "service.json": serviceSchema,
    "capability.json": capabilitySchema,
  };

  const version = ucpSchema.$defs.version;
  const entityProperties = ucpSchema.$defs.entity.properties;
  const serviceEndpoint = serviceSchema.$defs.base.allOf[1].properties.endpoint;

  // No spec file formally defined the "publish your signing keys" wrapper
  // document at 2026-04-08, so this hand-authored placeholder guessed both
  // the property name (signing_keys) and the key item's shape. 2026-08-25
  // published profile.json, which canonically names the field `keys`
  // ("Canonical UCP profile field for publishing signing keys... this is
  // where every UCP verifier reads them") and defines the real item shape
  // (jwk_public_key, with EC/OKP conditional requirements the hand-authored
  // version never had). When profile.json exists, derive both the property
  // name and the item schema from it instead of the guess -- the same class
  // of fix as the merged capability.extends duplicate (js-sdk#55/#63): stop
  // hand-authoring what the source now defines, derive it instead. When it
  // does not exist (2026-04-08 and earlier), fall back to the original
  // hand-authored shape unchanged, so the committed 2026-04-08 models do not
  // move a single byte.
  const profileSchema = loadRootSchema("profile.json");
  const derivedKeysProperty = profileSchema?.$defs?.base?.properties?.keys;
  const derivedJwkPublicKey = profileSchema?.$defs?.jwk_public_key;
  const usingDerivedProfile = Boolean(derivedKeysProperty && derivedJwkPublicKey);

  const keysPropertyName = usingDerivedProfile ? "keys" : "signing_keys";
  const keyItemOutputFile = usingDerivedProfile
    ? "jwk_public_key.json"
    : "signing_key.json";

  const signingKey = usingDerivedProfile
    ? clone(derivedJwkPublicKey)
    : {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        title: "Signing Key",
        type: "object",
        required: ["kid", "kty"],
        properties: {
          alg: { type: "string" },
          crv: { type: "string" },
          e: { type: "string" },
          kid: { type: "string" },
          kty: { type: "string" },
          n: { type: "string" },
          use: { type: "string", enum: ["enc", "sig"] },
          x: { type: "string" },
          y: { type: "string" },
        },
      };
  if (usingDerivedProfile) {
    signingKey.$schema = "https://json-schema.org/draft/2020-12/schema";
    signingKey.title = "Jwk Public Key";
  }

  // Derived from payment_handler.json#/$defs/response_schema (allOf: entity +
  // {required:[id]} + available_instruments). Required {id, version}; carries
  // available_instruments -- matching real handler responses. Replaces the
  // legacy discovery shape (config_schema/instrument_schemas/name) that no
  // longer exists in the 2026-04-08 schema.
  const paymentHandlerResponse = buildEntityResponseSchema(
    "Payment Handler Response",
    paymentHandlerSchema,
    rootDocs
  );

  // Derived from service.json#/$defs/response_schema. Required {transport,
  // version}; carries endpoint. (Per-transport embedded config typing from the
  // anyOf overlay is out of scope; config stays a generic object.)
  const serviceResponse = buildEntityResponseSchema(
    "Service Response",
    serviceSchema,
    rootDocs
  );

  const capabilityDiscovery = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Capability Discovery",
    type: "object",
    required: ["name", "schema", "spec", "version"],
    properties: {
      config: { type: "object", additionalProperties: true },
      extends: { type: "string" },
      name: { type: "string" },
      schema: clone(entityProperties.schema),
      spec: clone(entityProperties.spec),
      version: clone(version),
    },
  };

  // Derived from capability.json#/$defs/response_schema (allOf: entity +
  // {extends: string | string[]}). Required only {version}; NO `name` (the
  // legacy hand-written shape required a non-existent `name`, false-rejecting
  // every conformant capabilities registry -- e.g. the golden checkout ucp
  // envelope). `extends` is a string|string[] union.
  const capabilityResponse = buildEntityResponseSchema(
    "Capability Response",
    capabilitySchema,
    rootDocs
  );

  const ucpService = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "UCP Service",
    type: "object",
    required: ["spec", "version"],
    properties: {
      a2a: {
        type: "object",
        required: ["endpoint"],
        properties: { endpoint: clone(serviceEndpoint) },
      },
      embedded: {
        type: "object",
        required: ["schema"],
        properties: { schema: clone(entityProperties.schema) },
      },
      mcp: {
        type: "object",
        required: ["endpoint", "schema"],
        properties: {
          endpoint: clone(serviceEndpoint),
          schema: clone(entityProperties.schema),
        },
      },
      rest: {
        type: "object",
        required: ["endpoint", "schema"],
        properties: {
          endpoint: clone(serviceEndpoint),
          schema: clone(entityProperties.schema),
        },
      },
      spec: clone(entityProperties.spec),
      version: clone(version),
    },
  };

  // The shared response envelope, DERIVED from ucp.json#/$defs/base. Models
  // every base property (capabilities, payment_handlers, services, status,
  // version) with base's own required-ness (only version), so payment_handlers
  // and services are no longer silently stripped and capabilities is no longer
  // wrongly required. This single type is aliased by all four response
  // envelopes (checkout/order/cart/catalog); payment_handlers is therefore
  // OPTIONAL here even though response_checkout_schema requires it -- enforcing
  // the checkout-only requirement needs a distinct type and is filed as a
  // follow-up so order/cart/catalog responses are not falsely rejected.
  const ucpResponse = buildResponseEnvelopeSchema(ucpSchema);
  // Checkout responses additionally require `payment_handlers`
  // (ucp.json#/$defs/response_checkout_schema.allOf[1]), which the shared
  // envelope cannot express without also demanding it on order/cart/catalog
  // responses -- so only checkout aliases this distinct type.
  const ucpCheckoutResponse = {
    ...buildResponseEnvelopeSchema(ucpSchema, ["payment_handlers"]),
    title: "UCP Checkout Response",
  };

  const ucpDiscoveryProfile = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "UCP Discovery Profile",
    type: "object",
    required: ["ucp"],
    properties: {
      payment: {
        type: "object",
        properties: {
          handlers: {
            type: "array",
            items: { $ref: "payment_handler_resp.json" },
          },
        },
      },
      [keysPropertyName]: {
        type: "array",
        items: { $ref: keyItemOutputFile },
      },
      ucp: {
        type: "object",
        required: ["capabilities", "services", "version"],
        properties: {
          capabilities: {
            type: "array",
            items: { $ref: "capability.json" },
          },
          services: {
            type: "object",
            additionalProperties: { $ref: "ucp_service.json" },
          },
          version: clone(version),
        },
      },
    },
  };

  writeJson(path.join(outputDiscoveryRoot, keyItemOutputFile), signingKey);
  writeJson(
    path.join(outputDiscoveryRoot, "payment_handler_resp.json"),
    paymentHandlerResponse
  );
  writeJson(
    path.join(outputDiscoveryRoot, "service_resp.json"),
    serviceResponse
  );
  writeJson(
    path.join(outputDiscoveryRoot, "capability.json"),
    capabilityDiscovery
  );
  writeJson(
    path.join(outputDiscoveryRoot, "capability_response.json"),
    capabilityResponse
  );
  writeJson(path.join(outputDiscoveryRoot, "ucp_service.json"), ucpService);
  writeJson(path.join(outputDiscoveryRoot, "ucp_response.json"), ucpResponse);
  writeJson(
    path.join(outputDiscoveryRoot, "ucp_checkout_response.json"),
    ucpCheckoutResponse
  );
  writeJson(
    path.join(outputDiscoveryRoot, "ucp_discovery_profile.json"),
    ucpDiscoveryProfile
  );
}

function writeCompatibilityCoreSchemas() {
  // This compat ucp.json is what every response schema's `../ucp.json#/$defs/
  // response_*_schema` $ref actually resolves against once projected. The
  // previous version hand-listed exactly the four response_*_schema keys
  // that existed in the 2026-04-08 spec (checkout/order/cart/catalog). When
  // 2026-08-25 added response_location_schema (for the new location lookup/
  // search capability), any new capability whose response envelope $refs it
  // hit an unresolvable $ref (quicktype: "Key  not in schema object at
  // .../ucp.json#response_location_schema") -- reproduced while wiring up
  // the location capabilities discovered by discoverAdditionalCapabilities.
  // Deriving the key list from the REAL ucp.json's own $defs, instead of
  // hand-listing them, means a future response_*_schema addition needs no
  // edit here: response_checkout_schema keeps its distinct envelope (it
  // alone requires payment_handlers -- see buildResponseEnvelopeSchema's
  // extraRequired parameter above); every other response_*_schema key maps
  // to the generic envelope, whatever its name.
  const realUcpSchema = loadRootSchema("ucp.json");
  const defs = {};
  for (const key of Object.keys(realUcpSchema?.$defs ?? {})) {
    if (!/^response_.*_schema$/.test(key)) {
      continue;
    }
    defs[key] = {
      $ref:
        key === "response_checkout_schema"
          ? "../discovery/ucp_checkout_response.json"
          : "../discovery/ucp_response.json",
    };
  }

  const ucpSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $defs: defs,
  };

  writeJson(path.join(outputSchemasRoot, "ucp.json"), ucpSchema);
}

function writeCompatibilityPaymentDataSchema(schemaCache) {
  // payment_instrument.json moved from shopping/types/ to common/types/ in
  // the 2026-08-25 reorg. Rather than hardcode either location, resolve
  // wherever it actually lives today and compute the $ref from that --
  // the same resolve-by-basename fallback used for the AP2 and top-level
  // sourceRel lookups, applied here to a $ref TARGET instead of a $ref
  // SOURCE, since this is a hand-authored schema, not a projected one.
  const [targetSourceRel, targetSchema] = resolveSourceSchema(
    schemaCache,
    "shopping/types/payment_instrument.json"
  );
  if (!targetSchema) {
    throw new Error(
      'Could not locate "payment_instrument.json" anywhere under the schema tree.'
    );
  }

  const outputRel = "shopping/payment_data.json";
  const targetOutputRel = mapOutputPathForTarget(
    targetSourceRel,
    "response",
    targetSchema
  );
  const relRef =
    path.posix.relative(path.posix.dirname(outputRel), targetOutputRel) ||
    ".";

  const paymentDataSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Payment Data",
    type: "object",
    required: ["payment_data"],
    properties: {
      payment_data: {
        $ref: relRef,
      },
    },
  };

  writeJson(path.join(outputSchemasRoot, outputRel), paymentDataSchema);
}

function writeProjectedTypeSchemas(schemaCache) {
  for (const [sourceRel, schema] of schemaCache.entries()) {
    if (!sourceRel.startsWith("shopping/types/")) {
      continue;
    }

    const baseName = path.posix.basename(sourceRel, ".json");
    const strategy = splitStrategyForSchema(baseName, schema);

    if (strategy === "unified") {
      writeProjectedFile(
        schema,
        sourceRel,
        `shopping/types/${baseName}.json`,
        "response",
        schemaCache
      );
      continue;
    }

    if (strategy === "shared_request") {
      writeProjectedFile(
        schema,
        sourceRel,
        `shopping/types/${baseName}_req.json`,
        "create",
        schemaCache
      );
      writeProjectedFile(
        schema,
        sourceRel,
        `shopping/types/${baseName}_resp.json`,
        "response",
        schemaCache
      );
      continue;
    }

    writeProjectedFile(
      schema,
      sourceRel,
      `shopping/types/${baseName}.create_req.json`,
      "create",
      schemaCache
    );
    writeProjectedFile(
      schema,
      sourceRel,
      `shopping/types/${baseName}.update_req.json`,
      "update",
      schemaCache
    );
    writeProjectedFile(
      schema,
      sourceRel,
      `shopping/types/${baseName}_resp.json`,
      "response",
      schemaCache
    );
  }
}

// Extension capabilities (buyer_consent, discount, fulfillment, ap2, and any
// capability discovered by discoverExtensionCapabilities below) declare the
// fields they attach to a host resource under a reverse-domain $defs key
// ending in the host's name -- "dev.ucp.shopping.checkout", or "...order",
// "...cart". quicktype needs a stable fragment name to extract, so this
// renames EVERY such key to its bare host name ("checkout"/"order"/"cart").
// Renaming every match (not just the first) is what makes this correct for
// a capability like payment_terms, which attaches to both checkout and
// order at once -- the original single-match version only handled a
// capability with exactly one attachment point, which held for every
// extension in the 2026-04-08 tree but is not a rule the spec makes.
const ATTACHMENT_TARGETS = ["checkout", "order", "cart"];

function renameExtensionAttachmentDefs(projectedSchema) {
  const schema = clone(projectedSchema);
  if (!schema.$defs) {
    return schema;
  }

  for (const key of Object.keys(schema.$defs)) {
    for (const target of ATTACHMENT_TARGETS) {
      if (key.endsWith(`.${target}`)) {
        schema.$defs[target] = schema.$defs[key];
        delete schema.$defs[key];
        break;
      }
    }
  }

  return schema;
}

// Back-compat alias: writeCompatibilityAp2Schema (below) still calls this
// under its original name.
function renameExtensionCheckoutDef(projectedSchema) {
  return renameExtensionAttachmentDefs(projectedSchema);
}

// True when a (projected) schema declares a $defs key ending in one of the
// known host attachment points. Used instead of a hardcoded sourceRel list
// (the whack-a-mole this replaces: sourceRel === "shopping/buyer_consent.json"
// || ... one clause per extension, requiring an edit for every new one) so
// that any capability with this SHAPE gets the same treatment regardless of
// which file it lives in or when it was added to the spec.
function hasAttachmentDef(schema) {
  if (!schema?.$defs) {
    return false;
  }
  return Object.keys(schema.$defs).some((key) =>
    ATTACHMENT_TARGETS.some((target) => key.endsWith(`.${target}`))
  );
}

function writeProjectedTopLevelSchemas(schemaCache, variantMap) {
  for (const [sourceRel, variants] of Object.entries(
    variantMap ?? topLevelVariantMap
  )) {
    const [actualSourceRel, sourceSchema] = resolveSourceSchema(
      schemaCache,
      sourceRel
    );
    if (!sourceSchema) {
      throw new Error(
        `Could not locate "${sourceRel}" (or a same-named file elsewhere) under the schema ` +
          "tree; it may have moved or been removed upstream -- update topLevelVariantMap."
      );
    }

    for (const [variant, outputRel] of Object.entries(variants)) {
      let projected = projectSchemaNode(sourceSchema, {
        outputRel,
        schemaCache,
        sourceRel: actualSourceRel,
        variant,
      });

      projected = applyVariantTitles(
        projected,
        titleSuffixForOutput(outputRel)
      );

      if (hasAttachmentDef(projected)) {
        projected = renameExtensionAttachmentDefs(projected);
      }

      writeJson(path.join(outputSchemasRoot, outputRel), projected);
    }
  }
}

function writeCompatibilityAp2Schema(schemaCache) {
  // The AP2 mandate extension moved AND was renamed by the 2026-08-25 reorg
  // (shopping/ap2_mandate.json -> common/payment_ap2_mandate.json), so a
  // basename fallback alone would miss it. Its declared capability name
  // ("dev.ucp.shopping.ap2_mandate" -> "dev.ucp.common.payment.ap2_mandate")
  // still ends in "ap2_mandate" in both, which is the one thing a rename for
  // a reorg is expected to preserve, so that is the fallback identity.
  const [sourceRel, sourceSchema] = resolveSourceSchema(
    schemaCache,
    "shopping/ap2_mandate.json",
    { nameSuffix: "ap2_mandate" }
  );
  if (!sourceSchema) {
    throw new Error(
      'Could not locate the AP2 mandate extension schema anywhere under the schema tree ' +
        '(looked for "shopping/ap2_mandate.json" and any schema whose declared "name" ends ' +
        'in ".ap2_mandate"). It may have moved or been renamed again upstream -- update the ' +
        "lookup in writeCompatibilityAp2Schema()."
    );
  }

  const responseProjection = projectSchemaNode(sourceSchema, {
    outputRel: "shopping/ap2_mandate.json",
    schemaCache,
    sourceRel,
    variant: "response",
  });

  const ap2WithCheckoutMandate = sourceSchema?.$defs
    ?.ap2_with_checkout_mandate ?? {
    type: "object",
    properties: {
      checkout_mandate: { type: "string" },
    },
  };

  const completeRequestWithAp2 = {
    title: "Complete Checkout Request With AP2",
    type: "object",
    properties: {
      ap2: projectSchemaNode(ap2WithCheckoutMandate, {
        outputRel: "shopping/ap2_mandate.json",
        schemaCache,
        sourceRel,
        variant: "complete",
      }),
    },
  };

  const checkoutResponseWithAp2 = renameExtensionCheckoutDef(responseProjection)
    .$defs?.checkout ?? {
    title: "Checkout with AP2 Mandate",
    type: "object",
  };

  const ap2Schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "AP2 Mandate Extension",
    $defs: {
      checkout_mandate: projectSchemaNode(
        sourceSchema?.$defs?.checkout_mandate,
        {
          outputRel: "shopping/ap2_mandate.json",
          schemaCache,
          sourceRel,
          variant: "response",
        }
      ),
      merchant_authorization: projectSchemaNode(
        sourceSchema?.$defs?.merchant_authorization,
        {
          outputRel: "shopping/ap2_mandate.json",
          schemaCache,
          sourceRel,
          variant: "response",
        }
      ),
      ap2_with_checkout_mandate: projectSchemaNode(ap2WithCheckoutMandate, {
        outputRel: "shopping/ap2_mandate.json",
        schemaCache,
        sourceRel,
        variant: "complete",
      }),
      ap2_with_merchant_authorization: projectSchemaNode(
        sourceSchema?.$defs?.ap2_with_merchant_authorization,
        {
          outputRel: "shopping/ap2_mandate.json",
          schemaCache,
          sourceRel,
          variant: "response",
        }
      ),
      complete_request_with_ap2: completeRequestWithAp2,
      checkout_response_with_ap2: checkoutResponseWithAp2,
    },
  };

  writeJson(path.join(outputShoppingRoot, "ap2_mandate.json"), ap2Schema);
}

function writeProjectedCommonTypeSchemas(schemaCache) {
  for (const [sourceRel, schema] of schemaCache.entries()) {
    if (!sourceRel.startsWith("common/types/")) {
      continue;
    }
    const baseName = path.posix.basename(sourceRel, ".json");
    writeProjectedFile(
      schema,
      sourceRel,
      `common/types/${baseName}.json`,
      "response",
      schemaCache
    );
  }
}

// --- Capability discovery (root cause for symptom (c): the --src allowlist
// missing new capabilities/transports) --------------------------------------
//
// checkout/payment/order/buyer_consent/discount/fulfillment/cart/
// catalog_lookup/catalog_search are a DELIBERATE, curated set: they are the
// resources with their own real request/response lifecycle (topLevelVariantMap
// above), not something to auto-derive -- adding or removing one is a product
// decision, not a filesystem fact. That set is kept as-is.
//
// What generate_models.sh got wrong was hand-enumerating every capability
// BEYOND that set as --src flags, which is a filesystem fact: any new
// extension or lookup/search capability the reorg adds under common/ (or
// anywhere else) is invisible until someone edits the allowlist by hand.
// This walks the now-complete schemaCache (see loadSchemaCache) and finds
// them by SHAPE, using signals the spec itself publishes:
//   - a declared reverse-domain `name` (dev.ucp.*) marks a capability schema,
//     as opposed to a shared type -- verified present on every capability
//     file in both the 2026-04-08 and 2026-08-25 trees, and absent from the
//     four core registry files and from every schemas/*/types/* file.
//   - $defs.lookup_request + $defs.lookup_response (or search_request/
//     search_response) marks a read-only lookup/search capability -- the
//     exact shape catalog_lookup.json/catalog_search.json already use.
//   - a $defs key ending in ".checkout"/".order"/".cart" marks an extension
//     capability that attaches fields to a host resource -- the exact shape
//     buyer_consent/discount/fulfillment/ap2_mandate already use.
// A capability matching none of these (e.g. identity_linking, whose $defs is
// its own config shape, not an attachment or a lookup pair) is left alone:
// it is a pre-existing, documented gap in BOTH pins (see the PR body), not a
// 2026-08-25 regression, and modeling it would also change the 2026-04-08
// output -- out of scope for a root-cause-the-generator fix.
function isCoreRegistryFile(sourceRel) {
  return [
    "ucp.json",
    "capability.json",
    "service.json",
    "payment_handler.json",
    "profile.json",
  ].includes(sourceRel);
}

function isTypeFile(sourceRel) {
  return /(^|\/)types\//.test(sourceRel);
}

function classifyCapability(schema) {
  const defs = schema?.$defs ?? {};
  if (defs.lookup_request && defs.lookup_response) {
    return "lookup";
  }
  if (defs.search_request && defs.search_response) {
    return "search";
  }
  if (hasAttachmentDef(schema)) {
    return "extension";
  }
  return "none";
}

// Discover capability schemas not already covered by topLevelVariantMap or
// the AP2 extension, and return:
//   - variantMap: additional topLevelVariantMap-shaped entries to run
//     through the existing writeProjectedTopLevelSchemas machinery
//     (lookup/search get a single "response" self-mapping, exactly like
//     catalog_lookup/catalog_search; extensions get create/update/response,
//     exactly like buyer_consent/discount/fulfillment).
//   - manifest: the list of quicktype --src fragment specs (relative to the
//     projected schemas root) generate_models.sh must add for these to
//     actually reach the generated output, mirroring the hardcoded
//     buyer_consent/discount/fulfillment/catalog_lookup/catalog_search
//     entries already in generate_models.sh.
//   - skipped: name-bearing capability schemas that matched no known shape,
//     reported so the accounting is honest rather than silent (Phase 3
//     doctrine: every hit converted or explicitly out-of-scope with a
//     reason).
function discoverAdditionalCapabilities(schemaCache, excludedSourceRels) {
  const variantMap = {};
  const manifest = [];
  const skipped = [];

  for (const [sourceRel, schema] of schemaCache.entries()) {
    if (
      excludedSourceRels.has(sourceRel) ||
      isCoreRegistryFile(sourceRel) ||
      isTypeFile(sourceRel)
    ) {
      continue;
    }
    if (typeof schema?.name !== "string" || !schema.name.startsWith("dev.ucp.")) {
      continue;
    }

    const kind = classifyCapability(schema);
    const dir = path.posix.dirname(sourceRel);
    const baseName = path.posix.basename(sourceRel, ".json");

    if (kind === "lookup" || kind === "search") {
      const outputRel = sourceRel;
      const fragments =
        kind === "lookup"
          ? ["lookup_request", "lookup_response", "get_product_request", "get_product_response"]
          : ["search_request", "search_response"];

      // catalog_lookup.json/catalog_search.json (the pre-existing, hardcoded
      // entries) already name their fragments plainly ("lookup_request" ->
      // LookupRequestSchema) with no title, because until this discovery
      // mechanism existed there was only ever one schema using each name.
      // quicktype names a schema-mode fragment from its own `title` if
      // present, otherwise from the $ref fragment name -- so a second
      // capability reusing the same untitled fragment name (confirmed:
      // location_lookup.json also defines "lookup_request"/"lookup_response")
      // collides and silently loses one shape's fields (reproduced: without
      // this, the generated LookupRequestSchema carried location's
      // {distance, serves, ...} and dropped catalog's `attribution`). Titling
      // ONLY the newly-discovered capability's copy -- never touching
      // catalog_lookup/catalog_search's own untitled defs, which stay on the
      // topLevelVariantMap path unchanged -- fixes the collision without
      // moving the 2026-04-08 output, since no discovered capability can
      // exist in that tree to collide in the first place.
      const projected = clone(schema);
      for (const fragment of fragments) {
        if (!projected.$defs?.[fragment]) {
          continue;
        }
        // "lookup"/"search" already echo the capability's own title (e.g.
        // "Location Lookup"), so only append it for the "get_product_*"
        // pair, which does not -- avoids a stuttering "Location Lookup
        // Lookup Request" in favor of "Location Lookup Request".
        const suffix = fragment
          .replace(/^(lookup|search)_/, "")
          .split("_")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ");
        projected.$defs[fragment] = {
          ...projected.$defs[fragment],
          title: `${schema.title ?? baseName} ${suffix}`,
        };
        manifest.push(`${outputRel}#/$defs/${fragment}`);
      }
      writeJson(path.join(outputSchemasRoot, outputRel), projected);
      continue;
    }

    if (kind === "extension") {
      const attachmentTargets = ATTACHMENT_TARGETS.filter((target) =>
        Object.keys(schema.$defs).some((key) => key.endsWith(`.${target}`))
      );
      const outputs = {
        create: `${dir}/${baseName}.create_req.json`,
        update: `${dir}/${baseName}.update_req.json`,
        response: `${dir}/${baseName}_resp.json`,
      };
      variantMap[sourceRel] = outputs;
      for (const outputRel of Object.values(outputs)) {
        for (const target of attachmentTargets) {
          manifest.push(`${outputRel}#/$defs/${target}`);
        }
      }
      continue;
    }

    skipped.push({ sourceRel, name: schema.name });
  }

  return { variantMap, manifest, skipped };
}

// Transport envelopes (source/schemas/transports/*.json) are a separate
// concern from capabilities: they have no `name` field and no request/
// response split. Only "envelope" schemas (a top-level `oneOf` -- the shape
// of every message envelope: a2a_message, embedded_message, jsonrpc,
// mcp_tool_call) are modeled; embedded_config.json (a plain `type: object`
// config schema, present since 2026-04-08) is deliberately left alone --
// per the existing writeCompatibilityDiscoverySchemas comment, per-transport
// config typing is a separate, already-documented scope exclusion, and
// modeling it here would also change the 2026-04-08 output. The envelope/
// config distinction is a structural fact about each schema, not a version
// check, so it draws the line correctly for both pins without hardcoding
// which transports are "new".
function discoverTransportEnvelopes(schemaCache) {
  const manifest = [];
  for (const [sourceRel, schema] of schemaCache.entries()) {
    if (!sourceRel.startsWith("transports/")) {
      continue;
    }
    if (!Array.isArray(schema?.oneOf)) {
      continue;
    }
    const projected = projectSchemaNode(schema, {
      outputRel: sourceRel,
      schemaCache,
      sourceRel,
      variant: "response",
    });
    writeJson(path.join(outputSchemasRoot, sourceRel), projected);
    manifest.push(sourceRel);
  }
  return manifest;
}

const schemaCache = loadSchemaCache();

// Resolve where the deliberately-curated top-level resources and the AP2
// extension actually live today, so discovery below does not re-model them
// under a second name.
const knownSourceRels = new Set();
for (const sourceRel of Object.keys(topLevelVariantMap)) {
  const [actualSourceRel] = resolveSourceSchema(schemaCache, sourceRel);
  if (actualSourceRel) {
    knownSourceRels.add(actualSourceRel);
  }
}
{
  const [ap2SourceRel] = resolveSourceSchema(schemaCache, "shopping/ap2_mandate.json", {
    nameSuffix: "ap2_mandate",
  });
  if (ap2SourceRel) {
    knownSourceRels.add(ap2SourceRel);
  }
}

const { variantMap: discoveredVariantMap, manifest: discoveredManifest, skipped } =
  discoverAdditionalCapabilities(schemaCache, knownSourceRels);
const transportManifest = discoverTransportEnvelopes(schemaCache);

writeCompatibilityDiscoverySchemas();
writeCompatibilityCoreSchemas();
writeProjectedTypeSchemas(schemaCache);
writeProjectedCommonTypeSchemas(schemaCache);
writeProjectedTopLevelSchemas(schemaCache, {
  ...topLevelVariantMap,
  ...discoveredVariantMap,
});
writeCompatibilityPaymentDataSchema(schemaCache);
writeCompatibilityAp2Schema(schemaCache);

// generate_models.sh cannot know the discovered --src fragments ahead of
// time (they depend on which capabilities the checked-out spec tree
// declares), so hand them across as a manifest instead of a second hardcoded
// list. Written unconditionally (possibly empty) so the bash side never has
// to special-case "no manifest file".
writeJson(path.join(outputRoot, "generated-src-manifest.json"), {
  capabilities: discoveredManifest,
  transports: transportManifest,
});

if (skipped.length > 0) {
  console.error(
    `project-current-ucp-schemas.mjs: ${skipped.length} name-bearing capability schema(s) ` +
      "matched no known shape (lookup/search/checkout-order-cart-extension) and were left " +
      "unmodeled -- pre-existing gap, not this pass's concern:"
  );
  for (const { sourceRel, name } of skipped) {
    console.error(`  - ${sourceRel} (${name})`);
  }
}
