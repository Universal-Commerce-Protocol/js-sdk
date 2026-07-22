import * as z from "zod";

export const UseSchema = z.enum(["enc", "sig"]);
export type Use = z.infer<typeof UseSchema>;

// Content format, default = plain.

export const ContentTypeSchema = z.enum(["markdown", "plain"]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

// Reflects the resource state and recommended action. 'recoverable': platform can resolve
// by modifying inputs and retrying via API. 'requires_buyer_input': merchant requires
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

// Checkout state indicating the current phase and required action. See Checkout Status
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

export const PaymentHandlerResponseSchema = z.object({
  config: z.record(z.string(), z.any()),
  config_schema: z.string(),
  id: z.string(),
  instrument_schemas: z.array(z.string()),
  name: z.string(),
  spec: z.string(),
  version: z.string(),
});
export type PaymentHandlerResponse = z.infer<
  typeof PaymentHandlerResponseSchema
>;

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
  schema: z.string(),
  spec: z.string(),
  version: z.string(),
});
export type CapabilityDiscovery = z.infer<typeof CapabilityDiscoverySchema>;

export const A2ASchema = z.object({
  endpoint: z.string(),
});
export type A2A = z.infer<typeof A2ASchema>;

export const EmbeddedSchema = z.object({
  schema: z.string(),
});
export type Embedded = z.infer<typeof EmbeddedSchema>;

export const SchemaEndpointSchema = z.object({
  endpoint: z.string(),
  schema: z.string(),
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
  handler: z.string(),
  types: z.array(z.string()).optional(),
});
export type PurplePayment = z.infer<typeof PurplePaymentSchema>;
export const FluffyPaymentSchema = PurplePaymentSchema;
export type FluffyPayment = PurplePayment;

export const ItemReferenceSchema = z.object({
  id: z.string(),
});
export type ItemReference = z.infer<typeof ItemReferenceSchema>;
export const ItemCreateRequestSchema = ItemReferenceSchema;
export type ItemCreateRequest = ItemReference;
export const ItemUpdateRequestSchema = ItemReferenceSchema;
export type ItemUpdateRequest = ItemReference;

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

export const CheckoutCreateRequestSignalsSchema = z.object({
  "dev.ucp.buyer_ip": z.string().optional(),
  "dev.ucp.user_agent": z.string().optional(),
});
export type CheckoutCreateRequestSignals = z.infer<
  typeof CheckoutCreateRequestSignalsSchema
>;
export const LookupRequestSignalsSchema = CheckoutCreateRequestSignalsSchema;
export type LookupRequestSignals = CheckoutCreateRequestSignals;

export const ItemResponseSchema = z.object({
  id: z.string(),
  image_url: z.string().optional(),
  price: z.number(),
  title: z.string(),
});
export type ItemResponse = z.infer<typeof ItemResponseSchema>;

export const TotalResponseSchema = z.object({
  amount: z.number(),
  display_text: z.string().optional(),
  type: z.string(),
});
export type TotalResponse = z.infer<typeof TotalResponseSchema>;

export const CheckoutResponseLinkSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string(),
});
export type CheckoutResponseLink = z.infer<typeof CheckoutResponseLinkSchema>;
export const ConsentLinkSchema = CheckoutResponseLinkSchema;
export type ConsentLink = CheckoutResponseLink;

export const CheckoutResponseMessageSchema = z.object({
  code: z.string().optional(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  severity: SeveritySchema.optional(),
  type: TypeSchema,
  image_url: z.string().optional(),
  presentation: z.string().optional(),
  url: z.string().optional(),
});
export type CheckoutResponseMessage = z.infer<
  typeof CheckoutResponseMessageSchema
>;
export const LookupResponseMessageSchema = CheckoutResponseMessageSchema;
export type LookupResponseMessage = CheckoutResponseMessage;

export const OrderConfirmationSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  permalink_url: z.string(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

export const LineSchema = z.object({
  amount: z.number(),
  display_text: z.string(),
});
export type Line = z.infer<typeof LineSchema>;

export const CapabilityResponseSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  extends: z.string().optional(),
  name: z.string(),
  schema: z.string().optional(),
  spec: z.string().optional(),
  version: z.string(),
});
export type CapabilityResponse = z.infer<typeof CapabilityResponseSchema>;

