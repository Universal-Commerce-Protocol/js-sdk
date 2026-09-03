import * as z from "zod";

export const UseSchema = z.enum(["enc", "sig"]);
export type Use = z.infer<typeof UseSchema>;

// Content format, default = plain.

export const ContentTypeSchema = z.enum(["markdown", "plain"]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

// Reflects the resource state and recommended action. 'recoverable': platform can resolve
// the condition in band, for example by modifying inputs or processing a related Action,
// and submit a new operation when needed. 'requires_buyer_input': merchant requires
// information their API doesn't support collecting programmatically (checkout incomplete).
// 'requires_buyer_review': buyer must authorize before order placement due to policy,
// regulatory, or entitlement rules. 'unrecoverable': no valid resource exists to act on,
// retry with new resource or inputs. Errors with 'requires_*' severity contribute to
// 'status: requires_escalation'.

export const SeveritySchema = z.enum([
  "recoverable",
  "requires_buyer_input",
  "requires_buyer_review",
  "unrecoverable",
]);
export type Severity = z.infer<typeof SeveritySchema>;

export const MessageTypeSchema = z.enum(["error", "info", "warning"]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

// Checkout state indicating the current phase and required processing. See Checkout Status
// lifecycle documentation for state transition details.

export const CheckoutResponseStatusSchema = z.enum([
  "canceled",
  "complete_in_progress",
  "completed",
  "incomplete",
  "ready_for_complete",
  "requires_escalation",
]);
export type CheckoutResponseStatus = z.infer<
  typeof CheckoutResponseStatusSchema
>;

export const TransportSchema = z.enum(["a2a", "embedded", "mcp", "rest"]);
export type Transport = z.infer<typeof TransportSchema>;

export const UcpCheckoutResponseStatusSchema = z.enum(["error", "success"]);
export type UcpCheckoutResponseStatus = z.infer<
  typeof UcpCheckoutResponseStatusSchema
>;

// Adjustment status.

export const AdjustmentStatusSchema = z.enum([
  "completed",
  "failed",
  "pending",
]);
export type AdjustmentStatus = z.infer<typeof AdjustmentStatusSchema>;

// Derived status: removed if quantity.total == 0, fulfilled if quantity.total > 0 and
// quantity.fulfilled == quantity.total, partial if quantity.total > 0 and
// quantity.fulfilled > 0, otherwise processing.

export const LineItemStatusSchema = z.enum([
  "fulfilled",
  "partial",
  "processing",
  "removed",
]);
export type LineItemStatus = z.infer<typeof LineItemStatusSchema>;

// Identifies the party that asserted the current `granted` value for this segment.
// `business` means the value reflects the business's default policy; `platform` means the
// value reflects an explicit buyer decision captured by the platform.
//
// Identifies the party that asserted the current `granted` value. `business` means the
// value reflects the business's default policy; `platform` means the value reflects an
// explicit buyer decision captured by the platform.

export const SourceSchema = z.enum(["business", "platform"]);
export type Source = z.infer<typeof SourceSchema>;

// Allocation method. 'each' = applied independently per item. 'across' = split
// proportionally by value.

export const MethodSchema = z.enum(["across", "each"]);
export type Method = z.infer<typeof MethodSchema>;

// A stable UCP day-of-week identifier for the day on which this recurring local civil-time
// interval begins in the containing Location's `timezone`. It is not localized display text.

export const DaySchema = z.enum([
  "friday",
  "monday",
  "saturday",
  "sunday",
  "thursday",
  "tuesday",
  "wednesday",
]);
export type Day = z.infer<typeof DaySchema>;

// Error codes specific to AP2 mandate verification.

export const Ap2ErrorCodeSchema = z.enum([
  "agent_missing_key",
  "mandate_expired",
  "mandate_invalid_signature",
  "mandate_required",
  "mandate_scope_mismatch",
  "merchant_authorization_invalid",
  "merchant_authorization_missing",
]);
export type Ap2ErrorCode = z.infer<typeof Ap2ErrorCodeSchema>;

export const JsonrpcSchema = z.enum(["2.0"]);
export type Jsonrpc = z.infer<typeof JsonrpcSchema>;

// A non-empty, opaque Business-scoped item identifier.

export const A2AUcpMessageEnvelopeMethodSchema = z.enum(["message/send"]);
export type A2AUcpMessageEnvelopeMethod = z.infer<
  typeof A2AUcpMessageEnvelopeMethodSchema
>;

export const KindSchema = z.enum(["message"]);
export type Kind = z.infer<typeof KindSchema>;

// Message sender role.

export const RoleSchema = z.enum(["agent", "user"]);
export type Role = z.infer<typeof RoleSchema>;

export const ColorSchemeSchema = z.enum(["dark", "light"]);
export type ColorScheme = z.infer<typeof ColorSchemeSchema>;

// A non-empty, opaque Business-scoped item identifier.

export const McpToolCallEnvelopeMethodSchema = z.enum(["tools/call"]);
export type McpToolCallEnvelopeMethod = z.infer<
  typeof McpToolCallEnvelopeMethodSchema
>;

export const BusinessLocationDestinationTypeSchema = z.enum([
  "business_location",
]);
export type BusinessLocationDestinationType = z.infer<
  typeof BusinessLocationDestinationTypeSchema
>;

export const ShippingDestinationTypeSchema = z.enum(["shipping_address"]);
export type ShippingDestinationType = z.infer<
  typeof ShippingDestinationTypeSchema
>;

// Deprecated: the credential type now carries this distinction. The type of card number.
// Network tokens are preferred with fallback to FPAN. See PCI Scope for more details.

export const CardNumberTypeSchema = z.enum(["dpan", "fpan", "network_token"]);
export type CardNumberType = z.infer<typeof CardNumberTypeSchema>;

// URL-style parameter value, encoded as a string. Numeric or boolean values MUST be
// string-encoded as they would be in a URL query string.
//
// Error code identifying the type of error. Standard errors are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Warning code identifying the type of warning. Standard codes are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Info code identifying the type of informational message. Standard codes are defined in
// capability specifications (see examples) and have standardized semantics; freeform codes
// are permitted.
//
// Fulfillment method `type`. Well-known values: `shipping`, `pickup`.

export const CardCredentialTypeSchema = z.enum(["card"]);
export type CardCredentialType = z.infer<typeof CardCredentialTypeSchema>;

export const MessageErrorTypeSchema = z.enum(["error"]);
export type MessageErrorType = z.infer<typeof MessageErrorTypeSchema>;

export const MessageInfoTypeSchema = z.enum(["info"]);
export type MessageInfoType = z.infer<typeof MessageInfoTypeSchema>;

export const MessageWarningTypeSchema = z.enum(["warning"]);
export type MessageWarningType = z.infer<typeof MessageWarningTypeSchema>;

// URL-style parameter value, encoded as a string. Numeric or boolean values MUST be
// string-encoded as they would be in a URL query string.
//
// Error code identifying the type of error. Standard errors are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Warning code identifying the type of warning. Standard codes are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Info code identifying the type of informational message. Standard codes are defined in
// capability specifications (see examples) and have standardized semantics; freeform codes
// are permitted.
//
// Fulfillment method `type`. Well-known values: `shipping`, `pickup`.

export const NetworkTokenCredentialTypeSchema = z.enum(["network_token"]);
export type NetworkTokenCredentialType = z.infer<
  typeof NetworkTokenCredentialTypeSchema
>;

// URL-style parameter value, encoded as a string. Numeric or boolean values MUST be
// string-encoded as they would be in a URL query string.
//
// Error code identifying the type of error. Standard errors are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Warning code identifying the type of warning. Standard codes are defined in capability
// specifications (see examples) and have standardized semantics; freeform codes are
// permitted.
//
// Info code identifying the type of informational message. Standard codes are defined in
// capability specifications (see examples) and have standardized semantics; freeform codes
// are permitted.
//
// Fulfillment method `type`. Well-known values: `shipping`, `pickup`.

export const PanCredentialTypeSchema = z.enum(["pan"]);
export type PanCredentialType = z.infer<typeof PanCredentialTypeSchema>;

export const SigningKeySchema = z.object({
  alg: z.string().optional(),
  crv: z.string().optional(),
  e: z.string().optional(),
  kid: z.string(),
  kty: z.string(),
  n: z.string().optional(),
  use: UseSchema.optional(),
  x: z.string().optional(),
  y: z.string().optional(),
});
export type SigningKey = z.infer<typeof SigningKeySchema>;

export const ConstraintsPropertySchema = z.object({
  const: z.any().optional(),
  enum: z
    .array(z.any())
    .min(1)
    .refine(
      (items) =>
        new Set(items.map((item) => JSON.stringify(item))).size ===
        items.length,
      { message: "Array items must be unique (uniqueItems)" }
    )
    .optional(),
});
export type ConstraintsProperty = z.infer<typeof ConstraintsPropertySchema>;
export const ConstraintExpressionPropertySchema = ConstraintsPropertySchema;
export type ConstraintExpressionProperty = ConstraintsProperty;

export const CapabilityDiscoverySchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  extends: z.string().optional(),
  name: z.string(),
  schema: z.string().url(),
  spec: z.string().url(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type CapabilityDiscovery = z.infer<typeof CapabilityDiscoverySchema>;

export const A2ASchema = z.object({
  endpoint: z
    .string()
    .regex(/^https:\/\/[^\/?#\s\\@]+(?:\/[^?#\s\\]*[^\/?#\s\\])?$/)
    .url(),
});
export type A2A = z.infer<typeof A2ASchema>;
export const PermalinkCapabilityBusinessConfigSchema = A2ASchema;
export type PermalinkCapabilityBusinessConfig = A2A;

export const EmbeddedSchema = z.object({
  schema: z.string().url(),
});
export type Embedded = z.infer<typeof EmbeddedSchema>;

export const SchemaEndpointSchema = z.object({
  endpoint: z.string().url(),
  schema: z.string().url(),
});
export type SchemaEndpoint = z.infer<typeof SchemaEndpointSchema>;
export const McpSchema = SchemaEndpointSchema;
export type Mcp = SchemaEndpoint;
export const RestSchema = SchemaEndpointSchema;
export type Rest = SchemaEndpoint;

export const BuyerSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
});
export type Buyer = z.infer<typeof BuyerSchema>;
export const BuyerClassSchema = BuyerSchema;
export type BuyerClass = Buyer;

export const PurplePaymentSchema = z.object({
  handler: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    ),
  types: z.array(z.string()).optional(),
});
export type PurplePayment = z.infer<typeof PurplePaymentSchema>;
export const FluffyPaymentSchema = PurplePaymentSchema;
export type FluffyPayment = PurplePayment;

export const QuantityUnitClassSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
  increment: z.number().int().gte(1).optional(),
});
export type QuantityUnitClass = z.infer<typeof QuantityUnitClassSchema>;
export const QuantityUnitSchema = QuantityUnitClassSchema;
export type QuantityUnit = QuantityUnitClass;

