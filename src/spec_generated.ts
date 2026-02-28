import * as z from "zod";

// Key usage. Should be 'sig' for signing keys.

export const UseSchema = z.enum(["enc", "sig"]);
export type Use = z.infer<typeof UseSchema>;

// The type of card number. Network tokens are preferred with fallback to FPAN.
// See PCI Scope for more details.

export const CardNumberTypeSchema = z.enum(["dpan", "fpan", "network_token"]);
export type CardNumberType = z.infer<typeof CardNumberTypeSchema>;

// A URI pointing to a schema definition (e.g., JSON Schema) used to validate
// the structure of the instrument object.

export const CardPaymentInstrumentTypeSchema = z.enum(["card"]);
export type CardPaymentInstrumentType = z.infer<
  typeof CardPaymentInstrumentTypeSchema
>;

// Type of total categorization.

export const TotalResponseTypeSchema = z.enum([
  "discount",
  "fee",
  "fulfillment",
  "items_discount",
  "subtotal",
  "tax",
  "total",
]);
export type TotalResponseType = z.infer<typeof TotalResponseTypeSchema>;

// Content format, default = plain.

export const ContentTypeSchema = z.enum(["markdown", "plain"]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

// Declares who resolves this error. 'recoverable': agent can fix via API.
// 'requires_buyer_input': merchant requires information their API doesn't
// support collecting programmatically (checkout incomplete).
// 'requires_buyer_review': buyer must authorize before order placement due to
// policy, regulatory, or entitlement rules (checkout complete). Errors with
// 'requires_*' severity contribute to 'status: requires_escalation'.

export const SeveritySchema = z.enum([
  "recoverable",
  "requires_buyer_input",
  "requires_buyer_review",
]);
export type Severity = z.infer<typeof SeveritySchema>;

export const MessageTypeSchema = z.enum(["error", "info", "warning"]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

// Checkout state indicating the current phase and required action. See Checkout
// Status lifecycle documentation for state transition details.

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

export const MethodTypeSchema = z.enum(["digital", "pickup", "shipping"]);
export type MethodType = z.infer<typeof MethodTypeSchema>;

// Derived status: fulfilled if quantity.fulfilled == quantity.total, partial if
// quantity.fulfilled > 0, otherwise processing.

export const LineItemStatusSchema = z.enum([
  "fulfilled",
  "partial",
  "processing",
]);
export type LineItemStatus = z.infer<typeof LineItemStatusSchema>;

// Fulfillment method type this availability applies to.
//
// Fulfillment method type.

export const TypeElementSchema = z.enum(["pickup", "shipping"]);
export type TypeElement = z.infer<typeof TypeElementSchema>;

export const MessageErrorTypeSchema = z.enum(["error"]);
export type MessageErrorType = z.infer<typeof MessageErrorTypeSchema>;

export const MessageInfoTypeSchema = z.enum(["info"]);
export type MessageInfoType = z.infer<typeof MessageInfoTypeSchema>;

export const MessageWarningTypeSchema = z.enum(["warning"]);
export type MessageWarningType = z.infer<typeof MessageWarningTypeSchema>;

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

export const McpSchema = z.object({
  endpoint: z.string(),
  schema: z.string(),
});
export type Mcp = z.infer<typeof McpSchema>;

export const RestSchema = z.object({
  endpoint: z.string(),
  schema: z.string(),
});
export type Rest = z.infer<typeof RestSchema>;

export const BuyerClassSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
});
export type BuyerClass = z.infer<typeof BuyerClassSchema>;

export const ItemClassSchema = z.object({
  id: z.string(),
});
export type ItemClass = z.infer<typeof ItemClassSchema>;

export const BillingAddressClassSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
});
export type BillingAddressClass = z.infer<typeof BillingAddressClassSchema>;

export const PaymentCredentialSchema = z.object({
  type: z.string(),
  card_number_type: CardNumberTypeSchema.optional(),
  cryptogram: z.string().optional(),
  cvc: z.string().optional(),
  eci_value: z.string().optional(),
  expiry_month: z.number().optional(),
  expiry_year: z.number().optional(),
  name: z.string().optional(),
  number: z.string().optional(),
});
export type PaymentCredential = z.infer<typeof PaymentCredentialSchema>;

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
  type: TotalResponseTypeSchema,
});
export type TotalResponse = z.infer<typeof TotalResponseSchema>;