export const LineItemQuantityRefSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type LineItemQuantityRef = z.infer<typeof LineItemQuantityRefSchema>;
export const AdjustmentLineItemSchema = LineItemQuantityRefSchema;
export type AdjustmentLineItem = LineItemQuantityRef;
export const EventLineItemSchema = LineItemQuantityRefSchema;
export type EventLineItem = LineItemQuantityRef;
export const ExpectationLineItemSchema = LineItemQuantityRefSchema;
export type ExpectationLineItem = LineItemQuantityRef;

export const QuantitySchema = z.object({
  fulfilled: z.number(),
  original: z.number().optional(),
  total: z.number(),
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

export const CompleteCheckoutRequestWithAp2Ap2Schema = z.object({
  checkout_mandate: z.string(),
});
export type CompleteCheckoutRequestWithAp2Ap2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Ap2Schema
>;

export const CheckoutWithAp2MandateAp2Schema = z.object({
  merchant_authorization: z.string().optional(),
  checkout_mandate: z.string(),
});
export type CheckoutWithAp2MandateAp2 = z.infer<
  typeof CheckoutWithAp2MandateAp2Schema
>;

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
  amount: z.number(),
  path: z.string(),
});
export type AllocationElement = z.infer<typeof AllocationElementSchema>;

export const FulfillmentDestinationRequestSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string().optional(),
  address: PostalAddressSchema.optional(),
  name: z.string().optional(),
});
export type FulfillmentDestinationRequest = z.infer<
  typeof FulfillmentDestinationRequestSchema
>;

export const DescriptionSchema = z.object({
  html: z.string().optional(),
  markdown: z.string().optional(),
  plain: z.string().optional(),
});
export type Description = z.infer<typeof DescriptionSchema>;

export const FulfillmentAvailableMethodSchema = z.object({
  description: z.string().optional(),
  fulfillable_on: z.union([z.null(), z.string()]).optional(),
  line_item_ids: z.array(z.string()),
  type: z.string(),
});
export type FulfillmentAvailableMethod = z.infer<
  typeof FulfillmentAvailableMethodSchema
>;

export const FulfillmentDestinationResponseSchema = z.object({
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
  address: PostalAddressSchema.optional(),
  name: z.string().optional(),
});
export type FulfillmentDestinationResponse = z.infer<
  typeof FulfillmentDestinationResponseSchema
>;

export const PriceFilterSchema = z.object({
  max: z.number().optional(),
  min: z.number().optional(),
});
export type PriceFilter = z.infer<typeof PriceFilterSchema>;

export const CategorySchema = z.object({
  taxonomy: z.string().optional(),
  value: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const PriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});
export type Price = z.infer<typeof PriceSchema>;

export const MediaSchema = z.object({
  alt_text: z.string().optional(),
  height: z.number().optional(),
  type: z.string(),
  url: z.string(),
  width: z.number().optional(),
});
export type Media = z.infer<typeof MediaSchema>;

export const OptionValueSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
});
export type OptionValue = z.infer<typeof OptionValueSchema>;

export const RatingSchema = z.object({
  count: z.number().optional(),
  scale_max: z.number(),
  scale_min: z.number().optional(),
  value: z.number(),
});
export type Rating = z.infer<typeof RatingSchema>;

export const AvailabilitySchema = z.object({
  available: z.boolean().optional(),
  status: z.string().optional(),
});
export type Availability = z.infer<typeof AvailabilitySchema>;

export const PurpleBarcodeSchema = z.object({
  type: z.string(),
  value: z.string(),
});
export type PurpleBarcode = z.infer<typeof PurpleBarcodeSchema>;
export const FluffyBarcodeSchema = PurpleBarcodeSchema;
export type FluffyBarcode = PurpleBarcode;

export const InputCorrelationSchema = z.object({
  id: z.string(),
  match: z.string().optional(),
});
export type InputCorrelation = z.infer<typeof InputCorrelationSchema>;

export const OptionElementSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  name: z.string(),
});
export type OptionElement = z.infer<typeof OptionElementSchema>;
export const SelectedElementSchema = OptionElementSchema;
export type SelectedElement = OptionElement;

export const PurpleSellerSchema = z.object({
  links: z.array(CheckoutResponseLinkSchema).optional(),
  name: z.string().optional(),
});
export type PurpleSeller = z.infer<typeof PurpleSellerSchema>;
export const FluffySellerSchema = PurpleSellerSchema;
export type FluffySeller = PurpleSeller;

