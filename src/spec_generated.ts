import * as z from "zod";

// Key usage. Should be 'sig' for signing keys.

export const UseSchema = z.enum([
    "enc",
    "sig",
]);
export type Use = z.infer<typeof UseSchema>;

// Transport protocol for this service binding.

export const TransportSchema = z.enum([
    "a2a",
    "embedded",
    "mcp",
    "rest",
]);
export type Transport = z.infer<typeof TransportSchema>;

// Type of total categorization.

export const TotalTypeSchema = z.enum([
    "discount",
    "fee",
    "fulfillment",
    "items_discount",
    "subtotal",
    "tax",
    "total",
]);
export type TotalType = z.infer<typeof TotalTypeSchema>;

// Content format, default = plain.

export const ContentTypeSchema = z.enum([
    "markdown",
    "plain",
]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

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
export type Severity = z.infer<typeof SeveritySchema>;


export const MessageTypeSchema = z.enum([
    "error",
    "info",
    "warning",
]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

// Checkout state indicating the current phase and required action. See Checkout Status
// lifecycle documentation for state transition details.

export const CheckoutStatusSchema = z.enum([
    "canceled",
    "complete_in_progress",
    "completed",
    "incomplete",
    "ready_for_complete",
    "requires_escalation",
]);
export type CheckoutStatus = z.infer<typeof CheckoutStatusSchema>;

// Adjustment status.

export const AdjustmentStatusSchema = z.enum([
    "completed",
    "failed",
    "pending",
]);
export type AdjustmentStatus = z.infer<typeof AdjustmentStatusSchema>;

// Delivery method type (shipping, pickup, digital).

export const MethodTypeSchema = z.enum([
    "digital",
    "pickup",
    "shipping",
]);
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

export const TypeElementSchema = z.enum([
    "pickup",
    "shipping",
]);
export type TypeElement = z.infer<typeof TypeElementSchema>;

// The type of card number. Network tokens are preferred with fallback to FPAN. See PCI
// Scope for more details.

export const CardNumberTypeSchema = z.enum([
    "dpan",
    "fpan",
    "network_token",
]);
export type CardNumberType = z.infer<typeof CardNumberTypeSchema>;


export const AlgSchema = z.enum([
    "card",
]);
export type Alg = z.infer<typeof AlgSchema>;


export const MessageErrorTypeSchema = z.enum([
    "error",
]);
export type MessageErrorType = z.infer<typeof MessageErrorTypeSchema>;


export const MessageInfoTypeSchema = z.enum([
    "info",
]);
export type MessageInfoType = z.infer<typeof MessageInfoTypeSchema>;


export const MessageWarningTypeSchema = z.enum([
    "warning",
]);
export type MessageWarningType = z.infer<typeof MessageWarningTypeSchema>;

// Allocation method. 'each' = applied independently per item. 'across' = split
// proportionally by value.

export const MethodSchema = z.enum([
    "across",
    "each",
]);
export type Method = z.infer<typeof MethodSchema>;

export const ProfileSchemaSchema = z.object({
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
export type ProfileSchema = z.infer<typeof ProfileSchemaSchema>;

export const CapabilitySchemaSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "id": z.string().optional(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
    "extends": z.union([z.array(z.string()), z.string()]).optional(),
});
export type CapabilitySchema = z.infer<typeof CapabilitySchemaSchema>;

export const PaymentHandlerSchemaSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "id": z.string(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
});
export type PaymentHandlerSchema = z.infer<typeof PaymentHandlerSchemaSchema>;

export const ServiceConfigSchema = z.object({
    "delegate": z.array(z.string()).optional(),
});
export type ServiceConfig = z.infer<typeof ServiceConfigSchema>;

export const BuyerClassSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
export type BuyerClass = z.infer<typeof BuyerClassSchema>;

export const ContextClassSchema = z.object({
    "address_country": z.string().optional(),
    "address_region": z.string().optional(),
    "intent": z.string().optional(),
    "postal_code": z.string().optional(),
});
export type ContextClass = z.infer<typeof ContextClassSchema>;

export const ItemClassSchema = z.object({
    "id": z.string(),
    "image_url": z.string().optional(),
    "price": z.number(),
    "title": z.string(),
});
export type ItemClass = z.infer<typeof ItemClassSchema>;

export const TotalElementSchema = z.object({
    "amount": z.number(),
    "display_text": z.string().optional(),
    "type": TotalTypeSchema,
});
export type TotalElement = z.infer<typeof TotalElementSchema>;

export const LinkElementSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
export type LinkElement = z.infer<typeof LinkElementSchema>;

export const MessageElementSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema.optional(),
    "type": MessageTypeSchema,
});
export type MessageElement = z.infer<typeof MessageElementSchema>;

export const CapabilityResponseSchemaSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "id": z.string().optional(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
    "extends": z.union([z.array(z.string()), z.string()]).optional(),
});
export type CapabilityResponseSchema = z.infer<typeof CapabilityResponseSchemaSchema>;

export const PaymentHandlerResponseSchemaSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "id": z.string(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
});
export type PaymentHandlerResponseSchema = z.infer<typeof PaymentHandlerResponseSchemaSchema>;

export const ServiceSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "id": z.string().optional(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
    "endpoint": z.string().optional(),
    "transport": TransportSchema,
});
export type Service = z.infer<typeof ServiceSchema>;

export const OrderClassSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
export type OrderClass = z.infer<typeof OrderClassSchema>;

export const BillingAddressClassSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
});
export type BillingAddressClass = z.infer<typeof BillingAddressClassSchema>;

export const CredentialClassSchema = z.object({
    "type": z.string(),
});
export type CredentialClass = z.infer<typeof CredentialClassSchema>;

export const ServiceResponseSchemaConfigSchema = z.object({
    "delegate": z.array(z.string()).optional(),
});
export type ServiceResponseSchemaConfig = z.infer<typeof ServiceResponseSchemaConfigSchema>;

export const AdjustmentLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type AdjustmentLineItem = z.infer<typeof AdjustmentLineItemSchema>;

export const EventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type EventLineItem = z.infer<typeof EventLineItemSchema>;

export const ExpectationLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type ExpectationLineItem = z.infer<typeof ExpectationLineItemSchema>;

export const LineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
export type LineItemQuantity = z.infer<typeof LineItemQuantitySchema>;

export const UcpOrderResponseSchemaSchema = z.object({
    "capabilities": z.record(z.string(), z.array(CapabilityResponseSchemaSchema)).optional(),
    "payment_handlers": z.record(z.string(), z.array(PaymentHandlerResponseSchemaSchema)).optional(),
    "services": z.record(z.string(), z.array(ServiceSchema)).optional(),
    "version": z.string(),
});
export type UcpOrderResponseSchema = z.infer<typeof UcpOrderResponseSchemaSchema>;

export const PaymentAccountInfoSchema = z.object({
    "payment_account_reference": z.string().optional(),
});
export type PaymentAccountInfo = z.infer<typeof PaymentAccountInfoSchema>;

export const AdjustmentLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type AdjustmentLineItemClass = z.infer<typeof AdjustmentLineItemClassSchema>;

export const IdentityClassSchema = z.object({
    "access_token": z.string(),
});
export type IdentityClass = z.infer<typeof IdentityClassSchema>;

export const BusinessFulfillmentConfigAllowsMultiDestinationSchema = z.object({
    "pickup": z.boolean().optional(),
    "shipping": z.boolean().optional(),
});
export type BusinessFulfillmentConfigAllowsMultiDestination = z.infer<typeof BusinessFulfillmentConfigAllowsMultiDestinationSchema>;

export const BuyerSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
export type Buyer = z.infer<typeof BuyerSchema>;

export const CardCredentialSchema = z.object({
    "type": AlgSchema,
    "card_number_type": CardNumberTypeSchema,
    "cryptogram": z.string().optional(),
    "cvc": z.string().optional(),
    "eci_value": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "name": z.string().optional(),
    "number": z.string().optional(),
});
export type CardCredential = z.infer<typeof CardCredentialSchema>;