export const LinkElementSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string(),
});
export type LinkElement = z.infer<typeof LinkElementSchema>;

export const MessageElementSchema = z.object({
  code: z.string().optional(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  severity: SeveritySchema.optional(),
  type: MessageTypeSchema,
});
export type MessageElement = z.infer<typeof MessageElementSchema>;

export const OrderClassSchema = z.object({
  id: z.string(),
  permalink_url: z.string(),
});
export type OrderClass = z.infer<typeof OrderClassSchema>;

export const CapabilityResponseSchema = z.object({
  config: z.record(z.string(), z.any()).optional(),
  extends: z.string().optional(),
  name: z.string(),
  schema: z.string().optional(),
  spec: z.string().optional(),
  version: z.string(),
});
export type CapabilityResponse = z.infer<typeof CapabilityResponseSchema>;

export const LineItemItemSchema = z.object({
  id: z.string(),
});
export type LineItemItem = z.infer<typeof LineItemItemSchema>;

export const AdjustmentLineItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type AdjustmentLineItem = z.infer<typeof AdjustmentLineItemSchema>;

export const EventLineItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type EventLineItem = z.infer<typeof EventLineItemSchema>;

export const ExpectationLineItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type ExpectationLineItem = z.infer<typeof ExpectationLineItemSchema>;

export const LineItemQuantitySchema = z.object({
  fulfilled: z.number(),
  total: z.number(),
});
export type LineItemQuantity = z.infer<typeof LineItemQuantitySchema>;

export const UcpOrderResponseSchema = z.object({
  capabilities: z.array(CapabilityResponseSchema),
  version: z.string(),
});
export type UcpOrderResponse = z.infer<typeof UcpOrderResponseSchema>;

export const PaymentAccountInfoSchema = z.object({
  payment_account_reference: z.string().optional(),
});
export type PaymentAccountInfo = z.infer<typeof PaymentAccountInfoSchema>;

export const AdjustmentLineItemClassSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type AdjustmentLineItemClass = z.infer<
  typeof AdjustmentLineItemClassSchema
>;

export const IdentityClassSchema = z.object({
  access_token: z.string(),
});
export type IdentityClass = z.infer<typeof IdentityClassSchema>;

export const BuyerSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
});
export type Buyer = z.infer<typeof BuyerSchema>;

export const CardCredentialSchema = z.object({
  card_number_type: CardNumberTypeSchema,
  cryptogram: z.string().optional(),
  cvc: z.string().optional(),
  eci_value: z.string().optional(),
  expiry_month: z.number().optional(),
  expiry_year: z.number().optional(),
  name: z.string().optional(),
  number: z.string().optional(),
  type: CardPaymentInstrumentTypeSchema,
});
export type CardCredential = z.infer<typeof CardCredentialSchema>;

export const CardPaymentInstrumentSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
  handler_id: z.string(),
  id: z.string(),
  type: CardPaymentInstrumentTypeSchema,
  brand: z.string(),
  expiry_month: z.number().optional(),
  expiry_year: z.number().optional(),
  last_digits: z.string(),
  rich_card_art: z.string().optional(),
  rich_text_description: z.string().optional(),
});
export type CardPaymentInstrument = z.infer<typeof CardPaymentInstrumentSchema>;

export const ExpectationLineItemClassSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type ExpectationLineItemClass = z.infer<
  typeof ExpectationLineItemClassSchema
>;

export const FulfillmentDestinationRequestSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string().optional(),
  address: BillingAddressClassSchema.optional(),
  name: z.string().optional(),
});
export type FulfillmentDestinationRequest = z.infer<
  typeof FulfillmentDestinationRequestSchema
>;

export const FulfillmentEventLineItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
});
export type FulfillmentEventLineItem = z.infer<
  typeof FulfillmentEventLineItemSchema
>;

