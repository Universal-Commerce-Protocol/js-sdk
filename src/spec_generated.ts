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

export const MessageTypeSchema = z.enum(["error", "info", "warning"]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

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

// Delivery method type (shipping, pickup, digital).

export const MethodTypeEnumSchema = z.enum(["digital", "pickup", "shipping"]);
export type MethodTypeEnum = z.infer<typeof MethodTypeEnumSchema>;

// Derived status: fulfilled if quantity.fulfilled == quantity.total, partial if
// quantity.fulfilled > 0, otherwise processing.

export const LineItemStatusSchema = z.enum([
  "fulfilled",
  "partial",
  "processing",
]);
export type LineItemStatus = z.infer<typeof LineItemStatusSchema>;

// Allocation method. 'each' = applied independently per item. 'across' = split
// proportionally by value.

export const MethodSchema = z.enum(["across", "each"]);
export type Method = z.infer<typeof MethodSchema>;

// Fulfillment method type.
//
// Fulfillment method type this availability applies to.

export const MethodTypeSchema = z.enum(["pickup", "shipping"]);
export type MethodType = z.infer<typeof MethodTypeSchema>;

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

export const ContextSchema = z.object({
  address_country: z.string().optional(),
  address_region: z.string().optional(),
  currency: z.string().optional(),
  eligibility: z.array(z.string()).optional(),
  intent: z.string().optional(),
  language: z.string().optional(),
  postal_code: z.string().optional(),
});
export type Context = z.infer<typeof ContextSchema>;

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

export const SignalsSchema = z.object({
  "dev.ucp.buyer_ip": z.string().optional(),
  "dev.ucp.user_agent": z.string().optional(),
});
export type Signals = z.infer<typeof SignalsSchema>;

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

export const LinkSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string(),
});
export type Link = z.infer<typeof LinkSchema>;

export const MessageSchema = z.object({
  code: z.string().optional(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  severity: SeveritySchema.optional(),
  type: MessageTypeSchema,
  image_url: z.string().optional(),
  presentation: z.string().optional(),
  url: z.string().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const OrderConfirmationSchema = z.object({
  id: z.string(),
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

export const ConsentSchema = z.object({
  analytics: z.boolean().optional(),
  marketing: z.boolean().optional(),
  preferences: z.boolean().optional(),
  sale_of_data: z.boolean().optional(),
});
export type Consent = z.infer<typeof ConsentSchema>;
export const FluffyConsentSchema = ConsentSchema;
export type FluffyConsent = Consent;
export const PurpleConsentSchema = ConsentSchema;
export type PurpleConsent = Consent;
export const TentacledConsentSchema = ConsentSchema;
export type TentacledConsent = Consent;

export const AllocationSchema = z.object({
  amount: z.number(),
  path: z.string(),
});
export type Allocation = z.infer<typeof AllocationSchema>;
export const AllocationClassSchema = AllocationSchema;
export type AllocationClass = Allocation;
export const AllocationElementSchema = AllocationSchema;
export type AllocationElement = Allocation;
export const AppliedAllocationSchema = AllocationSchema;
export type AppliedAllocation = Allocation;

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

export const FulfillmentGroupCreateRequestSchema = z.object({
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroupCreateRequest = z.infer<
  typeof FulfillmentGroupCreateRequestSchema
>;

export const FulfillmentAvailableMethodResponseSchema = z.object({
  description: z.string().optional(),
  fulfillable_on: z.union([z.null(), z.string()]).optional(),
  line_item_ids: z.array(z.string()),
  type: MethodTypeSchema,
});
export type FulfillmentAvailableMethodResponse = z.infer<
  typeof FulfillmentAvailableMethodResponseSchema
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

export const FulfillmentOptionResponseSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  earliest_fulfillment_time: z.coerce.date().optional(),
  id: z.string(),
  latest_fulfillment_time: z.coerce.date().optional(),
  title: z.string(),
  totals: z.array(TotalResponseSchema),
});
export type FulfillmentOptionResponse = z.infer<
  typeof FulfillmentOptionResponseSchema
>;

export const PaymentSchema = z.object({
  handlers: z.array(PaymentHandlerResponseSchema).optional(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const UcpServiceSchema = z.object({
  a2a: A2ASchema.optional(),
  embedded: EmbeddedSchema.optional(),
  mcp: McpSchema.optional(),
  rest: RestSchema.optional(),
  spec: z.string(),
  version: z.string(),
});
export type UcpService = z.infer<typeof UcpServiceSchema>;

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
  capabilities: z.array(CapabilityResponseSchema),
  version: z.string(),
});
export type UcpResponse = z.infer<typeof UcpResponseSchema>;

export const AdjustmentSchema = z.object({
  amount: z.number().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemSchema).optional(),
  occurred_at: z.coerce.date(),
  status: AdjustmentStatusSchema,
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
  method_type: MethodTypeEnumSchema,
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
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkSchema),
  messages: z.array(MessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: SignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  ap2: CheckoutWithAp2MandateAp2Schema.optional(),
});
export type CheckoutWithAp2Mandate = z.infer<
  typeof CheckoutWithAp2MandateSchema
>;

export const BuyerWithConsentCreateRequestSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: PurpleConsentSchema.optional(),
});
export type BuyerWithConsentCreateRequest = z.infer<
  typeof BuyerWithConsentCreateRequestSchema
>;

export const BuyerWithConsentUpdateRequestSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: FluffyConsentSchema.optional(),
});
export type BuyerWithConsentUpdateRequest = z.infer<
  typeof BuyerWithConsentUpdateRequestSchema
>;

export const BuyerWithConsentResponseSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  consent: TentacledConsentSchema.optional(),
});
export type BuyerWithConsentResponse = z.infer<
  typeof BuyerWithConsentResponseSchema
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

