import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error(
    "Usage: node scripts/normalize-generated-schemas.mjs <input.ts> <output.ts>"
  );
  process.exit(1);
}

const sourcePath = path.resolve(inputPath);
const destinationPath = path.resolve(outputPath);
const sourceText = fs
  .readFileSync(sourcePath, "utf8")
  .replace(/\bCenterClassSchema\b/g, "GeoClassSchema")
  .replace(/\bCenterClass\b/g, "GeoClass");
const sourceFile = ts.createSourceFile(
  sourcePath,
  sourceText,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const canonicalNames = new Map([
  ["AllocationClass", "Allocation"],
  ["AllocationElement", "Allocation"],
  ["AppliedAllocation", "Allocation"],
  ["BillingAddressClass", "PostalAddress"],
  // location_destination.json composes common/types/location_summary.json,
  // which the projection never splits, so its request variants collapse onto
  // the summary's shape; keep the summary the declaration they alias.
  ["BusinessLocationDestinationCreateRequest", "LocationSummary"],
  ["BusinessLocationDestinationUpdateRequest", "LocationSummary"],
  ["BuyerClass", "Buyer"],
  ["CardPaymentInstrument", "PaymentInstrument"],
  ["CheckoutUpdateRequestPayment", "PaymentSelection"],
  ["ContextClass", "Context"],
  ["FluffyConsent", "Consent"],
  ["FulfillmentDestinationRequestElement", "FulfillmentDestinationRequest"],
  ["GroupClass", "FulfillmentGroupUpdateRequest"],
  ["IdentityClass", "PaymentIdentity"],
  ["ItemClass", "ItemReference"],
  ["LineItemClass", "LineItemUpdateRequest"],
  ["LineItemElement", "LineItem"],
  ["LineItemItem", "ItemReference"],
  ["LinkElement", "Link"],
  ["Mcp", "SchemaEndpoint"],
  ["MessageElement", "Message"],
  ["OrderClass", "OrderConfirmation"],
  ["OrderLineItemQuantity", "LineItemQuantity"],
  ["PaymentCreateRequest", "PaymentSelection"],
  ["PaymentUpdateRequest", "PaymentSelection"],
  ["PurpleConsent", "Consent"],
  ["PurpleUnitPrice", "UnitPrice"],
  ["Rest", "SchemaEndpoint"],
  ["TentacledConsent", "Consent"],
  ["TokenCredentialCreateRequest", "TokenCredentialRequest"],
  ["TokenCredentialUpdateRequest", "TokenCredentialRequest"],
  ["TotalResponse", "Total"],
  ["TotalsResponse", "CheckoutResponseTotal"],
  ["UcpCheckoutResponse", "UcpResponse"],
  ["UcpOrderResponse", "UcpResponse"],
]);

function normalizeSchemaText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function aliasBlock(aliasName, canonicalName) {
  return `export const ${aliasName}Schema = ${canonicalName}Schema;\nexport type ${aliasName} = ${canonicalName};`;
}

const schemaBlocks = new Map();

for (let index = 0; index < sourceFile.statements.length; index += 1) {
  const statement = sourceFile.statements[index];
  if (!ts.isVariableStatement(statement)) {
    continue;
  }

  const declaration = statement.declarationList.declarations[0];
  if (
    !declaration ||
    !ts.isIdentifier(declaration.name) ||
    !declaration.initializer ||
    !declaration.name.text.endsWith("Schema")
  ) {
    continue;
  }

  const schemaName = declaration.name.text.slice(0, -6);
  const nextStatement = sourceFile.statements[index + 1];

  if (
    !nextStatement ||
    !ts.isTypeAliasDeclaration(nextStatement) ||
    nextStatement.name.text !== schemaName
  ) {
    continue;
  }

  schemaBlocks.set(schemaName, {
    schemaName,
    start: statement.getStart(sourceFile),
    end: nextStatement.end,
    initializerText: declaration.initializer.getText(sourceFile),
    normalizedInitializer: normalizeSchemaText(
      declaration.initializer.getText(sourceFile)
    ),
  });
}

// Pass 1: Initial grouping to find duplicates
const initialGroups = new Map();
for (const block of schemaBlocks.values()) {
  const group = initialGroups.get(block.normalizedInitializer) ?? [];
  group.push(block.schemaName);
  initialGroups.set(block.normalizedInitializer, group);
}

// Pass 2: Build alias map
const aliasMap = new Map();
for (const [alias, canonical] of canonicalNames) {
  aliasMap.set(alias, canonical);
}

for (const names of initialGroups.values()) {
  if (names.length === 1) {
    continue;
  }
  const canonicalName =
    names.map((name) => canonicalNames.get(name)).find(Boolean) ?? names[0];
  for (const name of names) {
    if (name !== canonicalName) {
      aliasMap.set(name, canonicalName);
    }
  }
}

// Pass 3: Resolve aliases in initializers
for (const block of schemaBlocks.values()) {
  let resolvedInitializer = block.normalizedInitializer;
  const sortedAliases = Array.from(aliasMap.keys()).sort(
    (a, b) => b.length - a.length
  );
  for (const alias of sortedAliases) {
    const canonical = aliasMap.get(alias);
    const regex = new RegExp(`\\b${alias}Schema\\b`, "g");
    resolvedInitializer = resolvedInitializer.replace(
      regex,
      `${canonical}Schema`
    );
  }
  block.resolvedInitializer = resolvedInitializer;
}

// Pass 4: Regroup based on resolved initializers
const duplicateGroups = new Map();
for (const block of schemaBlocks.values()) {
  const group = duplicateGroups.get(block.resolvedInitializer) ?? [];
  group.push(block.schemaName);
  duplicateGroups.set(block.resolvedInitializer, group);
}

const replacements = [];

for (const [normalizedInitializer, names] of duplicateGroups.entries()) {
  if (names.length === 1) {
    continue;
  }

  const canonicalName =
    names.map((name) => canonicalNames.get(name)).find(Boolean) ?? names[0];
  const keepName = names
    .map((name) => schemaBlocks.get(name))
    .filter(Boolean)
    .sort((left, right) => left.start - right.start)[0]?.schemaName;
  const keepBlock = schemaBlocks.get(keepName);

  if (!keepBlock) {
    continue;
  }

  const aliases = new Set(names.filter((name) => name !== canonicalName));
  if (keepName !== canonicalName) {
    aliases.add(keepName);
  }

  const canonicalBlock = [
    `export const ${canonicalName}Schema = ${keepBlock.initializerText};`,
    `export type ${canonicalName} = z.infer<typeof ${canonicalName}Schema>;`,
    ...Array.from(aliases)
      .sort((left, right) => left.localeCompare(right))
      .map((name) => aliasBlock(name, canonicalName)),
  ].join("\n");

  replacements.push({
    start: keepBlock.start,
    end: keepBlock.end,
    text: `${canonicalBlock}\n`,
  });

  for (const name of names) {
    if (name === keepName) {
      continue;
    }

    const block = schemaBlocks.get(name);
    if (!block) {
      continue;
    }

    replacements.push({
      start: block.start,
      end: block.end,
      text: "",
    });
  }
}

replacements.sort((left, right) => right.start - left.start);

let outputText = sourceText;
for (const replacement of replacements) {
  outputText =
    outputText.slice(0, replacement.start) +
    replacement.text +
    outputText.slice(replacement.end);
}

// quicktype names an anonymous inline object after its property when that name
// is free. Splitting types/fulfillment.json into Create Request / Update
// Request / Response variants freed the bare title `Fulfillment`, and
// order.json's inline `fulfillment` object ({ events, expectations }) took it,
// so the existing FulfillmentSchema export kept compiling while silently
// changing meaning. Pin that inline object to the name it carried while the
// title was occupied (FulfillmentClass); `Fulfillment` then stays the checkout
// container through the compatibility alias below. Guarded on the two blocks
// differing after alias resolution: identical ones were unified above.
const fulfillmentBlock = schemaBlocks.get("Fulfillment");
const fulfillmentResponseBlock = schemaBlocks.get("FulfillmentResponse");
if (
  fulfillmentBlock &&
  fulfillmentResponseBlock &&
  !schemaBlocks.has("FulfillmentClass") &&
  fulfillmentBlock.resolvedInitializer !==
    fulfillmentResponseBlock.resolvedInitializer
) {
  outputText = outputText
    .replace(/\bFulfillmentSchema\b/g, "FulfillmentClassSchema")
    .replace(/^export type Fulfillment = /gm, "export type FulfillmentClass = ")
    .replace(/ = Fulfillment;$/gm, " = FulfillmentClass;");
}

// Post-processing renames
outputText = outputText
  .replace(/\bPaymentClassSchema\b/g, "PaymentSplitPaymentsSchema")
  .replace(/\bPaymentClass\b/g, "PaymentSplitPayments")
  .replace(
    /export const ConstraintsElementSchema = z\.object\(\{([\s\S]*?)\}\);/g,
    "export const ConstraintsElementSchema = z.object({$1}).passthrough();"
  )
  .replace(
    /export const ConstraintExpressionSchema = z\.object\(\{([\s\S]*?)\}\);/g,
    "export const ConstraintExpressionSchema = z.object({$1}).passthrough();"
  );

// Compatibility exports for schemas referenced across SDK versions and tests
const requiredCompatibilityExports = [
  { alias: "TotalResponse", target: "Total" },
  { alias: "TotalsResponse", target: "CheckoutResponseTotal" },
  { alias: "PurpleUnitPrice", target: "UnitPrice" },
  { alias: "PaymentTerm", target: "PurplePaymentTerm" },
  { alias: "CheckoutCreateRequestContext", target: "Context" },
  { alias: "CheckoutResponseMessage", target: "Message" },
  { alias: "LookupResponseMessage", target: "Message" },
  { alias: "CheckoutCreateRequestSignals", target: "Signals" },
  { alias: "LookupRequestSignals", target: "Signals" },
  { alias: "LineItemQuantityRef", target: "EventLineItem" },
  { alias: "Provider", target: "IdentityProvider" },
  // The fulfillment family was generated as one "unified" shape per type,
  // written with response rules, until the projector split it per variant
  // (js-sdk#77). Each unified name, and the quicktype element names that
  // aliased it, keeps resolving to the shape it always had: the response.
  {
    alias: "AvailableMethodElement",
    target: "FulfillmentAvailableMethodResponse",
  },
  {
    alias: "BusinessLocationDestination",
    target: "BusinessLocationDestinationResponse",
  },
  {
    alias: "BusinessLocationDestinationType",
    target: "BusinessLocationDestinationResponseType",
  },
  { alias: "DestinationElement", target: "FulfillmentDestinationResponse" },
  { alias: "Fulfillment", target: "FulfillmentResponse" },
  {
    alias: "FulfillmentAvailableMethod",
    target: "FulfillmentAvailableMethodResponse",
  },
  { alias: "FulfillmentDestination", target: "FulfillmentDestinationResponse" },
  { alias: "FulfillmentGroup", target: "FulfillmentGroupResponse" },
  { alias: "FulfillmentMethod", target: "FulfillmentMethodResponse" },
  { alias: "FulfillmentOption", target: "FulfillmentOptionResponse" },
  { alias: "FulfillmentOptionBase", target: "FulfillmentOptionBaseResponse" },
  { alias: "FulfillmentOptionElement", target: "FulfillmentOptionResponse" },
  { alias: "GroupElement", target: "FulfillmentGroupResponse" },
  { alias: "MethodElement", target: "FulfillmentMethodResponse" },
  { alias: "ShippingDestination", target: "ShippingDestinationResponse" },
  {
    alias: "ShippingDestinationType",
    target: "ShippingDestinationCreateRequestType",
  },
];

for (const { alias, target } of requiredCompatibilityExports) {
  if (!outputText.includes(`export const ${alias}Schema`)) {
    outputText += `\nexport const ${alias}Schema = ${target}Schema;\nexport type ${alias} = ${target};\n`;
  }
}

fs.writeFileSync(destinationPath, outputText);
