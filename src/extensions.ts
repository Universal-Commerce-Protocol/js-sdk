import { z } from "zod";

import {
  CheckoutSchema,
  OrderSchema,
  PaymentCredentialSchema,
} from "./spec_generated";

export const ExtendedPaymentCredentialSchema = PaymentCredentialSchema.extend({
  token: z.string().optional(),
});
export type ExtendedPaymentCredential = z.infer<
  typeof ExtendedPaymentCredentialSchema
>;

export const PlatformConfigSchema = z.object({
  webhook_url: z.string().url().optional(),
});
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;

export const ExtendedCheckoutResponseSchema = CheckoutSchema.extend({
  order_id: z.string().optional(),
  order_permalink_url: z.string().optional(),
  platform: PlatformConfigSchema.optional(),
});
export type ExtendedCheckoutResponse = z.infer<
  typeof ExtendedCheckoutResponseSchema
>;

export const ExtendedCheckoutCreateRequestSchema = CheckoutSchema;
export type ExtendedCheckoutCreateRequest = z.infer<
  typeof ExtendedCheckoutCreateRequestSchema
>;

export const ExtendedCheckoutUpdateRequestSchema = CheckoutSchema;
export type ExtendedCheckoutUpdateRequest = z.infer<
  typeof ExtendedCheckoutUpdateRequestSchema
>;

export const OrderUpdateSchema = OrderSchema;
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