export const FulfillmentGroupCreateRequestSchema = z.object({
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroupCreateRequest = z.infer<
  typeof FulfillmentGroupCreateRequestSchema
>;

export const FulfillmentGroupUpdateRequestSchema = z.object({
  id: z.string(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentGroupUpdateRequest = z.infer<
  typeof FulfillmentGroupUpdateRequestSchema
>;

export const FulfillmentDestinationRequestElementSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string().optional(),
  address: BillingAddressClassSchema.optional(),
  name: z.string().optional(),
});
export type FulfillmentDestinationRequestElement = z.infer<
  typeof FulfillmentDestinationRequestElementSchema
>;

export const GroupElementSchema = z.object({
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type GroupElement = z.infer<typeof GroupElementSchema>;

export const GroupClassSchema = z.object({
  id: z.string(),
  selected_option_id: z.union([z.null(), z.string()]).optional(),
});
export type GroupClass = z.infer<typeof GroupClassSchema>;

export const ItemCreateRequestSchema = z.object({
  id: z.string(),
});
export type ItemCreateRequest = z.infer<typeof ItemCreateRequestSchema>;

export const ItemUpdateRequestSchema = z.object({
  id: z.string(),
});
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequestSchema>;

export const LineItemCreateRequestSchema = z.object({
  item: ItemClassSchema,
  quantity: z.number(),
});
export type LineItemCreateRequest = z.infer<typeof LineItemCreateRequestSchema>;

export const LineItemUpdateRequestSchema = z.object({
  id: z.string().optional(),
  item: LineItemItemSchema,
  parent_id: z.string().optional(),
  quantity: z.number(),
});
export type LineItemUpdateRequest = z.infer<typeof LineItemUpdateRequestSchema>;

export const LinkSchema = z.object({
  title: z.string().optional(),
  type: z.string(),
  url: z.string(),
});
export type Link = z.infer<typeof LinkSchema>;

export const AllowsMultiDestinationSchema = z.object({
  pickup: z.boolean().optional(),
  shipping: z.boolean().optional(),
});
export type AllowsMultiDestination = z.infer<
  typeof AllowsMultiDestinationSchema
>;

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

export const MessageSchema = z.object({
  code: z.string().optional(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  severity: SeveritySchema.optional(),
  type: MessageTypeSchema,
});
export type Message = z.infer<typeof MessageSchema>;

export const MessageWarningSchema = z.object({
  code: z.string(),
  content: z.string(),
  content_type: ContentTypeSchema.optional(),
  path: z.string().optional(),
  type: MessageWarningTypeSchema,
});
export type MessageWarning = z.infer<typeof MessageWarningSchema>;

export const OrderConfirmationSchema = z.object({
  id: z.string(),
  permalink_url: z.string(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

export const OrderLineItemQuantitySchema = z.object({
  fulfilled: z.number(),
  total: z.number(),
});
export type OrderLineItemQuantity = z.infer<typeof OrderLineItemQuantitySchema>;

export const PaymentIdentitySchema = z.object({
  access_token: z.string(),
});
export type PaymentIdentity = z.infer<typeof PaymentIdentitySchema>;

export const PaymentInstrumentBaseSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
  handler_id: z.string(),
  id: z.string(),
  type: z.string(),
});
export type PaymentInstrumentBase = z.infer<typeof PaymentInstrumentBaseSchema>;

export const PlatformFulfillmentConfigSchema = z.object({
  supports_multi_group: z.boolean().optional(),
});
export type PlatformFulfillmentConfig = z.infer<
  typeof PlatformFulfillmentConfigSchema
>;

export const PostalAddressSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
});
export type PostalAddress = z.infer<typeof PostalAddressSchema>;

export const RetailLocationRequestSchema = z.object({
  address: BillingAddressClassSchema.optional(),
  name: z.string(),
});
export type RetailLocationRequest = z.infer<typeof RetailLocationRequestSchema>;

export const RetailLocationResponseSchema = z.object({
  address: BillingAddressClassSchema.optional(),
  id: z.string(),
  name: z.string(),
});
export type RetailLocationResponse = z.infer<
  typeof RetailLocationResponseSchema
>;

export const ShippingDestinationRequestSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string().optional(),
});
export type ShippingDestinationRequest = z.infer<
  typeof ShippingDestinationRequestSchema
>;

export const ShippingDestinationResponseSchema = z.object({
  address_country: z.string().optional(),
  address_locality: z.string().optional(),
  address_region: z.string().optional(),
  extended_address: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string(),
});
export type ShippingDestinationResponse = z.infer<
  typeof ShippingDestinationResponseSchema
>;

export const TokenCredentialCreateRequestSchema = z.object({
  token: z.string(),
  type: z.string(),
});
export type TokenCredentialCreateRequest = z.infer<
  typeof TokenCredentialCreateRequestSchema
>;

export const TokenCredentialResponseSchema = z.object({
  type: z.string(),
});
export type TokenCredentialResponse = z.infer<
  typeof TokenCredentialResponseSchema
>;

export const TokenCredentialUpdateRequestSchema = z.object({
  token: z.string(),
  type: z.string(),
});
export type TokenCredentialUpdateRequest = z.infer<
  typeof TokenCredentialUpdateRequestSchema
>;

export const Ap2CompleteRequestObjectSchema = z.object({
  checkout_mandate: z.string(),
});
export type Ap2CompleteRequestObject = z.infer<
  typeof Ap2CompleteRequestObjectSchema
>;

export const Ap2CheckoutResponseObjectSchema = z.object({
  merchant_authorization: z.string(),
});
export type Ap2CheckoutResponseObject = z.infer<
  typeof Ap2CheckoutResponseObjectSchema
>;

export const PurpleConsentSchema = z.object({
  analytics: z.boolean().optional(),
  marketing: z.boolean().optional(),
  preferences: z.boolean().optional(),
  sale_of_data: z.boolean().optional(),
});
export type PurpleConsent = z.infer<typeof PurpleConsentSchema>;

export const FluffyConsentSchema = z.object({
  analytics: z.boolean().optional(),
  marketing: z.boolean().optional(),
  preferences: z.boolean().optional(),
  sale_of_data: z.boolean().optional(),
});
export type FluffyConsent = z.infer<typeof FluffyConsentSchema>;

export const TentacledConsentSchema = z.object({
  analytics: z.boolean().optional(),
  marketing: z.boolean().optional(),
  preferences: z.boolean().optional(),
  sale_of_data: z.boolean().optional(),
});
export type TentacledConsent = z.infer<typeof TentacledConsentSchema>;

export const AllocationElementSchema = z.object({
  amount: z.number(),
  path: z.string(),
});
export type AllocationElement = z.infer<typeof AllocationElementSchema>;

export const AllocationClassSchema = z.object({
  amount: z.number(),
  path: z.string(),
});
export type AllocationClass = z.infer<typeof AllocationClassSchema>;

export const AppliedAllocationSchema = z.object({
  amount: z.number(),
  path: z.string(),
});
export type AppliedAllocation = z.infer<typeof AppliedAllocationSchema>;

export const MethodElementSchema = z.object({
  destinations: z.array(FulfillmentDestinationRequestElementSchema).optional(),
  groups: z.array(GroupElementSchema).optional(),
  line_item_ids: z.array(z.string()).optional(),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: TypeElementSchema,
});
export type MethodElement = z.infer<typeof MethodElementSchema>;

export const FulfillmentAvailableMethodResponseSchema = z.object({
  description: z.string().optional(),
  fulfillable_on: z.union([z.null(), z.string()]).optional(),
  line_item_ids: z.array(z.string()),
  type: TypeElementSchema,
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
  full_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  postal_code: z.string().optional(),
  street_address: z.string().optional(),
  id: z.string(),
  address: BillingAddressClassSchema.optional(),
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

export const LineItemElementSchema = z.object({
  item: ItemClassSchema,
  quantity: z.number(),
});
export type LineItemElement = z.infer<typeof LineItemElementSchema>;

export const PaymentInstrumentSchema = z.object({
  billing_address: BillingAddressClassSchema.optional(),
  credential: PaymentCredentialSchema.optional(),
  handler_id: z.string(),
  id: z.string(),
  type: CardPaymentInstrumentTypeSchema,
  brand: z.string(),
  expiry_month: z.number().optional(),
  expiry_year: z.number().optional(),
  last_digits: z.string(),
  rich_card_art: z.string().optional(),
  rich_text_description: z.string().optional(),
});
export type PaymentInstrument = z.infer<typeof PaymentInstrumentSchema>;

export const LineItemResponseSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: z.number(),
  totals: z.array(TotalResponseSchema),
});
export type LineItemResponse = z.infer<typeof LineItemResponseSchema>;

export const PaymentResponseSchema = z.object({
  handlers: z.array(PaymentHandlerResponseSchema),
  instruments: z.array(PaymentInstrumentSchema).optional(),
  selected_instrument_id: z.string().optional(),
});
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

export const UcpCheckoutResponseSchema = z.object({
  capabilities: z.array(CapabilityResponseSchema),
  version: z.string(),
});
export type UcpCheckoutResponse = z.infer<typeof UcpCheckoutResponseSchema>;

export const LineItemClassSchema = z.object({
  id: z.string().optional(),
  item: LineItemItemSchema,
  parent_id: z.string().optional(),
  quantity: z.number(),
});
export type LineItemClass = z.infer<typeof LineItemClassSchema>;

export const CheckoutUpdateRequestPaymentSchema = z.object({
  instruments: z.array(PaymentInstrumentSchema).optional(),
  selected_instrument_id: z.string().optional(),
});
export type CheckoutUpdateRequestPayment = z.infer<
  typeof CheckoutUpdateRequestPaymentSchema
>;

export const AdjustmentElementSchema = z.object({
  amount: z.number().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemSchema).optional(),
  occurred_at: z.coerce.date(),
  status: AdjustmentStatusSchema,
  type: z.string(),
});
export type AdjustmentElement = z.infer<typeof AdjustmentElementSchema>;

export const EventElementSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(EventLineItemSchema),
  occurred_at: z.coerce.date(),
  tracking_number: z.string().optional(),
  tracking_url: z.string().optional(),
  type: z.string(),
});
export type EventElement = z.infer<typeof EventElementSchema>;

