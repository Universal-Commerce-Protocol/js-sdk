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

export const TypeSchema = z.enum(["error", "info", "warning"]);
export type Type = z.infer<typeof TypeSchema>;

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

export const PropertyValueSchema = z.object({
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
export type PropertyValue = z.infer<typeof PropertyValueSchema>;

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

export const QuantityUnitSchema = z.object({
  display_text: z.string(),
  scale: z.number().int().gte(0).lte(15).optional(),
  unit: z.string(),
  increment: z.number().int().gte(1).optional(),
});
export type QuantityUnit = z.infer<typeof QuantityUnitSchema>;

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

export const LineItemTotalSchema = z
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
export type LineItemTotal = z.infer<typeof LineItemTotalSchema>;

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

export const PaymentCredentialSchema = z.object({
  type: z.string(),
});
export type PaymentCredential = z.infer<typeof PaymentCredentialSchema>;

export const CheckoutCreateRequestSignalsSchema = z
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
export type CheckoutCreateRequestSignals = z.infer<
  typeof CheckoutCreateRequestSignalsSchema
>;
export const LookupRequestSignalsSchema = CheckoutCreateRequestSignalsSchema;
export type LookupRequestSignals = CheckoutCreateRequestSignals;

export const ActionsSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  id: z.string().min(1),
});
export type Actions = z.infer<typeof ActionsSchema>;

export const CheckoutResponseLinkSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string().url(),
});
export type CheckoutResponseLink = z.infer<typeof CheckoutResponseLinkSchema>;
export const ConsentLinkSchema = CheckoutResponseLinkSchema;
export type ConsentLink = CheckoutResponseLink;