export const DisplaySchema = z.object({
    "brand": z.string().optional(),
    "card_art": z.string().optional(),
    "description": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "last_digits": z.string().optional(),
});
export type Display = z.infer<typeof DisplaySchema>;

export const ContextSchema = z.object({
    "address_country": z.string().optional(),
    "address_region": z.string().optional(),
    "intent": z.string().optional(),
    "postal_code": z.string().optional(),
});
export type Context = z.infer<typeof ContextSchema>;

export const ExpectationLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type ExpectationLineItemClass = z.infer<typeof ExpectationLineItemClassSchema>;

export const PurpleFulfillmentAvailableMethodSchema = z.object({
    "description": z.string().optional(),
    "fulfillable_on": z.union([z.null(), z.string()]).optional(),
    "line_item_ids": z.array(z.string()),
    "type": TypeElementSchema,
});
export type PurpleFulfillmentAvailableMethod = z.infer<typeof PurpleFulfillmentAvailableMethodSchema>;

export const FulfillmentDestinationSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string(),
    "address": BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
export type FulfillmentDestination = z.infer<typeof FulfillmentDestinationSchema>;

export const FulfillmentEventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
export type FulfillmentEventLineItem = z.infer<typeof FulfillmentEventLineItemSchema>;

export const OptionElementSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "earliest_fulfillment_time": z.coerce.date().optional(),
    "id": z.string(),
    "latest_fulfillment_time": z.coerce.date().optional(),
    "title": z.string(),
    "totals": z.array(TotalElementSchema),
});
export type OptionElement = z.infer<typeof OptionElementSchema>;

export const AvailableMethodElementSchema = z.object({
    "description": z.string().optional(),
    "fulfillable_on": z.union([z.null(), z.string()]).optional(),
    "line_item_ids": z.array(z.string()),
    "type": TypeElementSchema,
});
export type AvailableMethodElement = z.infer<typeof AvailableMethodElementSchema>;

export const FulfillmentDestinationElementSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string(),
    "address": BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
export type FulfillmentDestinationElement = z.infer<typeof FulfillmentDestinationElementSchema>;

export const GroupElementSchema = z.object({
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "options": z.array(OptionElementSchema).optional(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export type GroupElement = z.infer<typeof GroupElementSchema>;

export const PurpleFulfillmentMethodSchema = z.object({
    "destinations": z.array(FulfillmentDestinationElementSchema).optional(),
    "groups": z.array(GroupElementSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": TypeElementSchema,
});
export type PurpleFulfillmentMethod = z.infer<typeof PurpleFulfillmentMethodSchema>;

export const PurpleFulfillmentOptionSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "earliest_fulfillment_time": z.coerce.date().optional(),
    "id": z.string(),
    "latest_fulfillment_time": z.coerce.date().optional(),
    "title": z.string(),
    "totals": z.array(TotalElementSchema),
});
export type PurpleFulfillmentOption = z.infer<typeof PurpleFulfillmentOptionSchema>;

export const ItemSchema = z.object({
    "id": z.string(),
    "image_url": z.string().optional(),
    "price": z.number(),
    "title": z.string(),
});
export type Item = z.infer<typeof ItemSchema>;

export const LineItemSchema = z.object({
    "id": z.string(),
    "item": ItemClassSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
    "totals": z.array(TotalElementSchema),
});
export type LineItem = z.infer<typeof LineItemSchema>;

export const LinkSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
export type Link = z.infer<typeof LinkSchema>;

export const MerchantFulfillmentConfigAllowsMultiDestinationSchema = z.object({
    "pickup": z.boolean().optional(),
    "shipping": z.boolean().optional(),
});
export type MerchantFulfillmentConfigAllowsMultiDestination = z.infer<typeof MerchantFulfillmentConfigAllowsMultiDestinationSchema>;

export const MessageErrorSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema,
    "type": MessageErrorTypeSchema,
});
export type MessageError = z.infer<typeof MessageErrorSchema>;

