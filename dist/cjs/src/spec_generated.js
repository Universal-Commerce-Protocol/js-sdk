"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FulfillmentGroupUpdateRequestSchema = exports.FulfillmentGroupCreateRequestSchema = exports.FulfillmentEventLineItemSchema = exports.FulfillmentDestinationRequestSchema = exports.ExpectationLineItemClassSchema = exports.CardPaymentInstrumentSchema = exports.CardCredentialSchema = exports.BuyerSchema = exports.IdentityClassSchema = exports.AdjustmentLineItemClassSchema = exports.PaymentAccountInfoSchema = exports.UcpOrderResponseSchema = exports.LineItemQuantitySchema = exports.ExpectationLineItemSchema = exports.EventLineItemSchema = exports.AdjustmentLineItemSchema = exports.LineItemItemSchema = exports.ItemClassSchema = exports.CapabilityResponseSchema = exports.PaymentCredentialSchema = exports.BillingAddressClassSchema = exports.OrderClassSchema = exports.MessageElementSchema = exports.LinkElementSchema = exports.TotalResponseSchema = exports.ItemResponseSchema = exports.BuyerClassSchema = exports.RestSchema = exports.McpSchema = exports.EmbeddedSchema = exports.A2ASchema = exports.CapabilityDiscoverySchema = exports.SigningKeySchema = exports.PaymentHandlerResponseSchema = exports.MethodSchema = exports.MessageWarningTypeSchema = exports.MessageInfoTypeSchema = exports.MessageErrorTypeSchema = exports.TypeElementSchema = exports.LineItemStatusSchema = exports.MethodTypeSchema = exports.AdjustmentStatusSchema = exports.CheckoutResponseStatusSchema = exports.CardPaymentInstrumentTypeSchema = exports.CardNumberTypeSchema = exports.MessageTypeSchema = exports.SeveritySchema = exports.ContentTypeSchema = exports.TotalResponseTypeSchema = exports.UseSchema = void 0;
exports.ExpectationElementSchema = exports.EventElementSchema = exports.AdjustmentElementSchema = exports.CheckoutUpdateRequestPaymentSchema = exports.LineItemClassSchema = exports.PaymentClassSchema = exports.LineItemElementSchema = exports.UcpCheckoutResponseSchema = exports.PaymentInstrumentSchema = exports.LineItemResponseSchema = exports.UcpServiceSchema = exports.PaymentSchema = exports.FulfillmentOptionResponseSchema = exports.FulfillmentDestinationResponseSchema = exports.FulfillmentAvailableMethodResponseSchema = exports.MethodElementSchema = exports.AppliedAllocationSchema = exports.AllocationClassSchema = exports.AllocationElementSchema = exports.TentacledConsentSchema = exports.FluffyConsentSchema = exports.PurpleConsentSchema = exports.Ap2CheckoutResponseObjectSchema = exports.Ap2CompleteRequestObjectSchema = exports.TokenCredentialUpdateRequestSchema = exports.TokenCredentialCreateRequestSchema = exports.TokenCredentialResponseSchema = exports.ShippingDestinationResponseSchema = exports.ShippingDestinationRequestSchema = exports.RetailLocationResponseSchema = exports.RetailLocationRequestSchema = exports.PostalAddressSchema = exports.PlatformFulfillmentConfigSchema = exports.PaymentInstrumentBaseSchema = exports.PaymentIdentitySchema = exports.OrderLineItemQuantitySchema = exports.OrderConfirmationSchema = exports.MessageSchema = exports.MessageWarningSchema = exports.MessageInfoSchema = exports.MessageErrorSchema = exports.AllowsMultiDestinationSchema = exports.LinkSchema = exports.LineItemUpdateRequestSchema = exports.LineItemCreateRequestSchema = exports.ItemUpdateRequestSchema = exports.ItemCreateRequestSchema = exports.GroupClassSchema = exports.GroupElementSchema = exports.FulfillmentDestinationRequestElementSchema = void 0;
exports.CheckoutWithFulfillmentResponseSchema = exports.FulfillmentResponseSchema = exports.CheckoutWithDiscountResponseSchema = exports.CheckoutWithDiscountUpdateRequestSchema = exports.CheckoutWithDiscountCreateRequestSchema = exports.OrderSchema = exports.CheckoutResponseSchema = exports.UcpDiscoveryProfileSchema = exports.FulfillmentMethodResponseSchema = exports.CheckoutWithFulfillmentCreateRequestSchema = exports.CheckoutWithDiscountResponseDiscountsSchema = exports.CheckoutWithDiscountUpdateRequestDiscountsSchema = exports.CheckoutWithDiscountCreateRequestDiscountsSchema = exports.CheckoutWithBuyerConsentResponseSchema = exports.CheckoutWithBuyerConsentUpdateRequestSchema = exports.CheckoutWithBuyerConsentCreateRequestSchema = exports.CheckoutWithAp2MandateSchema = exports.FulfillmentSchema = exports.CheckoutUpdateRequestSchema = exports.CheckoutCreateRequestSchema = exports.PaymentResponseSchema = exports.UcpClassSchema = exports.FulfillmentGroupResponseSchema = exports.CheckoutWithFulfillmentUpdateRequestSchema = exports.FulfillmentRequestSchema = exports.DiscountsAppliedSchema = exports.AppliedClassSchema = exports.AppliedElementSchema = exports.BuyerWithConsentResponseSchema = exports.BuyerWithConsentUpdateRequestSchema = exports.BuyerWithConsentCreateRequestSchema = exports.CompleteCheckoutRequestWithAp2Schema = exports.OrderLineItemSchema = exports.MerchantFulfillmentConfigSchema = exports.FulfillmentMethodUpdateRequestSchema = exports.FulfillmentMethodCreateRequestSchema = exports.FulfillmentEventSchema = exports.ExpectationSchema = exports.BindingSchema = exports.AdjustmentSchema = exports.PaymentUpdateRequestSchema = exports.PaymentCreateRequestSchema = exports.PaymentDataSchema = exports.OrderLineItemClassSchema = void 0;
const z = __importStar(require("zod"));
// Key usage. Should be 'sig' for signing keys.
exports.UseSchema = z.enum([
    "enc",
    "sig",
]);
// Type of total categorization.
exports.TotalResponseTypeSchema = z.enum([
    "discount",
    "fee",
    "fulfillment",
    "items_discount",
    "subtotal",
    "tax",
    "total",
]);
// Content format, default = plain.
exports.ContentTypeSchema = z.enum([
    "markdown",
    "plain",
]);
// Declares who resolves this error. 'recoverable': agent can fix via API.
// 'requires_buyer_input': merchant requires information their API doesn't support
// collecting programmatically (checkout incomplete). 'requires_buyer_review': buyer must
// authorize before order placement due to policy, regulatory, or entitlement rules
// (checkout complete). Errors with 'requires_*' severity contribute to 'status:
// requires_escalation'.
exports.SeveritySchema = z.enum([
    "recoverable",
    "requires_buyer_input",
    "requires_buyer_review",
]);
exports.MessageTypeSchema = z.enum([
    "error",
    "info",
    "warning",
]);
// The type of card number. Network tokens are preferred with fallback to FPAN. See PCI
// Scope for more details.
exports.CardNumberTypeSchema = z.enum([
    "dpan",
    "fpan",
    "network_token",
]);
// A URI pointing to a schema definition (e.g., JSON Schema) used to validate the structure
// of the instrument object.
exports.CardPaymentInstrumentTypeSchema = z.enum([
    "card",
]);
// Checkout state indicating the current phase and required action. See Checkout Status
// lifecycle documentation for state transition details.
exports.CheckoutResponseStatusSchema = z.enum([
    "canceled",
    "complete_in_progress",
    "completed",
    "incomplete",
    "ready_for_complete",
    "requires_escalation",
]);
// Adjustment status.
exports.AdjustmentStatusSchema = z.enum([
    "completed",
    "failed",
    "pending",
]);
// Delivery method type (shipping, pickup, digital).
exports.MethodTypeSchema = z.enum([
    "digital",
    "pickup",
    "shipping",
]);
// Derived status: fulfilled if quantity.fulfilled == quantity.total, partial if
// quantity.fulfilled > 0, otherwise processing.
exports.LineItemStatusSchema = z.enum([
    "fulfilled",
    "partial",
    "processing",
]);
// Fulfillment method type this availability applies to.
//
// Fulfillment method type.
exports.TypeElementSchema = z.enum([
    "pickup",
    "shipping",
]);
exports.MessageErrorTypeSchema = z.enum([
    "error",
]);
exports.MessageInfoTypeSchema = z.enum([
    "info",
]);
exports.MessageWarningTypeSchema = z.enum([
    "warning",
]);
// Allocation method. 'each' = applied independently per item. 'across' = split
// proportionally by value.
exports.MethodSchema = z.enum([
    "across",
    "each",
]);
exports.PaymentHandlerResponseSchema = z.object({
    "config": z.record(z.string(), z.any()),
    "config_schema": z.string(),
    "id": z.string(),
    "instrument_schemas": z.array(z.string()),
    "name": z.string(),
    "spec": z.string(),
    "version": z.string(),
});
exports.SigningKeySchema = z.object({
    "alg": z.string().optional(),
    "crv": z.string().optional(),
    "e": z.string().optional(),
    "kid": z.string(),
    "kty": z.string(),
    "n": z.string().optional(),
    "use": exports.UseSchema.optional(),
    "x": z.string().optional(),
    "y": z.string().optional(),
});
exports.CapabilityDiscoverySchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "extends": z.string().optional(),
    "name": z.string(),
    "schema": z.string(),
    "spec": z.string(),
    "version": z.string(),
});
exports.A2ASchema = z.object({
    "endpoint": z.string(),
});
exports.EmbeddedSchema = z.object({
    "schema": z.string(),
});
exports.McpSchema = z.object({
    "endpoint": z.string(),
    "schema": z.string(),
});
exports.RestSchema = z.object({
    "endpoint": z.string(),
    "schema": z.string(),
});
exports.BuyerClassSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
exports.ItemResponseSchema = z.object({
    "id": z.string(),
    "image_url": z.string().optional(),
    "price": z.number(),
    "title": z.string(),
});
exports.TotalResponseSchema = z.object({
    "amount": z.number(),
    "display_text": z.string().optional(),
    "type": exports.TotalResponseTypeSchema,
});
exports.LinkElementSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
exports.MessageElementSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": exports.ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": exports.SeveritySchema.optional(),
    "type": exports.MessageTypeSchema,
});
exports.OrderClassSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
exports.BillingAddressClassSchema = z.object({
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
exports.PaymentCredentialSchema = z.object({
    "type": z.string(),
    "card_number_type": exports.CardNumberTypeSchema.optional(),
    "cryptogram": z.string().optional(),
    "cvc": z.string().optional(),
    "eci_value": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "name": z.string().optional(),
    "number": z.string().optional(),
});
exports.CapabilityResponseSchema = z.object({
    "config": z.record(z.string(), z.any()).optional(),
    "extends": z.string().optional(),
    "name": z.string(),
    "schema": z.string().optional(),
    "spec": z.string().optional(),
    "version": z.string(),
});
exports.ItemClassSchema = z.object({
    "id": z.string(),
});
exports.LineItemItemSchema = z.object({
    "id": z.string(),
});
exports.AdjustmentLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.EventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.ExpectationLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.LineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
exports.UcpOrderResponseSchema = z.object({
    "capabilities": z.array(exports.CapabilityResponseSchema),
    "version": z.string(),
});
exports.PaymentAccountInfoSchema = z.object({
    "payment_account_reference": z.string().optional(),
});
exports.AdjustmentLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.IdentityClassSchema = z.object({
    "access_token": z.string(),
});
exports.BuyerSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
});
exports.CardCredentialSchema = z.object({
    "card_number_type": exports.CardNumberTypeSchema,
    "cryptogram": z.string().optional(),
    "cvc": z.string().optional(),
    "eci_value": z.string().optional(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "name": z.string().optional(),
    "number": z.string().optional(),
    "type": exports.CardPaymentInstrumentTypeSchema,
});
exports.CardPaymentInstrumentSchema = z.object({
    "billing_address": exports.BillingAddressClassSchema.optional(),
    "credential": exports.PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": exports.CardPaymentInstrumentTypeSchema,
    "brand": z.string(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "last_digits": z.string(),
    "rich_card_art": z.string().optional(),
    "rich_text_description": z.string().optional(),
});
exports.ExpectationLineItemClassSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.FulfillmentDestinationRequestSchema = z.object({
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
    "address": exports.BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
exports.FulfillmentEventLineItemSchema = z.object({
    "id": z.string(),
    "quantity": z.number(),
});
exports.FulfillmentGroupCreateRequestSchema = z.object({
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
exports.FulfillmentGroupUpdateRequestSchema = z.object({
    "id": z.string(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
exports.FulfillmentDestinationRequestElementSchema = z.object({
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
    "address": exports.BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
exports.GroupElementSchema = z.object({
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
exports.GroupClassSchema = z.object({
    "id": z.string(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
exports.ItemCreateRequestSchema = z.object({
    "id": z.string(),
});
exports.ItemUpdateRequestSchema = z.object({
    "id": z.string(),
});
exports.LineItemCreateRequestSchema = z.object({
    "item": exports.ItemClassSchema,
    "quantity": z.number(),
});
exports.LineItemUpdateRequestSchema = z.object({
    "id": z.string().optional(),
    "item": exports.LineItemItemSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
});
exports.LinkSchema = z.object({
    "title": z.string().optional(),
    "type": z.string(),
    "url": z.string(),
});
exports.AllowsMultiDestinationSchema = z.object({
    "pickup": z.boolean().optional(),
    "shipping": z.boolean().optional(),
});
exports.MessageErrorSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": exports.ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": exports.SeveritySchema,
    "type": exports.MessageErrorTypeSchema,
});
exports.MessageInfoSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": exports.ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": exports.MessageInfoTypeSchema,
});
exports.MessageWarningSchema = z.object({
    "code": z.string(),
    "content": z.string(),
    "content_type": exports.ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "type": exports.MessageWarningTypeSchema,
});
exports.MessageSchema = z.object({
    "code": z.string().optional(),
    "content": z.string(),
    "content_type": exports.ContentTypeSchema.optional(),
    "path": z.string().optional(),
    "severity": exports.SeveritySchema.optional(),
    "type": exports.MessageTypeSchema,
});
exports.OrderConfirmationSchema = z.object({
    "id": z.string(),
    "permalink_url": z.string(),
});
exports.OrderLineItemQuantitySchema = z.object({
    "fulfilled": z.number(),
    "total": z.number(),
});
exports.PaymentIdentitySchema = z.object({
    "access_token": z.string(),
});
exports.PaymentInstrumentBaseSchema = z.object({
    "billing_address": exports.BillingAddressClassSchema.optional(),
    "credential": exports.PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": z.string(),
});
exports.PlatformFulfillmentConfigSchema = z.object({
    "supports_multi_group": z.boolean().optional(),
});
exports.PostalAddressSchema = z.object({
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
exports.RetailLocationRequestSchema = z.object({
    "address": exports.BillingAddressClassSchema.optional(),
    "name": z.string(),
});
exports.RetailLocationResponseSchema = z.object({
    "address": exports.BillingAddressClassSchema.optional(),
    "id": z.string(),
    "name": z.string(),
});
exports.ShippingDestinationRequestSchema = z.object({
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
exports.ShippingDestinationResponseSchema = z.object({
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
exports.TokenCredentialResponseSchema = z.object({
    "type": z.string(),
});
exports.TokenCredentialCreateRequestSchema = z.object({
    "token": z.string(),
    "type": z.string(),
});
exports.TokenCredentialUpdateRequestSchema = z.object({
    "token": z.string(),
    "type": z.string(),
});
exports.Ap2CompleteRequestObjectSchema = z.object({
    "checkout_mandate": z.string(),
});
exports.Ap2CheckoutResponseObjectSchema = z.object({
    "merchant_authorization": z.string(),
});
exports.PurpleConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
exports.FluffyConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
exports.TentacledConsentSchema = z.object({
    "analytics": z.boolean().optional(),
    "marketing": z.boolean().optional(),
    "preferences": z.boolean().optional(),
    "sale_of_data": z.boolean().optional(),
});
exports.AllocationElementSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
exports.AllocationClassSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
exports.AppliedAllocationSchema = z.object({
    "amount": z.number(),
    "path": z.string(),
});
exports.MethodElementSchema = z.object({
    "destinations": z.array(exports.FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(exports.GroupElementSchema).optional(),
    "line_item_ids": z.array(z.string()).optional(),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": exports.TypeElementSchema,
});
exports.FulfillmentAvailableMethodResponseSchema = z.object({
    "description": z.string().optional(),
    "fulfillable_on": z.union([z.null(), z.string()]).optional(),
    "line_item_ids": z.array(z.string()),
    "type": exports.TypeElementSchema,
});
exports.FulfillmentDestinationResponseSchema = z.object({
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
    "address": exports.BillingAddressClassSchema.optional(),
    "name": z.string().optional(),
});
exports.FulfillmentOptionResponseSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "earliest_fulfillment_time": z.coerce.date().optional(),
    "id": z.string(),
    "latest_fulfillment_time": z.coerce.date().optional(),
    "title": z.string(),
    "totals": z.array(exports.TotalResponseSchema),
});
exports.PaymentSchema = z.object({
    "handlers": z.array(exports.PaymentHandlerResponseSchema).optional(),
});
exports.UcpServiceSchema = z.object({
    "a2a": exports.A2ASchema.optional(),
    "embedded": exports.EmbeddedSchema.optional(),
    "mcp": exports.McpSchema.optional(),
    "rest": exports.RestSchema.optional(),
    "spec": z.string(),
    "version": z.string(),
});
exports.LineItemResponseSchema = z.object({
    "id": z.string(),
    "item": exports.ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
    "totals": z.array(exports.TotalResponseSchema),
});
exports.PaymentInstrumentSchema = z.object({
    "billing_address": exports.BillingAddressClassSchema.optional(),
    "credential": exports.PaymentCredentialSchema.optional(),
    "handler_id": z.string(),
    "id": z.string(),
    "type": exports.CardPaymentInstrumentTypeSchema,
    "brand": z.string(),
    "expiry_month": z.number().optional(),
    "expiry_year": z.number().optional(),
    "last_digits": z.string(),
    "rich_card_art": z.string().optional(),
    "rich_text_description": z.string().optional(),
});
exports.UcpCheckoutResponseSchema = z.object({
    "capabilities": z.array(exports.CapabilityResponseSchema),
    "version": z.string(),
});
exports.LineItemElementSchema = z.object({
    "item": exports.ItemClassSchema,
    "quantity": z.number(),
});
exports.PaymentClassSchema = z.object({
    "instruments": z.array(exports.PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
exports.LineItemClassSchema = z.object({
    "id": z.string().optional(),
    "item": exports.LineItemItemSchema,
    "parent_id": z.string().optional(),
    "quantity": z.number(),
});
exports.CheckoutUpdateRequestPaymentSchema = z.object({
    "instruments": z.array(exports.PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
exports.AdjustmentElementSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.AdjustmentLineItemSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": exports.AdjustmentStatusSchema,
    "type": z.string(),
});
exports.EventElementSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.EventLineItemSchema),
    "occurred_at": z.coerce.date(),
    "tracking_number": z.string().optional(),
    "tracking_url": z.string().optional(),
    "type": z.string(),
});
exports.ExpectationElementSchema = z.object({
    "description": z.string().optional(),
    "destination": exports.BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.ExpectationLineItemSchema),
    "method_type": exports.MethodTypeSchema,
});
exports.OrderLineItemClassSchema = z.object({
    "id": z.string(),
    "item": exports.ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": exports.LineItemQuantitySchema,
    "status": exports.LineItemStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
});
exports.PaymentDataSchema = z.object({
    "payment_data": exports.PaymentInstrumentSchema,
});
exports.PaymentCreateRequestSchema = z.object({
    "instruments": z.array(exports.PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
exports.PaymentUpdateRequestSchema = z.object({
    "instruments": z.array(exports.PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
exports.AdjustmentSchema = z.object({
    "amount": z.number().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.AdjustmentLineItemClassSchema).optional(),
    "occurred_at": z.coerce.date(),
    "status": exports.AdjustmentStatusSchema,
    "type": z.string(),
});
exports.BindingSchema = z.object({
    "checkout_id": z.string(),
    "identity": exports.IdentityClassSchema.optional(),
});
exports.ExpectationSchema = z.object({
    "description": z.string().optional(),
    "destination": exports.BillingAddressClassSchema,
    "fulfillable_on": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.ExpectationLineItemClassSchema),
    "method_type": exports.MethodTypeSchema,
});
exports.FulfillmentEventSchema = z.object({
    "carrier": z.string().optional(),
    "description": z.string().optional(),
    "id": z.string(),
    "line_items": z.array(exports.FulfillmentEventLineItemSchema),
    "occurred_at": z.coerce.date(),
    "tracking_number": z.string().optional(),
    "tracking_url": z.string().optional(),
    "type": z.string(),
});
exports.FulfillmentMethodCreateRequestSchema = z.object({
    "destinations": z.array(exports.FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(exports.GroupElementSchema).optional(),
    "line_item_ids": z.array(z.string()).optional(),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": exports.TypeElementSchema,
});
exports.FulfillmentMethodUpdateRequestSchema = z.object({
    "destinations": z.array(exports.FulfillmentDestinationRequestElementSchema).optional(),
    "groups": z.array(exports.GroupClassSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
});
exports.MerchantFulfillmentConfigSchema = z.object({
    "allows_method_combinations": z.array(z.array(exports.TypeElementSchema)).optional(),
    "allows_multi_destination": exports.AllowsMultiDestinationSchema.optional(),
});
exports.OrderLineItemSchema = z.object({
    "id": z.string(),
    "item": exports.ItemResponseSchema,
    "parent_id": z.string().optional(),
    "quantity": exports.OrderLineItemQuantitySchema,
    "status": exports.LineItemStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
});
exports.CompleteCheckoutRequestWithAp2Schema = z.object({
    "ap2": exports.Ap2CompleteRequestObjectSchema.optional(),
});
exports.BuyerWithConsentCreateRequestSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": exports.PurpleConsentSchema.optional(),
});
exports.BuyerWithConsentUpdateRequestSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": exports.FluffyConsentSchema.optional(),
});
exports.BuyerWithConsentResponseSchema = z.object({
    "email": z.string().optional(),
    "first_name": z.string().optional(),
    "full_name": z.string().optional(),
    "last_name": z.string().optional(),
    "phone_number": z.string().optional(),
    "consent": exports.TentacledConsentSchema.optional(),
});
exports.AppliedElementSchema = z.object({
    "allocations": z.array(exports.AllocationElementSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": exports.MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
exports.AppliedClassSchema = z.object({
    "allocations": z.array(exports.AllocationClassSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": exports.MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
exports.DiscountsAppliedSchema = z.object({
    "allocations": z.array(exports.AppliedAllocationSchema).optional(),
    "amount": z.number(),
    "automatic": z.boolean().optional(),
    "code": z.string().optional(),
    "method": exports.MethodSchema.optional(),
    "priority": z.number().optional(),
    "title": z.string(),
});
exports.FulfillmentRequestSchema = z.object({
    "methods": z.array(exports.MethodElementSchema).optional(),
});
exports.CheckoutWithFulfillmentUpdateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemClassSchema),
    "payment": exports.CheckoutUpdateRequestPaymentSchema,
    "fulfillment": exports.FulfillmentRequestSchema.optional(),
});
exports.FulfillmentGroupResponseSchema = z.object({
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "options": z.array(exports.FulfillmentOptionResponseSchema).optional(),
    "selected_option_id": z.union([z.null(), z.string()]).optional(),
});
exports.UcpClassSchema = z.object({
    "capabilities": z.array(exports.CapabilityDiscoverySchema),
    "services": z.record(z.string(), exports.UcpServiceSchema),
    "version": z.string(),
});
exports.PaymentResponseSchema = z.object({
    "handlers": z.array(exports.PaymentHandlerResponseSchema),
    "instruments": z.array(exports.PaymentInstrumentSchema).optional(),
    "selected_instrument_id": z.string().optional(),
});
exports.CheckoutCreateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(exports.LineItemElementSchema),
    "payment": exports.PaymentClassSchema,
});
exports.CheckoutUpdateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemClassSchema),
    "payment": exports.CheckoutUpdateRequestPaymentSchema,
});
exports.FulfillmentSchema = z.object({
    "events": z.array(exports.EventElementSchema).optional(),
    "expectations": z.array(exports.ExpectationElementSchema).optional(),
});
exports.CheckoutWithAp2MandateSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemResponseSchema),
    "links": z.array(exports.LinkElementSchema),
    "messages": z.array(exports.MessageElementSchema).optional(),
    "order": exports.OrderClassSchema.optional(),
    "payment": exports.PaymentResponseSchema,
    "status": exports.CheckoutResponseStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpCheckoutResponseSchema,
    "ap2": exports.Ap2CheckoutResponseObjectSchema.optional(),
});
exports.CheckoutWithBuyerConsentCreateRequestSchema = z.object({
    "buyer": exports.BuyerWithConsentCreateRequestSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(exports.LineItemElementSchema),
    "payment": exports.PaymentClassSchema,
});
exports.CheckoutWithBuyerConsentUpdateRequestSchema = z.object({
    "buyer": exports.BuyerWithConsentUpdateRequestSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemClassSchema),
    "payment": exports.CheckoutUpdateRequestPaymentSchema,
});
exports.CheckoutWithBuyerConsentResponseSchema = z.object({
    "buyer": exports.BuyerWithConsentResponseSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemResponseSchema),
    "links": z.array(exports.LinkElementSchema),
    "messages": z.array(exports.MessageElementSchema).optional(),
    "order": exports.OrderClassSchema.optional(),
    "payment": exports.PaymentResponseSchema,
    "status": exports.CheckoutResponseStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpCheckoutResponseSchema,
});
exports.CheckoutWithDiscountCreateRequestDiscountsSchema = z.object({
    "applied": z.array(exports.AppliedElementSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
exports.CheckoutWithDiscountUpdateRequestDiscountsSchema = z.object({
    "applied": z.array(exports.AppliedClassSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
exports.CheckoutWithDiscountResponseDiscountsSchema = z.object({
    "applied": z.array(exports.DiscountsAppliedSchema).optional(),
    "codes": z.array(z.string()).optional(),
});
exports.CheckoutWithFulfillmentCreateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(exports.LineItemElementSchema),
    "payment": exports.PaymentClassSchema,
    "fulfillment": exports.FulfillmentRequestSchema.optional(),
});
exports.FulfillmentMethodResponseSchema = z.object({
    "destinations": z.array(exports.FulfillmentDestinationResponseSchema).optional(),
    "groups": z.array(exports.FulfillmentGroupResponseSchema).optional(),
    "id": z.string(),
    "line_item_ids": z.array(z.string()),
    "selected_destination_id": z.union([z.null(), z.string()]).optional(),
    "type": exports.TypeElementSchema,
});
exports.UcpDiscoveryProfileSchema = z.object({
    "payment": exports.PaymentSchema.optional(),
    "signing_keys": z.array(exports.SigningKeySchema).optional(),
    "ucp": exports.UcpClassSchema,
});
exports.CheckoutResponseSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemResponseSchema),
    "links": z.array(exports.LinkElementSchema),
    "messages": z.array(exports.MessageElementSchema).optional(),
    "order": exports.OrderClassSchema.optional(),
    "payment": exports.PaymentResponseSchema,
    "status": exports.CheckoutResponseStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpCheckoutResponseSchema,
});
exports.OrderSchema = z.object({
    "adjustments": z.array(exports.AdjustmentElementSchema).optional(),
    "checkout_id": z.string(),
    "fulfillment": exports.FulfillmentSchema,
    "id": z.string(),
    "line_items": z.array(exports.OrderLineItemClassSchema),
    "permalink_url": z.string(),
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpOrderResponseSchema,
});
exports.CheckoutWithDiscountCreateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "line_items": z.array(exports.LineItemElementSchema),
    "payment": exports.PaymentClassSchema,
    "discounts": exports.CheckoutWithDiscountCreateRequestDiscountsSchema.optional(),
});
exports.CheckoutWithDiscountUpdateRequestSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "currency": z.string(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemClassSchema),
    "payment": exports.CheckoutUpdateRequestPaymentSchema,
    "discounts": exports.CheckoutWithDiscountUpdateRequestDiscountsSchema.optional(),
});
exports.CheckoutWithDiscountResponseSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemResponseSchema),
    "links": z.array(exports.LinkElementSchema),
    "messages": z.array(exports.MessageElementSchema).optional(),
    "order": exports.OrderClassSchema.optional(),
    "payment": exports.PaymentResponseSchema,
    "status": exports.CheckoutResponseStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpCheckoutResponseSchema,
    "discounts": exports.CheckoutWithDiscountResponseDiscountsSchema.optional(),
});
exports.FulfillmentResponseSchema = z.object({
    "available_methods": z.array(exports.FulfillmentAvailableMethodResponseSchema).optional(),
    "methods": z.array(exports.FulfillmentMethodResponseSchema).optional(),
});
exports.CheckoutWithFulfillmentResponseSchema = z.object({
    "buyer": exports.BuyerClassSchema.optional(),
    "continue_url": z.string().optional(),
    "currency": z.string(),
    "expires_at": z.coerce.date().optional(),
    "id": z.string(),
    "line_items": z.array(exports.LineItemResponseSchema),
    "links": z.array(exports.LinkElementSchema),
    "messages": z.array(exports.MessageElementSchema).optional(),
    "order": exports.OrderClassSchema.optional(),
    "payment": exports.PaymentResponseSchema,
    "status": exports.CheckoutResponseStatusSchema,
    "totals": z.array(exports.TotalResponseSchema),
    "ucp": exports.UcpCheckoutResponseSchema,
    "fulfillment": exports.FulfillmentResponseSchema.optional(),
});
