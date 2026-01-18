import * as z from "zod";
// Key usage. Should be 'sig' for signing keys.
export const UseSchema = z.enum([
    "enc",
    "sig",
]);
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
// Content format, default = plain.
export const ContentTypeSchema = z.enum([
    "markdown",
    "plain",
]);
// Declares who resolves this error. 'recoverable': agent can fix via API.
// 'requires_buyer_input': merchant requires information their API doesn't support
// collecting programmatically (checkout incomplete). 'requires_buyer_review': buyer must
// authorize before order placement due to policy, regulatory, or entitlement rules
// (checkout complete). Errors with 'requires_*' severity contribute to 'status:
// requires_escalation'.
export const SeveritySchema = z.enum([
    "recoverable",
    "requires_buyer_input",
    "requires_buyer_review",
]);
export const MessageTypeSchema = z.enum([
    "error",
    "info",
    "warning",
]);
// The type of card number. Network tokens are preferred with fallback to FPAN. See PCI
// Scope for more details.
export const CardNumberTypeSchema = z.enum([
    "dpan",
    "fpan",
    "network_token",
]);
// A URI pointing to a schema definition (e.g., JSON Schema) used to validate the structure
// of the instrument object.
export const CardPaymentInstrumentTypeSchema = z.enum([
    "card",
]);
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
// Adjustment status.
export const AdjustmentStatusSchema = z.enum([
    "completed",
    "failed",
    "pending",
]);
// Delivery method type (shipping, pickup, digital).
export const MethodTypeSchema = z.enum([
    "digital",
    "pickup",
    "shipping",
]);
// Derived status: fulfilled if quantity.fulfilled == quantity.total, partial if
// quantity.fulfilled > 0, otherwise processing.
export const LineItemStatusSchema = z.enum([
    "fulfilled",
    "partial",
    "processing",
]);
// Fulfillment method type this availability applies to.
//
// Fulfillment method type.
export const TypeElementSchema = z.enum([
    "pickup",
    "shipping",
]);
export const MessageErrorTypeSchema = z.enum([
    "error",
]);
export const MessageInfoTypeSchema = z.enum([
    "info",
]);
export const MessageWarningTypeSchema = z.enum([
    "warning",
]);
// Allocation method. 'each' = applied independently per item. 'across' = split
// proportionally by value.
export const MethodSchema = z.enum([
    "across",
    "each",
]);
export const PaymentHandlerResponseSchema = z.object({
    "config": z.record(z.string(), z.any()),
    "config_schema": z.string(),
    "id": z.string(),
    "instrument_schemas": z.array(z.string()),
    "name": z.string(),
    "spec": z.string(),
    "version": z.string(),
});
export const SigningKeySchema = z.object({
    "alg": z.string().optional(),
    "crv": z.string().optional(),
    "e": z.string().optional(),
    "kid": z.string(),
    "kty": z.string(),
    "n": z.string().optional(),
    "use": UseSchema.optional(),
    "x": z.string().optional(),
    "y": z.string().optional(),
});
export const CapabilityDiscoverySchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "extends": z.string().optional(),
    "name": z.string(),
    "schema": z.string(),
    "spec": z.string(),
    "version": z.string(),
});
export const A2ASchema = z.object({
    "endpoint": z.string(),
});
export const EmbeddedSchema = z.object({
    "schema": z.string(),
});
export const McpSchema = z.object({
    "endpoint": z.string(),
    "schema": z.string(),
});
export const RestSchema = z.object({
    "endpoint": z.string(),
    "schema": z.string(),
});
export const BuyerClassSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
export const ItemResponseSchema = z.object({
    "id": z.string(),
    "image_url": z.string().optional(),
    "price": z.number(),
    "title": z.string(),
});
export const TotalResponseSchema = z.object({
    "amount": z.number(),
    "display_text": z.string().optional(),
    "type": TotalResponseTypeSchema,
});
export const LinkElementSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
export const MessageElementSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema.optional(),
    "type": MessageTypeSchema,
});
export const OrderClassSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
export const BillingAddressClassSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
});
export const PaymentCredentialSchema = z.object({
    "type": z.string(),
    "card_number_type": CardNumberTypeSchema.optional(),
    "cryptogram": z.string().optional(),
    "cvc": z.string().optional(),
    "eci_value": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "name": z.string().optional(),
    "number": z.string().optional(),
});
export const CapabilityResponseSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "extends": z.string().optional(),
    "name": z.string(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
});
export const ItemClassSchema = z.object({
    "id": z.string(),
});
export const LineItemItemSchema = z.object({
    "id": z.string(),
});
export const AdjustmentLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const EventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const ExpectationLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const LineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
export const UcpOrderResponseSchema = z.object({
    "capabilities": z.array(CapabilityResponseSchema),
    "version": z.string(),
});
export const PaymentAccountInfoSchema = z.object({
    "payment_account_reference": z.string().optional(),
});
export const AdjustmentLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const IdentityClassSchema = z.object({
    "access_token": z.string(),
});
export const BuyerSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
export const CardCredentialSchema = z.object({
    "card_number_type": CardNumberTypeSchema,
    "cryptogram": z.string().optional(),
    "cvc": z.string().optional(),
    "eci_value": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "name": z.string().optional(),
    "number": z.string().optional(),
    "type": CardPaymentInstrumentTypeSchema,
});
export const CardPaymentInstrumentSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": CardPaymentInstrumentTypeSchema,
    "brand": z.string(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "last_digits": z.string(),
    "rich_card_art": z.string().optional(),
    "rich_text_description": z.string().optional(),
});
export const ExpectationLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const FulfillmentDestinationRequestSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string().optional(),
    "address": BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