export const ExpectationElementSchema = z.object({
  description: z.string().optional(),
  destination: BillingAddressClassSchema,
  fulfillable_on: z.string().optional(),
  id: z.string(),
  line_items: z.array(ExpectationLineItemSchema),
  method_type: MethodTypeSchema,
});
export type ExpectationElement = z.infer<typeof ExpectationElementSchema>;

export const OrderLineItemClassSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: LineItemQuantitySchema,
  status: LineItemStatusSchema,
  totals: z.array(TotalResponseSchema),
});
export type OrderLineItemClass = z.infer<typeof OrderLineItemClassSchema>;

export const PaymentCreateRequestSchema = z.object({
  instruments: z.array(PaymentInstrumentSchema).optional(),
  selected_instrument_id: z.string().optional(),
});
export type PaymentCreateRequest = z.infer<typeof PaymentCreateRequestSchema>;

export const PaymentDataSchema = z.object({
  payment_data: PaymentInstrumentSchema,
});
export type PaymentData = z.infer<typeof PaymentDataSchema>;

export const PaymentUpdateRequestSchema = z.object({
  instruments: z.array(PaymentInstrumentSchema).optional(),
  selected_instrument_id: z.string().optional(),
});
export type PaymentUpdateRequest = z.infer<typeof PaymentUpdateRequestSchema>;