export const CheckoutResponseMessageSchema = z
  .object({
    code: z.string().optional(),
    content: z.string(),
    content_type: ContentTypeSchema.optional(),
    path: z.string().optional(),
    severity: SeveritySchema.optional(),
    type: TypeSchema,
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
export type CheckoutResponseMessage = z.infer<
  typeof CheckoutResponseMessageSchema
>;
export const LookupResponseMessageSchema = CheckoutResponseMessageSchema;
export type LookupResponseMessage = CheckoutResponseMessage;

export const OrderConfirmationSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  permalink_url: z.string().url(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

export const DescriptionSchema = z
  .object({
    html: z.string().optional(),
    markdown: z.string().optional(),
    plain: z.string().optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  });
export type Description = z.infer<typeof DescriptionSchema>;

export const LineSchema = z.object({
  amount: z.number().int().gte(-9007199254740991).lte(9007199254740991),
  display_text: z.string(),
});
export type Line = z.infer<typeof LineSchema>;

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

export const LineItemQuantityRefSchema = z.object({
  id: z.string(),
  quantity: z.number().int().gte(1).lte(9007199254740991),
});
export type LineItemQuantityRef = z.infer<typeof LineItemQuantityRefSchema>;
export const EventLineItemSchema = LineItemQuantityRefSchema;
export type EventLineItem = LineItemQuantityRef;
export const ExpectationLineItemSchema = LineItemQuantityRefSchema;
export type ExpectationLineItem = LineItemQuantityRef;

export const QuantitySchema = z.object({
  fulfilled: z.number().int().gte(0).lte(9007199254740991),
  original: z.number().int().gte(0).lte(9007199254740991).optional(),
  total: z.number().int().gte(0).lte(9007199254740991),
});
export type Quantity = z.infer<typeof QuantitySchema>;

export const PaymentInstrumentSchema = z.object({
  billing_address: PostalAddressSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
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
  links: z.array(ConsentLinkSchema).optional(),
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

export const FulfillmentAvailableMethodSchema = z.object({
  description: z.string().optional(),
  fulfillable_on: z.union([z.null(), z.string()]).optional(),
  line_item_ids: z.array(z.string()),
  type: z.string(),
});
export type FulfillmentAvailableMethod = z.infer<
  typeof FulfillmentAvailableMethodSchema
>;

export const FulfillmentDestinationSchema = z.object({
  id: z.string().min(1),
  type: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    ),
});
export type FulfillmentDestination = z.infer<
  typeof FulfillmentDestinationSchema
>;

export const FulfillmentOptionSchema = z.object({
  description: DescriptionSchema.optional(),
  id: z.string(),
  title: z.string(),
  carrier: z.string().optional(),
  earliest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
  latest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
  totals: z.array(LineItemTotalSchema),
});
export type FulfillmentOption = z.infer<typeof FulfillmentOptionSchema>;

export const GeoSchema = z.object({
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
});
export type Geo = z.infer<typeof GeoSchema>;

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

export const AmenitySchema = z.object({
  description: z.string(),
});
export type Amenity = z.infer<typeof AmenitySchema>;

export const ExceptionHourSchema = z.object({
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
export type ExceptionHour = z.infer<typeof ExceptionHourSchema>;

export const DailyHourSchema = z.object({
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
export type DailyHour = z.infer<typeof DailyHourSchema>;

export const InputSchema = z.object({
  id: z.string(),
});
export type Input = z.infer<typeof InputSchema>;

export const PriceFilterSchema = z.object({
  max: z.number().int().gte(0).lte(9007199254740991).optional(),
  min: z.number().int().gte(0).lte(9007199254740991).optional(),
});
export type PriceFilter = z.infer<typeof PriceFilterSchema>;

export const SelectedElementSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  name: z.string(),
});
export type SelectedElement = z.infer<typeof SelectedElementSchema>;
export const OptionElementSchema = SelectedElementSchema;
export type OptionElement = SelectedElement;

export const GetProductResponsePolicySchema = z.object({
  applies_to: z.array(z.string()).optional(),
  description: DescriptionSchema,
  type: z
    .string()
    .regex(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/
    ),
  url: z.string().url().optional(),
});
export type GetProductResponsePolicy = z.infer<
  typeof GetProductResponsePolicySchema
>;
export const CheckoutResponsePolicySchema = GetProductResponsePolicySchema;
export type CheckoutResponsePolicy = GetProductResponsePolicy;

export const CategorySchema = z.object({
  taxonomy: z.string().optional(),
  value: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const PriceSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  currency: z.string().regex(/^[A-Z]{3}$/),
});
export type Price = z.infer<typeof PriceSchema>;

export const MediaSchema = z.object({
  alt_text: z.string().optional(),
  height: z.number().int().gte(1).optional(),
  type: z.string(),
  url: z.string().url(),
  width: z.number().int().gte(1).optional(),
});
export type Media = z.infer<typeof MediaSchema>;

export const OptionValueSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
});
export type OptionValue = z.infer<typeof OptionValueSchema>;

export const RatingSchema = z.object({
  count: z.number().int().gte(0).optional(),
  scale_max: z.number().gte(1),
  scale_min: z.number().gte(0).optional(),
  value: z.number().gte(0),
});
export type Rating = z.infer<typeof RatingSchema>;

export const AvailabilitySchema = z.object({
  available: z.boolean().optional(),
  status: z.string().optional(),
});
export type Availability = z.infer<typeof AvailabilitySchema>;

export const BarcodeSchema = z.object({
  type: z.string(),
  value: z.string(),
});
export type Barcode = z.infer<typeof BarcodeSchema>;

export const SellerSchema = z.object({
  links: z.array(CheckoutResponseLinkSchema).optional(),
  name: z.string().optional(),
});
export type Seller = z.infer<typeof SellerSchema>;

export const SearchRequestPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().gte(1).optional(),
});
export type SearchRequestPagination = z.infer<
  typeof SearchRequestPaginationSchema
>;

export const SearchResponseLocationSchema = z.object({
  address: PostalAddressSchema.optional(),
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
  exception_hours: z.array(ExceptionHourSchema).optional(),
  geo: GeoSchema.optional(),
  hours: z.array(DailyHourSchema).optional(),
  timezone: z.string().optional(),
});
export type SearchResponseLocation = z.infer<
  typeof SearchResponseLocationSchema
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

export const InstrumentGroupSchema = z.object({
  max: z.number().int().gte(1).optional(),
  min: z.number().int().gte(0).optional(),
  types: z.array(z.string()).min(1),
});
export type InstrumentGroup = z.infer<typeof InstrumentGroupSchema>;

export const PaymentInstrumentSplitPaymentsSchema = z.object({
  billing_address: PostalAddressSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
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

export const ConstraintExpressionSchema = z
  .object({
    anyOf: z.array(z.record(z.string(), z.any())).min(1).optional(),
    properties: z
      .record(z.string(), PropertyValueSchema)
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
export type ConstraintExpression = z.infer<typeof ConstraintExpressionSchema>;

export const UcpServiceSchema = z.object({
  a2a: A2ASchema.optional(),
  embedded: EmbeddedSchema.optional(),
  mcp: McpSchema.optional(),
  rest: RestSchema.optional(),
  spec: z.string().url(),
  version: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type UcpService = z.infer<typeof UcpServiceSchema>;

export const CheckoutCreateRequestContextSchema = z.object({
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
export type CheckoutCreateRequestContext = z.infer<
  typeof CheckoutCreateRequestContextSchema
>;
export const LookupRequestContextSchema = CheckoutCreateRequestContextSchema;
export type LookupRequestContext = CheckoutCreateRequestContext;

export const UnitPriceSchema = z.object({
  amount: z.number().int().gte(0).lte(9007199254740991),
  currency: z.string().regex(/^[A-Z]{3}$/),
  measure: PurpleMeasureSchema,
  reference: FluffyMeasureSchema,
});
export type UnitPrice = z.infer<typeof UnitPriceSchema>;

export const SelectedPaymentInstrumentSchema = z.object({
  billing_address: PostalAddressSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
  display: z.record(z.string(), z.any()).optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
  selected: z.boolean().optional(),
});
export type SelectedPaymentInstrument = z.infer<
  typeof SelectedPaymentInstrumentSchema
>;

export const CheckoutResponseTotalSchema = z
  .object({
    amount: z.number().int().gte(-9007199254740991).lte(9007199254740991),
    display_text: z.string().optional(),
    type: z.string(),
    lines: z.array(LineSchema).optional(),
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

export const AdjustmentLineItemSchema = z.object({
  id: z.string(),
  measure: LineItemMeasureSchema.optional(),
  quantity: z.number().int().gte(-9007199254740991).lte(9007199254740991),
});
export type AdjustmentLineItem = z.infer<typeof AdjustmentLineItemSchema>;

export const FulfillmentEventSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(EventLineItemSchema),
  occurred_at: z.string().datetime({ offset: true }),
  tracking_number: z.string().optional(),
  tracking_url: z.string().url().optional(),
  type: z.string(),
});
export type FulfillmentEvent = z.infer<typeof FulfillmentEventSchema>;

export const ExpectationSchema = z.object({
  description: z.string().optional(),
  destination: PostalAddressSchema,
  fulfillable_on: z.string().optional(),
  id: z.string(),
  line_items: z.array(ExpectationLineItemSchema),
  method_type: z.string(),
});
export type Expectation = z.infer<typeof ExpectationSchema>;

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
  links: z.array(ConsentLinkSchema).optional(),
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

export const FulfillmentGroupSchema = z.object({
  id: z.string(),
  line_item_ids: z.array(z.string()),
  options: z.array(FulfillmentOptionSchema).optional(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroup = z.infer<typeof FulfillmentGroupSchema>;

export const LocationDistanceSchema = z.object({
  center: GeoSchema,
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
    point: GeoSchema.optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  });
export type LocationServes = z.infer<typeof LocationServesSchema>;

export const LookupResponseLocationSchema = z.object({
  address: PostalAddressSchema.optional(),
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
  exception_hours: z.array(ExceptionHourSchema).optional(),
  geo: GeoSchema.optional(),
  hours: z.array(DailyHourSchema).optional(),
  timezone: z.string().optional(),
  inputs: z.array(InputSchema).min(1),
});
export type LookupResponseLocation = z.infer<
  typeof LookupResponseLocationSchema
>;

export const SearchFiltersSchema = z.object({
  categories: z.array(z.string()).optional(),
  price: PriceFilterSchema.optional(),
});
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

export const PriceRangeSchema = z.object({
  max: PriceSchema,
  min: PriceSchema,
});
export type PriceRange = z.infer<typeof PriceRangeSchema>;

export const ProductOptionSchema = z.object({
  name: z.string(),
  values: z.array(OptionValueSchema).min(1),
});
export type ProductOption = z.infer<typeof ProductOptionSchema>;

export const VariantSchema = z.object({
  availability: AvailabilitySchema.optional(),
  barcodes: z.array(BarcodeSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price: PriceSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionElementSchema).optional(),
  price: PriceSchema,
  quantity_unit: QuantityUnitSchema.optional(),
  rating: RatingSchema.optional(),
  seller: SellerSchema.optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  unit_price: UnitPriceSchema.optional(),
  url: z.string().url().optional(),
});
export type Variant = z.infer<typeof VariantSchema>;

export const SearchRequestSchema = z.object({
  context: LookupRequestContextSchema.optional(),
  distance: LocationDistanceSchema.optional(),
  filters: LocationFilterSchema.optional(),
  pagination: SearchRequestPaginationSchema.optional(),
  query: z.string().optional(),
  serves: LocationServesSchema.optional(),
  signals: LookupRequestSignalsSchema.optional(),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const CompleteCheckoutRequestWithAp2Schema = z.object({
  ap2: CompleteCheckoutRequestWithAp2Ap2Schema.optional(),
});
export type CompleteCheckoutRequestWithAp2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Schema
>;

export const CheckoutWithSplitPaymentsPaymentSchema = z.object({
  instruments: z.array(PaymentInstrumentSplitPaymentsSchema).optional(),
});
export type CheckoutWithSplitPaymentsPayment = z.infer<
  typeof CheckoutWithSplitPaymentsPaymentSchema
>;

export const MessageSchema = z.object({
  contextId: z.string(),
  kind: KindSchema,
  messageId: z.string(),
  parts: z.array(PartElementSchema).min(1),
  role: RoleSchema,
});
export type Message = z.infer<typeof MessageSchema>;

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

export const AvailablePaymentInstrumentSchema = z.object({
  constraints: ConstraintExpressionSchema.optional(),
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

export const ItemSchema = z.object({
  id: z.string(),
  image_url: z.string().url().optional(),
  price: z.number().int().gte(0).lte(9007199254740991),
  quantity_unit: QuantityUnitSchema.optional(),
  title: z.string(),
  unit_price: UnitPriceSchema.optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const CheckoutCreateRequestPaymentSchema = z.object({
  instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
});
export type CheckoutCreateRequestPayment = z.infer<
  typeof CheckoutCreateRequestPaymentSchema
>;

export const CheckoutCompleteRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  payment: CheckoutCreateRequestPaymentSchema,
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutCompleteRequest = z.infer<
  typeof CheckoutCompleteRequestSchema
>;

export const AdjustmentSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemSchema).optional(),
  occurred_at: z.string().datetime({ offset: true }),
  status: AdjustmentStatusSchema,
  totals: z.array(LineItemTotalSchema).optional(),
  type: z.string(),
});
export type Adjustment = z.infer<typeof AdjustmentSchema>;

export const FulfillmentSchema = z.object({
  events: z.array(FulfillmentEventSchema).optional(),
  expectations: z.array(ExpectationSchema).optional(),
});
export type Fulfillment = z.infer<typeof FulfillmentSchema>;

export const OrderLineItemSchema = z.object({
  id: z.string(),
  item: ItemSchema,
  parent_id: z.string().optional(),
  quantity: QuantitySchema,
  status: LineItemStatusSchema,
  totals: z.array(LineItemTotalSchema),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

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

export const CheckoutWithDiscountResponseDiscountsSchema = z.object({
  applied: z.array(AppliedElementSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountResponseDiscounts = z.infer<
  typeof CheckoutWithDiscountResponseDiscountsSchema
>;

export const FulfillmentMethodSchema = z.object({
  destinations: z.array(FulfillmentDestinationSchema).optional(),
  groups: z.array(FulfillmentGroupSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: z.string(),
});
export type FulfillmentMethod = z.infer<typeof FulfillmentMethodSchema>;

export const LookupRequestSchema = z.object({
  context: LookupRequestContextSchema.optional(),
  distance: LocationDistanceSchema.optional(),
  filters: LocationFilterSchema.optional(),
  ids: z.array(z.string()).min(1),
  serves: LocationServesSchema.optional(),
  signals: LookupRequestSignalsSchema.optional(),
});
export type LookupRequest = z.infer<typeof LookupRequestSchema>;

export const GetProductRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: LookupRequestContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  id: z.string(),
  preferences: z.array(z.string()).optional(),
  selected: z.array(SelectedElementSchema).optional(),
  signals: LookupRequestSignalsSchema.optional(),
});
export type GetProductRequest = z.infer<typeof GetProductRequestSchema>;

export const ProductSchema = z.object({
  options: z.array(ProductOptionSchema).optional(),
  selected: z.array(SelectedElementSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: PriceRangeSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  price_range: PriceRangeSchema,
  rating: RatingSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().url().optional(),
  variants: z.array(VariantSchema).min(1),
});
export type Product = z.infer<typeof ProductSchema>;

export const A2AUcpMessageEnvelopeParamsSchema = z.object({
  message: MessageSchema,
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

export const LineItemSchema = z.object({
  id: z.string(),
  item: ItemSchema,
  parent_id: z.string().optional(),
  quantity: z.number().int().gte(1).lte(9007199254740991),
  totals: z.array(LineItemTotalSchema),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const CheckoutUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;
export const CheckoutCreateRequestSchema = CheckoutUpdateRequestSchema;
export type CheckoutCreateRequest = CheckoutUpdateRequest;
export const CheckoutWithCartUpdateRequestSchema = CheckoutUpdateRequestSchema;
export type CheckoutWithCartUpdateRequest = CheckoutUpdateRequest;

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
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentCreateRequest = z.infer<
  typeof CheckoutWithBuyerConsentCreateRequestSchema
>;

export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentUpdateRequestSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<
  typeof CheckoutWithBuyerConsentUpdateRequestSchema
>;

export const CheckoutWithBuyerConsentResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentResponseSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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

export const CheckoutWithDiscountCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  discounts: CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountCreateRequest = z.infer<
  typeof CheckoutWithDiscountCreateRequestSchema
>;
export const CheckoutWithDiscountUpdateRequestSchema =
  CheckoutWithDiscountCreateRequestSchema;
export type CheckoutWithDiscountUpdateRequest =
  CheckoutWithDiscountCreateRequest;

export const CheckoutWithDiscountResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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

export const CheckoutWithFulfillmentCreateRequestFulfillmentSchema = z.object({
  available_methods: z.array(FulfillmentAvailableMethodSchema).optional(),
  methods: z.array(FulfillmentMethodSchema).optional(),
});
export type CheckoutWithFulfillmentCreateRequestFulfillment = z.infer<
  typeof CheckoutWithFulfillmentCreateRequestFulfillmentSchema
>;

export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  fulfillment: CheckoutWithFulfillmentCreateRequestFulfillmentSchema.optional(),
});
export type CheckoutWithFulfillmentUpdateRequest = z.infer<
  typeof CheckoutWithFulfillmentUpdateRequestSchema
>;
export const CheckoutWithFulfillmentCreateRequestSchema =
  CheckoutWithFulfillmentUpdateRequestSchema;
export type CheckoutWithFulfillmentCreateRequest =
  CheckoutWithFulfillmentUpdateRequest;

export const CheckoutWithFulfillmentResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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
  fulfillment: CheckoutWithFulfillmentCreateRequestFulfillmentSchema.optional(),
});
export type CheckoutWithFulfillmentResponse = z.infer<
  typeof CheckoutWithFulfillmentResponseSchema
>;

export const CartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CartCreateRequest = z.infer<typeof CartCreateRequestSchema>;
export const CartUpdateRequestSchema = CartCreateRequestSchema;
export type CartUpdateRequest = CartCreateRequest;

export const CartResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema).optional(),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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

export const CheckoutWithCartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemSchema),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  cart_id: z.string().optional(),
});
export type CheckoutWithCartCreateRequest = z.infer<
  typeof CheckoutWithCartCreateRequestSchema
>;

export const CheckoutWithCartResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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
  locations: z.array(LookupResponseLocationSchema),
  messages: z.array(LookupResponseMessageSchema).optional(),
  ucp: UcpResponseSchema,
});
export type LookupResponse = z.infer<typeof LookupResponseSchema>;

export const GetProductResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  messages: z.array(LookupResponseMessageSchema).optional(),
  policies: z.array(GetProductResponsePolicySchema).optional(),
  product: ProductSchema,
  ucp: UcpResponseSchema,
});
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;

export const SearchResponseSchema = z.object({
  locations: z.array(SearchResponseLocationSchema),
  messages: z.array(LookupResponseMessageSchema).optional(),
  pagination: SearchResponsePaginationSchema.optional(),
  ucp: UcpResponseSchema,
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const CheckoutWithAp2MandateSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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

export const CheckoutWithSplitPaymentsSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutWithSplitPaymentsPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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
  result: MessageSchema.optional(),
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

export const UcpDiscoveryProfilePaymentSchema = z.object({
  handlers: z.array(PaymentHandlerResponseSchema).optional(),
});
export type UcpDiscoveryProfilePayment = z.infer<
  typeof UcpDiscoveryProfilePaymentSchema
>;

export const CheckoutResponseSchema = z.object({
  actions: z.record(z.string(), z.array(ActionsSchema)).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().url().optional(),
  currency: z.string(),
  expires_at: z.string().datetime({ offset: true }).optional(),
  id: z.string(),
  line_items: z.array(LineItemSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: CheckoutCreateRequestPaymentSchema.optional(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
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
  adjustments: z.array(AdjustmentSchema).optional(),
  attribution: z.record(z.string(), z.string()).optional(),
  checkout_id: z.string(),
  currency: z.string(),
  fulfillment: FulfillmentSchema,
  id: z.string(),
  label: z.string().optional(),
  line_items: z.array(OrderLineItemSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  permalink_url: z.string().url(),
  policies: z.array(CheckoutResponsePolicySchema).optional(),
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
  payment: UcpDiscoveryProfilePaymentSchema.optional(),
  signing_keys: z.array(SigningKeySchema).optional(),
  ucp: UcpSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const TotalResponseSchema = LineItemTotalSchema;
export type TotalResponse = LineItemTotal;

export const TotalsResponseSchema = CheckoutResponseTotalSchema;
export type TotalsResponse = CheckoutResponseTotal;

export const LineItemCreateRequestSchema = LineItemSchema;
export type LineItemCreateRequest = LineItem;

export const LineItemUpdateRequestSchema = LineItemSchema;
export type LineItemUpdateRequest = LineItem;

export const PurpleUnitPriceSchema = UnitPriceSchema;
export type PurpleUnitPrice = UnitPrice;