export const FulfillmentEventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export const FulfillmentGroupCreateRequestSchema = z.object({
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export const FulfillmentGroupUpdateRequestSchema = z.object({
    "id": z.string(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export const FulfillmentDestinationRequestElementSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string().optional(),
    "address": BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
export const GroupElementSchema = z.object({
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export const GroupClassSchema = z.object({
    "id": z.string(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export const ItemCreateRequestSchema = z.object({
    "id": z.string(),
});
export const ItemUpdateRequestSchema = z.object({
    "id": z.string(),
});
export const LineItemCreateRequestSchema = z.object({
    "item": ItemClassSchema,
    "quantity": z.number(),
});
export const LineItemUpdateRequestSchema = z.object({
    "id": z.string().optional(),
    "item": LineItemItemSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
});
export const LinkSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
export const AllowsMultiDestinationSchema = z.object({
    "pickup": z.boolean().optional(),
    "shipping": z.boolean().optional(),
});
export const MessageErrorSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema,
    "type": MessageErrorTypeSchema,
});
export const MessageInfoSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": MessageInfoTypeSchema,
});
export const MessageWarningSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": MessageWarningTypeSchema,
});
export const MessageSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema.optional(),
    "type": MessageTypeSchema,
});
export const OrderConfirmationSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
export const OrderLineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
export const PaymentIdentitySchema = z.object({
    "access_token": z.string(),
});
export const PaymentInstrumentBaseSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": z.string(),
});
export const PlatformFulfillmentConfigSchema = z.object({
    "supports_multi_group": z.boolean().optional(),
});
export const PostalAddressSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
});
export const RetailLocationRequestSchema = z.object({
    "address": BillingAddressClassSchema.optional(),
    "name": z.string(),
});
export const RetailLocationResponseSchema = z.object({
    "address": BillingAddressClassSchema.optional(),
    "id": z.string(),
    "name": z.string(),
});
export const ShippingDestinationRequestSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string().optional(),
});
export const ShippingDestinationResponseSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string(),
});
export const TokenCredentialResponseSchema = z.object({
    "type": z.string(),
});
export const TokenCredentialCreateRequestSchema = z.object({
    "token": z.string(),
    "type": z.string(),
});
export const TokenCredentialUpdateRequestSchema = z.object({
    "token": z.string(),
    "type": z.string(),
});
export const Ap2CompleteRequestObjectSchema = z.object({
    "checkout_mandate": z.string(),
});
export const Ap2CheckoutResponseObjectSchema = z.object({
    "merchant_authorization": z.string(),
});
export const PurpleConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
export const FluffyConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
export const TentacledConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
export const AllocationElementSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
export const AllocationClassSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
export const AppliedAllocationSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
export const MethodElementSchema = z.object({
    "destinations": z.array(FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(GroupElementSchema).optional(),
    "line_item_ids": z.array(z.string()).optional(),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": TypeElementSchema,
});
export const FulfillmentAvailableMethodResponseSchema = z.object({
    "description": z.string().optional(),
    "fulfillable_on": z.union([z.null(), z.string()]).optional(),
    "line_item_ids": z.array(z.string()),
    "type": TypeElementSchema,
});
export const FulfillmentDestinationResponseSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string(),
    "address": BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
export const FulfillmentOptionResponseSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "earliest_fulfillment_time": z.coerce.date().optional(),
    "id": z.string(),
    "latest_fulfillment_time": z.coerce.date().optional(),
    "title": z.string(),
    "totals": z.array(TotalResponseSchema),
});
export const PaymentSchema = z.object({
    "handlers": z.array(PaymentHandlerResponseSchema).optional(),
});
export const UcpServiceSchema = z.object({
    "a2a": A2ASchema.optional(),
    "embedded": EmbeddedSchema.optional(),
    "mcp": McpSchema.optional(),
    "rest": RestSchema.optional(),
    "spec": z.string(),
    "version": z.string(),
});
export const LineItemResponseSchema = z.object({
    "id": z.string(),
    "item": ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
    "totals": z.array(TotalResponseSchema),
});
export const PaymentInstrumentSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": CardPaymentInstrumentTypeSchema,
    "brand": z.string(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "last_digits": z.string(),
    "rich_card_art": z.string().optional(),
    "rich_text_description": z.string().optional(),
});
export const UcpCheckoutResponseSchema = z.object({
    "capabilities": z.array(CapabilityResponseSchema),
    "version": z.string(),
});
export const LineItemElementSchema = z.object({
    "item": ItemClassSchema,
    "quantity": z.number(),
});
export const PaymentClassSchema = z.object({
    "instruments": z.array(PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
export const LineItemClassSchema = z.object({
    "id": z.string().optional(),
    "item": LineItemItemSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
});
export const CheckoutUpdateRequestPaymentSchema = z.object({
    "instruments": z.array(PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
export const AdjustmentElementSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(AdjustmentLineItemSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": AdjustmentStatusSchema,
    "type": z.string(),
});
export const EventElementSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(EventLineItemSchema),
    "occurred_at": z.coerce.date(),
    "tracking_number": z.string().optional(),
    "tracking_url": z.string().optional(),
    "type": z.string(),
});
export const ExpectationElementSchema = z.object({
    "description": z.string().optional(),
    "destination": BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(ExpectationLineItemSchema),
    "method_type": MethodTypeSchema,
});
export const OrderLineItemClassSchema = z.object({
    "id": z.string(),
    "item": ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": LineItemQuantitySchema,
    "status": LineItemStatusSchema,
    "totals": z.array(TotalResponseSchema),
});
export const PaymentDataSchema = z.object({
    "payment_data": PaymentInstrumentSchema,
});
export const PaymentCreateRequestSchema = z.object({
    "instruments": z.array(PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
export const PaymentUpdateRequestSchema = z.object({
    "instruments": z.array(PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
export const AdjustmentSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(AdjustmentLineItemClassSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": AdjustmentStatusSchema,
    "type": z.string(),
});
export const BindingSchema = z.object({
    "checkout_id": z.string(),
    "identity": IdentityClassSchema.optional(),
});
export const ExpectationSchema = z.object({
    "description": z.string().optional(),
    "destination": BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(ExpectationLineItemClassSchema),
    "method_type": MethodTypeSchema,
});
export const FulfillmentEventSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(FulfillmentEventLineItemSchema),
    "occurred_at": z.coerce.date(),
    "tracking_number": z.string().optional(),
    "tracking_url": z.string().optional(),
    "type": z.string(),
});
export const FulfillmentMethodCreateRequestSchema = z.object({
    "destinations": z.array(FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(GroupElementSchema).optional(),
    "line_item_ids": z.array(z.string()).optional(),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": TypeElementSchema,
});
export const FulfillmentMethodUpdateRequestSchema = z.object({
    "destinations": z.array(FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(GroupClassSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
});
export const MerchantFulfillmentConfigSchema = z.object({
    "allows_method_combinations": z.array(z.array(TypeElementSchema)).optional(),
    "allows_multi_destination": AllowsMultiDestinationSchema.optional(),
});
export const OrderLineItemSchema = z.object({
    "id": z.string(),
    "item": ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": OrderLineItemQuantitySchema,
    "status": LineItemStatusSchema,
    "totals": z.array(TotalResponseSchema),
});
export const CompleteCheckoutRequestWithAp2Schema = z.object({
    "ap2": Ap2CompleteRequestObjectSchema.optional(),
});
export const BuyerWithConsentCreateRequestSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": PurpleConsentSchema.optional(),
});
export const BuyerWithConsentUpdateRequestSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": FluffyConsentSchema.optional(),
});
export const BuyerWithConsentResponseSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": TentacledConsentSchema.optional(),
});
export const AppliedElementSchema = z.object({
    "allocations": z.array(AllocationElementSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
export const AppliedClassSchema = z.object({
    "allocations": z.array(AllocationClassSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
export const DiscountsAppliedSchema = z.object({
    "allocations": z.array(AppliedAllocationSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
export const FulfillmentRequestSchema = z.object({
    "methods": z.array(MethodElementSchema).optional(),
});
export const CheckoutWithFulfillmentUpdateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(LineItemClassSchema),
    "payment": CheckoutUpdateRequestPaymentSchema,
    "fulfillment": FulfillmentRequestSchema.optional(),
});
export const FulfillmentGroupResponseSchema = z.object({
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "options": z.array(FulfillmentOptionResponseSchema).optional(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export const UcpClassSchema = z.object({
    "capabilities": z.array(CapabilityDiscoverySchema),
    "services": z.record(z.string(), UcpServiceSchema),
    "version": z.string(),
});
export const PaymentResponseSchema = z.object({
    "handlers": z.array(PaymentHandlerResponseSchema),
    "instruments": z.array(PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
export const CheckoutCreateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(LineItemElementSchema),
    "payment": PaymentClassSchema,
});
export const CheckoutUpdateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(LineItemClassSchema),
    "payment": CheckoutUpdateRequestPaymentSchema,
});
export const FulfillmentSchema = z.object({
    "events": z.array(EventElementSchema).optional(),
    "expectations": z.array(ExpectationElementSchema).optional(),
});
export const CheckoutWithAp2MandateSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(LineItemResponseSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentResponseSchema,
    "status": CheckoutResponseStatusSchema,
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpCheckoutResponseSchema,
    "ap2": Ap2CheckoutResponseObjectSchema.optional(),
});
export const CheckoutWithBuyerConsentCreateRequestSchema = z.object({
    "buyer": BuyerWithConsentCreateRequestSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(LineItemElementSchema),
    "payment": PaymentClassSchema,
});
export const CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
    "buyer": BuyerWithConsentUpdateRequestSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(LineItemClassSchema),
    "payment": CheckoutUpdateRequestPaymentSchema,
});
export const CheckoutWithBuyerConsentResponseSchema = z.object({
    "buyer": BuyerWithConsentResponseSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(LineItemResponseSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentResponseSchema,
    "status": CheckoutResponseStatusSchema,
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpCheckoutResponseSchema,
});
export const CheckoutWithDiscountCreateRequestDiscountsSchema = z.object({
    "applied": z.array(AppliedElementSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
export const CheckoutWithDiscountUpdateRequestDiscountsSchema = z.object({
    "applied": z.array(AppliedClassSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
export const CheckoutWithDiscountResponseDiscountsSchema = z.object({
    "applied": z.array(DiscountsAppliedSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
export const CheckoutWithFulfillmentCreateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(LineItemElementSchema),
    "payment": PaymentClassSchema,
    "fulfillment": FulfillmentRequestSchema.optional(),
});
export const FulfillmentMethodResponseSchema = z.object({
    "destinations": z.array(FulfillmentDestinationResponseSchema).optional(),
    "groups": z.array(FulfillmentGroupResponseSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": TypeElementSchema,
});
export const UcpDiscoveryProfileSchema = z.object({
    "payment": PaymentSchema.optional(),
    "signing_keys": z.array(SigningKeySchema).optional(),
    "ucp": UcpClassSchema,
});
export const CheckoutResponseSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(LineItemResponseSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentResponseSchema,
    "status": CheckoutResponseStatusSchema,
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpCheckoutResponseSchema,
});
export const OrderSchema = z.object({
    "adjustments": z.array(AdjustmentElementSchema).optional(),
    "checkout_id": z.string(),
    "fulfillment": FulfillmentSchema,
    "id": z.string(),
    "line_items": z.array(OrderLineItemClassSchema),
    "permalink_url": z.string(),
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpOrderResponseSchema,
});
export const CheckoutWithDiscountCreateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(LineItemElementSchema),
    "payment": PaymentClassSchema,
    "discounts": CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
export const CheckoutWithDiscountUpdateRequestSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(LineItemClassSchema),
    "payment": CheckoutUpdateRequestPaymentSchema,
    "discounts": CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
export const CheckoutWithDiscountResponseSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(LineItemResponseSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentResponseSchema,
    "status": CheckoutResponseStatusSchema,
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpCheckoutResponseSchema,
    "discounts": CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
export const FulfillmentResponseSchema = z.object({
    "available_methods": z.array(FulfillmentAvailableMethodResponseSchema).optional(),
    "methods": z.array(FulfillmentMethodResponseSchema).optional(),
});
export const CheckoutWithFulfillmentResponseSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(LineItemResponseSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentResponseSchema,
    "status": CheckoutResponseStatusSchema,
    "totals": z.array(TotalResponseSchema),
    "ucp": UcpCheckoutResponseSchema,
    "fulfillment": FulfillmentResponseSchema.optional(),
});
