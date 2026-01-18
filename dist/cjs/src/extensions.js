"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUpdateSchema = exports.ExtendedCheckoutUpdateRequestSchema = exports.ExtendedCheckoutCreateRequestSchema = exports.ExtendedCheckoutResponseSchema = exports.PlatformConfigSchema = exports.ExtendedPaymentCredentialSchema = void 0;
const zod_1 = require("zod");
const spec_generated_1 = require("./spec_generated");
exports.ExtendedPaymentCredentialSchema = spec_generated_1.PaymentCredentialSchema.extend({
    token: zod_1.z.string().optional(),
});
exports.PlatformConfigSchema = zod_1.z.object({
    webhook_url: zod_1.z.string().url().optional(),
});
exports.ExtendedCheckoutResponseSchema = spec_generated_1.CheckoutResponseSchema.extend(spec_generated_1.CheckoutWithFulfillmentResponseSchema.pick({ fulfillment: true }).shape)
    .extend(spec_generated_1.CheckoutWithDiscountResponseSchema.pick({ discounts: true }).shape)
    .extend(spec_generated_1.CheckoutWithBuyerConsentResponseSchema.pick({ buyer: true }).shape)
    .extend({
    order_id: zod_1.z.string().optional(),
    order_permalink_url: zod_1.z.string().optional(),
    platform: exports.PlatformConfigSchema.optional(),
});
exports.ExtendedCheckoutCreateRequestSchema = spec_generated_1.CheckoutCreateRequestSchema.extend(spec_generated_1.CheckoutWithFulfillmentCreateRequestSchema.pick({ fulfillment: true }).shape)
    .extend(spec_generated_1.CheckoutWithDiscountCreateRequestSchema.pick({ discounts: true }).shape)
    .extend(spec_generated_1.CheckoutWithBuyerConsentCreateRequestSchema.pick({ buyer: true }).shape);
exports.ExtendedCheckoutUpdateRequestSchema = spec_generated_1.CheckoutUpdateRequestSchema.extend(spec_generated_1.CheckoutWithFulfillmentUpdateRequestSchema.pick({ fulfillment: true }).shape)
    .extend(spec_generated_1.CheckoutWithDiscountUpdateRequestSchema.pick({ discounts: true }).shape)
    .extend(spec_generated_1.CheckoutWithBuyerConsentUpdateRequestSchema.pick({ buyer: true }).shape);
exports.OrderUpdateSchema = spec_generated_1.OrderSchema;