export const PostalAddressSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
});
export type PostalAddress = z.infer<typeof PostalAddressSchema>;
export const BillingAddressClassSchema = PostalAddressSchema;
export type BillingAddressClass = PostalAddress;

export const CredentialClassSchema = z.object({
  type: z.string(),
});
export type CredentialClass = z.infer<typeof CredentialClassSchema>;
export const IdentityProviderSchema = CredentialClassSchema;
export type IdentityProvider = CredentialClass;
export const PaymentCredentialSchema = CredentialClassSchema;
export type PaymentCredential = CredentialClass;
export const TokenCredentialSchema = CredentialClassSchema;
export type TokenCredential = CredentialClass;

export const SignalsClassSchema = z
  .object({
    "dev.ucp.buyer_ip": z.string().optional(),
    "dev.ucp.user_agent": z.string().optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    for (const key of Object.keys(value)) {
      if (
        !/^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
          key
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `Property name ${JSON.stringify(key)} does not match the required pattern (propertyNames)`,
        });
      }
    }
  });
export type SignalsClass = z.infer<typeof SignalsClassSchema>;
export const SignalsSchema = SignalsClassSchema;
export type Signals = SignalsClass;

export const ItemUpdateRequestSchema = z.object({
  id: z.string(),
  quantity_unit: QuantityUnitClassSchema.optional(),
});
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequestSchema>;
export const ItemCreateRequestSchema = ItemUpdateRequestSchema;
export type ItemCreateRequest = ItemUpdateRequest;

export const ActionElementSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  id: z.string().min(1),
});
export type ActionElement = z.infer<typeof ActionElementSchema>;

export const PurpleMeasureSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
  value: z.number(),
});
export type PurpleMeasure = z.infer<typeof PurpleMeasureSchema>;
export const FluffyMeasureSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
  value: z.number().int().gte(1).lte(9007199254740991),
});
export type FluffyMeasure = PurpleMeasure;
export const LineItemMeasureSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
  value: z.number().int().gte(1).lte(9007199254740991),
});
export type LineItemMeasure = PurpleMeasure;
export const MeasureSchema = PurpleMeasureSchema;
export type Measure = PurpleMeasure;
export const StickyMeasureSchema = PurpleMeasureSchema;
export type StickyMeasure = PurpleMeasure;
export const TentacledMeasureSchema = PurpleMeasureSchema;
export type TentacledMeasure = PurpleMeasure;

export const LineItemResponseTotalSchema = z
  .object({
    amount: z.number().int().gte(-9007199254740991).lte(9007199254740991),
    display_text: z.string().optional(),
    type: z.string(),
  })
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "numeric",
        discriminator: "type",
        values: ["discount", "items_discount"],
        negated: false,
        required: [],
        field: null,
        format: null,
        target: "amount",
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: 0,
      },
      {
        kind: "numeric",
        discriminator: "type",
        values: ["subtotal", "fulfillment", "tax", "fee"],
        negated: false,
        required: [],
        field: null,
        format: null,
        target: "amount",
        minimum: 0,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
    ]) {
      const record = value as Record<string, unknown>;
      const discriminatorVal = record[rule.discriminator];
      if (discriminatorVal === undefined) continue;
      const matches = (rule.values as readonly unknown[]).includes(
        discriminatorVal
      );
      if (rule.negated ? matches : !matches) continue;
      if (rule.kind === "required") {
        for (const field of rule.required) {
          if (!(field in record))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Field is required by a conditional constraint",
            });
        }
        continue;
      }
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          try {
            new URL(fieldValue);
          } catch {
            if (field !== null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [field],
                message: "Value must be a valid URI",
              });
          }
        }
        continue;
      }
      if (rule.target === null) continue;
      const target = record[rule.target];
      if (typeof target !== "number") continue;
      const invalid =
        (rule.minimum !== null && target < rule.minimum) ||
        (rule.maximum !== null && target > rule.maximum) ||
        (rule.exclusiveMinimum !== null && target <= rule.exclusiveMinimum) ||
        (rule.exclusiveMaximum !== null && target >= rule.exclusiveMaximum);
      if (invalid)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.target],
          message: "Value violates a conditional numeric constraint",
        });
    }
  });
export type LineItemResponseTotal = z.infer<typeof LineItemResponseTotalSchema>;
export const TotalSchema = LineItemResponseTotalSchema;
export type Total = LineItemResponseTotal;

export const LinkSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string().url(),
});
export type Link = z.infer<typeof LinkSchema>;
export const LinkElementSchema = LinkSchema;
export type LinkElement = Link;

export const MessageSchema = z
  .object({
    code: z.string().optional(),
    content: z.string(),
    content_type: ContentTypeSchema.optional(),
    path: z.string().optional(),
    severity: SeveritySchema.optional(),
    type: MessageTypeSchema,
    image_url: z.string().optional(),
    presentation: z.string().optional(),
    url: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "required",
        discriminator: "type",
        values: ["error"],
        negated: false,
        required: ["code", "content", "severity", "type"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
      {
        kind: "required",
        discriminator: "type",
        values: ["warning"],
        negated: false,
        required: ["code", "content", "type"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
      {
        kind: "required",
        discriminator: "type",
        values: ["info"],
        negated: false,
        required: ["content", "type"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
      {
        kind: "format",
        discriminator: "type",
        values: ["warning"],
        negated: false,
        required: [],
        field: "image_url",
        format: "uri",
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
      {
        kind: "format",
        discriminator: "type",
        values: ["warning"],
        negated: false,
        required: [],
        field: "url",
        format: "uri",
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
    ]) {
      const record = value as Record<string, unknown>;
      const discriminatorVal = record[rule.discriminator];
      if (discriminatorVal === undefined) continue;
      const matches = (rule.values as readonly unknown[]).includes(
        discriminatorVal
      );
      if (rule.negated ? matches : !matches) continue;
      if (rule.kind === "required") {
        for (const field of rule.required) {
          if (!(field in record))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Field is required by a conditional constraint",
            });
        }
        continue;
      }
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          try {
            new URL(fieldValue);
          } catch {
            if (field !== null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [field],
                message: "Value must be a valid URI",
              });
          }
        }
        continue;
      }
      if (rule.target === null) continue;
      const target = record[rule.target];
      if (typeof target !== "number") continue;
      const invalid =
        (rule.minimum !== null && target < rule.minimum) ||
        (rule.maximum !== null && target > rule.maximum) ||
        (rule.exclusiveMinimum !== null && target <= rule.exclusiveMinimum) ||
        (rule.exclusiveMaximum !== null && target >= rule.exclusiveMaximum);
      if (invalid)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.target],
          message: "Value violates a conditional numeric constraint",
        });
    }
  });
export type Message = z.infer<typeof MessageSchema>;
export const MessageElementSchema = MessageSchema;
export type MessageElement = Message;

export const OrderConfirmationSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  permalink_url: z.string().url(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;
export const OrderClassSchema = OrderConfirmationSchema;
export type OrderClass = OrderConfirmation;

export const DescriptionClassSchema = z
  .object({
    html: z.string().optional(),
    markdown: z.string().optional(),
    plain: z.string().optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  });
export type DescriptionClass = z.infer<typeof DescriptionClassSchema>;
export const DescriptionSchema = DescriptionClassSchema;
export type Description = DescriptionClass;

export const TotalLineSchema = z.object({
  amount: z.number().int().gte(-9007199254740991).lte(9007199254740991),
  display_text: z.string(),
});
export type TotalLine = z.infer<typeof TotalLineSchema>;
export const TotalLineClassSchema = TotalLineSchema;
export type TotalLineClass = TotalLine;

export const CapabilityResponseSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
  id: z.string().optional(),
  schema: z.string().url().optional(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type CapabilityResponse = z.infer<typeof CapabilityResponseSchema>;

export const ServiceResponseSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  endpoint: z.string().url().optional(),
  id: z.string().optional(),
  schema: z.string().url().optional(),
  spec: z.string().url().optional(),
  transport: TransportSchema,
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>;

export const EventLineItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().gte(1).lte(9007199254740991),
});
export type EventLineItem = z.infer<typeof EventLineItemSchema>;
export const ExpectationLineItemSchema = EventLineItemSchema;
export type ExpectationLineItem = EventLineItem;
export const ExpectationLineItemClassSchema = EventLineItemSchema;
export type ExpectationLineItemClass = EventLineItem;
export const FulfillmentEventLineItemSchema = EventLineItemSchema;
export type FulfillmentEventLineItem = EventLineItem;

export const LineItemQuantitySchema = z.object({
  fulfilled: z.number().int().gte(0).lte(9007199254740991),
  original: z.number().int().gte(0).lte(9007199254740991).optional(),
  total: z.number().int().gte(0).lte(9007199254740991),
});
export type LineItemQuantity = z.infer<typeof LineItemQuantitySchema>;
export const OrderLineItemQuantitySchema = LineItemQuantitySchema;
export type OrderLineItemQuantity = LineItemQuantity;