export const PurpleMeasureSchema = z.object({
  unit: z.string(),
  value: z.number(),
});
export type PurpleMeasure = z.infer<typeof PurpleMeasureSchema>;
export const FluffyMeasureSchema = PurpleMeasureSchema;
export type FluffyMeasure = PurpleMeasure;
export const FluffyReferenceSchema = PurpleMeasureSchema;
export type FluffyReference = PurpleMeasure;
export const PurpleReferenceSchema = PurpleMeasureSchema;
export type PurpleReference = PurpleMeasure;

export const SearchRequestPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().optional(),
});
export type SearchRequestPagination = z.infer<
  typeof SearchRequestPaginationSchema
>;

export const SearchResponsePaginationSchema = z.object({
  cursor: z.string().optional(),
  has_next_page: z.boolean(),
  total_count: z.number().optional(),
});
export type SearchResponsePagination = z.infer<
  typeof SearchResponsePaginationSchema
>;

export const InstrumentGroupSchema = z.object({
  max: z.number().optional(),
  min: z.number().optional(),
  types: z.array(z.string()),
});
export type InstrumentGroup = z.infer<typeof InstrumentGroupSchema>;

export const PaymentInstrumentSplitPaymentsSchema = z.object({
  billing_address: PostalAddressSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
  display: z.record(z.string(), z.any()).optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
  amount: z.number().optional(),
});
export type PaymentInstrumentSplitPayments = z.infer<
  typeof PaymentInstrumentSplitPaymentsSchema
>;

export const UcpDiscoveryProfilePaymentSchema = z.object({
  handlers: z.array(PaymentHandlerResponseSchema).optional(),
});
export type UcpDiscoveryProfilePayment = z.infer<
  typeof UcpDiscoveryProfilePaymentSchema
>;

export const UcpServiceSchema = z.object({
  a2a: A2ASchema.optional(),
  embedded: EmbeddedSchema.optional(),
  mcp: McpSchema.optional(),
  rest: RestSchema.optional(),
  spec: z.string(),
  version: z.string(),
});
export type UcpService = z.infer<typeof UcpServiceSchema>;

export const CheckoutCreateRequestContextSchema = z.object({
  address_country: z.string().optional(),
  address_region: z.string().optional(),
  postal_code: z.string().optional(),
  currency: z.string().optional(),
  eligibility: z.array(z.string()).optional(),
  intent: z.string().optional(),
  language: z.string().optional(),
  payment: z.array(PurplePaymentSchema).optional(),
});
export type CheckoutCreateRequestContext = z.infer<
  typeof CheckoutCreateRequestContextSchema
>;
export const LookupRequestContextSchema = CheckoutCreateRequestContextSchema;
export type LookupRequestContext = CheckoutCreateRequestContext;

export const LineItemCreateRequestSchema = z.object({
  item: ItemCreateRequestSchema,
  quantity: z.number(),
});
export type LineItemCreateRequest = z.infer<typeof LineItemCreateRequestSchema>;

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

export const LineItemUpdateRequestSchema = z.object({
  id: z.string().optional(),
  item: ItemUpdateRequestSchema,
  parent_id: z.string().optional(),
  quantity: z.number(),
});
export type LineItemUpdateRequest = z.infer<typeof LineItemUpdateRequestSchema>;

export const PaymentSelectionSchema = z.object({
  instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
});
export type PaymentSelection = z.infer<typeof PaymentSelectionSchema>;
export const PaymentCompleteRequestSchema = PaymentSelectionSchema;
export type PaymentCompleteRequest = PaymentSelection;
export const PaymentCreateRequestSchema = PaymentSelectionSchema;
export type PaymentCreateRequest = PaymentSelection;
export const PaymentResponseSchema = PaymentSelectionSchema;
export type PaymentResponse = PaymentSelection;
export const PaymentUpdateRequestSchema = PaymentSelectionSchema;
export type PaymentUpdateRequest = PaymentSelection;

export const LineItemResponseSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: z.number(),
  totals: z.array(TotalResponseSchema),
});
export type LineItemResponse = z.infer<typeof LineItemResponseSchema>;

export const TotalsResponseSchema = z.object({
  amount: z.number(),
  display_text: z.string().optional(),
  type: z.string(),
  lines: z.array(LineSchema).optional(),
});
export type TotalsResponse = z.infer<typeof TotalsResponseSchema>;