export const MessageInfoSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": MessageInfoTypeSchema,
});
export type MessageInfo = z.infer<typeof MessageInfoSchema>;

export const MessageSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": SeveritySchema.optional(),
    "type": MessageTypeSchema,
});
export type Message = z.infer<typeof MessageSchema>;

export const MessageWarningSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": MessageWarningTypeSchema,
});
export type MessageWarning = z.infer<typeof MessageWarningSchema>;

export const OrderConfirmationSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

export const OrderLineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
export type OrderLineItemQuantity = z.infer<typeof OrderLineItemQuantitySchema>;

export const PaymentCredentialSchema = z.object({
    "type": z.string(),
});
export type PaymentCredential = z.infer<typeof PaymentCredentialSchema>;

export const PaymentIdentitySchema = z.object({
    "access_token": z.string(),
});
export type PaymentIdentity = z.infer<typeof PaymentIdentitySchema>;

export const PaymentInstrumentSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": CredentialClassSchema.optional(),
    "display": z.record(z.string(), z.any()).optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": z.string(),
});
export type PaymentInstrument = z.infer<typeof PaymentInstrumentSchema>;

export const PlatformFulfillmentConfigSchema = z.object({
    "supports_multi_group": z.boolean().optional(),
});
export type PlatformFulfillmentConfig = z.infer<typeof PlatformFulfillmentConfigSchema>;

export const PostalAddressSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
});
export type PostalAddress = z.infer<typeof PostalAddressSchema>;

export const RetailLocationSchema = z.object({
    "address": BillingAddressClassSchema.optional(),
    "id": z.string(),
    "name": z.string(),
});
export type RetailLocation = z.infer<typeof RetailLocationSchema>;

export const ShippingDestinationSchema = z.object({
    "address_country": z.string().optional(),
    "address_locality": z.string().optional(),
    "address_region": z.string().optional(),
    "extended_address": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "postal_code": z.string().optional(),
    "street_address": z.string().optional(),
    "id": z.string(),
});
export type ShippingDestination = z.infer<typeof ShippingDestinationSchema>;

export const TokenCredentialSchema = z.object({
    "type": z.string(),
    "token": z.string(),
});
export type TokenCredential = z.infer<typeof TokenCredentialSchema>;

export const TotalSchema = z.object({
    "amount": z.number(),
    "display_text": z.string().optional(),
    "type": TotalTypeSchema,
});
export type Total = z.infer<typeof TotalSchema>;

export const Ap2WithCheckoutMandateSchema = z.object({
    "checkout_mandate": z.string().optional(),
});
export type Ap2WithCheckoutMandate = z.infer<typeof Ap2WithCheckoutMandateSchema>;

export const Ap2WithMerchantAuthorizationSchema = z.object({
    "merchant_authorization": z.string().optional(),
});
export type Ap2WithMerchantAuthorization = z.infer<typeof Ap2WithMerchantAuthorizationSchema>;

export const ConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
export type Consent = z.infer<typeof ConsentSchema>;

export const AllocationSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
export type Allocation = z.infer<typeof AllocationSchema>;

export const ServiceSchemaSchema = z.object({
    "config": ServiceConfigSchema.optional(),
    "id": z.string().optional(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
    "endpoint": z.string().optional(),
    "transport": TransportSchema,
});
export type ServiceSchema = z.infer<typeof ServiceSchemaSchema>;

export const CartLineItemSchema = z.object({
    "id": z.string(),
    "item": ItemClassSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
    "totals": z.array(TotalElementSchema),
});
export type CartLineItem = z.infer<typeof CartLineItemSchema>;

export const UcpCartResponseSchemaSchema = z.object({
    "capabilities": z.record(z.string(), z.array(CapabilityResponseSchemaSchema)).optional(),
    "payment_handlers": z.record(z.string(), z.array(PaymentHandlerResponseSchemaSchema)).optional(),
    "services": z.record(z.string(), z.array(ServiceSchema)).optional(),
    "version": z.string(),
});
export type UcpCartResponseSchema = z.infer<typeof UcpCartResponseSchemaSchema>;

export const SelectedPaymentInstrumentSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": CredentialClassSchema.optional(),
    "display": z.record(z.string(), z.any()).optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": z.string(),
    "selected": z.boolean().optional(),
});
export type SelectedPaymentInstrument = z.infer<typeof SelectedPaymentInstrumentSchema>;