export const PaymentInstrumentSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: CredentialClassSchema.optional(),
  display: z.record(z.string(), z.any()).optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
});
export type PaymentInstrument = z.infer<typeof PaymentInstrumentSchema>;

export const SegmentValueSchema = z.object({
  granted: z.boolean(),
  source: SourceSchema,
});
export type SegmentValue = z.infer<typeof SegmentValueSchema>;
export const SegmentClassSchema = SegmentValueSchema;
export type SegmentClass = SegmentValue;

export const ConsentSegmentSchema = z.object({
  description: z.string(),
  granted: z.boolean(),
  links: z.array(LinkSchema).optional(),
  source: SourceSchema,
});
export type ConsentSegment = z.infer<typeof ConsentSegmentSchema>;

export const CheckoutWithDiscountCreateRequestDiscountsSchema = z.object({
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountCreateRequestDiscounts = z.infer<
  typeof CheckoutWithDiscountCreateRequestDiscountsSchema
>;
export const CheckoutWithDiscountUpdateRequestDiscountsSchema =
  CheckoutWithDiscountCreateRequestDiscountsSchema;
export type CheckoutWithDiscountUpdateRequestDiscounts =
  CheckoutWithDiscountCreateRequestDiscounts;

export const AllocationElementSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  path: z.string(),
});
export type AllocationElement = z.infer<typeof AllocationElementSchema>;

export const AvailableMethodElementSchema = z.object({
  description: z.string().optional(),
  fulfillable_on: z.union([z.null(), z.string()]).optional(),
  line_item_ids: z.array(z.string()),
  type: z.string(),
});
export type AvailableMethodElement = z.infer<
  typeof AvailableMethodElementSchema
>;
export const FulfillmentAvailableMethodSchema = AvailableMethodElementSchema;
export type FulfillmentAvailableMethod = AvailableMethodElement;

export const DestinationElementSchema = z.object({
  id: z.string().min(1),
  type: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    ),
});
export type DestinationElement = z.infer<typeof DestinationElementSchema>;
export const BindingSchema = DestinationElementSchema;
export type Binding = DestinationElement;
export const FulfillmentDestinationSchema = DestinationElementSchema;
export type FulfillmentDestination = DestinationElement;

export const FulfillmentOptionElementSchema = z.object({
  description: DescriptionClassSchema.optional(),
  id: z.string(),
  title: z.string(),
  carrier: z.string().optional(),
  earliest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
  latest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
  totals: z.array(LineItemResponseTotalSchema),
});
export type FulfillmentOptionElement = z.infer<
  typeof FulfillmentOptionElementSchema
>;
export const FulfillmentOptionSchema = FulfillmentOptionElementSchema;
export type FulfillmentOption = FulfillmentOptionElement;

export const PriceClassSchema = z.object({
  max: z.number().int().gte(0).lte(9007199254740991).optional(),
  min: z.number().int().gte(0).lte(9007199254740991).optional(),
});
export type PriceClass = z.infer<typeof PriceClassSchema>;
export const PriceFilterSchema = PriceClassSchema;
export type PriceFilter = PriceClass;

export const PolicySchema = z.object({
  applies_to: z.array(z.string()).optional(),
  description: DescriptionClassSchema,
  type: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    ),
  url: z.string().url().optional(),
});
export type Policy = z.infer<typeof PolicySchema>;
export const PolicyElementSchema = PolicySchema;
export type PolicyElement = Policy;

export const CategoryElementSchema = z.object({
  taxonomy: z.string().optional(),
  value: z.string(),
});
export type CategoryElement = z.infer<typeof CategoryElementSchema>;
export const CategorySchema = CategoryElementSchema;
export type Category = CategoryElement;

export const ListPriceClassSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  currency: z.string().regex(/^[A-Z]{3}$/),
});
export type ListPriceClass = z.infer<typeof ListPriceClassSchema>;
export const PriceSchema = ListPriceClassSchema;
export type Price = ListPriceClass;

export const MediaElementSchema = z.object({
  alt_text: z.string().optional(),
  height: z.number().int().gte(1).optional(),
  type: z.string(),
  url: z.string().url(),
  width: z.number().int().gte(1).optional(),
});
export type MediaElement = z.infer<typeof MediaElementSchema>;
export const MediaSchema = MediaElementSchema;
export type Media = MediaElement;

export const ValueElementSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
});
export type ValueElement = z.infer<typeof ValueElementSchema>;
export const OptionValueSchema = ValueElementSchema;
export type OptionValue = ValueElement;

export const RatingClassSchema = z.object({
  count: z.number().int().gte(0).optional(),
  scale_max: z.number().gte(1),
  scale_min: z.number().gte(0).optional(),
  value: z.number().gte(0),
});
export type RatingClass = z.infer<typeof RatingClassSchema>;
export const RatingSchema = RatingClassSchema;
export type Rating = RatingClass;

export const AvailabilityClassSchema = z.object({
  available: z.boolean().optional(),
  status: z.string().optional(),
});
export type AvailabilityClass = z.infer<typeof AvailabilityClassSchema>;
export const AvailabilitySchema = AvailabilityClassSchema;
export type Availability = AvailabilityClass;

export const VariantBarcodeSchema = z.object({
  type: z.string(),
  value: z.string(),
});
export type VariantBarcode = z.infer<typeof VariantBarcodeSchema>;
export const PurpleBarcodeSchema = VariantBarcodeSchema;
export type PurpleBarcode = VariantBarcode;

export const InputCorrelationSchema = z.object({
  id: z.string(),
  match: z.string().optional(),
});
export type InputCorrelation = z.infer<typeof InputCorrelationSchema>;

export const OptionClassSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  name: z.string(),
});
export type OptionClass = z.infer<typeof OptionClassSchema>;
export const SelectedOptionSchema = OptionClassSchema;
export type SelectedOption = OptionClass;

export const VariantSellerSchema = z.object({
  links: z.array(LinkElementSchema).optional(),
  name: z.string().optional(),
});
export type VariantSeller = z.infer<typeof VariantSellerSchema>;
export const PurpleSellerSchema = VariantSellerSchema;
export type PurpleSeller = VariantSeller;

export const SearchRequestPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().gte(1).optional(),
});
export type SearchRequestPagination = z.infer<
  typeof SearchRequestPaginationSchema
>;

export const SearchResponsePaginationSchema = z
  .object({
    cursor: z.string().optional(),
    has_next_page: z.boolean(),
    total_count: z.number().int().gte(0).optional(),
  })
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "required",
        discriminator: "has_next_page",
        values: [true],
        negated: false,
        required: ["cursor"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
    ]) {
      const record = value as Record<string, unknown>;
      const discriminatorVal = record[rule.discriminator];
      if (discriminatorVal === undefined) continue;
      const matches = (rule.values as readonly unknown[]).includes(
        discriminatorVal
      );
      if (rule.negated ? matches : !matches) continue;
      if (rule.kind === "required") {
        for (const field of rule.required) {
          if (!(field in record))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Field is required by a conditional constraint",
            });
        }
        continue;
      }
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          try {
            new URL(fieldValue);
          } catch {
            if (field !== null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [field],
                message: "Value must be a valid URI",
              });
          }
        }
        continue;
      }
      if (rule.target === null) continue;
      const target = record[rule.target];
      if (typeof target !== "number") continue;
      const invalid =
        (rule.minimum !== null && target < rule.minimum) ||
        (rule.maximum !== null && target > rule.maximum) ||
        (rule.exclusiveMinimum !== null && target <= rule.exclusiveMinimum) ||
        (rule.exclusiveMaximum !== null && target >= rule.exclusiveMaximum);
      if (invalid)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.target],
          message: "Value violates a conditional numeric constraint",
        });
    }
  });
export type SearchResponsePagination = z.infer<
  typeof SearchResponsePaginationSchema
>;

export const CompleteCheckoutRequestWithAp2Ap2Schema = z.object({
  checkout_mandate: z
    .string()
    .regex(
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+(~[A-Za-z0-9_-]+)*$/
    ),
});
export type CompleteCheckoutRequestWithAp2Ap2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Ap2Schema
>;

export const CheckoutWithAp2MandateAp2Schema = z.object({
  merchant_authorization: z
    .string()
    .regex(/^[A-Za-z0-9_-]+\.\.[A-Za-z0-9_-]+$/)
    .optional(),
  checkout_mandate: z
    .string()
    .regex(
      /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+(~[A-Za-z0-9_-]+)*$/
    ),
});
export type CheckoutWithAp2MandateAp2 = z.infer<
  typeof CheckoutWithAp2MandateAp2Schema
>;

export const GeoClassSchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
});
export type GeoClass = z.infer<typeof GeoClassSchema>;
export const GeoSchema = GeoClassSchema;
export type Geo = GeoClass;