export const UcpResponseSchema = z.object({
  capabilities: z.record(z.string(), z.array(CapabilityResponseSchema)),
  version: z.string(),
});
export type UcpResponse = z.infer<typeof UcpResponseSchema>;

export const AdjustmentSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemSchema).optional(),
  occurred_at: z.coerce.date(),
  status: AdjustmentStatusSchema,
  totals: z.array(TotalResponseSchema).optional(),
  type: z.string(),
});
export type Adjustment = z.infer<typeof AdjustmentSchema>;

export const FulfillmentEventSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(EventLineItemSchema),
  occurred_at: z.coerce.date(),
  tracking_number: z.string().optional(),
  tracking_url: z.string().optional(),
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

export const OrderLineItemSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: QuantitySchema,
  status: LineItemStatusSchema,
  totals: z.array(TotalResponseSchema),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const PaymentDataSchema = z.object({
  payment_data: PaymentInstrumentSchema,
});
export type PaymentData = z.infer<typeof PaymentDataSchema>;

export const CompleteCheckoutRequestWithAp2Schema = z.object({
  ap2: CompleteCheckoutRequestWithAp2Ap2Schema.optional(),
});
export type CompleteCheckoutRequestWithAp2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Schema
>;

export const CheckoutWithAp2MandateSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  ap2: CheckoutWithAp2MandateAp2Schema.optional(),
});
export type CheckoutWithAp2Mandate = z.infer<
  typeof CheckoutWithAp2MandateSchema
>;

export const ConsentValueSchema = z.object({
  granted: z.boolean(),
  segments: z.record(z.string(), SegmentValueSchema).optional(),
  source: SourceSchema,
});
export type ConsentValue = z.infer<typeof ConsentValueSchema>;
export const ConsentClassSchema = ConsentValueSchema;
export type ConsentClass = ConsentValue;

export const BuyerConsentSchema = z.object({
  description: z.string(),
  granted: z.boolean(),
  links: z.array(ConsentLinkSchema).optional(),
  segments: z.record(z.string(), ConsentSegmentSchema).optional(),
  source: SourceSchema,
});
export type BuyerConsent = z.infer<typeof BuyerConsentSchema>;

export const CheckoutWithDiscountUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  discounts: CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountUpdateRequest = z.infer<
  typeof CheckoutWithDiscountUpdateRequestSchema
>;

export const AppliedElementSchema = z.object({
  allocations: z.array(AllocationElementSchema).optional(),
  amount: z.number(),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  eligibility: z.string().optional(),
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  provisional: z.boolean().optional(),
  title: z.string(),
});
export type AppliedElement = z.infer<typeof AppliedElementSchema>;

export const FulfillmentOptionSchema = z.object({
  description: DescriptionSchema.optional(),
  id: z.string(),
  title: z.string(),
  carrier: z.string().optional(),
  earliest_fulfillment_time: z.coerce.date().optional(),
  latest_fulfillment_time: z.coerce.date().optional(),
  totals: z.array(TotalResponseSchema),
});
export type FulfillmentOption = z.infer<typeof FulfillmentOptionSchema>;

export const CartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CartCreateRequest = z.infer<typeof CartCreateRequestSchema>;

export const CartUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  id: z.string(),
  line_items: z.array(LineItemUpdateRequestSchema),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CartUpdateRequest = z.infer<typeof CartUpdateRequestSchema>;

export const CartResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema).optional(),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type CartResponse = z.infer<typeof CartResponseSchema>;

export const CheckoutWithCartUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutWithCartUpdateRequest = z.infer<
  typeof CheckoutWithCartUpdateRequestSchema
>;
export const CheckoutUpdateRequestSchema = CheckoutWithCartUpdateRequestSchema;
export type CheckoutUpdateRequest = CheckoutWithCartUpdateRequest;

export const CheckoutWithCartResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  cart_id: z.string().optional(),
});
export type CheckoutWithCartResponse = z.infer<
  typeof CheckoutWithCartResponseSchema
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
  values: z.array(OptionValueSchema),
});
export type ProductOption = z.infer<typeof ProductOptionSchema>;