export const AppliedClassSchema = z.object({
  allocations: z.array(AllocationClassSchema).optional(),
  amount: z.number(),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  eligibility: z.string().optional(),
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  provisional: z.boolean().optional(),
  title: z.string(),
});
export type AppliedClass = z.infer<typeof AppliedClassSchema>;

export const DiscountsAppliedSchema = z.object({
  allocations: z.array(AppliedAllocationSchema).optional(),
  amount: z.number(),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  eligibility: z.string().optional(),
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  provisional: z.boolean().optional(),
  title: z.string(),
});
export type DiscountsApplied = z.infer<typeof DiscountsAppliedSchema>;

export const FulfillmentMethodCreateRequestSchema = z.object({
  destinations: z.array(FulfillmentDestinationRequestSchema).optional(),
  groups: z.array(FulfillmentGroupCreateRequestSchema).optional(),
  line_item_ids: z.array(z.string()).optional(),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: MethodTypeSchema,
});
export type FulfillmentMethodCreateRequest = z.infer<
  typeof FulfillmentMethodCreateRequestSchema
>;

export const FulfillmentGroupResponseSchema = z.object({
  id: z.string(),
  line_item_ids: z.array(z.string()),
  options: z.array(FulfillmentOptionResponseSchema).optional(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroupResponse = z.infer<
  typeof FulfillmentGroupResponseSchema
>;

export const UcpSchema = z.object({
  capabilities: z.array(CapabilityDiscoverySchema),
  services: z.record(z.string(), UcpServiceSchema),
  version: z.string(),
});
export type Ucp = z.infer<typeof UcpSchema>;

export const CheckoutUpdateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
});
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;

export const CheckoutResponseSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkSchema),
  messages: z.array(MessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: SignalsSchema.optional(),
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

export const CheckoutWithBuyerConsentCreateRequestSchema = z.object({
  buyer: BuyerWithConsentCreateRequestSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentCreateRequest = z.infer<
  typeof CheckoutWithBuyerConsentCreateRequestSchema
>;

export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
  buyer: BuyerWithConsentUpdateRequestSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
});
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<
  typeof CheckoutWithBuyerConsentUpdateRequestSchema
>;

export const CheckoutWithBuyerConsentResponseSchema = z.object({
  buyer: BuyerWithConsentResponseSchema.optional(),
  context: ContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkSchema),
  messages: z.array(MessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: SignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type CheckoutWithBuyerConsentResponse = z.infer<
  typeof CheckoutWithBuyerConsentResponseSchema
>;

export const CheckoutWithDiscountCreateRequestDiscountsSchema = z.object({
  applied: z.array(AppliedElementSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountCreateRequestDiscounts = z.infer<
  typeof CheckoutWithDiscountCreateRequestDiscountsSchema
>;

export const CheckoutWithDiscountUpdateRequestDiscountsSchema = z.object({
  applied: z.array(AppliedClassSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountUpdateRequestDiscounts = z.infer<
  typeof CheckoutWithDiscountUpdateRequestDiscountsSchema
>;

export const CheckoutWithDiscountResponseDiscountsSchema = z.object({
  applied: z.array(DiscountsAppliedSchema).optional(),
  codes: z.array(z.string()).optional(),
});
export type CheckoutWithDiscountResponseDiscounts = z.infer<
  typeof CheckoutWithDiscountResponseDiscountsSchema
>;

export const FulfillmentRequestSchema = z.object({
  methods: z.array(FulfillmentMethodCreateRequestSchema).optional(),
});
export type FulfillmentRequest = z.infer<typeof FulfillmentRequestSchema>;

export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentUpdateRequest = z.infer<
  typeof CheckoutWithFulfillmentUpdateRequestSchema
>;

export const FulfillmentMethodResponseSchema = z.object({
  destinations: z.array(FulfillmentDestinationResponseSchema).optional(),
  groups: z.array(FulfillmentGroupResponseSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: MethodTypeSchema,
});
export type FulfillmentMethodResponse = z.infer<
  typeof FulfillmentMethodResponseSchema
>;

export const UcpDiscoveryProfileSchema = z.object({
  payment: PaymentSchema.optional(),
  signing_keys: z.array(SigningKeySchema).optional(),
  ucp: UcpSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const CheckoutCreateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
});
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;

export const OrderSchema = z.object({
  adjustments: z.array(AdjustmentSchema).optional(),
  checkout_id: z.string(),
  currency: z.string().optional(),
  fulfillment: FulfillmentSchema,
  id: z.string(),
  line_items: z.array(OrderLineItemSchema),
  permalink_url: z.string(),
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
});
export type Order = z.infer<typeof OrderSchema>;

export const CheckoutWithDiscountCreateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
  discounts: CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountCreateRequest = z.infer<
  typeof CheckoutWithDiscountCreateRequestSchema
>;

export const CheckoutWithDiscountUpdateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemUpdateRequestSchema),
  payment: PaymentUpdateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
  discounts: CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountUpdateRequest = z.infer<
  typeof CheckoutWithDiscountUpdateRequestSchema
>;

export const CheckoutWithDiscountResponseSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkSchema),
  messages: z.array(MessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: SignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  discounts: CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
export type CheckoutWithDiscountResponse = z.infer<
  typeof CheckoutWithDiscountResponseSchema
>;

export const CheckoutWithFulfillmentCreateRequestSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  line_items: z.array(LineItemCreateRequestSchema),
  payment: PaymentCreateRequestSchema.optional(),
  risk_signals: z.record(z.string(), z.any()).optional(),
  signals: SignalsSchema.optional(),
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentCreateRequest = z.infer<
  typeof CheckoutWithFulfillmentCreateRequestSchema
>;

export const FulfillmentResponseSchema = z.object({
  available_methods: z
    .array(FulfillmentAvailableMethodResponseSchema)
    .optional(),
  methods: z.array(FulfillmentMethodResponseSchema).optional(),
});
export type FulfillmentResponse = z.infer<typeof FulfillmentResponseSchema>;

export const CheckoutWithFulfillmentResponseSchema = z.object({
  buyer: BuyerSchema.optional(),
  context: ContextSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkSchema),
  messages: z.array(MessageSchema).optional(),
  order: OrderConfirmationSchema.optional(),
  payment: PaymentResponseSchema.optional(),
  signals: SignalsSchema.optional(),
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalsResponseSchema),
  ucp: UcpResponseSchema,
  fulfillment: FulfillmentResponseSchema.optional(),
});
export type CheckoutWithFulfillmentResponse = z.infer<
  typeof CheckoutWithFulfillmentResponseSchema
>;