export const AdjustmentSchema = z.object({
  amount: z.number().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(AdjustmentLineItemClassSchema).optional(),
  occurred_at: z.coerce.date(),
  status: AdjustmentStatusSchema,
  type: z.string(),
});
export type Adjustment = z.infer<typeof AdjustmentSchema>;

export const BindingSchema = z.object({
  checkout_id: z.string(),
  identity: IdentityClassSchema.optional(),
});
export type Binding = z.infer<typeof BindingSchema>;

export const ExpectationSchema = z.object({
  description: z.string().optional(),
  destination: BillingAddressClassSchema,
  fulfillable_on: z.string().optional(),
  id: z.string(),
  line_items: z.array(ExpectationLineItemClassSchema),
  method_type: MethodTypeSchema,
});
export type Expectation = z.infer<typeof ExpectationSchema>;

export const FulfillmentEventSchema = z.object({
  carrier: z.string().optional(),
  description: z.string().optional(),
  id: z.string(),
  line_items: z.array(FulfillmentEventLineItemSchema),
  occurred_at: z.coerce.date(),
  tracking_number: z.string().optional(),
  tracking_url: z.string().optional(),
  type: z.string(),
});
export type FulfillmentEvent = z.infer<typeof FulfillmentEventSchema>;

export const FulfillmentMethodCreateRequestSchema = z.object({
  destinations: z.array(FulfillmentDestinationRequestElementSchema).optional(),
  groups: z.array(GroupElementSchema).optional(),
  line_item_ids: z.array(z.string()).optional(),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: TypeElementSchema,
});
export type FulfillmentMethodCreateRequest = z.infer<
  typeof FulfillmentMethodCreateRequestSchema
>;