export const PurpleUnitPriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  measure: PurpleMeasureSchema,
  reference: PurpleReferenceSchema,
});
export type PurpleUnitPrice = z.infer<typeof PurpleUnitPriceSchema>;
export const FluffyUnitPriceSchema = PurpleUnitPriceSchema;
export type FluffyUnitPrice = PurpleUnitPrice;

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

export const SearchRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: LookupRequestContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  pagination: SearchRequestPaginationSchema.optional(),
  query: z.string().optional(),
  signals: LookupRequestSignalsSchema.optional(),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const PaymentSplitPaymentsSchema = z.object({
  instruments: z.array(PaymentInstrumentSplitPaymentsSchema).optional(),
});
export type PaymentSplitPayments = z.infer<typeof PaymentSplitPaymentsSchema>;

export const UcpSchema = z.object({
  capabilities: z.array(CapabilityDiscoverySchema),
  services: z.record(z.string(), UcpServiceSchema),
  version: z.string(),
});
export type Ucp = z.infer<typeof UcpSchema>;

export const CheckoutCompleteRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  payment: PaymentCompleteRequestSchema,
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutCompleteRequest = z.infer<
  typeof CheckoutCompleteRequestSchema
>;

export const CheckoutResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const FulfillmentSchema = z.object({
  events: z.array(FulfillmentEventSchema).optional(),
  expectations: z.array(ExpectationSchema).optional(),
});
export type Fulfillment = z.infer<typeof FulfillmentSchema>;

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
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  discounts: CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountCreateRequest = z.infer<
  typeof CheckoutWithDiscountCreateRequestSchema
>;