export const HoursSchema = z.object({
  open_at: z
    .string()
    .regex(/(?:[Zz]|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$/)
    .datetime({ offset: true }),
});
export type Hours = z.infer<typeof HoursSchema>;

export const AddressSchema = z.object({
  address_country: z.string().optional(),
  address_region: z.string().optional(),
  postal_code: z.string().optional(),
});
export type Address = z.infer<typeof AddressSchema>;
export const LocalitySchema = AddressSchema;
export type Locality = Address;

export const AmenitySchema = z.object({
  description: z.string(),
});
export type Amenity = z.infer<typeof AmenitySchema>;

export const ExceptionHourElementSchema = z.object({
  closes: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  opens: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  title: z.string().optional(),
  valid_from: z.string().optional(),
  valid_through: z.string().optional(),
});
export type ExceptionHourElement = z.infer<typeof ExceptionHourElementSchema>;
export const ExceptionHourSchema = ExceptionHourElementSchema;
export type ExceptionHour = ExceptionHourElement;

export const DailyHourElementSchema = z.object({
  closes: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  opens: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  day: DaySchema.optional(),
});
export type DailyHourElement = z.infer<typeof DailyHourElementSchema>;
export const DailyHourSchema = DailyHourElementSchema;
export type DailyHour = DailyHourElement;

export const InputSchema = z.object({
  id: z.string(),
});
export type Input = z.infer<typeof InputSchema>;

export const LocationSchema = z.object({
  address: BillingAddressClassSchema.optional(),
  id: z.string(),
  name: z.string(),
  amenities: z
    .record(z.string(), AmenitySchema)
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  exception_hours: z.array(ExceptionHourElementSchema).optional(),
  geo: GeoClassSchema.optional(),
  hours: z.array(DailyHourElementSchema).optional(),
  timezone: z.string().optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const BreakdownElementSchema = z.object({
  amount: z.number().int().gte(0),
  benefit_id: z.string().optional(),
  description: z.string(),
  id: z.string(),
});
export type BreakdownElement = z.infer<typeof BreakdownElementSchema>;

export const RewardCurrencySchema = z.object({
  code: z.string(),
  decimal_places: z.number().int().gte(0).optional(),
  name: z.string(),
});
export type RewardCurrency = z.infer<typeof RewardCurrencySchema>;
export const CurrencySchema = RewardCurrencySchema;
export type Currency = RewardCurrency;

export const EarningForecastClassSchema = z.object({
  amount: z.number().int().gte(0),
  breakdown: z.array(BreakdownElementSchema).optional(),
});
export type EarningForecastClass = z.infer<typeof EarningForecastClassSchema>;
export const EarningForecastSchema = EarningForecastClassSchema;
export type EarningForecast = EarningForecastClass;

export const BenefitElementSchema = z.object({
  description: z.string(),
  id: z.string(),
});
export type BenefitElement = z.infer<typeof BenefitElementSchema>;

export const ScheduleElementSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  description: DescriptionClassSchema,
  due_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  type: z.string(),
});
export type ScheduleElement = z.infer<typeof ScheduleElementSchema>;
export const PaymentScheduleSchema = ScheduleElementSchema;
export type PaymentSchedule = ScheduleElement;

export const PurpleInstrumentGroupSchema = z.object({
  max: z.number().int().gte(1).optional(),
  min: z.number().int().gte(0).optional(),
  types: z.array(z.string()).min(1),
});
export type PurpleInstrumentGroup = z.infer<typeof PurpleInstrumentGroupSchema>;
export const AllowedCombinationElementSchema = PurpleInstrumentGroupSchema;
export type AllowedCombinationElement = PurpleInstrumentGroup;
export const InstrumentGroupSchema = PurpleInstrumentGroupSchema;
export type InstrumentGroup = PurpleInstrumentGroup;

export const PaymentInstrumentSplitPaymentsSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: CredentialClassSchema.optional(),
  display: z.record(z.string(), z.any()).optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
  amount: z.number().int().gte(0).lte(9007199254740991).optional(),
});
export type PaymentInstrumentSplitPayments = z.infer<
  typeof PaymentInstrumentSplitPaymentsSchema
>;

export const ExtensionElementSchema = z.object({
  description: z.string().optional(),
  params: z.record(z.string(), z.any()).optional(),
  uri: z.string().url(),
});
export type ExtensionElement = z.infer<typeof ExtensionElementSchema>;

export const PartElementSchema = z.object({
  data: z.record(z.string(), z.any()).optional(),
  kind: z.string().optional(),
  text: z.string().optional(),
  type: z.string().optional(),
});
export type PartElement = z.infer<typeof PartElementSchema>;

export const EmbeddedTransportConfigSchema = z.object({
  color_scheme: z.array(ColorSchemeSchema).optional(),
  delegate: z.array(z.string()).optional(),
});
export type EmbeddedTransportConfig = z.infer<
  typeof EmbeddedTransportConfigSchema
>;

export const ErrorClassSchema = z.object({
  code: z.number().int(),
  data: z.any().optional(),
  message: z.string(),
});
export type ErrorClass = z.infer<typeof ErrorClassSchema>;

export const JsonRpc20EnvelopeSchema = z.object({
  id: z.union([z.number(), z.null(), z.string()]).optional(),
  jsonrpc: JsonrpcSchema,
  method: z.string().optional(),
  params: z.union([z.array(z.any()), z.record(z.string(), z.any())]).optional(),
  result: z.any().optional(),
  error: ErrorClassSchema.optional(),
});
export type JsonRpc20Envelope = z.infer<typeof JsonRpc20EnvelopeSchema>;

export const UcpAgentSchema = z.object({
  profile: z.string(),
});
export type UcpAgent = z.infer<typeof UcpAgentSchema>;

export const McpToolCallSchema = z.object({
  text: z.string().optional(),
  type: z.string(),
});
export type McpToolCall = z.infer<typeof McpToolCallSchema>;

export const EcKeysCarryCrvXYSchema = z.object({
  alg: z.string().optional(),
  crv: z.string().optional(),
  kid: z.string(),
  kty: z.string(),
  use: z.string().optional(),
  x: z.string().optional(),
  y: z.string().optional(),
});
export type EcKeysCarryCrvXY = z.infer<typeof EcKeysCarryCrvXYSchema>;

export const AdjustmentLineItemClassSchema = z.object({
  id: z.string(),
  measure: LineItemMeasureSchema.optional(),
  quantity: z.number().int().gte(-9007199254740991).lte(9007199254740991),
});
export type AdjustmentLineItemClass = z.infer<
  typeof AdjustmentLineItemClassSchema
>;
export const AdjustmentLineItemSchema = AdjustmentLineItemClassSchema;
export type AdjustmentLineItem = AdjustmentLineItemClass;

export const MultiDestinationSchema = z.object({
  method: z.string(),
});
export type MultiDestination = z.infer<typeof MultiDestinationSchema>;

export const DetailOptionValueSchema = z.object({
  available: z.boolean().optional(),
  exists: z.boolean().optional(),
  id: z.string().optional(),
  label: z.string(),
});
export type DetailOptionValue = z.infer<typeof DetailOptionValueSchema>;

export const FulfillmentDestinationFilterSchema = z.object({
  address_country: z.string().optional(),
  address_region: z.string().optional(),
  postal_code: z.string().optional(),
  location: z.string().optional(),
});
export type FulfillmentDestinationFilter = z.infer<
  typeof FulfillmentDestinationFilterSchema
>;

