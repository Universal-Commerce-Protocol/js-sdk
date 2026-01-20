import { z } from "zod";

import {
  CheckoutCreateRequestSchema,
  CheckoutResponseSchema,
  CheckoutUpdateRequestSchema,
  CheckoutWithBuyerConsentCreateRequestSchema,
  CheckoutWithBuyerConsentResponseSchema,
  CheckoutWithBuyerConsentUpdateRequestSchema,
  CheckoutWithDiscountCreateRequestSchema,
  CheckoutWithDiscountResponseSchema,
  CheckoutWithDiscountUpdateRequestSchema,
  CheckoutWithFulfillmentCreateRequestSchema,
  CheckoutWithFulfillmentResponseSchema,
  CheckoutWithFulfillmentUpdateRequestSchema,
  OrderSchema,
  PaymentCredentialSchema,
  BuyerSchema,
} from "./spec_generated";

export const ExtendedPaymentCredentialSchema = PaymentCredentialSchema.extend({
  token: z.string().optional(),
});
export type ExtendedPaymentCredential = z.infer<
  typeof ExtendedPaymentCredentialSchema
>;

// [SECURITY] Safe version of PaymentCredential that masks sensitive fields
export const SafePaymentCredentialSchema = PaymentCredentialSchema.transform((data) => ({
  ...data,
  number: data.number ? `****${data.number.slice(-4)}` : undefined,
  cvc: data.cvc ? "***" : undefined,
}));

// [SECURITY] Safe version of Buyer that masks PII
export const SafeBuyerSchema = BuyerSchema.transform((data) => ({
  ...data,
  email: data.email ? `${data.email.charAt(0)}***@${data.email.split("@")[1]}` : undefined,
  phone_number: data.phone_number ? `******${data.phone_number.slice(-4)}` : undefined,
  full_name: data.full_name ? "***" : undefined,
  first_name: data.first_name ? "***" : undefined,
  last_name: data.last_name ? "***" : undefined,
}));

export const PlatformConfigSchema = z.object({
  webhook_url: z.string().url().optional(),
});
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

export const ExtendedCheckoutResponseSchema = CheckoutResponseSchema.extend(
  CheckoutWithFulfillmentResponseSchema.pick({ fulfillment: true }).shape
)
  .extend(CheckoutWithDiscountResponseSchema.pick({ discounts: true }).shape)
  .extend(CheckoutWithBuyerConsentResponseSchema.pick({ buyer: true }).shape)
  .extend({
    order_id: z.string().optional(),
    order_permalink_url: z.string().optional(),
    platform: PlatformConfigSchema.optional(),
  });
export type ExtendedCheckoutResponse = z.infer<
  typeof ExtendedCheckoutResponseSchema
>;

export const ExtendedCheckoutCreateRequestSchema =
  CheckoutCreateRequestSchema.extend(
    CheckoutWithFulfillmentCreateRequestSchema.pick({ fulfillment: true }).shape
  )
    .extend(
      CheckoutWithDiscountCreateRequestSchema.pick({ discounts: true }).shape
    )
    .extend(
      CheckoutWithBuyerConsentCreateRequestSchema.pick({ buyer: true }).shape
    );
export type ExtendedCheckoutCreateRequest = z.infer<
  typeof ExtendedCheckoutCreateRequestSchema
>;

export const ExtendedCheckoutUpdateRequestSchema =
  CheckoutUpdateRequestSchema.extend(
    CheckoutWithFulfillmentUpdateRequestSchema.pick({ fulfillment: true }).shape
  )
    .extend(
      CheckoutWithDiscountUpdateRequestSchema.pick({ discounts: true }).shape
    )
    .extend(
      CheckoutWithBuyerConsentUpdateRequestSchema.pick({ buyer: true }).shape
    );
export type ExtendedCheckoutUpdateRequest = z.infer<
  typeof ExtendedCheckoutUpdateRequestSchema
>;

export const OrderUpdateSchema = OrderSchema;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