export const CheckoutWithDiscountResponseDiscountsSchema = z.object({
  applied: z.array(AppliedElementSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountResponseDiscounts = z.infer<
  typeof CheckoutWithDiscountResponseDiscountsSchema
>;

export const FulfillmentGroupSchema = z.object({
  id: z.string(),
  line_item_ids: z.array(z.string()),
  options: z.array(FulfillmentOptionSchema).optional(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroup = z.infer<typeof FulfillmentGroupSchema>;

export const FulfillmentMethodResponseSchema = z.object({
  destinations: z.array(FulfillmentDestinationResponseSchema).optional(),
  groups: z.array(FulfillmentGroupSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: z.string(),
});
export type FulfillmentMethodResponse = z.infer<
  typeof FulfillmentMethodResponseSchema
>;

export const CheckoutWithCartCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  cart_id: z.string().optional(),
});
export type CheckoutWithCartCreateRequest = z.infer<
  typeof CheckoutWithCartCreateRequestSchema
>;

export const LookupRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  context: LookupRequestContextSchema.optional(),
  filters: SearchFiltersSchema.optional(),
  ids: z.array(z.string()),
  signals: LookupRequestSignalsSchema.optional(),
});
export type LookupRequest = z.infer<typeof LookupRequestSchema>;

export const CatalogLookupSchema = z.object({
  availability: AvailabilitySchema.optional(),
  barcodes: z.array(PurpleBarcodeSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price: PriceSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionElementSchema).optional(),
  price: PriceSchema,
  rating: RatingSchema.optional(),
  seller: PurpleSellerSchema.optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  unit_price: PurpleUnitPriceSchema.optional(),
  url: z.string().optional(),
  inputs: z.array(InputCorrelationSchema),
});
export type CatalogLookup = z.infer<typeof CatalogLookupSchema>;

export const VariantSchema = z.object({
  availability: AvailabilitySchema.optional(),
  barcodes: z.array(FluffyBarcodeSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price: PriceSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(OptionElementSchema).optional(),
  price: PriceSchema,
  rating: RatingSchema.optional(),
  seller: FluffySellerSchema.optional(),
  sku: z.string().optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  unit_price: FluffyUnitPriceSchema.optional(),
  url: z.string().optional(),
});
export type Variant = z.infer<typeof VariantSchema>;

export const SearchResponseProductSchema = z.object({
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: PriceRangeSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(ProductOptionSchema).optional(),
  price_range: PriceRangeSchema,
  rating: RatingSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().optional(),
  variants: z.array(VariantSchema),
});
export type SearchResponseProduct = z.infer<typeof SearchResponseProductSchema>;

export const CheckoutWithSplitPaymentsSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentSplitPaymentsSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type CheckoutWithSplitPayments = z.infer<
  typeof CheckoutWithSplitPaymentsSchema
>;

export const UcpDiscoveryProfileSchema = z.object({
  payment: UcpDiscoveryProfilePaymentSchema.optional(),
  signing_keys: z.array(SigningKeySchema).optional(),
  ucp: UcpSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const CheckoutCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;

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
  permalink_url: z.string(),
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type Order = z.infer<typeof OrderSchema>;

export const CheckoutWithBuyerConsentCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentCreateRequestSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentCreateRequest = z.infer<
  typeof CheckoutWithBuyerConsentCreateRequestSchema
>;

export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentUpdateRequestSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<
  typeof CheckoutWithBuyerConsentUpdateRequestSchema
>;

export const CheckoutWithBuyerConsentResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerWithConsentResponseSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type CheckoutWithBuyerConsentResponse = z.infer<
  typeof CheckoutWithBuyerConsentResponseSchema
>;

export const CheckoutWithDiscountResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  discounts: CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
export type CheckoutWithDiscountResponse = z.infer<
  typeof CheckoutWithDiscountResponseSchema
>;

export const FulfillmentMethodCreateRequestSchema = z.object({
  destinations: z.array(FulfillmentDestinationRequestSchema).optional(),
  groups: z.array(FulfillmentGroupSchema).optional(),
  line_item_ids: z.array(z.string()).optional(),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: z.string(),
});
export type FulfillmentMethodCreateRequest = z.infer<
  typeof FulfillmentMethodCreateRequestSchema
>;

export const FulfillmentResponseSchema = z.object({
  available_methods: z.array(FulfillmentAvailableMethodSchema).optional(),
  methods: z.array(FulfillmentMethodResponseSchema).optional(),
});
export type FulfillmentResponse = z.infer<typeof FulfillmentResponseSchema>;

export const LookupResponseProductSchema = z.object({
  categories: z.array(CategorySchema).optional(),
  description: DescriptionSchema,
  handle: z.string().optional(),
  id: z.string(),
  list_price_range: PriceRangeSchema.optional(),
  media: z.array(MediaSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  options: z.array(ProductOptionSchema).optional(),
  price_range: PriceRangeSchema,
  rating: RatingSchema.optional(),
  tags: z.array(z.string()).optional(),
  title: z.string(),
  url: z.string().optional(),
  variants: z.array(CatalogLookupSchema),
});
export type LookupResponseProduct = z.infer<typeof LookupResponseProductSchema>;

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
  url: z.string().optional(),
  variants: z.array(VariantSchema),
});
export type Product = z.infer<typeof ProductSchema>;

export const SearchResponseSchema = z.object({
  messages: z.array(LookupResponseMessageSchema).optional(),
  pagination: SearchResponsePaginationSchema.optional(),
  products: z.array(SearchResponseProductSchema),
  ucp: UcpResponseSchema,
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const FulfillmentRequestSchema = z.object({
  methods: z.array(FulfillmentMethodCreateRequestSchema).optional(),
});
export type FulfillmentRequest = z.infer<typeof FulfillmentRequestSchema>;

export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentUpdateRequest = z.infer<
  typeof CheckoutWithFulfillmentUpdateRequestSchema
>;

export const CheckoutWithFulfillmentResponseSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(CheckoutResponseLinkSchema),
  messages: z.array(CheckoutResponseMessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  fulfillment: FulfillmentResponseSchema.optional(),
});
export type CheckoutWithFulfillmentResponse = z.infer<
  typeof CheckoutWithFulfillmentResponseSchema
>;

export const LookupResponseSchema = z.object({
  messages: z.array(LookupResponseMessageSchema).optional(),
  products: z.array(LookupResponseProductSchema),
  ucp: UcpResponseSchema,
});
export type LookupResponse = z.infer<typeof LookupResponseSchema>;

export const GetProductResponseSchema = z.object({
  messages: z.array(LookupResponseMessageSchema).optional(),
  product: ProductSchema,
  ucp: UcpResponseSchema,
});
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;

export const CheckoutWithFulfillmentCreateRequestSchema = z.object({
  attribution: z.record(z.string(), z.string()).optional(),
  buyer: BuyerSchema.optional(),
  context: CheckoutCreateRequestContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  signals: CheckoutCreateRequestSignalsSchema.optional(),
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentCreateRequest = z.infer<
  typeof CheckoutWithFulfillmentCreateRequestSchema
>;