export const FulfillmentMethodUpdateRequestSchema = z.object({
  destinations: z.array(FulfillmentDestinationRequestElementSchema).optional(),
  groups: z.array(GroupClassSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
});
export type FulfillmentMethodUpdateRequest = z.infer<
  typeof FulfillmentMethodUpdateRequestSchema
>;

export const MerchantFulfillmentConfigSchema = z.object({
  allows_method_combinations: z.array(z.array(TypeElementSchema)).optional(),
  allows_multi_destination: AllowsMultiDestinationSchema.optional(),
});
export type MerchantFulfillmentConfig = z.infer<
  typeof MerchantFulfillmentConfigSchema
>;

export const OrderLineItemSchema = z.object({
  id: z.string(),
  item: ItemResponseSchema,
  parent_id: z.string().optional(),
  quantity: OrderLineItemQuantitySchema,
  status: LineItemStatusSchema,
  totals: z.array(TotalResponseSchema),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const CompleteCheckoutRequestWithAp2Schema = z.object({
  ap2: Ap2CompleteRequestObjectSchema.optional(),
});
export type CompleteCheckoutRequestWithAp2 = z.infer<
  typeof CompleteCheckoutRequestWithAp2Schema
>;

export const CheckoutWithAp2MandateSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: PaymentResponseSchema,
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalResponseSchema),
  ucp: UcpCheckoutResponseSchema,
  ap2: Ap2CheckoutResponseObjectSchema.optional(),
});
export type CheckoutWithAp2Mandate = z.infer<
  typeof CheckoutWithAp2MandateSchema
>;

export const BuyerWithConsentCreateRequestSchema = z.object({
  email: z.string().optional(),
  first_name: z.string().optional(),
  full_name: z.string().optional(),
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
  full_name: z.string().optional(),
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
  full_name: z.string().optional(),
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
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  title: z.string(),
});
export type AppliedElement = z.infer<typeof AppliedElementSchema>;

export const AppliedClassSchema = z.object({
  allocations: z.array(AllocationClassSchema).optional(),
  amount: z.number(),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  title: z.string(),
});
export type AppliedClass = z.infer<typeof AppliedClassSchema>;

export const DiscountsAppliedSchema = z.object({
  allocations: z.array(AppliedAllocationSchema).optional(),
  amount: z.number(),
  automatic: z.boolean().optional(),
  code: z.string().optional(),
  method: MethodSchema.optional(),
  priority: z.number().optional(),
  title: z.string(),
});
export type DiscountsApplied = z.infer<typeof DiscountsAppliedSchema>;

export const FulfillmentRequestSchema = z.object({
  methods: z.array(MethodElementSchema).optional(),
});
export type FulfillmentRequest = z.infer<typeof FulfillmentRequestSchema>;

export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  id: z.string(),
  line_items: z.array(LineItemClassSchema),
  payment: CheckoutUpdateRequestPaymentSchema,
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentUpdateRequest = z.infer<
  typeof CheckoutWithFulfillmentUpdateRequestSchema
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

export const UcpClassSchema = z.object({
  capabilities: z.array(CapabilityDiscoverySchema),
  services: z.record(z.string(), UcpServiceSchema),
  version: z.string(),
});
export type UcpClass = z.infer<typeof UcpClassSchema>;

export const PaymentClassSchema = z.object({
  instruments: z.array(PaymentInstrumentSchema).optional(),
  selected_instrument_id: z.string().optional(),
});
export type PaymentClass = z.infer<typeof PaymentClassSchema>;

export const CheckoutResponseSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: PaymentResponseSchema,
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalResponseSchema),
  ucp: UcpCheckoutResponseSchema,
});
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const CheckoutUpdateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  id: z.string(),
  line_items: z.array(LineItemClassSchema),
  payment: CheckoutUpdateRequestPaymentSchema,
});
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;

export const FulfillmentSchema = z.object({
  events: z.array(EventElementSchema).optional(),
  expectations: z.array(ExpectationElementSchema).optional(),
});
export type Fulfillment = z.infer<typeof FulfillmentSchema>;

export const CheckoutWithBuyerConsentCreateRequestSchema = z.object({
  buyer: BuyerWithConsentCreateRequestSchema.optional(),
  currency: z.string(),
  line_items: z.array(LineItemElementSchema),
  payment: PaymentClassSchema,
});
export type CheckoutWithBuyerConsentCreateRequest = z.infer<
  typeof CheckoutWithBuyerConsentCreateRequestSchema
