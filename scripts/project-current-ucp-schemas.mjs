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
      const properties = {};
      const required = new Set(
        Array.isArray(node.required) ? node.required : []
      );

      for (const [propertyName, propertySchema] of Object.entries(value)) {
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

function loadSchemaCache() {
  const cache = new Map();

  for (const fileName of fs.readdirSync(sourceTypesRoot)) {
    if (!fileName.endsWith(".json")) {
      continue;
    }

    cache.set(
      `shopping/types/${fileName}`,
      readJson(path.join(sourceTypesRoot, fileName))
    );
  }

  for (const fileName of fs.readdirSync(sourceShoppingRoot)) {
    if (!fileName.endsWith(".json")) {
      continue;
    }

    cache.set(
      `shopping/${fileName}`,
      readJson(path.join(sourceShoppingRoot, fileName))
    );
  }

  if (fs.existsSync(sourceCommonTypesRoot)) {
    for (const fileName of fs.readdirSync(sourceCommonTypesRoot)) {
      if (!fileName.endsWith(".json")) {
        continue;
      }

      cache.set(
        `common/types/${fileName}`,
        readJson(path.join(sourceCommonTypesRoot, fileName))
      );
    }
  }

  return cache;
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

  const signingKey = {
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
      schema: { type: "string" },
      spec: { type: "string" },
      version: { type: "string" },
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
        properties: { endpoint: { type: "string" } },
      },
      embedded: {
        type: "object",
        required: ["schema"],
        properties: { schema: { type: "string" } },
      },
      mcp: {
        type: "object",
        required: ["endpoint", "schema"],
        properties: {
          endpoint: { type: "string" },
          schema: { type: "string" },
        },
      },
      rest: {
        type: "object",
        required: ["endpoint", "schema"],
        properties: {
          endpoint: { type: "string" },
          schema: { type: "string" },
        },
      },
      spec: { type: "string" },
      version: { type: "string" },
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
      signing_keys: {
        type: "array",
        items: { $ref: "signing_key.json" },
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
          version: { type: "string" },
        },
      },
    },
  };

  writeJson(path.join(outputDiscoveryRoot, "signing_key.json"), signingKey);
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
  const ucpSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $defs: {
      response_checkout_schema: {
        $ref: "../discovery/ucp_checkout_response.json",
      },
      response_order_schema: { $ref: "../discovery/ucp_response.json" },
      response_cart_schema: { $ref: "../discovery/ucp_response.json" },
      response_catalog_schema: { $ref: "../discovery/ucp_response.json" },
    },
  };

  writeJson(path.join(outputSchemasRoot, "ucp.json"), ucpSchema);
}

function writeCompatibilityPaymentDataSchema() {
  const paymentDataSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Payment Data",
    type: "object",
    required: ["payment_data"],
    properties: {
      payment_data: {
        $ref: "types/payment_instrument.json",
      },
    },
  };

  writeJson(
    path.join(outputShoppingRoot, "payment_data.json"),
    paymentDataSchema
  );
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

function renameExtensionCheckoutDef(projectedSchema) {
  const schema = clone(projectedSchema);
  if (!schema.$defs) {
    return schema;
  }

  for (const key of Object.keys(schema.$defs)) {
    if (key.endsWith(".checkout")) {
      schema.$defs.checkout = schema.$defs[key];
      delete schema.$defs[key];
      break;
    }
  }

  return schema;
}

function writeProjectedTopLevelSchemas(schemaCache) {
  for (const [sourceRel, variants] of Object.entries(topLevelVariantMap)) {
    const sourceSchema = schemaCache.get(sourceRel);

    for (const [variant, outputRel] of Object.entries(variants)) {
      let projected = projectSchemaNode(sourceSchema, {
        outputRel,
        schemaCache,
        sourceRel,
        variant,
      });

      projected = applyVariantTitles(
        projected,
        titleSuffixForOutput(outputRel)
      );

      if (
        sourceRel === "shopping/buyer_consent.json" ||
        sourceRel === "shopping/discount.json" ||
        sourceRel === "shopping/fulfillment.json"
      ) {
        projected = renameExtensionCheckoutDef(projected);
      }

      writeJson(path.join(outputSchemasRoot, outputRel), projected);
    }
  }
}

function writeCompatibilityAp2Schema(schemaCache) {
  const sourceRel = "shopping/ap2_mandate.json";
  const sourceSchema = schemaCache.get(sourceRel);

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

const schemaCache = loadSchemaCache();

writeCompatibilityDiscoverySchemas();
writeCompatibilityCoreSchemas();
writeProjectedTypeSchemas(schemaCache);
writeProjectedCommonTypeSchemas(schemaCache);
writeProjectedTopLevelSchemas(schemaCache);
writeCompatibilityPaymentDataSchema();
writeCompatibilityAp2Schema(schemaCache);