export const FulfillmentGroupCreateRequestSchema = z.object({
  id: z.string(),
  line_item_ids: z.array(z.string()),
  options: z.array(FulfillmentOptionElementSchema).optional(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroupCreateRequest = z.infer<
  typeof FulfillmentGroupCreateRequestSchema
>;
export const FulfillmentGroupSchema = FulfillmentGroupCreateRequestSchema;
export type FulfillmentGroup = FulfillmentGroupCreateRequest;
export const GroupElementSchema = FulfillmentGroupCreateRequestSchema;
export type GroupElement = FulfillmentGroupCreateRequest;

export const FulfillmentOptionBaseSchema = z.object({
  description: DescriptionClassSchema.optional(),
  id: z.string(),
  title: z.string(),
});
export type FulfillmentOptionBase = z.infer<typeof FulfillmentOptionBaseSchema>;

export const BusinessLocationDestinationSchema = z.object({
  address: BillingAddressClassSchema.optional(),
  id: z.string(),
  name: z.string(),
  type: BusinessLocationDestinationTypeSchema,
});
export type BusinessLocationDestination = z.infer<
  typeof BusinessLocationDestinationSchema
>;

export const PlatformFulfillmentConfigSchema = z.object({
  supports_multi_group: z.boolean().optional(),
});
export type PlatformFulfillmentConfig = z.infer<
  typeof PlatformFulfillmentConfigSchema
>;

export const ProductOptionSchema = z.object({
  name: z.string(),
  values: z.array(ValueElementSchema).min(1),
});
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export const OptionElementSchema = ProductOptionSchema;
export type OptionElement = ProductOption;

export const ShippingDestinationSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string(),
  type: ShippingDestinationTypeSchema,
});
export type ShippingDestination = z.infer<typeof ShippingDestinationSchema>;

export const CardCredentialSchema = z.object({
  type: CardCredentialTypeSchema,
  card_number_type: CardNumberTypeSchema,
  cryptogram: z.string().optional(),
  cvc: z.string().max(4).optional(),
  eci_value: z.string().optional(),
  expiry_month: z.number().int().optional(),
  expiry_year: z.number().int().optional(),
  name: z.string().optional(),
  number: z.string().optional(),
});
export type CardCredential = z.infer<typeof CardCredentialSchema>;

export const DisplaySchema = z.object({
  brand: z.string().optional(),
  card_art: z.string().url().optional(),
  description: z.string().optional(),
  expiry_month: z.number().int().optional(),
  expiry_year: z.number().int().optional(),
  last_digits: z.string().optional(),
});
export type Display = z.infer<typeof DisplaySchema>;

export const LocationSummarySchema = z.object({
  address: BillingAddressClassSchema.optional(),
  id: z.string(),
  name: z.string(),
});
export type LocationSummary = z.infer<typeof LocationSummarySchema>;

export const MessageErrorSchema = z.object({
  code: z.string(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  severity: SeveritySchema,
  type: MessageErrorTypeSchema,
});
export type MessageError = z.infer<typeof MessageErrorSchema>;

export const MessageInfoSchema = z.object({
  code: z.string().optional(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  type: MessageInfoTypeSchema,
});
export type MessageInfo = z.infer<typeof MessageInfoSchema>;

export const MessageWarningSchema = z.object({
  code: z.string(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  image_url: z.string().url().optional(),
  path: z.string().optional(),
  presentation: z.string().optional(),
  type: MessageWarningTypeSchema,
  url: z.string().url().optional(),
});
export type MessageWarning = z.infer<typeof MessageWarningSchema>;

export const NetworkTokenCredentialSchema = z.object({
  type: NetworkTokenCredentialTypeSchema,
  cryptogram: z.string(),
  eci_value: z.string().optional(),
  expiry_month: z.number().int().optional(),
  expiry_year: z.number().int().optional(),
  name: z.string().optional(),
  number: z.string(),
  token_requestor_id: z.string().optional(),
});
export type NetworkTokenCredential = z.infer<
  typeof NetworkTokenCredentialSchema
>;

export const PanCredentialSchema = z.object({
  type: PanCredentialTypeSchema,
  cvc: z.string().max(4).optional(),
  expiry_month: z.number().int().optional(),
  expiry_year: z.number().int().optional(),
  name: z.string().optional(),
  number: z.string(),
});
export type PanCredential = z.infer<typeof PanCredentialSchema>;

export const PaymentIdentitySchema = z.object({
  access_token: z.string(),
});
export type PaymentIdentity = z.infer<typeof PaymentIdentitySchema>;

export const PriceRangeSchema = z.object({
  max: ListPriceClassSchema,
  min: ListPriceClassSchema,
});
export type PriceRange = z.infer<typeof PriceRangeSchema>;
export const ListPriceRangeClassSchema = PriceRangeSchema;
export type ListPriceRangeClass = PriceRange;

export const RequestConstraintsPropertySchema = z.object({
  anyOf: z.array(z.record(z.string(), z.any())).optional(),
  properties: z.record(z.string(), ConstraintsPropertySchema).optional(),
  required: z.array(z.string()).optional(),
  const: z.any().optional(),
  enum: z.array(z.any()).optional(),
});
export type RequestConstraintsProperty = z.infer<
  typeof RequestConstraintsPropertySchema
>;

export const TimeIntervalSchema = z.object({
  closes: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  opens: z
    .string()
    .regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
});
export type TimeInterval = z.infer<typeof TimeIntervalSchema>;

export const UnitSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
});
export type Unit = z.infer<typeof UnitSchema>;

export const ConstraintsElementSchema = z
  .object({
    anyOf: z.array(z.record(z.string(), z.any())).min(1).optional(),
    properties: z
      .record(z.string(), ConstraintsPropertySchema)
      .refine((value) => Object.keys(value).length >= 1, {
        message: "Object must contain at least 1 property(ies) (minProperties)",
      })
      .optional(),
    required: z
      .array(z.string())
      .min(1)
      .refine(
        (items) =>
          new Set(items.map((item) => JSON.stringify(item))).size ===
          items.length,
        { message: "Array items must be unique (uniqueItems)" }
      )
      .optional(),
  })
  .passthrough();
export type ConstraintsElement = z.infer<typeof ConstraintsElementSchema>;
export const ConstraintExpressionSchema = ConstraintsElementSchema;
export type ConstraintExpression = ConstraintsElement;

export const UcpServiceSchema = z.object({
  a2a: A2ASchema.optional(),
  embedded: EmbeddedSchema.optional(),
  mcp: McpSchema.optional(),
  rest: RestSchema.optional(),
  spec: z.string().url(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type UcpService = z.infer<typeof UcpServiceSchema>;

export const ContextSchema = z.object({
  address_country: z.string().optional(),
  address_region: z.string().optional(),
  postal_code: z.string().optional(),
  currency: z.string().optional(),
  eligibility: z
    .array(z.string())
    .refine(
      (items) =>
        new Set(items.map((item) => JSON.stringify(item))).size ===
        items.length,
      { message: "Array items must be unique (uniqueItems)" }
    )
    .optional(),
  intent: z.string().optional(),
  language: z.string().optional(),
  location: z.string().optional(),
  payment: z.array(PurplePaymentSchema).optional(),
});
export type Context = z.infer<typeof ContextSchema>;
export const ContextClassSchema = ContextSchema;
export type ContextClass = Context;

export const SelectedPaymentInstrumentSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: CredentialClassSchema.optional(),
  display: z.record(z.string(), z.any()).optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
  selected: z.boolean().optional(),
});
export type SelectedPaymentInstrument = z.infer<
  typeof SelectedPaymentInstrumentSchema
>;

export const LineItemUpdateRequestSchema = z.object({
  id: z.string().optional(),
  item: ItemUpdateRequestSchema,
  parent_id: z.string().optional(),
  quantity: z.number().int().gte(1).lte(9007199254740991),
});
export type LineItemUpdateRequest = z.infer<typeof LineItemUpdateRequestSchema>;

export const UnitPriceClassSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  currency: z.string().regex(/^[A-Z]{3}$/),
  measure: PurpleMeasureSchema,
  reference: FluffyMeasureSchema,
});
export type UnitPriceClass = z.infer<typeof UnitPriceClassSchema>;
export const UnitPriceSchema = UnitPriceClassSchema;
export type UnitPrice = UnitPriceClass;

export const CheckoutResponseTotalSchema = z
  .object({
    amount: z.number().int().gte(-9007199254740991).lte(9007199254740991),
    display_text: z.string().optional(),
    type: z.string(),
    lines: z.array(TotalLineSchema).optional(),
  })
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "required",
        discriminator: "type",
        values: [
          "subtotal",
          "items_discount",
          "discount",
          "fulfillment",
          "tax",
          "fee",
          "total",
        ],
        negated: true,
        required: ["display_text"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
    ]) {
      const record = value as Record<string, unknown>;
      const discriminatorVal = record[rule.discriminator];
      if (discriminatorVal === undefined) continue;
      const matches = (rule.values as readonly unknown[]).includes(
        discriminatorVal
      );
      if (rule.negated ? matches : !matches) continue;
      if (rule.kind === "required") {
        for (const field of rule.required) {
          if (!(field in record))
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Field is required by a conditional constraint",
            });
        }
        continue;
      }
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          try {
            new URL(fieldValue);
          } catch {
            if (field !== null)
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [field],
                message: "Value must be a valid URI",
              });
          }
        }
        continue;
      }
      if (rule.target === null) continue;
      const target = record[rule.target];
      if (typeof target !== "number") continue;
      const invalid =
        (rule.minimum !== null && target < rule.minimum) ||
        (rule.maximum !== null && target > rule.maximum) ||
        (rule.exclusiveMinimum !== null && target <= rule.exclusiveMinimum) ||
        (rule.exclusiveMaximum !== null && target >= rule.exclusiveMaximum);
      if (invalid)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.target],
          message: "Value violates a conditional numeric constraint",
        });
    }
  });
export type CheckoutResponseTotal = z.infer<typeof CheckoutResponseTotalSchema>;
export const TotalElementSchema = CheckoutResponseTotalSchema;
export type TotalElement = CheckoutResponseTotal;

export const EventElementSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(EventLineItemSchema),
  occurred_at: z.string().datetime({ offset: true }),
  tracking_number: z.string().optional(),
  tracking_url: z.string().url().optional(),
  type: z.string(),
});
export type EventElement = z.infer<typeof EventElementSchema>;
export const FulfillmentEventSchema = EventElementSchema;
export type FulfillmentEvent = EventElement;

export const ExpectationElementSchema = z.object({
  description: z.string().optional(),
  destination: BillingAddressClassSchema,
  fulfillable_on: z.string().optional(),
  id: z.string(),
  line_items: z.array(ExpectationLineItemSchema),
  method_type: z.string(),
});
export type ExpectationElement = z.infer<typeof ExpectationElementSchema>;
export const ExpectationSchema = ExpectationElementSchema;
export type Expectation = ExpectationElement;

export const PaymentDataSchema = z.object({
  payment_data: PaymentInstrumentSchema,
});
export type PaymentData = z.infer<typeof PaymentDataSchema>;

export const ConsentValueSchema = z.object({
  granted: z.boolean(),
  segments: z
    .record(z.string(), SegmentValueSchema)
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  source: SourceSchema,
});
export type ConsentValue = z.infer<typeof ConsentValueSchema>;
export const ConsentClassSchema = ConsentValueSchema;
export type ConsentClass = ConsentValue;

export const BuyerConsentSchema = z.object({
  description: z.string(),
  granted: z.boolean(),
  links: z.array(LinkSchema).optional(),
  segments: z
    .record(z.string(), ConsentSegmentSchema)
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  source: SourceSchema,
});
export type BuyerConsent = z.infer<typeof BuyerConsentSchema>;

export const AppliedElementSchema = z.object({
  allocations: z.array(AllocationElementSchema).optional(),
  amount: z.number().int().gte(0).lte(9007199254740991),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  eligibility: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    )
    .optional(),
  method: MethodSchema.optional(),
  priority: z.number().int().gte(1).optional(),
  provisional: z.boolean().optional(),
  title: z.string(),
});
export type AppliedElement = z.infer<typeof AppliedElementSchema>;

export const CartUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  signals: SignalsClassSchema.optional(),
});
export type CartUpdateRequest = z.infer<typeof CartUpdateRequestSchema>;

export const SearchFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  price: PriceClassSchema.optional(),
});
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

export const CatalogLookupSchema = z.object({
  availability: AvailabilityClassSchema.optional(),
  barcodes: z.array(VariantBarcodeSchema).optional(),
  categories: z.array(CategoryElementSchema).optional(),
  description: DescriptionClassSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price: ListPriceClassSchema.optional(),
  media: z.array(MediaElementSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionClassSchema).optional(),
  price: ListPriceClassSchema,
  quantity_unit: QuantityUnitClassSchema.optional(),
  rating: RatingClassSchema.optional(),
  seller: VariantSellerSchema.optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  unit_price: UnitPriceClassSchema.optional(),
  url: z.string().url().optional(),
  inputs: z.array(InputCorrelationSchema).min(1),
});
export type CatalogLookup = z.infer<typeof CatalogLookupSchema>;