export const ServiceResponseSchemaSchema = z.object({
    "config": ServiceResponseSchemaConfigSchema.optional(),
    "id": z.string().optional(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
    "endpoint": z.string().optional(),
    "transport": TransportSchema,
});
export type ServiceResponseSchema = z.infer<typeof ServiceResponseSchemaSchema>;

export const AdjustmentElementSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(AdjustmentLineItemSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": AdjustmentStatusSchema,
    "type": z.string(),
});
export type AdjustmentElement = z.infer<typeof AdjustmentElementSchema>;

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
export type EventElement = z.infer<typeof EventElementSchema>;

export const ExpectationElementSchema = z.object({
    "description": z.string().optional(),
    "destination": BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(ExpectationLineItemSchema),
    "method_type": MethodTypeSchema,
});
export type ExpectationElement = z.infer<typeof ExpectationElementSchema>;

export const LineItemElementSchema = z.object({
    "id": z.string(),
    "item": ItemClassSchema,
    "parent_id": z.string().optional(),
    "quantity": LineItemQuantitySchema,
    "status": LineItemStatusSchema,
    "totals": z.array(TotalElementSchema),
});
export type LineItemElement = z.infer<typeof LineItemElementSchema>;

export const PaymentSchema = z.object({
    "instruments": z.array(SelectedPaymentInstrumentSchema).optional(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const AdjustmentSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(AdjustmentLineItemClassSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": AdjustmentStatusSchema,
    "type": z.string(),
});
export type Adjustment = z.infer<typeof AdjustmentSchema>;

export const BindingSchema = z.object({
    "checkout_id": z.string(),
    "identity": IdentityClassSchema.optional(),
});
export type Binding = z.infer<typeof BindingSchema>;

export const BusinessFulfillmentConfigSchema = z.object({
    "allows_method_combinations": z.array(z.array(TypeElementSchema)).optional(),
    "allows_multi_destination": BusinessFulfillmentConfigAllowsMultiDestinationSchema.optional(),
});
export type BusinessFulfillmentConfig = z.infer<typeof BusinessFulfillmentConfigSchema>;

export const CardPaymentInstrumentSchema = z.object({
    "billing_address": BillingAddressClassSchema.optional(),
    "credential": CredentialClassSchema.optional(),
    "display": DisplaySchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": AlgSchema,
});
export type CardPaymentInstrument = z.infer<typeof CardPaymentInstrumentSchema>;

export const ExpectationSchema = z.object({
    "description": z.string().optional(),
    "destination": BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(ExpectationLineItemClassSchema),
    "method_type": MethodTypeSchema,
});
export type Expectation = z.infer<typeof ExpectationSchema>;

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
export type FulfillmentEvent = z.infer<typeof FulfillmentEventSchema>;

export const PurpleFulfillmentGroupSchema = z.object({
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "options": z.array(OptionElementSchema).optional(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
export type PurpleFulfillmentGroup = z.infer<typeof PurpleFulfillmentGroupSchema>;

export const MethodElementSchema = z.object({
    "destinations": z.array(FulfillmentDestinationElementSchema).optional(),
    "groups": z.array(GroupElementSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": TypeElementSchema,
});
export type MethodElement = z.infer<typeof MethodElementSchema>;

export const MerchantFulfillmentConfigSchema = z.object({
    "allows_method_combinations": z.array(z.array(TypeElementSchema)).optional(),
    "allows_multi_destination": MerchantFulfillmentConfigAllowsMultiDestinationSchema.optional(),
});
export type MerchantFulfillmentConfig = z.infer<typeof MerchantFulfillmentConfigSchema>;

export const OrderLineItemSchema = z.object({
    "id": z.string(),
    "item": ItemClassSchema,
    "parent_id": z.string().optional(),
    "quantity": OrderLineItemQuantitySchema,
    "status": LineItemStatusSchema,
    "totals": z.array(TotalElementSchema),
});
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const BuyerWithConsentSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": ConsentSchema.optional(),
});
export type BuyerWithConsent = z.infer<typeof BuyerWithConsentSchema>;

export const AppliedDiscountSchema = z.object({
    "allocations": z.array(AllocationSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
export type AppliedDiscount = z.infer<typeof AppliedDiscountSchema>;

export const UcpSchemaSchema = z.object({
    "capabilities": z.record(z.string(), z.array(CapabilitySchemaSchema)).optional(),
    "payment_handlers": z.record(z.string(), z.array(PaymentHandlerSchemaSchema)),
    "services": z.record(z.string(), z.array(ServiceSchemaSchema)),
    "version": z.string(),
});
export type UcpSchema = z.infer<typeof UcpSchemaSchema>;

export const CartSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "context": ContextClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(CartLineItemSchema),
    "links": z.array(LinkElementSchema).optional(),
    "messages": z.array(MessageElementSchema).optional(),
    "totals": z.array(TotalElementSchema),
    "ucp": UcpCartResponseSchemaSchema,
});
export type Cart = z.infer<typeof CartSchema>;

export const PaymentClassSchema = z.object({
    "instruments": z.array(SelectedPaymentInstrumentSchema).optional(),
});
export type PaymentClass = z.infer<typeof PaymentClassSchema>;

export const UcpCheckoutResponseSchemaSchema = z.object({
    "capabilities": z.record(z.string(), z.array(CapabilityResponseSchemaSchema)).optional(),
    "payment_handlers": z.record(z.string(), z.array(PaymentHandlerResponseSchemaSchema)),
    "services": z.record(z.string(), z.array(ServiceResponseSchemaSchema)).optional(),
    "version": z.string(),
});
export type UcpCheckoutResponseSchema = z.infer<typeof UcpCheckoutResponseSchemaSchema>;

export const FulfillmentClassSchema = z.object({
    "events": z.array(EventElementSchema).optional(),
    "expectations": z.array(ExpectationElementSchema).optional(),
});
export type FulfillmentClass = z.infer<typeof FulfillmentClassSchema>;

export const PurpleFulfillmentSchema = z.object({
    "available_methods": z.array(AvailableMethodElementSchema).optional(),
    "methods": z.array(MethodElementSchema).optional(),
});
export type PurpleFulfillment = z.infer<typeof PurpleFulfillmentSchema>;

export const DiscountsObjectSchema = z.object({
    "applied": z.array(AppliedDiscountSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
export type DiscountsObject = z.infer<typeof DiscountsObjectSchema>;

export const UcpDiscoveryProfileSchema = z.object({
    "signing_keys": z.array(ProfileSchemaSchema).optional(),
    "ucp": UcpSchemaSchema,
});
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;

export const CheckoutSchema = z.object({
    "buyer": BuyerClassSchema.optional(),
    "context": ContextClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(CartLineItemSchema),
    "links": z.array(LinkElementSchema),
    "messages": z.array(MessageElementSchema).optional(),
    "order": OrderClassSchema.optional(),
    "payment": PaymentClassSchema.optional(),
    "status": CheckoutStatusSchema,
    "totals": z.array(TotalElementSchema),
    "ucp": UcpCheckoutResponseSchemaSchema,
});
export type Checkout = z.infer<typeof CheckoutSchema>;

export const OrderSchema = z.object({
    "adjustments": z.array(AdjustmentElementSchema).optional(),
    "checkout_id": z.string(),
    "fulfillment": FulfillmentClassSchema,
    "id": z.string(),
    "line_items": z.array(LineItemElementSchema),
    "permalink_url": z.string(),
    "totals": z.array(TotalElementSchema),
    "ucp": UcpOrderResponseSchemaSchema,
});
export type Order = z.infer<typeof OrderSchema>;
