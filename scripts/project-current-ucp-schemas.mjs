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

fs.mkdirSync(outputDiscoveryRoot, { recursive: true });
fs.mkdirSync(outputTypesRoot, { recursive: true });

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
    response: "shopping/checkout_resp.json",
  },
  "shopping/payment.json": {
    create: "shopping/payment.create_req.json",
    update: "shopping/payment.update_req.json",
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
};

const alwaysUnifiedTypeFiles = new Set([
  "account_info",
  "adjustment",
  "amount",
  "available_payment_instrument",
  "binding",
  "buyer",
  "business_fulfillment_config",
  "card_credential",
  "card_payment_instrument",
  "category",
  "context",
  "description",
  "error_code",
  "error_response",
  "expectation",
  "fulfillment_event",
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
  "signals",
  "signed_amount",
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

function writeCompatibilityDiscoverySchemas() {
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

  const paymentHandlerResponse = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Payment Handler Response",
    type: "object",
    required: [
      "config",
      "config_schema",
      "id",
      "instrument_schemas",
      "name",
      "spec",
      "version",
    ],
    properties: {
      config: { type: "object", additionalProperties: true },
      config_schema: { type: "string" },
      id: { type: "string" },
      instrument_schemas: {
        type: "array",
        items: { type: "string" },
      },
      name: { type: "string" },
      spec: { type: "string" },
      version: { type: "string" },
    },
  };

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

  const capabilityResponse = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "Capability Response",
    type: "object",
    required: ["name", "version"],
    properties: {
      config: { type: "object", additionalProperties: true },
      extends: { type: "string" },
      name: { type: "string" },
      schema: { type: "string" },
      spec: { type: "string" },
      version: { type: "string" },
    },
  };

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

  const ucpResponse = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "UCP Response",
    type: "object",
    required: ["capabilities", "version"],
    properties: {
      capabilities: {
        type: "array",
        items: { $ref: "capability_response.json" },
      },
      version: { type: "string" },
    },
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
    path.join(outputDiscoveryRoot, "ucp_discovery_profile.json"),
    ucpDiscoveryProfile
  );
}

function writeCompatibilityCoreSchemas() {
  const ucpSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $defs: {
      response_checkout_schema: { $ref: "../discovery/ucp_response.json" },
      response_order_schema: { $ref: "../discovery/ucp_response.json" },
      response_cart_schema: { $ref: "../discovery/ucp_response.json" },
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

const schemaCache = loadSchemaCache();

writeCompatibilityDiscoverySchemas();
writeCompatibilityCoreSchemas();
writeProjectedTypeSchemas(schemaCache);
writeProjectedTopLevelSchemas(schemaCache);
writeCompatibilityPaymentDataSchema();
writeCompatibilityAp2Schema(schemaCache);