export const GetProductRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: ContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  id: z.string(),
  preferences: z.array(z.string()).optional(),
  selected: z.array(SelectedOptionSchema).optional(),
  signals: SignalsSchema.optional(),
});
export type GetProductRequest = z.infer<typeof GetProductRequestSchema>;

export const VariantElementSchema = z.object({
  availability: AvailabilityClassSchema.optional(),
  barcodes: z.array(PurpleBarcodeSchema).optional(),
  categories: z.array(CategoryElementSchema).optional(),
  description: DescriptionClassSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price: ListPriceClassSchema.optional(),
  media: z.array(MediaElementSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionClassSchema).optional(),
  price: ListPriceClassSchema,
  quantity_unit: QuantityUnitClassSchema.optional(),
  rating: RatingClassSchema.optional(),
  seller: PurpleSellerSchema.optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  unit_price: UnitPriceClassSchema.optional(),
  url: z.string().url().optional(),
});
export type VariantElement = z.infer<typeof VariantElementSchema>;
export const VariantSchema = VariantElementSchema;
export type Variant = VariantElement;

export const SearchRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: ContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  pagination: SearchRequestPaginationSchema.optional(),
  query: z.string().optional(),
  signals: SignalsSchema.optional(),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const ProductSchema = z.object({
  categories: z.array(CategoryElementSchema).optional(),
  description: DescriptionClassSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: ListPriceRangeClassSchema.optional(),
  media: z.array(MediaElementSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionElementSchema).optional(),
  price_range: ListPriceRangeClassSchema,
  rating: RatingClassSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().url().optional(),
  variants: z.array(VariantElementSchema).min(1),
});
export type Product = z.infer<typeof ProductSchema>;

export const CompleteCheckoutRequestWithAp2Schema = z.object({
  ap2: CompleteCheckoutRequestWithAp2Ap2Schema.optional(),
});
export type CompleteCheckoutRequestWithAp2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Schema
>;

export const LocationDistanceSchema = z.object({
  center: GeoClassSchema,
  max: z.number().gte(0),
});
export type LocationDistance = z.infer<typeof LocationDistanceSchema>;

export const LocationFilterSchema = z.object({
  amenities: z.array(z.string()).optional(),
  hours: HoursSchema.optional(),
  items: z
    .array(z.string())
    .min(1)
    .refine(
      (items) =>
        new Set(items.map((item) => JSON.stringify(item))).size ===
        items.length,
      { message: "Array items must be unique (uniqueItems)" }
    )
    .optional(),
});
export type LocationFilter = z.infer<typeof LocationFilterSchema>;

export const LocationServesSchema = z
  .object({
    address: AddressSchema.optional(),
    point: GeoClassSchema.optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  });
export type LocationServes = z.infer<typeof LocationServesSchema>;

export const LocationElementSchema = z.object({
  address: BillingAddressClassSchema.optional(),
  id: z.string(),
  name: z.string(),
  amenities: z
    .record(z.string(), AmenitySchema)
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  exception_hours: z.array(ExceptionHourElementSchema).optional(),
  geo: GeoClassSchema.optional(),
  hours: z.array(DailyHourElementSchema).optional(),
  timezone: z.string().optional(),
  inputs: z.array(InputSchema).min(1),
});
export type LocationElement = z.infer<typeof LocationElementSchema>;

export const LocationSearchRequestSchema = z.object({
  context: ContextSchema.optional(),
  distance: LocationDistanceSchema.optional(),
  filters: LocationFilterSchema.optional(),
  pagination: SearchRequestPaginationSchema.optional(),
  query: z.string().optional(),
  serves: LocationServesSchema.optional(),
  signals: SignalsSchema.optional(),
});
export type LocationSearchRequest = z.infer<typeof LocationSearchRequestSchema>;

export const ScopePolicySchema = z.object({
  description: DescriptionSchema.optional(),
});
export type ScopePolicy = z.infer<typeof ScopePolicySchema>;

export const MembershipRewardSchema = z.object({
  currency: CurrencySchema,
  earning_forecast: EarningForecastClassSchema.optional(),
});
export type MembershipReward = z.infer<typeof MembershipRewardSchema>;

export const MembershipTierSchema = z.object({
  benefits: z.array(BenefitElementSchema).optional(),
  id: z.string(),
  name: z.string(),
});
export type MembershipTier = z.infer<typeof MembershipTierSchema>;

export const PurplePaymentTermSchema = z.object({
  description: DescriptionClassSchema.optional(),
  id: z.string(),
  schedules: z.array(ScheduleElementSchema).min(1),
  title: z.string(),
});
export type PurplePaymentTerm = z.infer<typeof PurplePaymentTermSchema>;

export const OrderPaymentWithAcceptedTermSchema = z.object({
  accepted_term: PurplePaymentTermSchema.optional(),
});
export type OrderPaymentWithAcceptedTerm = z.infer<
  typeof OrderPaymentWithAcceptedTermSchema
>;

export const CheckoutWithPaymentTermsPaymentSchema = z.object({
  instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
  selected_term_id: z.string().optional(),
  terms: z.array(PurplePaymentTermSchema).optional(),
});
export type CheckoutWithPaymentTermsPayment = z.infer<
  typeof CheckoutWithPaymentTermsPaymentSchema
>;

export const CheckoutWithSplitPaymentsPaymentSchema = z.object({
  instruments: z.array(PaymentInstrumentSplitPaymentsSchema).optional(),
});
export type CheckoutWithSplitPaymentsPayment = z.infer<
  typeof CheckoutWithSplitPaymentsPaymentSchema
>;

export const ResultClassSchema = z.object({
  contextId: z.string(),
  kind: KindSchema,
  messageId: z.string(),
  parts: z.array(PartElementSchema).min(1),
  role: RoleSchema,
});
export type ResultClass = z.infer<typeof ResultClassSchema>;

export const EmbeddedProtocolMessageEnvelopeSchema = z.object({
  id: z.union([z.number(), z.null(), z.string()]).optional(),
  jsonrpc: JsonrpcSchema,
  method: z.string().optional(),
  params: z.record(z.string(), z.any()).optional(),
  result: z.record(z.string(), z.any()).optional(),
  error: ErrorClassSchema.optional(),
});
export type EmbeddedProtocolMessageEnvelope = z.infer<
  typeof EmbeddedProtocolMessageEnvelopeSchema
>;

export const MetaSchema = z.object({
  "idempotency-key": z.string().optional(),
  "ucp-agent": UcpAgentSchema.optional(),
});
export type Meta = z.infer<typeof MetaSchema>;

export const ResultSchema = z.object({
  content: z.array(McpToolCallSchema).optional(),
  structuredContent: z.record(z.string(), z.any()),
});
export type Result = z.infer<typeof ResultSchema>;

export const AdjustmentSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemClassSchema).optional(),
  occurred_at: z.string().datetime({ offset: true }),
  status: AdjustmentStatusSchema,
  totals: z.array(LineItemResponseTotalSchema).optional(),
  type: z.string(),
});
export type Adjustment = z.infer<typeof AdjustmentSchema>;
export const AdjustmentElementSchema = AdjustmentSchema;
export type AdjustmentElement = Adjustment;

export const BusinessFulfillmentConfigSchema = z.object({
  method_combinations: z.array(z.array(z.string())).optional(),
  multi_destination: z.array(MultiDestinationSchema).optional(),
});
export type BusinessFulfillmentConfig = z.infer<
  typeof BusinessFulfillmentConfigSchema
>;

export const FulfillmentMethodCreateRequestSchema = z.object({
  destinations: z.array(DestinationElementSchema).optional(),
  groups: z.array(GroupElementSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: z.string(),
});
export type FulfillmentMethodCreateRequest = z.infer<
  typeof FulfillmentMethodCreateRequestSchema
>;
export const FulfillmentMethodSchema = FulfillmentMethodCreateRequestSchema;
export type FulfillmentMethod = FulfillmentMethodCreateRequest;
export const MethodElementSchema = FulfillmentMethodCreateRequestSchema;
export type MethodElement = FulfillmentMethodCreateRequest;

export const BusinessSplitPaymentsConfigSchema = z.object({
  allowed_combinations: z
    .array(z.array(AllowedCombinationElementSchema))
    .min(1),
});
export type BusinessSplitPaymentsConfig = z.infer<
  typeof BusinessSplitPaymentsConfigSchema
>;

export const CardPaymentInstrumentSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: CredentialClassSchema.optional(),
  display: DisplaySchema.optional(),
  handler_id: z.string(),
  id: z.string(),
  type: CardCredentialTypeSchema,
  network: z.string().optional(),
});
export type CardPaymentInstrument = z.infer<typeof CardPaymentInstrumentSchema>;

export const PaymentSchema = z.object({
  instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
});
export type Payment = z.infer<typeof PaymentSchema>;
export const CheckoutCreateRequestPaymentSchema = PaymentSchema;
export type CheckoutCreateRequestPayment = Payment;

export const RequestConstraintsSchema = z.object({
  anyOf: z.array(ConstraintsElementSchema).min(1).optional(),
  path: z.string().optional(),
  properties: z
    .record(z.string(), RequestConstraintsPropertySchema)
    .refine((value) => Object.keys(value).length >= 1, {
      message: "Object must contain at least 1 property(ies) (minProperties)",
    })
    .optional(),
  required: z
    .array(z.string())
    .min(1)
    .refine(
      (items) =>
        new Set(items.map((item) => JSON.stringify(item))).size ===
        items.length,
      { message: "Array items must be unique (uniqueItems)" }
    )
    .optional(),
});
export type RequestConstraints = z.infer<typeof RequestConstraintsSchema>;