>;

export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
  buyer: BuyerWithConsentUpdateRequestSchema.optional(),
  currency: z.string(),
  id: z.string(),
  line_items: z.array(LineItemClassSchema),
  payment: CheckoutUpdateRequestPaymentSchema,
});
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<
  typeof CheckoutWithBuyerConsentUpdateRequestSchema
>;

export const CheckoutWithBuyerConsentResponseSchema = z.object({
  buyer: BuyerWithConsentResponseSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: PaymentResponseSchema,
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalResponseSchema),
  ucp: UcpCheckoutResponseSchema,
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

export const CheckoutWithFulfillmentCreateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  line_items: z.array(LineItemElementSchema),
  payment: PaymentClassSchema,
  fulfillment: FulfillmentRequestSchema.optional(),
});
export type CheckoutWithFulfillmentCreateRequest = z.infer<
  typeof CheckoutWithFulfillmentCreateRequestSchema
>;

export const FulfillmentMethodResponseSchema = z.object({
  destinations: z.array(FulfillmentDestinationResponseSchema).optional(),
  groups: z.array(FulfillmentGroupResponseSchema).optional(),
  id: z.string(),
  line_item_ids: z.array(z.string()),
  selected_destination_id: z.union([z.null(), z.string()]).optional(),
  type: TypeElementSchema,
});
export type FulfillmentMethodResponse = z.infer<
  typeof FulfillmentMethodResponseSchema
>;

export const UcpDiscoveryProfileSchema = z.object({
  payment: PaymentSchema.optional(),
  signing_keys: z.array(SigningKeySchema).optional(),
  ucp: UcpClassSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const CheckoutCreateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  line_items: z.array(LineItemElementSchema),
  payment: PaymentClassSchema,
});
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;

export const OrderSchema = z.object({
  adjustments: z.array(AdjustmentElementSchema).optional(),
  checkout_id: z.string(),
  fulfillment: FulfillmentSchema,
  id: z.string(),
  line_items: z.array(OrderLineItemClassSchema),
  permalink_url: z.string(),
  totals: z.array(TotalResponseSchema),
  ucp: UcpOrderResponseSchema,
});
export type Order = z.infer<typeof OrderSchema>;

export const CheckoutWithDiscountCreateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  line_items: z.array(LineItemElementSchema),
  payment: PaymentClassSchema,
  discounts: CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountCreateRequest = z.infer<
  typeof CheckoutWithDiscountCreateRequestSchema
>;

export const CheckoutWithDiscountUpdateRequestSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  currency: z.string(),
  id: z.string(),
  line_items: z.array(LineItemClassSchema),
  payment: CheckoutUpdateRequestPaymentSchema,
  discounts: CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
export type CheckoutWithDiscountUpdateRequest = z.infer<
  typeof CheckoutWithDiscountUpdateRequestSchema
>;

export const CheckoutWithDiscountResponseSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: PaymentResponseSchema,
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalResponseSchema),
  ucp: UcpCheckoutResponseSchema,
  discounts: CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
export type CheckoutWithDiscountResponse = z.infer<
  typeof CheckoutWithDiscountResponseSchema
>;

export const FulfillmentResponseSchema = z.object({
  available_methods: z
    .array(FulfillmentAvailableMethodResponseSchema)
    .optional(),
  methods: z.array(FulfillmentMethodResponseSchema).optional(),
});
export type FulfillmentResponse = z.infer<typeof FulfillmentResponseSchema>;

export const CheckoutWithFulfillmentResponseSchema = z.object({
  buyer: BuyerClassSchema.optional(),
  continue_url: z.string().optional(),
  currency: z.string(),
  expires_at: z.coerce.date().optional(),
  id: z.string(),
  line_items: z.array(LineItemResponseSchema),
  links: z.array(LinkElementSchema),
  messages: z.array(MessageElementSchema).optional(),
  order: OrderClassSchema.optional(),
  payment: PaymentResponseSchema,
  status: CheckoutResponseStatusSchema,
  totals: z.array(TotalResponseSchema),
  ucp: UcpCheckoutResponseSchema,
  fulfillment: FulfillmentResponseSchema.optional(),
});
export type CheckoutWithFulfillmentResponse = z.infer<
  typeof CheckoutWithFulfillmentResponseSchema
>;