export const AvailablePaymentInstrumentSchema = z.object({
  constraints: ConstraintsElementSchema.optional(),
  type: z.string(),
});
export type AvailablePaymentInstrument = z.infer<
  typeof AvailablePaymentInstrumentSchema
>;

export const UcpSchema = z.object({
  capabilities: z.array(CapabilityDiscoverySchema),
  services: z.record(z.string(), UcpServiceSchema),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Ucp = z.infer<typeof UcpSchema>;

export const LineItemCreateRequestSchema = z.object({
  item: ItemCreateRequestSchema,
  quantity: z.number().int().gte(1).lte(9007199254740991),
});
export type LineItemCreateRequest = z.infer<typeof LineItemCreateRequestSchema>;

export const CheckoutUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
});
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;
export const CheckoutWithCartUpdateRequestSchema = CheckoutUpdateRequestSchema;
export type CheckoutWithCartUpdateRequest = CheckoutUpdateRequest;

export const CheckoutCompleteRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  payment: CheckoutCreateRequestPaymentSchema,
  signals: SignalsClassSchema.optional(),
});
export type CheckoutCompleteRequest = z.infer<
  typeof CheckoutCompleteRequestSchema
>;

export const ItemResponseSchema = z.object({
  id: z.string(),
  image_url: z.string().url().optional(),
  price: z.number().int().gte(0).lte(9007199254740991),
  quantity_unit: QuantityUnitClassSchema.optional(),
  title: z.string(),
  unit_price: UnitPriceClassSchema.optional(),
});
export type ItemResponse = z.infer<typeof ItemResponseSchema>;

export const FulfillmentClassSchema = z.object({
  events: z.array(EventElementSchema).optional(),
  expectations: z.array(ExpectationElementSchema).optional(),
});
export type FulfillmentClass = z.infer<typeof FulfillmentClassSchema>;

export const LineItemSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: LineItemQuantitySchema,
  status: LineItemStatusSchema,
  totals: z.array(LineItemResponseTotalSchema),
});
export type LineItem = z.infer<typeof LineItemSchema>;
export const LineItemElementSchema = LineItemSchema;
export type LineItemElement = LineItem;
export const OrderLineItemSchema = LineItemSchema;
export type OrderLineItem = LineItem;

export const BuyerWithConsentCreateRequestSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: z.record(z.string(), ConsentValueSchema).optional(),
});
export type BuyerWithConsentCreateRequest = z.infer<
  typeof BuyerWithConsentCreateRequestSchema
>;

export const BuyerWithConsentUpdateRequestSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: z.record(z.string(), ConsentClassSchema).optional(),
});
export type BuyerWithConsentUpdateRequest = z.infer<
  typeof BuyerWithConsentUpdateRequestSchema
>;

export const BuyerWithConsentResponseSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: z.record(z.string(), BuyerConsentSchema).optional(),
});
export type BuyerWithConsentResponse = z.infer<
  typeof BuyerWithConsentResponseSchema
>;

export const CheckoutWithDiscountCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
  discounts: CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountCreateRequest = z.infer<
  typeof CheckoutWithDiscountCreateRequestSchema
>;

export const CheckoutWithDiscountUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
  discounts: CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountUpdateRequest = z.infer<
  typeof CheckoutWithDiscountUpdateRequestSchema
>;

export const CheckoutWithDiscountResponseDiscountsSchema = z.object({
  applied: z.array(AppliedElementSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountResponseDiscounts = z.infer<
  typeof CheckoutWithDiscountResponseDiscountsSchema
>;

export const CartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  signals: SignalsClassSchema.optional(),
});
export type CartCreateRequest = z.infer<typeof CartCreateRequestSchema>;

export const CheckoutWithCartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
  cart_id: z.string().optional(),
});
export type CheckoutWithCartCreateRequest = z.infer<
  typeof CheckoutWithCartCreateRequestSchema
>;

export const LookupRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: ContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  ids: z.array(z.string()).min(1),
  signals: SignalsSchema.optional(),
});
export type LookupRequest = z.infer<typeof LookupRequestSchema>;

export const ProductElementSchema = z.object({
  categories: z.array(CategoryElementSchema).optional(),
  description: DescriptionClassSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: ListPriceRangeClassSchema.optional(),
  media: z.array(MediaElementSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionElementSchema).optional(),
  price_range: ListPriceRangeClassSchema,
  rating: RatingClassSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().url().optional(),
  variants: z.array(CatalogLookupSchema).min(1),
});
export type ProductElement = z.infer<typeof ProductElementSchema>;

export const ProductClassSchema = z.object({
  options: z.array(OptionElementSchema).optional(),
  selected: z.array(SelectedOptionSchema).optional(),
  categories: z.array(CategoryElementSchema).optional(),
  description: DescriptionClassSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: ListPriceRangeClassSchema.optional(),
  media: z.array(MediaElementSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  price_range: ListPriceRangeClassSchema,
  rating: RatingClassSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().url().optional(),
  variants: z.array(VariantElementSchema).min(1),
});
export type ProductClass = z.infer<typeof ProductClassSchema>;

export const LocationLookupRequestSchema = z.object({
  context: ContextSchema.optional(),
  distance: LocationDistanceSchema.optional(),
  filters: LocationFilterSchema.optional(),
  ids: z.array(z.string()).min(1),
  serves: LocationServesSchema.optional(),
  signals: SignalsSchema.optional(),
});
export type LocationLookupRequest = z.infer<typeof LocationLookupRequestSchema>;

export const LoyaltyMembershipSchema = z.object({
  display_id: z.string().optional(),
  id: z.string(),
  name: z.string(),
  provisional: z.boolean(),
  rewards: z.array(MembershipRewardSchema).optional(),
  tiers: z.array(MembershipTierSchema).optional(),
});
export type LoyaltyMembership = z.infer<typeof LoyaltyMembershipSchema>;

export const PaymentWithTermsSchema = z.object({
  selected_term_id: z.string().optional(),
  terms: z.array(PurplePaymentTermSchema).min(1).optional(),
});
export type PaymentWithTerms = z.infer<typeof PaymentWithTermsSchema>;

export const A2AUcpMessageEnvelopeParamsSchema = z.object({
  message: ResultClassSchema,
});
export type A2AUcpMessageEnvelopeParams = z.infer<
  typeof A2AUcpMessageEnvelopeParamsSchema
>;

export const ArgumentsSchema = z.object({
  meta: MetaSchema.optional(),
});
export type Arguments = z.infer<typeof ArgumentsSchema>;

export const PaymentHandlerResponseSchema = z.object({
  available_instruments: z
    .array(AvailablePaymentInstrumentSchema)
    .min(1)
    .optional(),
  config: z.record(z.string(), z.any()).optional(),
  id: z.string(),
  schema: z.string().url().optional(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type PaymentHandlerResponse = z.infer<
  typeof PaymentHandlerResponseSchema
>;

export const CheckoutCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
});
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;

export const LineItemResponseSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: z.number().int().gte(1).lte(9007199254740991),
  totals: z.array(LineItemResponseTotalSchema),
});
export type LineItemResponse = z.infer<typeof LineItemResponseSchema>;

export const UcpCheckoutResponseSchema = z.object({
  capabilities: z
    .record(z.string(), z.array(CapabilityResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  map_order: z.string().optional(),
  payment_handlers: z
    .record(z.string(), z.array(PaymentHandlerResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    ),
  services: z
    .record(z.string(), z.array(ServiceResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  status: UcpCheckoutResponseStatusSchema.optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type UcpCheckoutResponse = z.infer<typeof UcpCheckoutResponseSchema>;

export const UcpResponseSchema = z.object({
  capabilities: z
    .record(z.string(), z.array(CapabilityResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  map_order: z.string().optional(),
  payment_handlers: z
    .record(z.string(), z.array(PaymentHandlerResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  services: z
    .record(z.string(), z.array(ServiceResponseSchema))
    .refine(
      (value) =>
        Object.keys(value).every((key) =>
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/.test(
            key
          )
        ),
      { message: "Record keys must match the required pattern (propertyNames)" }
    )
    .optional(),
  status: UcpCheckoutResponseStatusSchema.optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type UcpResponse = z.infer<typeof UcpResponseSchema>;

export const CheckoutWithBuyerConsentCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentCreateRequestSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
});
export type CheckoutWithBuyerConsentCreateRequest = z.infer<
  typeof CheckoutWithBuyerConsentCreateRequestSchema
>;

export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentUpdateRequestSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
});
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<
  typeof CheckoutWithBuyerConsentUpdateRequestSchema
>;

export const CheckoutWithBuyerConsentResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentResponseSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
});
export type CheckoutWithBuyerConsentResponse = z.infer<
  typeof CheckoutWithBuyerConsentResponseSchema
>;

export const CheckoutWithDiscountResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
  discounts: CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
export type CheckoutWithDiscountResponse = z.infer<
  typeof CheckoutWithDiscountResponseSchema
>;

export const FulfillmentSchema = z.object({
  available_methods: z.array(AvailableMethodElementSchema).optional(),
  methods: z.array(MethodElementSchema).optional(),
});
export type Fulfillment = z.infer<typeof FulfillmentSchema>;

export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
  fulfillment: FulfillmentSchema.optional(),
});
export type CheckoutWithFulfillmentUpdateRequest = z.infer<
  typeof CheckoutWithFulfillmentUpdateRequestSchema
>;

export const CheckoutWithFulfillmentResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
  fulfillment: FulfillmentSchema.optional(),
});
export type CheckoutWithFulfillmentResponse = z.infer<
  typeof CheckoutWithFulfillmentResponseSchema
>;

export const CartResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema).optional(),
  messages: z.array(MessageElementSchema).optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpResponseSchema,
});
export type CartResponse = z.infer<typeof CartResponseSchema>;

export const CheckoutWithCartResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
  cart_id: z.string().optional(),
});
export type CheckoutWithCartResponse = z.infer<
  typeof CheckoutWithCartResponseSchema
>;

export const LookupResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  messages: z.array(MessageSchema).optional(),
  policies: z.array(PolicySchema).optional(),
  products: z.array(ProductElementSchema),
  ucp: UcpResponseSchema,
});
export type LookupResponse = z.infer<typeof LookupResponseSchema>;

export const GetProductResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  messages: z.array(MessageSchema).optional(),
  policies: z.array(PolicySchema).optional(),
  product: ProductClassSchema,
  ucp: UcpResponseSchema,
});
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;

export const SearchResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  messages: z.array(MessageSchema).optional(),
  pagination: SearchResponsePaginationSchema.optional(),
  policies: z.array(PolicySchema).optional(),
  products: z.array(ProductSchema),
  ucp: UcpResponseSchema,
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const CheckoutWithAp2MandateSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
  ap2: CheckoutWithAp2MandateAp2Schema.optional(),
});
export type CheckoutWithAp2Mandate = z.infer<
  typeof CheckoutWithAp2MandateSchema
>;

export const LocationLookupResponseSchema = z.object({
  locations: z.array(LocationElementSchema),
  messages: z.array(MessageSchema).optional(),
  ucp: UcpResponseSchema,
});
export type LocationLookupResponse = z.infer<
  typeof LocationLookupResponseSchema
>;

export const LocationSearchResponseSchema = z.object({
  locations: z.array(LocationSchema),
  messages: z.array(MessageSchema).optional(),
  pagination: SearchResponsePaginationSchema.optional(),
  ucp: UcpResponseSchema,
});
export type LocationSearchResponse = z.infer<
  typeof LocationSearchResponseSchema
>;

export const CheckoutWithLoyaltySchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
  loyalty: z.record(z.string(), LoyaltyMembershipSchema).optional(),
});
export type CheckoutWithLoyalty = z.infer<typeof CheckoutWithLoyaltySchema>;

export const CheckoutWithPaymentTermsSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutWithPaymentTermsPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
});
export type CheckoutWithPaymentTerms = z.infer<
  typeof CheckoutWithPaymentTermsSchema
>;

export const CheckoutWithSplitPaymentsSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutWithSplitPaymentsPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
});
export type CheckoutWithSplitPayments = z.infer<
  typeof CheckoutWithSplitPaymentsSchema
>;

export const A2AUcpMessageEnvelopeSchema = z.object({
  extensions: z.array(ExtensionElementSchema).optional(),
  id: z.union([z.number(), z.null(), z.string()]).optional(),
  jsonrpc: JsonrpcSchema.optional(),
  method: A2AUcpMessageEnvelopeMethodSchema.optional(),
  params: A2AUcpMessageEnvelopeParamsSchema.optional(),
  result: ResultClassSchema.optional(),
});
export type A2AUcpMessageEnvelope = z.infer<typeof A2AUcpMessageEnvelopeSchema>;

export const McpToolCallEnvelopeParamsSchema = z.object({
  arguments: ArgumentsSchema,
  name: z.string().min(1),
});
export type McpToolCallEnvelopeParams = z.infer<
  typeof McpToolCallEnvelopeParamsSchema
>;

export const UcpProfileDocumentSchema = z.object({
  keys: z.array(EcKeysCarryCrvXYSchema).optional(),
  ucp: UcpResponseSchema,
});
export type UcpProfileDocument = z.infer<typeof UcpProfileDocumentSchema>;

export const ErrorResponseSchema = z.object({
  continue_url: z.string().url().optional(),
  messages: z.array(MessageElementSchema).min(1),
  ucp: UcpResponseSchema,
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const UcpDiscoveryProfilePaymentSchema = z.object({
  handlers: z.array(PaymentHandlerResponseSchema).optional(),
});
export type UcpDiscoveryProfilePayment = z.infer<
  typeof UcpDiscoveryProfilePaymentSchema
>;

export const CheckoutResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionElementSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(PolicyElementSchema).optional(),
  signals: SignalsClassSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpCheckoutResponseSchema,
});
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const OrderSchema = z.object({
  adjustments: z.array(AdjustmentElementSchema).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  checkout_id: z.string(),
  currency: z.string(),
  fulfillment: FulfillmentClassSchema,
  id: z.string(),
  label: z.string().optional(),
  line_items: z.array(LineItemElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  permalink_url: z.string().url(),
  policies: z.array(PolicyElementSchema).optional(),
  totals: z.array(CheckoutResponseTotalSchema).superRefine((items, ctx) => {
    for (const rule of [
      { property: "type", value: "subtotal", min: 1, max: 1 },
      { property: "type", value: "total", min: 1, max: 1 },
    ]) {
      const matches = items.filter(
        (item) =>
          item != null &&
          (item as Record<string, unknown>)[rule.property] === rule.value
      ).length;
      if (rule.min !== undefined && matches < rule.min) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at least ${rule.min} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (minContains)`,
        });
      }
      if (rule.max !== undefined && matches > rule.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Array must contain at most ${rule.max} item(s) where ${rule.property} = ${JSON.stringify(rule.value)} (maxContains)`,
        });
      }
    }
  }),
  ucp: UcpResponseSchema,
});
export type Order = z.infer<typeof OrderSchema>;

export const CheckoutWithFulfillmentCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerClassSchema.optional(),
  context: ContextClassSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: SignalsClassSchema.optional(),
  fulfillment: FulfillmentSchema.optional(),
});
export type CheckoutWithFulfillmentCreateRequest = z.infer<
  typeof CheckoutWithFulfillmentCreateRequestSchema
>;

export const McpToolCallEnvelopeSchema = z.object({
  id: z.union([z.number(), z.null(), z.string()]).optional(),
  jsonrpc: JsonrpcSchema,
  method: McpToolCallEnvelopeMethodSchema.optional(),
  params: McpToolCallEnvelopeParamsSchema.optional(),
  result: ResultSchema.optional(),
  error: ErrorClassSchema.optional(),
});
export type McpToolCallEnvelope = z.infer<typeof McpToolCallEnvelopeSchema>;

export const UcpDiscoveryProfileSchema = z.object({
  keys: z.array(SigningKeySchema).optional(),
  payment: UcpDiscoveryProfilePaymentSchema.optional(),
  ucp: UcpSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const PermalinkCapabilityPlatformSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type PermalinkCapabilityPlatform = z.infer<
  typeof PermalinkCapabilityPlatformSchema
>;

export const PermalinkCapabilityResponseSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  id: z.string().optional(),
  schema: z.string().url().optional(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type PermalinkCapabilityResponse = z.infer<
  typeof PermalinkCapabilityResponseSchema
>;

export const FulfillmentCapabilityPlatformSchema = z.object({
  config: PlatformFulfillmentConfigSchema.optional(),
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type FulfillmentCapabilityPlatform = z.infer<
  typeof FulfillmentCapabilityPlatformSchema
>;

export const PermalinkCapabilityBusinessSchema = z.object({
  config: PermalinkCapabilityBusinessConfigSchema,
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type PermalinkCapabilityBusiness = z.infer<
  typeof PermalinkCapabilityBusinessSchema
>;

export const IdentityLinkingBusinessConfigSchema = z.object({
  providers: z.record(z.string(), z.array(IdentityProviderSchema)).optional(),
  scopes: z.record(z.string(), ScopePolicySchema),
});
export type IdentityLinkingBusinessConfig = z.infer<
  typeof IdentityLinkingBusinessConfigSchema
>;

export const SplitPaymentsCapabilityBusinessSchema = z.object({
  config: BusinessSplitPaymentsConfigSchema.optional(),
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type SplitPaymentsCapabilityBusiness = z.infer<
  typeof SplitPaymentsCapabilityBusinessSchema
>;

export const FulfillmentCapabilityBusinessSchema = z.object({
  config: BusinessFulfillmentConfigSchema.optional(),
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type FulfillmentCapabilityBusiness = z.infer<
  typeof FulfillmentCapabilityBusinessSchema
>;

export const IdentityLinkingBusinessSchema = z.object({
  config: IdentityLinkingBusinessConfigSchema,
  id: z.string().optional(),
  schema: z.string().url(),
  spec: z.string().url().optional(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  extends: z
    .union([
      z
        .array(
          z
            .string()
            .regex(
              /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
            )
        )
        .min(1),
      z
        .string()
        .regex(
          /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
        ),
    ])
    .optional(),
});
export type IdentityLinkingBusiness = z.infer<
  typeof IdentityLinkingBusinessSchema
>;

export const TotalResponseSchema = TotalSchema;
export type TotalResponse = Total;

export const TotalsResponseSchema = CheckoutResponseTotalSchema;
export type TotalsResponse = CheckoutResponseTotal;

export const PurpleUnitPriceSchema = UnitPriceSchema;
export type PurpleUnitPrice = UnitPrice;

export const PaymentTermSchema = PurplePaymentTermSchema;
export type PaymentTerm = PurplePaymentTerm;

export const CheckoutCreateRequestContextSchema = ContextSchema;
export type CheckoutCreateRequestContext = Context;

export const CheckoutResponseMessageSchema = MessageSchema;
export type CheckoutResponseMessage = Message;

export const LookupResponseMessageSchema = MessageSchema;
export type LookupResponseMessage = Message;

export const CheckoutCreateRequestSignalsSchema = SignalsSchema;
export type CheckoutCreateRequestSignals = Signals;

export const LookupRequestSignalsSchema = SignalsSchema;
export type LookupRequestSignals = Signals;

export const LineItemQuantityRefSchema = EventLineItemSchema;
export type LineItemQuantityRef = EventLineItem;

export const ProviderSchema = IdentityProviderSchema;
export type Provider = IdentityProvider;

export const IdentityLinkingPlatformSchema = PermalinkCapabilityPlatformSchema;
export type IdentityLinkingPlatform = PermalinkCapabilityPlatform;
