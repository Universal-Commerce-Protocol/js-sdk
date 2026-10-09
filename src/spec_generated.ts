import { z } from "zod";

declare module "zod" {
  interface ZodObject<
    T extends z.ZodRawShape,
    UnknownKeys extends z.UnknownKeysParam = z.UnknownKeysParam,
    Catchall extends z.ZodTypeAny = z.ZodTypeAny,
    Output = z.objectOutputType<T, Catchall, UnknownKeys>,
    Input = z.objectInputType<T, Catchall, UnknownKeys>,
  > {
    catchall<Index extends z.ZodTypeAny>(
      index: Index
    ): z.ZodObject<
      T,
      UnknownKeys,
      Index,
      {
        [
          K in keyof z.objectOutputType<T, Index, UnknownKeys>
        ]: z.objectOutputType<T, Index, UnknownKeys>[K];
      },
      {
        [
          K in keyof z.objectInputType<T, Index, UnknownKeys>
        ]: z.objectInputType<T, Index, UnknownKeys>[K];
      }
    >;
  }
}

export const PartSchema = z
  .object({
    type: z.string().optional(),
    kind: z.string().optional(),
    text: z.string().optional(),
    data: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type Part = z.infer<typeof PartSchema>;

export const A2aMessageMessageSchema = z
  .object({
    role: z.enum(["user", "agent"]),
    parts: z.array(PartSchema).min(1),
    messageId: z.string(),
    kind: z.literal("message"),
    contextId: z.string(),
  })
  .catchall(z.any());
export type A2aMessageMessage = z.infer<typeof A2aMessageMessageSchema>;

export const A2aMessageRequestParamsSchema = z
  .object({ message: A2aMessageMessageSchema })
  .catchall(z.any());
export type A2aMessageRequestParams = z.infer<
  typeof A2aMessageRequestParamsSchema
>;

export const IdSchema = z.union([z.string(), z.number(), z.null()]);
export type Id = z.infer<typeof IdSchema>;

export const A2aMessageRequestSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema.optional(),
    method: z.literal("message/send"),
    params: A2aMessageRequestParamsSchema,
  })
  .catchall(z.any());
export type A2aMessageRequest = z.infer<typeof A2aMessageRequestSchema>;

export const A2aMessageResponseSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema,
    result: A2aMessageMessageSchema,
  })
  .catchall(z.any());
export type A2aMessageResponse = z.infer<typeof A2aMessageResponseSchema>;

export const ExtensionSchema = z
  .object({
    uri: z.string().url(),
    description: z.string().optional(),
    params: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type Extension = z.infer<typeof ExtensionSchema>;

export const AgentCardSchema = z
  .object({ extensions: z.array(ExtensionSchema).min(1) })
  .catchall(z.any());
export type AgentCard = z.infer<typeof AgentCardSchema>;

export const A2aMessageSchema = z.union([
  AgentCardSchema,
  A2aMessageRequestSchema,
  A2aMessageResponseSchema,
]);
export type A2aMessage = z.infer<typeof A2aMessageSchema>;

export const ActionsDeviceDataCollectionConfigSchema = z
  .object({ payment_instrument_id: z.string().min(1), url: z.string().url() })
  .catchall(z.any());
export type ActionsDeviceDataCollectionConfig = z.infer<
  typeof ActionsDeviceDataCollectionConfigSchema
>;

export const ActionsDeviceDataCollectionSchema = z
  .object({ config: ActionsDeviceDataCollectionConfigSchema })
  .catchall(z.any());
export type ActionsDeviceDataCollection = z.infer<
  typeof ActionsDeviceDataCollectionSchema
>;

export const ActionsThreeDsChallengeConfigSchema = z
  .object({ payment_instrument_id: z.string().min(1), url: z.string().url() })
  .catchall(z.any());
export type ActionsThreeDsChallengeConfig = z.infer<
  typeof ActionsThreeDsChallengeConfigSchema
>;

export const ActionsThreeDsChallengeSchema = z
  .object({ config: ActionsThreeDsChallengeConfigSchema })
  .catchall(z.any());
export type ActionsThreeDsChallenge = z.infer<
  typeof ActionsThreeDsChallengeSchema
>;

export const InstanceSchema = z
  .object({ id: z.string().min(1), config: z.record(z.any()).optional() })
  .catchall(z.any());
export type Instance = z.infer<typeof InstanceSchema>;

export const ReverseDomainNameSchema = z
  .string()
  .regex(
    new RegExp(
      "^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$"
    )
  );
export type ReverseDomainName = z.infer<typeof ReverseDomainNameSchema>;

export const ActionsSchema = z
  .object({
    "dev.ucp.common.payment.device_data_collection": z
      .array(ActionsDeviceDataCollectionSchema)
      .optional(),
    "dev.ucp.common.payment.three_ds_challenge": z
      .array(ActionsThreeDsChallengeSchema)
      .optional(),
  })
  .catchall(z.array(InstanceSchema).min(1));
export type Actions = z.infer<typeof ActionsSchema>;

export const MeasureSchema = z
  .object({
    unit: z.string(),
    scale: z.number().int().gte(0).lte(15).optional(),
    display_text: z.string(),
    value: z.number().int().gte(-9007199254740991).lte(9007199254740991),
  })
  .catchall(z.any());
export type Measure = z.infer<typeof MeasureSchema>;

export const AdjustmentLineItemSchema = z
  .object({
    id: z.string(),
    quantity: z.number().int().gte(-9007199254740991).lte(9007199254740991),
    measure: MeasureSchema.optional(),
  })
  .catchall(z.any());
export type AdjustmentLineItem = z.infer<typeof AdjustmentLineItemSchema>;

export const SignedAmountSchema = z
  .number()
  .int()
  .gte(-9007199254740991)
  .lte(9007199254740991);
export type SignedAmount = z.infer<typeof SignedAmountSchema>;

export const TotalSchema = z
  .object({
    type: z.string(),
    display_text: z.string().optional(),
    amount: SignedAmountSchema,
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "numeric",
        discriminator: "type",
        values: ["discount", "items_discount"],
        negated: false,
        required: [],
        field: null,
        format: null,
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
        field: null,
        format: null,
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
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          if (!z.string().url().safeParse(fieldValue).success && field !== null)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Value must be a valid URI",
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
export type Total = z.infer<typeof TotalSchema>;

export const AdjustmentSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    occurred_at: z.string().datetime({ offset: true }),
    status: z.enum(["pending", "completed", "failed"]),
    line_items: z.array(AdjustmentLineItemSchema).optional(),
    totals: z.array(TotalSchema).optional(),
    description: z.string().optional(),
  })
  .catchall(z.any());
export type Adjustment = z.infer<typeof AdjustmentSchema>;

export const AmountSchema = z.number().int().gte(0).lte(9007199254740991);
export type Amount = z.infer<typeof AmountSchema>;

export const AllocationSchema = z
  .object({ path: z.string(), amount: AmountSchema })
  .catchall(z.any());
export type Allocation = z.infer<typeof AllocationSchema>;

export const AmenitySchema = z
  .object({ description: z.string().min(1) })
  .catchall(z.any());
export type Amenity = z.infer<typeof AmenitySchema>;

export const AmenityTypeSchema = ReverseDomainNameSchema;
export type AmenityType = z.infer<typeof AmenityTypeSchema>;

export const CheckoutMandateSchema = z
  .string()
  .regex(
    new RegExp(
      "^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]*\\.[A-Za-z0-9_-]+(~[A-Za-z0-9_-]+)*$"
    )
  );
export type CheckoutMandate = z.infer<typeof CheckoutMandateSchema>;

export const Ap2WithCheckoutMandateSchema = z
  .object({ checkout_mandate: CheckoutMandateSchema.optional() })
  .catchall(z.any());
export type Ap2WithCheckoutMandate = z.infer<
  typeof Ap2WithCheckoutMandateSchema
>;

export const Ap2WithCheckoutMandateCompleteRequestSchema = z
  .object({ checkout_mandate: CheckoutMandateSchema })
  .catchall(z.any());
export type Ap2WithCheckoutMandateCompleteRequest = z.infer<
  typeof Ap2WithCheckoutMandateCompleteRequestSchema
>;

export const MerchantAuthorizationSchema = z
  .string()
  .regex(new RegExp("^[A-Za-z0-9_-]+\\.\\.[A-Za-z0-9_-]+$"));
export type MerchantAuthorization = z.infer<typeof MerchantAuthorizationSchema>;

export const Ap2WithMerchantAuthorizationSchema = z
  .object({ merchant_authorization: MerchantAuthorizationSchema.optional() })
  .catchall(z.any());
export type Ap2WithMerchantAuthorization = z.infer<
  typeof Ap2WithMerchantAuthorizationSchema
>;

export const AppliedDiscountSchema = z
  .object({
    code: z.string().optional(),
    title: z.string(),
    amount: AmountSchema,
    automatic: z.boolean().optional(),
    method: z.enum(["each", "across"]).optional(),
    priority: z.number().int().gte(1).optional(),
    provisional: z.boolean().optional(),
    eligibility: ReverseDomainNameSchema.optional(),
    allocations: z.array(AllocationSchema).optional(),
  })
  .catchall(z.any());
export type AppliedDiscount = z.infer<typeof AppliedDiscountSchema>;

export const UcpAgentSchema = z
  .object({ profile: z.string() })
  .catchall(z.any());
export type UcpAgent = z.infer<typeof UcpAgentSchema>;

export const MetaSchema = z
  .object({
    "ucp-agent": UcpAgentSchema.optional(),
    "idempotency-key": z.string().optional(),
  })
  .catchall(z.any());
export type Meta = z.infer<typeof MetaSchema>;

export const ArgumentsSchema = z
  .object({ meta: MetaSchema.optional() })
  .catchall(z.any());
export type Arguments = z.infer<typeof ArgumentsSchema>;

export const AttributionSchema = z.record(z.string());
export type Attribution = z.infer<typeof AttributionSchema>;

export const AvailabilitySchema = z
  .object({ available: z.boolean().optional(), status: z.string().optional() })
  .catchall(z.any());
export type Availability = z.infer<typeof AvailabilitySchema>;

export const ValueConstraintConstSchema = z
  .object({
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
    const: z.any(),
  })
  .strict();
export type ValueConstraintConst = z.infer<typeof ValueConstraintConstSchema>;

export const ValueConstraintEnumSchema = z
  .object({
    enum: z
      .array(z.any())
      .min(1)
      .refine(
        (items) =>
          new Set(items.map((item) => JSON.stringify(item))).size ===
          items.length,
        { message: "Array items must be unique (uniqueItems)" }
      ),
    const: z.any().optional(),
  })
  .strict();
export type ValueConstraintEnum = z.infer<typeof ValueConstraintEnumSchema>;

export const ValueConstraintSchema = z.union([
  ValueConstraintEnumSchema,
  ValueConstraintConstSchema,
]);
export type ValueConstraint = z.infer<typeof ValueConstraintSchema>;

export const ConstraintExpressionSchema: z.ZodType<any> = z
  .object({
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
    properties: z
      .record(
        z.union([
          z.lazy(() => ConstraintExpressionSchema),
          ValueConstraintSchema,
        ])
      )
      .refine((value) => Object.keys(value).length >= 1, {
        message: "Object must contain at least 1 property(ies) (minProperties)",
      })
      .optional(),
    anyOf: z
      .array(z.lazy(() => ConstraintExpressionSchema))
      .min(1)
      .optional(),
  })
  .strict();
export type ConstraintExpression = z.infer<typeof ConstraintExpressionSchema>;

export const AvailablePaymentInstrumentSchema = z
  .object({
    type: z.string(),
    constraints: ConstraintExpressionSchema.optional(),
  })
  .catchall(z.any());
export type AvailablePaymentInstrument = z.infer<
  typeof AvailablePaymentInstrumentSchema
>;

export const BindingSchema = z
  .object({ type: ReverseDomainNameSchema, id: z.string().min(1) })
  .catchall(z.any());
export type Binding = z.infer<typeof BindingSchema>;

export const BusinessFulfillmentConfigMultiDestinationSchema = z
  .object({ method: z.string() })
  .catchall(z.any());
export type BusinessFulfillmentConfigMultiDestination = z.infer<
  typeof BusinessFulfillmentConfigMultiDestinationSchema
>;

export const BusinessFulfillmentConfigSchema = z
  .object({
    multi_destination: z
      .array(BusinessFulfillmentConfigMultiDestinationSchema)
      .optional(),
    method_combinations: z.array(z.array(z.string())).optional(),
  })
  .catchall(z.any());
export type BusinessFulfillmentConfig = z.infer<
  typeof BusinessFulfillmentConfigSchema
>;

export const InstrumentGroupSchema = z
  .object({
    types: z.array(z.string()).min(1),
    min: z.number().int().gte(0).optional(),
    max: z.number().int().gte(1).optional(),
  })
  .catchall(z.any());
export type InstrumentGroup = z.infer<typeof InstrumentGroupSchema>;

export const BusinessSplitPaymentsConfigSchema = z
  .object({
    allowed_combinations: z.array(z.array(InstrumentGroupSchema).min(1)).min(1),
  })
  .catchall(z.any());
export type BusinessSplitPaymentsConfig = z.infer<
  typeof BusinessSplitPaymentsConfigSchema
>;

export const LinkSchema = z
  .object({
    type: z.string(),
    url: z.string().url(),
    title: z.string().optional(),
  })
  .catchall(z.any());
export type Link = z.infer<typeof LinkSchema>;

export const ConsentSegmentSchema = z
  .object({
    granted: z.boolean(),
    source: z.enum(["business", "platform"]),
    description: z.string(),
    links: z.array(LinkSchema).optional(),
  })
  .catchall(z.any());
export type ConsentSegment = z.infer<typeof ConsentSegmentSchema>;

export const ConsentPurposeSchema = z
  .object({
    granted: z.boolean(),
    source: z.enum(["business", "platform"]),
    description: z.string(),
    links: z.array(LinkSchema).optional(),
    segments: z
      .record(ReverseDomainNameSchema, ConsentSegmentSchema)
      .optional(),
  })
  .catchall(z.any());
export type ConsentPurpose = z.infer<typeof ConsentPurposeSchema>;

export const ConsentSchema = z.record(
  ReverseDomainNameSchema,
  ConsentPurposeSchema
);
export type Consent = z.infer<typeof ConsentSchema>;

export const BuyerSchema = z
  .object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    phone_number: z.string().optional(),
    consent: ConsentSchema.optional(),
  })
  .catchall(z.any());
export type Buyer = z.infer<typeof BuyerSchema>;

export const VersionSchema = z
  .string()
  .regex(new RegExp("^\\d{4}-\\d{2}-\\d{2}$"));
export type Version = z.infer<typeof VersionSchema>;

export const CapabilityBaseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type CapabilityBase = z.infer<typeof CapabilityBaseSchema>;

export const CapabilityBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type CapabilityBusiness = z.infer<typeof CapabilityBusinessSchema>;

export const CapabilityPlatformSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type CapabilityPlatform = z.infer<typeof CapabilityPlatformSchema>;

export const CapabilityResponseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type CapabilityResponse = z.infer<typeof CapabilityResponseSchema>;

export const CardCredentialSchema = z
  .object({
    type: z.literal("card"),
    card_number_type: z.enum(["fpan", "network_token", "dpan"]),
    number: z.string().optional(),
    expiry_month: z.number().int().optional(),
    expiry_year: z.number().int().optional(),
    name: z.string().optional(),
    cvc: z.string().max(4).optional(),
    cryptogram: z.string().optional(),
    eci_value: z.string().optional(),
  })
  .catchall(z.any());
export type CardCredential = z.infer<typeof CardCredentialSchema>;

export const CardPaymentInstrumentDisplaySchema = z
  .object({
    brand: z.string().optional(),
    last_digits: z.string().optional(),
    expiry_month: z.number().int().optional(),
    expiry_year: z.number().int().optional(),
    description: z.string().optional(),
    card_art: z.string().url().optional(),
  })
  .catchall(z.any());
export type CardPaymentInstrumentDisplay = z.infer<
  typeof CardPaymentInstrumentDisplaySchema
>;

export const PaymentCredentialSchema = z
  .object({ type: z.string() })
  .catchall(z.any());
export type PaymentCredential = z.infer<typeof PaymentCredentialSchema>;

export const PostalAddressSchema = z
  .object({
    extended_address: z.string().optional(),
    street_address: z.string().optional(),
    address_locality: z.string().optional(),
    address_region: z.string().optional(),
    address_country: z.string().optional(),
    postal_code: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
  })
  .catchall(z.any());
export type PostalAddress = z.infer<typeof PostalAddressSchema>;

export const CardPaymentInstrumentSchema = z
  .object({
    id: z.string(),
    handler_id: z.string(),
    type: z.literal("card"),
    billing_address: PostalAddressSchema.optional(),
    credential: PaymentCredentialSchema.optional(),
    display: CardPaymentInstrumentDisplaySchema.optional(),
    amount: AmountSchema.optional(),
    network: z.string().optional(),
  })
  .catchall(z.any());
export type CardPaymentInstrument = z.infer<typeof CardPaymentInstrumentSchema>;

export const ContextPaymentSchema = z
  .object({
    handler: ReverseDomainNameSchema,
    types: z.array(z.string()).optional(),
  })
  .catchall(z.any());
export type ContextPayment = z.infer<typeof ContextPaymentSchema>;

export const ContextSchema = z
  .object({
    address_country: z.string().optional(),
    address_region: z.string().optional(),
    postal_code: z.string().optional(),
    location: z.string().optional(),
    intent: z.string().optional(),
    language: z.string().optional(),
    currency: z.string().optional(),
    eligibility: z
      .array(ReverseDomainNameSchema)
      .refine(
        (items) =>
          new Set(items.map((item) => JSON.stringify(item))).size ===
          items.length,
        { message: "Array items must be unique (uniqueItems)" }
      )
      .optional(),
    payment: z.array(ContextPaymentSchema).optional(),
  })
  .catchall(z.any());
export type Context = z.infer<typeof ContextSchema>;

export const DiscountsObjectSchema = z
  .object({
    codes: z.array(z.string()).optional(),
    applied: z.array(AppliedDiscountSchema).optional(),
  })
  .catchall(z.any());
export type DiscountsObject = z.infer<typeof DiscountsObjectSchema>;

export const QuantityUnitSchema = z
  .object({
    unit: z.string(),
    scale: z.number().int().gte(0).lte(15).optional(),
    display_text: z.string(),
    increment: z.number().int().gte(1).optional(),
  })
  .catchall(z.any());
export type QuantityUnit = z.infer<typeof QuantityUnitSchema>;

export const UnitPriceMeasureSchema = z
  .object({
    unit: z.string(),
    scale: z.number().int().gte(0).lte(15).optional(),
    display_text: z.string(),
    value: z.number().int().gte(1).lte(9007199254740991),
  })
  .catchall(z.any());
export type UnitPriceMeasure = z.infer<typeof UnitPriceMeasureSchema>;

export const UnitPriceReferenceSchema = z
  .object({
    unit: z.string(),
    scale: z.number().int().gte(0).lte(15).optional(),
    display_text: z.string(),
    value: z.number().int().gte(1).lte(9007199254740991),
  })
  .catchall(z.any());
export type UnitPriceReference = z.infer<typeof UnitPriceReferenceSchema>;

export const UnitPriceSchema = z
  .object({
    amount: AmountSchema,
    currency: z.string().regex(new RegExp("^[A-Z]{3}$")),
    measure: UnitPriceMeasureSchema,
    reference: UnitPriceReferenceSchema,
  })
  .catchall(z.any());
export type UnitPrice = z.infer<typeof UnitPriceSchema>;

export const ItemSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    price: AmountSchema,
    quantity_unit: QuantityUnitSchema.optional(),
    unit_price: UnitPriceSchema.optional(),
    image_url: z.string().url().optional(),
  })
  .catchall(z.any());
export type Item = z.infer<typeof ItemSchema>;

export const LineItemSchema = z
  .object({
    id: z.string(),
    item: ItemSchema,
    quantity: z.number().int().gte(1).lte(9007199254740991),
    totals: z.array(TotalSchema),
    parent_id: z.string().optional(),
  })
  .catchall(z.any());
export type LineItem = z.infer<typeof LineItemSchema>;

export const RewardAmountSchema = z.number().int().gte(0);
export type RewardAmount = z.infer<typeof RewardAmountSchema>;

export const EarningBreakdownSchema = z
  .object({
    id: z.string(),
    amount: RewardAmountSchema,
    description: z.string(),
    benefit_id: z.string().optional(),
  })
  .catchall(z.any());
export type EarningBreakdown = z.infer<typeof EarningBreakdownSchema>;

export const EarningForecastSchema = z
  .object({
    amount: RewardAmountSchema,
    breakdown: z.array(EarningBreakdownSchema).optional(),
  })
  .catchall(z.any());
export type EarningForecast = z.infer<typeof EarningForecastSchema>;

export const RewardCurrencySchema = z
  .object({
    name: z.string(),
    code: z.string(),
    decimal_places: z.number().int().gte(0).optional(),
  })
  .catchall(z.any());
export type RewardCurrency = z.infer<typeof RewardCurrencySchema>;

export const MembershipRewardSchema = z
  .object({
    currency: RewardCurrencySchema,
    earning_forecast: EarningForecastSchema.optional(),
  })
  .catchall(z.any());
export type MembershipReward = z.infer<typeof MembershipRewardSchema>;

export const MembershipTierBenefitSchema = z
  .object({ id: z.string(), description: z.string() })
  .catchall(z.any());
export type MembershipTierBenefit = z.infer<typeof MembershipTierBenefitSchema>;

export const MembershipTierSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    benefits: z.array(MembershipTierBenefitSchema).optional(),
  })
  .catchall(z.any());
export type MembershipTier = z.infer<typeof MembershipTierSchema>;

export const LoyaltyMembershipSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    display_id: z.string().optional(),
    tiers: z.array(MembershipTierSchema).optional(),
    rewards: z.array(MembershipRewardSchema).optional(),
    provisional: z.boolean(),
  })
  .catchall(z.any());
export type LoyaltyMembership = z.infer<typeof LoyaltyMembershipSchema>;

export const LoyaltySchema = z.record(
  ReverseDomainNameSchema,
  LoyaltyMembershipSchema
);
export type Loyalty = z.infer<typeof LoyaltySchema>;

export const ErrorCodeSchema = z.string();
export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const MessageErrorSchema = z
  .object({
    type: z.literal("error"),
    code: ErrorCodeSchema,
    path: z.string().optional(),
    content_type: z.enum(["plain", "markdown"]).optional(),
    content: z.string(),
    severity: z.enum([
      "recoverable",
      "requires_buyer_input",
      "requires_buyer_review",
      "unrecoverable",
    ]),
  })
  .catchall(z.any());
export type MessageError = z.infer<typeof MessageErrorSchema>;

export const InfoCodeSchema = z.string();
export type InfoCode = z.infer<typeof InfoCodeSchema>;

export const MessageInfoSchema = z
  .object({
    type: z.literal("info"),
    path: z.string().optional(),
    code: InfoCodeSchema.optional(),
    content_type: z.enum(["plain", "markdown"]).optional(),
    content: z.string(),
  })
  .catchall(z.any());
export type MessageInfo = z.infer<typeof MessageInfoSchema>;

export const WarningCodeSchema = z.string();
export type WarningCode = z.infer<typeof WarningCodeSchema>;

export const MessageWarningSchema = z
  .object({
    type: z.literal("warning"),
    path: z.string().optional(),
    code: WarningCodeSchema,
    content: z.string(),
    content_type: z.enum(["plain", "markdown"]).optional(),
    presentation: z.string().optional(),
    image_url: z.string().url().optional(),
    url: z.string().url().optional(),
  })
  .catchall(z.any());
export type MessageWarning = z.infer<typeof MessageWarningSchema>;

export const MessageSchema = z.union([
  MessageErrorSchema,
  MessageWarningSchema,
  MessageInfoSchema,
]);
export type Message = z.infer<typeof MessageSchema>;

export const DescriptionSchema = z
  .object({
    plain: z.string().optional(),
    html: z.string().optional(),
    markdown: z.string().optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  });
export type Description = z.infer<typeof DescriptionSchema>;

export const PolicySchema = z
  .object({
    type: ReverseDomainNameSchema,
    description: DescriptionSchema,
    applies_to: z.array(z.string()).optional(),
    url: z.string().url().optional(),
  })
  .catchall(z.any());
export type Policy = z.infer<typeof PolicySchema>;

export const MapOrderSchema = z.record(z.array(z.string()));
export type MapOrder = z.infer<typeof MapOrderSchema>;

export const PaymentHandlerBaseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string(),
    config: z.record(z.any()).optional(),
    available_instruments: z
      .array(AvailablePaymentInstrumentSchema)
      .min(1)
      .optional(),
  })
  .catchall(z.any());
export type PaymentHandlerBase = z.infer<typeof PaymentHandlerBaseSchema>;

export const ServiceBaseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.enum(["rest", "mcp", "a2a", "embedded"]),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceBase = z.infer<typeof ServiceBaseSchema>;

export const ResponseCartSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityResponseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type ResponseCart = z.infer<typeof ResponseCartSchema>;

export const SignalsSchema = z
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
export type Signals = z.infer<typeof SignalsSchema>;

export const TotalsItemLineSchema = z
  .object({ display_text: z.string(), amount: SignedAmountSchema })
  .catchall(z.any());
export type TotalsItemLine = z.infer<typeof TotalsItemLineSchema>;

export const TotalsItemSchema = z
  .object({
    type: z.string(),
    display_text: z.string().optional(),
    amount: SignedAmountSchema,
    lines: z.array(TotalsItemLineSchema).optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "numeric",
        discriminator: "type",
        values: ["discount", "items_discount"],
        negated: false,
        required: [],
        field: null,
        format: null,
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
        field: null,
        format: null,
        target: "amount",
        minimum: 0,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
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
        field: null,
        format: null,
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
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          if (!z.string().url().safeParse(fieldValue).success && field !== null)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Value must be a valid URI",
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
export type TotalsItem = z.infer<typeof TotalsItemSchema>;

export const TotalsSchema = z
  .array(TotalsItemSchema)
  .superRefine((items, ctx) => {
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
  });
export type Totals = z.infer<typeof TotalsSchema>;

export const CartSchema = z
  .object({
    ucp: ResponseCartSchema,
    id: z.string(),
    line_items: z.array(LineItemSchema),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    buyer: BuyerSchema.optional(),
    currency: z.string(),
    totals: TotalsSchema,
    actions: ActionsSchema.optional(),
    messages: z.array(MessageSchema).optional(),
    links: z.array(LinkSchema).optional(),
    policies: z.array(PolicySchema).optional(),
    continue_url: z.string().url().optional(),
    expires_at: z.string().datetime({ offset: true }).optional(),
    loyalty: LoyaltySchema.optional(),
    discounts: DiscountsObjectSchema.optional(),
  })
  .catchall(z.any());
export type Cart = z.infer<typeof CartSchema>;

export const DiscountsObjectCreateRequestSchema = z
  .object({ codes: z.array(z.string()).optional() })
  .catchall(z.any());
export type DiscountsObjectCreateRequest = z.infer<
  typeof DiscountsObjectCreateRequestSchema
>;

export const ItemCreateRequestSchema = z
  .object({ id: z.string(), quantity_unit: QuantityUnitSchema.optional() })
  .catchall(z.any());
export type ItemCreateRequest = z.infer<typeof ItemCreateRequestSchema>;

export const LineItemCreateRequestSchema = z
  .object({
    item: ItemCreateRequestSchema,
    quantity: z.number().int().gte(1).lte(9007199254740991),
  })
  .catchall(z.any());
export type LineItemCreateRequest = z.infer<typeof LineItemCreateRequestSchema>;

export const CartCreateRequestSchema = z
  .object({
    line_items: z.array(LineItemCreateRequestSchema),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    buyer: BuyerSchema.optional(),
    discounts: DiscountsObjectCreateRequestSchema.optional(),
  })
  .catchall(z.any());
export type CartCreateRequest = z.infer<typeof CartCreateRequestSchema>;

export const DiscountsObjectUpdateRequestSchema = z
  .object({ codes: z.array(z.string()).optional() })
  .catchall(z.any());
export type DiscountsObjectUpdateRequest = z.infer<
  typeof DiscountsObjectUpdateRequestSchema
>;

export const ItemUpdateRequestSchema = z
  .object({ id: z.string(), quantity_unit: QuantityUnitSchema.optional() })
  .catchall(z.any());
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequestSchema>;

export const LineItemUpdateRequestSchema = z
  .object({
    id: z.string().optional(),
    item: ItemUpdateRequestSchema,
    quantity: z.number().int().gte(1).lte(9007199254740991),
    parent_id: z.string().optional(),
  })
  .catchall(z.any());
export type LineItemUpdateRequest = z.infer<typeof LineItemUpdateRequestSchema>;

export const CartUpdateRequestSchema = z
  .object({
    line_items: z.array(LineItemUpdateRequestSchema),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    buyer: BuyerSchema.optional(),
    discounts: DiscountsObjectUpdateRequestSchema.optional(),
  })
  .catchall(z.any());
export type CartUpdateRequest = z.infer<typeof CartUpdateRequestSchema>;

export const FulfillmentOptionBaseSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: DescriptionSchema.optional(),
  })
  .catchall(z.any());
export type FulfillmentOptionBase = z.infer<typeof FulfillmentOptionBaseSchema>;

export const CatalogFulfillmentMethodSchema = z
  .object({
    type: z.string(),
    description: DescriptionSchema.optional(),
    availability: AvailabilitySchema.optional(),
    location: z.string().optional(),
    options: z.array(FulfillmentOptionBaseSchema).optional(),
  })
  .catchall(z.any());
export type CatalogFulfillmentMethod = z.infer<
  typeof CatalogFulfillmentMethodSchema
>;

export const CatalogFulfillmentSchema = z
  .object({ methods: z.array(CatalogFulfillmentMethodSchema).optional() })
  .catchall(z.any());
export type CatalogFulfillment = z.infer<typeof CatalogFulfillmentSchema>;

export const FulfillmentDestinationFilterSchema = z
  .object({
    address_country: z.string().optional(),
    address_region: z.string().optional(),
    postal_code: z.string().optional(),
    location: z.string().optional(),
  })
  .catchall(z.any());
export type FulfillmentDestinationFilter = z.infer<
  typeof FulfillmentDestinationFilterSchema
>;

export const PriceFilterSchema = z
  .object({ min: AmountSchema.optional(), max: AmountSchema.optional() })
  .catchall(z.any());
export type PriceFilter = z.infer<typeof PriceFilterSchema>;

export const FulfillmentSearchFiltersSchema = z
  .object({
    categories: z.array(z.string()).optional(),
    price: PriceFilterSchema.optional(),
    fulfills_to: FulfillmentDestinationFilterSchema.optional(),
    methods: z.array(z.string()).optional(),
  })
  .catchall(z.any());
export type FulfillmentSearchFilters = z.infer<
  typeof FulfillmentSearchFiltersSchema
>;

export const SelectedOptionSchema = z
  .object({ name: z.string(), id: z.string().optional(), label: z.string() })
  .catchall(z.any());
export type SelectedOption = z.infer<typeof SelectedOptionSchema>;

export const CatalogGetProductRequestSchema = z
  .object({
    id: z.string(),
    selected: z.array(SelectedOptionSchema).optional(),
    preferences: z.array(z.string()).optional(),
    filters: FulfillmentSearchFiltersSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
  })
  .catchall(z.any());
export type CatalogGetProductRequest = z.infer<
  typeof CatalogGetProductRequestSchema
>;

export const CategorySchema = z
  .object({ value: z.string(), taxonomy: z.string().optional() })
  .catchall(z.any());
export type Category = z.infer<typeof CategorySchema>;

export const DetailOptionValueSchema = z
  .object({
    id: z.string().optional(),
    label: z.string(),
    available: z.boolean().optional(),
    exists: z.boolean().optional(),
  })
  .catchall(z.any());
export type DetailOptionValue = z.infer<typeof DetailOptionValueSchema>;

export const FulfillmentDetailProductOptionSchema = z
  .object({ name: z.string(), values: z.array(DetailOptionValueSchema).min(1) })
  .catchall(z.any());
export type FulfillmentDetailProductOption = z.infer<
  typeof FulfillmentDetailProductOptionSchema
>;

export const FulfillmentVariantBarcodeSchema = z
  .object({ type: z.string(), value: z.string() })
  .catchall(z.any());
export type FulfillmentVariantBarcode = z.infer<
  typeof FulfillmentVariantBarcodeSchema
>;

export const FulfillmentVariantSellerSchema = z
  .object({
    name: z.string().optional(),
    links: z.array(LinkSchema).optional(),
  })
  .catchall(z.any());
export type FulfillmentVariantSeller = z.infer<
  typeof FulfillmentVariantSellerSchema
>;

export const MediaSchema = z
  .object({
    type: z.string(),
    url: z.string().url(),
    alt_text: z.string().optional(),
    width: z.number().int().gte(1).optional(),
    height: z.number().int().gte(1).optional(),
  })
  .catchall(z.any());
export type Media = z.infer<typeof MediaSchema>;

export const PriceSchema = z
  .object({
    amount: AmountSchema,
    currency: z.string().regex(new RegExp("^[A-Z]{3}$")),
  })
  .catchall(z.any());
export type Price = z.infer<typeof PriceSchema>;

export const RatingSchema = z
  .object({
    value: z.number().gte(0),
    scale_min: z.number().gte(0).optional(),
    scale_max: z.number().gte(1),
    count: z.number().int().gte(0).optional(),
  })
  .catchall(z.any());
export type Rating = z.infer<typeof RatingSchema>;

export const FulfillmentVariantSchema = z
  .object({
    id: z.string(),
    sku: z.string().optional(),
    barcodes: z.array(FulfillmentVariantBarcodeSchema).optional(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price: PriceSchema,
    quantity_unit: QuantityUnitSchema.optional(),
    list_price: PriceSchema.optional(),
    unit_price: UnitPriceSchema.optional(),
    availability: AvailabilitySchema.optional(),
    options: z.array(SelectedOptionSchema).optional(),
    media: z.array(MediaSchema).optional(),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    seller: FulfillmentVariantSellerSchema.optional(),
    fulfillment: CatalogFulfillmentSchema.optional(),
  })
  .catchall(z.any());
export type FulfillmentVariant = z.infer<typeof FulfillmentVariantSchema>;

export const PriceRangeSchema = z
  .object({ min: PriceSchema, max: PriceSchema })
  .catchall(z.any());
export type PriceRange = z.infer<typeof PriceRangeSchema>;

export const FulfillmentDetailProductSchema = z
  .object({
    id: z.string(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price_range: PriceRangeSchema,
    list_price_range: PriceRangeSchema.optional(),
    media: z.array(MediaSchema).optional(),
    options: z.array(FulfillmentDetailProductOptionSchema).optional(),
    variants: z.array(FulfillmentVariantSchema).min(1),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    selected: z.array(SelectedOptionSchema).optional(),
  })
  .catchall(z.any());
export type FulfillmentDetailProduct = z.infer<
  typeof FulfillmentDetailProductSchema
>;

export const ResponseCatalogSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityResponseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type ResponseCatalog = z.infer<typeof ResponseCatalogSchema>;

export const CatalogGetProductResponseSchema = z
  .object({
    ucp: ResponseCatalogSchema,
    product: FulfillmentDetailProductSchema,
    actions: ActionsSchema.optional(),
    messages: z.array(MessageSchema).optional(),
    policies: z.array(PolicySchema).optional(),
    loyalty: LoyaltySchema.optional(),
  })
  .catchall(z.any());
export type CatalogGetProductResponse = z.infer<
  typeof CatalogGetProductResponseSchema
>;

export const CatalogLookupRequestSchema = z
  .object({
    ids: z.array(z.string()).min(1),
    filters: FulfillmentSearchFiltersSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
  })
  .catchall(z.any());
export type CatalogLookupRequest = z.infer<typeof CatalogLookupRequestSchema>;

export const FulfillmentLookupVariantBarcodeSchema = z
  .object({ type: z.string(), value: z.string() })
  .catchall(z.any());
export type FulfillmentLookupVariantBarcode = z.infer<
  typeof FulfillmentLookupVariantBarcodeSchema
>;

export const FulfillmentLookupVariantSellerSchema = z
  .object({
    name: z.string().optional(),
    links: z.array(LinkSchema).optional(),
  })
  .catchall(z.any());
export type FulfillmentLookupVariantSeller = z.infer<
  typeof FulfillmentLookupVariantSellerSchema
>;

export const InputCorrelationSchema = z
  .object({ id: z.string(), match: z.string().optional() })
  .catchall(z.any());
export type InputCorrelation = z.infer<typeof InputCorrelationSchema>;

export const FulfillmentLookupVariantSchema = z
  .object({
    id: z.string(),
    sku: z.string().optional(),
    barcodes: z.array(FulfillmentLookupVariantBarcodeSchema).optional(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price: PriceSchema,
    quantity_unit: QuantityUnitSchema.optional(),
    list_price: PriceSchema.optional(),
    unit_price: UnitPriceSchema.optional(),
    availability: AvailabilitySchema.optional(),
    options: z.array(SelectedOptionSchema).optional(),
    media: z.array(MediaSchema).optional(),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    seller: FulfillmentLookupVariantSellerSchema.optional(),
    inputs: z.array(InputCorrelationSchema).min(1),
    fulfillment: CatalogFulfillmentSchema.optional(),
  })
  .catchall(z.any());
export type FulfillmentLookupVariant = z.infer<
  typeof FulfillmentLookupVariantSchema
>;

export const OptionValueSchema = z
  .object({ id: z.string().optional(), label: z.string() })
  .catchall(z.any());
export type OptionValue = z.infer<typeof OptionValueSchema>;

export const ProductOptionSchema = z
  .object({ name: z.string(), values: z.array(OptionValueSchema).min(1) })
  .catchall(z.any());
export type ProductOption = z.infer<typeof ProductOptionSchema>;

export const FulfillmentLookupProductSchema = z
  .object({
    id: z.string(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price_range: PriceRangeSchema,
    list_price_range: PriceRangeSchema.optional(),
    media: z.array(MediaSchema).optional(),
    options: z.array(ProductOptionSchema).optional(),
    variants: z.array(FulfillmentLookupVariantSchema).min(1),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type FulfillmentLookupProduct = z.infer<
  typeof FulfillmentLookupProductSchema
>;

export const CatalogLookupResponseSchema = z
  .object({
    ucp: ResponseCatalogSchema,
    products: z.array(FulfillmentLookupProductSchema),
    actions: ActionsSchema.optional(),
    messages: z.array(MessageSchema).optional(),
    policies: z.array(PolicySchema).optional(),
    loyalty: LoyaltySchema.optional(),
  })
  .catchall(z.any());
export type CatalogLookupResponse = z.infer<typeof CatalogLookupResponseSchema>;

export const PaginationRequestSchema = z
  .object({
    cursor: z.string().optional(),
    limit: z.number().int().gte(1).optional(),
  })
  .catchall(z.any());
export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;

export const CatalogSearchRequestSchema = z
  .object({
    query: z.string().optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    filters: FulfillmentSearchFiltersSchema.optional(),
    pagination: PaginationRequestSchema.optional(),
  })
  .catchall(z.any());
export type CatalogSearchRequest = z.infer<typeof CatalogSearchRequestSchema>;

export const FulfillmentProductSchema = z
  .object({
    id: z.string(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price_range: PriceRangeSchema,
    list_price_range: PriceRangeSchema.optional(),
    media: z.array(MediaSchema).optional(),
    options: z.array(ProductOptionSchema).optional(),
    variants: z.array(FulfillmentVariantSchema).min(1),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type FulfillmentProduct = z.infer<typeof FulfillmentProductSchema>;

export const PaginationResponseSchema = z
  .object({
    cursor: z.string().optional(),
    has_next_page: z.boolean(),
    total_count: z.number().int().gte(0).optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "required",
        discriminator: "has_next_page",
        values: [true],
        negated: false,
        required: ["cursor"],
        field: null,
        format: null,
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
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          if (!z.string().url().safeParse(fieldValue).success && field !== null)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Value must be a valid URI",
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
export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;

export const CatalogSearchResponseSchema = z
  .object({
    ucp: ResponseCatalogSchema,
    products: z.array(FulfillmentProductSchema),
    pagination: PaginationResponseSchema.optional(),
    actions: ActionsSchema.optional(),
    messages: z.array(MessageSchema).optional(),
    policies: z.array(PolicySchema).optional(),
    loyalty: LoyaltySchema.optional(),
  })
  .catchall(z.any());
export type CatalogSearchResponse = z.infer<typeof CatalogSearchResponseSchema>;

export const FulfillmentAvailableMethodSchema = z
  .object({
    type: z.string(),
    line_item_ids: z.array(z.string()),
    fulfillable_on: z.union([z.string(), z.null()]).optional(),
    description: z.string().optional(),
  })
  .catchall(z.any());
export type FulfillmentAvailableMethod = z.infer<
  typeof FulfillmentAvailableMethodSchema
>;

export const FulfillmentDestinationBaseSchema = z
  .object({
    type: z.string().superRefine((value, ctx) => {
      if (
        (
          ["business_location", "shipping_address"] as readonly string[]
        ).includes(value)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid discriminator value",
          fatal: true,
        });
      }
    }),
    id: z.string(),
  })
  .catchall(z.any());
export type FulfillmentDestinationBase = z.infer<
  typeof FulfillmentDestinationBaseSchema
>;

export const LocationDestinationSchema = z
  .object({
    type: z.literal("business_location"),
    id: z.string(),
    name: z.string(),
    address: PostalAddressSchema.optional(),
  })
  .catchall(z.any());
export type LocationDestination = z.infer<typeof LocationDestinationSchema>;

export const ShippingDestinationSchema = z
  .object({
    type: z.literal("shipping_address"),
    id: z.string(),
    extended_address: z.string().optional(),
    street_address: z.string().optional(),
    address_locality: z.string().optional(),
    address_region: z.string().optional(),
    address_country: z.string().optional(),
    postal_code: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
  })
  .catchall(z.any());
export type ShippingDestination = z.infer<typeof ShippingDestinationSchema>;

export const FulfillmentDestinationSchema = z.union([
  LocationDestinationSchema,
  ShippingDestinationSchema,
  FulfillmentDestinationBaseSchema,
]);
export type FulfillmentDestination = z.infer<
  typeof FulfillmentDestinationSchema
>;

export const FulfillmentOptionSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: DescriptionSchema.optional(),
    carrier: z.string().optional(),
    earliest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
    latest_fulfillment_time: z.string().datetime({ offset: true }).optional(),
    totals: z.array(TotalSchema),
  })
  .catchall(z.any());
export type FulfillmentOption = z.infer<typeof FulfillmentOptionSchema>;

export const FulfillmentGroupSchema = z
  .object({
    id: z.string(),
    line_item_ids: z.array(z.string()),
    options: z.array(FulfillmentOptionSchema).optional(),
    selected_option_id: z.union([z.string(), z.null()]).optional(),
  })
  .catchall(z.any());
export type FulfillmentGroup = z.infer<typeof FulfillmentGroupSchema>;

export const FulfillmentMethodBaseSchema = z
  .object({
    id: z.string(),
    type: z.string().superRefine((value, ctx) => {
      if ((["pickup", "shipping"] as readonly string[]).includes(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid discriminator value",
          fatal: true,
        });
      }
    }),
    line_item_ids: z.array(z.string()),
    destinations: z.array(FulfillmentDestinationSchema).optional(),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupSchema).optional(),
  })
  .catchall(z.any());
export type FulfillmentMethodBase = z.infer<typeof FulfillmentMethodBaseSchema>;

export const PickupMethodSchema = z
  .object({
    id: z.string(),
    type: z.literal("pickup"),
    line_item_ids: z.array(z.string()),
    destinations: z.array(LocationDestinationSchema).optional(),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupSchema).optional(),
  })
  .catchall(z.any());
export type PickupMethod = z.infer<typeof PickupMethodSchema>;

export const ShippingMethodSchema = z
  .object({
    id: z.string(),
    type: z.literal("shipping"),
    line_item_ids: z.array(z.string()),
    destinations: z.array(ShippingDestinationSchema).optional(),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupSchema).optional(),
  })
  .catchall(z.any());
export type ShippingMethod = z.infer<typeof ShippingMethodSchema>;

export const FulfillmentMethodSchema = z.union([
  PickupMethodSchema,
  ShippingMethodSchema,
  FulfillmentMethodBaseSchema,
]);
export type FulfillmentMethod = z.infer<typeof FulfillmentMethodSchema>;

export const FulfillmentSchema = z
  .object({
    methods: z.array(FulfillmentMethodSchema).optional(),
    available_methods: z.array(FulfillmentAvailableMethodSchema).optional(),
  })
  .catchall(z.any());
export type Fulfillment = z.infer<typeof FulfillmentSchema>;

export const OrderConfirmationSchema = z
  .object({
    id: z.string(),
    label: z.string().optional(),
    permalink_url: z.string().url(),
  })
  .catchall(z.any());
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;

export const PaymentScheduleSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    description: DescriptionSchema,
    due_at: z.string().datetime({ offset: true }).optional(),
    amount: AmountSchema,
  })
  .catchall(z.any());
export type PaymentSchedule = z.infer<typeof PaymentScheduleSchema>;

export const PaymentTermSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: DescriptionSchema.optional(),
    schedules: z.array(PaymentScheduleSchema).min(1),
  })
  .catchall(z.any());
export type PaymentTerm = z.infer<typeof PaymentTermSchema>;

export const SelectedPaymentInstrumentSchema = z
  .object({
    id: z.string(),
    handler_id: z.string(),
    type: z.string(),
    billing_address: PostalAddressSchema.optional(),
    credential: PaymentCredentialSchema.optional(),
    display: z.record(z.any()).optional(),
    amount: AmountSchema.optional(),
    selected: z.boolean().optional(),
  })
  .catchall(z.any());
export type SelectedPaymentInstrument = z.infer<
  typeof SelectedPaymentInstrumentSchema
>;

export const PaymentSchema = z
  .object({
    instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
    terms: z.array(PaymentTermSchema).min(1).optional(),
    selected_term_id: z.string().optional(),
  })
  .catchall(z.any());
export type Payment = z.infer<typeof PaymentSchema>;

export const PaymentHandlerResponseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string(),
    config: z.record(z.any()).optional(),
    available_instruments: z
      .array(AvailablePaymentInstrumentSchema)
      .min(1)
      .optional(),
  })
  .catchall(z.any());
export type PaymentHandlerResponse = z.infer<
  typeof PaymentHandlerResponseSchema
>;

export const ServiceResponseSchemaA2aSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("a2a"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceResponseSchemaA2a = z.infer<
  typeof ServiceResponseSchemaA2aSchema
>;

export const EmbeddedConfigSchema = z
  .object({
    delegate: z.array(z.string()).optional(),
    color_scheme: z.array(z.enum(["light", "dark"])).optional(),
  })
  .catchall(z.any());
export type EmbeddedConfig = z.infer<typeof EmbeddedConfigSchema>;

export const ServiceResponseSchemaEmbeddedSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: EmbeddedConfigSchema.optional(),
    transport: z.literal("embedded"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceResponseSchemaEmbedded = z.infer<
  typeof ServiceResponseSchemaEmbeddedSchema
>;

export const ServiceResponseSchemaMcpSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("mcp"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceResponseSchemaMcp = z.infer<
  typeof ServiceResponseSchemaMcpSchema
>;

export const ServiceResponseSchemaRestSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("rest"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceResponseSchemaRest = z.infer<
  typeof ServiceResponseSchemaRestSchema
>;

export const ServiceResponseSchema = z.union([
  ServiceResponseSchemaRestSchema,
  ServiceResponseSchemaMcpSchema,
  ServiceResponseSchemaA2aSchema,
  ServiceResponseSchemaEmbeddedSchema,
]);
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>;

export const ResponseCheckoutSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceResponseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityResponseSchema))
      .optional(),
    payment_handlers: z.record(
      ReverseDomainNameSchema,
      z.array(PaymentHandlerResponseSchema)
    ),
  })
  .catchall(z.any());
export type ResponseCheckout = z.infer<typeof ResponseCheckoutSchema>;

export const CheckoutSchema = z
  .object({
    ucp: ResponseCheckoutSchema,
    id: z.string(),
    line_items: z.array(LineItemSchema),
    buyer: BuyerSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    status: z.enum([
      "incomplete",
      "requires_escalation",
      "ready_for_complete",
      "complete_in_progress",
      "completed",
      "canceled",
    ]),
    currency: z.string(),
    totals: TotalsSchema,
    actions: ActionsSchema.optional(),
    messages: z.array(MessageSchema).optional(),
    links: z.array(LinkSchema),
    policies: z.array(PolicySchema).optional(),
    expires_at: z.string().datetime({ offset: true }).optional(),
    continue_url: z.string().url().optional(),
    payment: PaymentSchema.optional(),
    order: OrderConfirmationSchema.optional(),
    cart_id: z.string().optional(),
    loyalty: LoyaltySchema.optional(),
    ap2: z
      .intersection(
        Ap2WithMerchantAuthorizationSchema,
        Ap2WithCheckoutMandateSchema
      )
      .optional(),
    discounts: DiscountsObjectSchema.optional(),
    fulfillment: FulfillmentSchema.optional(),
  })
  .catchall(z.any());
export type Checkout = z.infer<typeof CheckoutSchema>;

export const PaymentCompleteRequestSchema = z
  .object({ instruments: z.array(SelectedPaymentInstrumentSchema) })
  .catchall(z.any());
export type PaymentCompleteRequest = z.infer<
  typeof PaymentCompleteRequestSchema
>;

export const CheckoutCompleteRequestSchema = z
  .object({
    buyer: BuyerSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    payment: PaymentCompleteRequestSchema,
    cart_id: z.string().optional(),
    ap2: Ap2WithCheckoutMandateCompleteRequestSchema.optional(),
  })
  .catchall(z.any());
export type CheckoutCompleteRequest = z.infer<
  typeof CheckoutCompleteRequestSchema
>;

export const FulfillmentGroupCreateRequestSchema = z
  .object({ selected_option_id: z.union([z.string(), z.null()]).optional() })
  .catchall(z.any());
export type FulfillmentGroupCreateRequest = z.infer<
  typeof FulfillmentGroupCreateRequestSchema
>;

export const FulfillmentMethodCreateRequestBaseSchema = z
  .object({
    type: z.string().superRefine((value, ctx) => {
      if ((["pickup", "shipping"] as readonly string[]).includes(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid discriminator value",
          fatal: true,
        });
      }
    }),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupCreateRequestSchema).optional(),
  })
  .catchall(z.any());
export type FulfillmentMethodCreateRequestBase = z.infer<
  typeof FulfillmentMethodCreateRequestBaseSchema
>;

export const PickupMethodCreateRequestSchema = z
  .object({
    type: z.literal("pickup"),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupCreateRequestSchema).optional(),
  })
  .catchall(z.any());
export type PickupMethodCreateRequest = z.infer<
  typeof PickupMethodCreateRequestSchema
>;

export const ShippingDestinationCreateRequestSchema = z
  .object({
    type: z.literal("shipping_address").optional(),
    id: z.string().optional(),
    extended_address: z.string().optional(),
    street_address: z.string().optional(),
    address_locality: z.string().optional(),
    address_region: z.string().optional(),
    address_country: z.string().optional(),
    postal_code: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
  })
  .catchall(z.any());
export type ShippingDestinationCreateRequest = z.infer<
  typeof ShippingDestinationCreateRequestSchema
>;

export const ShippingMethodCreateRequestSchema = z
  .object({
    type: z.literal("shipping"),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupCreateRequestSchema).optional(),
    destinations: z.array(ShippingDestinationCreateRequestSchema).optional(),
  })
  .catchall(z.any());
export type ShippingMethodCreateRequest = z.infer<
  typeof ShippingMethodCreateRequestSchema
>;

export const FulfillmentMethodCreateRequestSchema = z.union([
  PickupMethodCreateRequestSchema,
  ShippingMethodCreateRequestSchema,
  FulfillmentMethodCreateRequestBaseSchema,
]);
export type FulfillmentMethodCreateRequest = z.infer<
  typeof FulfillmentMethodCreateRequestSchema
>;

export const FulfillmentCreateRequestSchema = z
  .object({ methods: z.array(FulfillmentMethodCreateRequestSchema).optional() })
  .catchall(z.any());
export type FulfillmentCreateRequest = z.infer<
  typeof FulfillmentCreateRequestSchema
>;

export const PaymentCreateRequestSchema = z
  .object({ instruments: z.array(SelectedPaymentInstrumentSchema).optional() })
  .catchall(z.any());
export type PaymentCreateRequest = z.infer<typeof PaymentCreateRequestSchema>;

export const CheckoutCreateRequestSchema = z
  .object({
    line_items: z.array(LineItemCreateRequestSchema),
    buyer: BuyerSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    payment: PaymentCreateRequestSchema.optional(),
    cart_id: z.string().optional(),
    discounts: DiscountsObjectCreateRequestSchema.optional(),
    fulfillment: FulfillmentCreateRequestSchema.optional(),
  })
  .catchall(z.any());
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;

export const FulfillmentGroupUpdateRequestSchema = z
  .object({
    id: z.string(),
    selected_option_id: z.union([z.string(), z.null()]).optional(),
  })
  .catchall(z.any());
export type FulfillmentGroupUpdateRequest = z.infer<
  typeof FulfillmentGroupUpdateRequestSchema
>;

export const FulfillmentMethodUpdateRequestBaseSchema = z
  .object({
    id: z.string().optional(),
    type: z
      .string()
      .superRefine((value, ctx) => {
        if ((["pickup", "shipping"] as readonly string[]).includes(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid discriminator value",
            fatal: true,
          });
        }
      })
      .optional(),
    line_item_ids: z.array(z.string()),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupUpdateRequestSchema).optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    for (const [subject, dependents] of [["destinations", ["type"]]] as [
      string,
      string[],
    ][]) {
      if (record[subject] === undefined) continue;
      for (const field of dependents) {
        if (record[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Field is required when ${subject} is present (dependentRequired)`,
          });
      }
    }
  });
export type FulfillmentMethodUpdateRequestBase = z.infer<
  typeof FulfillmentMethodUpdateRequestBaseSchema
>;

export const PickupMethodUpdateRequestSchema = z
  .object({
    id: z.string().optional(),
    type: z.literal("pickup"),
    line_item_ids: z.array(z.string()),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupUpdateRequestSchema).optional(),
  })
  .catchall(z.any());
export type PickupMethodUpdateRequest = z.infer<
  typeof PickupMethodUpdateRequestSchema
>;

export const ShippingDestinationUpdateRequestSchema = z
  .object({
    type: z.literal("shipping_address").optional(),
    id: z.string().optional(),
    extended_address: z.string().optional(),
    street_address: z.string().optional(),
    address_locality: z.string().optional(),
    address_region: z.string().optional(),
    address_country: z.string().optional(),
    postal_code: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().optional(),
  })
  .catchall(z.any());
export type ShippingDestinationUpdateRequest = z.infer<
  typeof ShippingDestinationUpdateRequestSchema
>;

export const ShippingMethodUpdateRequestSchema = z
  .object({
    id: z.string().optional(),
    type: z.literal("shipping"),
    line_item_ids: z.array(z.string()),
    selected_destination_id: z.union([z.string(), z.null()]).optional(),
    groups: z.array(FulfillmentGroupUpdateRequestSchema).optional(),
    destinations: z.array(ShippingDestinationUpdateRequestSchema).optional(),
  })
  .catchall(z.any());
export type ShippingMethodUpdateRequest = z.infer<
  typeof ShippingMethodUpdateRequestSchema
>;

export const FulfillmentMethodUpdateRequestSchema = z.union([
  PickupMethodUpdateRequestSchema,
  ShippingMethodUpdateRequestSchema,
  FulfillmentMethodUpdateRequestBaseSchema,
]);
export type FulfillmentMethodUpdateRequest = z.infer<
  typeof FulfillmentMethodUpdateRequestSchema
>;

export const FulfillmentUpdateRequestSchema = z
  .object({ methods: z.array(FulfillmentMethodUpdateRequestSchema).optional() })
  .catchall(z.any());
export type FulfillmentUpdateRequest = z.infer<
  typeof FulfillmentUpdateRequestSchema
>;

export const PaymentUpdateRequestSchema = z
  .object({
    instruments: z.array(SelectedPaymentInstrumentSchema).optional(),
    selected_term_id: z.string().optional(),
  })
  .catchall(z.any());
export type PaymentUpdateRequest = z.infer<typeof PaymentUpdateRequestSchema>;

export const CheckoutUpdateRequestSchema = z
  .object({
    line_items: z.array(LineItemUpdateRequestSchema),
    buyer: BuyerSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    attribution: AttributionSchema.optional(),
    payment: PaymentUpdateRequestSchema.optional(),
    discounts: DiscountsObjectUpdateRequestSchema.optional(),
    fulfillment: FulfillmentUpdateRequestSchema.optional(),
  })
  .catchall(z.any());
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;

export const ConstraintTargetSchema = z
  .object({ brand: z.string().optional() })
  .catchall(z.any());
export type ConstraintTarget = z.infer<typeof ConstraintTargetSchema>;

export const ContentPartSchema = z
  .object({ type: z.string(), text: z.string().optional() })
  .catchall(z.any());
export type ContentPart = z.infer<typeof ContentPartSchema>;

export const DailyHourSchema = z
  .object({
    opens: z.string().regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$")),
    closes: z.string().regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$")),
    day: z.enum([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]),
  })
  .catchall(z.any());
export type DailyHour = z.infer<typeof DailyHourSchema>;

export const DetailProductOptionSchema = z
  .object({ name: z.string(), values: z.array(DetailOptionValueSchema).min(1) })
  .catchall(z.any());
export type DetailProductOption = z.infer<typeof DetailProductOptionSchema>;

export const VariantBarcodeSchema = z
  .object({ type: z.string(), value: z.string() })
  .catchall(z.any());
export type VariantBarcode = z.infer<typeof VariantBarcodeSchema>;

export const VariantSellerSchema = z
  .object({
    name: z.string().optional(),
    links: z.array(LinkSchema).optional(),
  })
  .catchall(z.any());
export type VariantSeller = z.infer<typeof VariantSellerSchema>;

export const VariantSchema = z
  .object({
    id: z.string(),
    sku: z.string().optional(),
    barcodes: z.array(VariantBarcodeSchema).optional(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price: PriceSchema,
    quantity_unit: QuantityUnitSchema.optional(),
    list_price: PriceSchema.optional(),
    unit_price: UnitPriceSchema.optional(),
    availability: AvailabilitySchema.optional(),
    options: z.array(SelectedOptionSchema).optional(),
    media: z.array(MediaSchema).optional(),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    seller: VariantSellerSchema.optional(),
  })
  .catchall(z.any());
export type Variant = z.infer<typeof VariantSchema>;

export const DetailProductSchema = z
  .object({
    id: z.string(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price_range: PriceRangeSchema,
    list_price_range: PriceRangeSchema.optional(),
    media: z.array(MediaSchema).optional(),
    options: z.array(DetailProductOptionSchema).optional(),
    variants: z.array(VariantSchema).min(1),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    selected: z.array(SelectedOptionSchema).optional(),
  })
  .catchall(z.any());
export type DetailProduct = z.infer<typeof DetailProductSchema>;

export const JsonrpcErrorSchema = z
  .object({
    code: z.number().int(),
    message: z.string(),
    data: z.any().optional(),
  })
  .catchall(z.any());
export type JsonrpcError = z.infer<typeof JsonrpcErrorSchema>;

export const JsonrpcErrorResponseSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema,
    error: JsonrpcErrorSchema,
  })
  .strict();
export type JsonrpcErrorResponse = z.infer<typeof JsonrpcErrorResponseSchema>;

export const EmbeddedErrorResponseSchema = JsonrpcErrorResponseSchema;
export type EmbeddedErrorResponse = z.infer<typeof EmbeddedErrorResponseSchema>;

export const MethodSchema = z
  .string()
  .regex(
    new RegExp("^(ec|ep\\.cart)\\.[a-z][a-z0-9_]*(?:\\.[a-z][a-z0-9_]*)*$")
  );
export type Method = z.infer<typeof MethodSchema>;

export const EmbeddedMessageRequestSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema.optional(),
    method: MethodSchema,
    params: z.record(z.any()),
  })
  .catchall(z.any());
export type EmbeddedMessageRequest = z.infer<
  typeof EmbeddedMessageRequestSchema
>;

export const EmbeddedMessageResponseSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema,
    result: z.record(z.any()),
  })
  .catchall(z.any());
export type EmbeddedMessageResponse = z.infer<
  typeof EmbeddedMessageResponseSchema
>;

export const EmbeddedMessageSchema = z.union([
  EmbeddedMessageRequestSchema,
  EmbeddedMessageResponseSchema,
  EmbeddedErrorResponseSchema,
]);
export type EmbeddedMessage = z.infer<typeof EmbeddedMessageSchema>;

export const UcpErrorSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.literal("error"),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityBaseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type UcpError = z.infer<typeof UcpErrorSchema>;

export const ErrorResponseSchema = z
  .object({
    ucp: UcpErrorSchema,
    messages: z.array(MessageSchema).min(1),
    continue_url: z.string().url().optional(),
  })
  .strict();
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const ExceptionHourSchema = z
  .object({
    opens: z
      .string()
      .regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$"))
      .optional(),
    closes: z
      .string()
      .regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$"))
      .optional(),
    title: z.string().optional(),
    valid_from: z.string().date(),
    valid_through: z.string().date(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    for (const [subject, dependents] of [
      ["closes", ["opens"]],
      ["opens", ["closes"]],
    ] as [string, string[]][]) {
      if (record[subject] === undefined) continue;
      for (const field of dependents) {
        if (record[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Field is required when ${subject} is present (dependentRequired)`,
          });
      }
    }
  });
export type ExceptionHour = z.infer<typeof ExceptionHourSchema>;

export const ExpectationLineItemSchema = z
  .object({
    id: z.string(),
    quantity: z.number().int().gte(1).lte(9007199254740991),
  })
  .catchall(z.any());
export type ExpectationLineItem = z.infer<typeof ExpectationLineItemSchema>;

export const ExpectationSchema = z
  .object({
    id: z.string(),
    line_items: z.array(ExpectationLineItemSchema),
    method_type: z.string(),
    destination: PostalAddressSchema,
    description: z.string().optional(),
    fulfillable_on: z.string().optional(),
  })
  .catchall(z.any());
export type Expectation = z.infer<typeof ExpectationSchema>;

export const FulfillmentBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: BusinessFulfillmentConfigSchema.optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type FulfillmentBusiness = z.infer<typeof FulfillmentBusinessSchema>;

export const FulfillmentEventLineItemSchema = z
  .object({
    id: z.string(),
    quantity: z.number().int().gte(1).lte(9007199254740991),
  })
  .catchall(z.any());
export type FulfillmentEventLineItem = z.infer<
  typeof FulfillmentEventLineItemSchema
>;

export const FulfillmentEventSchema = z
  .object({
    id: z.string(),
    occurred_at: z.string().datetime({ offset: true }),
    type: z.string(),
    line_items: z.array(FulfillmentEventLineItemSchema),
    tracking_number: z.string().optional(),
    tracking_url: z.string().url().optional(),
    carrier: z.string().optional(),
    description: z.string().optional(),
  })
  .catchall(z.any());
export type FulfillmentEvent = z.infer<typeof FulfillmentEventSchema>;

export const PlatformFulfillmentConfigSchema = z
  .object({ supports_multi_group: z.boolean().optional() })
  .catchall(z.any());
export type PlatformFulfillmentConfig = z.infer<
  typeof PlatformFulfillmentConfigSchema
>;

export const FulfillmentPlatformSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: PlatformFulfillmentConfigSchema.optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type FulfillmentPlatform = z.infer<typeof FulfillmentPlatformSchema>;

export const GeoSchema = z
  .object({
    latitude: z.number().gte(-90).lte(90),
    longitude: z.number().gte(-180).lte(180),
  })
  .catchall(z.any());
export type Geo = z.infer<typeof GeoSchema>;

export const Oauth2ProviderSchema = z
  .object({
    type: z.literal("oauth2"),
    auth_url: z.string().url(),
    required_claims: z
      .array(z.string())
      .refine(
        (items) =>
          new Set(items.map((item) => JSON.stringify(item))).size ===
          items.length,
        { message: "Array items must be unique (uniqueItems)" }
      )
      .optional(),
  })
  .catchall(z.any());
export type Oauth2Provider = z.infer<typeof Oauth2ProviderSchema>;

export const ProviderBaseSchema = z
  .object({
    type: z.string().superRefine((value, ctx) => {
      if ((["oauth2"] as readonly string[]).includes(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid discriminator value",
          fatal: true,
        });
      }
    }),
  })
  .catchall(z.any());
export type ProviderBase = z.infer<typeof ProviderBaseSchema>;

export const ProviderSchema = z.union([
  Oauth2ProviderSchema,
  ProviderBaseSchema,
]);
export type Provider = z.infer<typeof ProviderSchema>;

export const ScopePolicySchema = z
  .object({ description: DescriptionSchema.optional() })
  .catchall(z.any());
export type ScopePolicy = z.infer<typeof ScopePolicySchema>;

export const ScopeTokenSchema = z
  .string()
  .regex(
    new RegExp(
      "^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+:[a-z][a-z0-9_]*$"
    )
  );
export type ScopeToken = z.infer<typeof ScopeTokenSchema>;

export const IdentityLinkingBusinessSchemaConfigSchema = z
  .object({
    providers: z
      .record(ReverseDomainNameSchema, z.array(ProviderSchema))
      .optional(),
    scopes: z.record(ScopeTokenSchema, ScopePolicySchema),
  })
  .catchall(z.any());
export type IdentityLinkingBusinessSchemaConfig = z.infer<
  typeof IdentityLinkingBusinessSchemaConfigSchema
>;

export const IdentityLinkingBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: IdentityLinkingBusinessSchemaConfigSchema,
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type IdentityLinkingBusiness = z.infer<
  typeof IdentityLinkingBusinessSchema
>;

export const IdentityLinkingPlatformSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type IdentityLinkingPlatform = z.infer<
  typeof IdentityLinkingPlatformSchema
>;

export const JsonrpcRequestSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema.optional(),
    method: z.string().min(1),
    params: z.union([z.record(z.any()), z.array(z.any())]).optional(),
  })
  .strict();
export type JsonrpcRequest = z.infer<typeof JsonrpcRequestSchema>;

export const JsonrpcSuccessResponseSchema = z
  .object({ jsonrpc: z.literal("2.0"), id: IdSchema, result: z.any() })
  .strict();
export type JsonrpcSuccessResponse = z.infer<
  typeof JsonrpcSuccessResponseSchema
>;

export const JsonrpcSchema = z.union([
  JsonrpcRequestSchema,
  JsonrpcSuccessResponseSchema,
  JsonrpcErrorResponseSchema,
]);
export type Jsonrpc = z.infer<typeof JsonrpcSchema>;

export const JwkPublicKeySchema = z
  .object({
    kid: z.string(),
    kty: z.string(),
    crv: z.string().optional(),
    x: z.string().optional(),
    y: z.string().optional(),
    alg: z.string().optional(),
    use: z.string().optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    for (const rule of [
      {
        kind: "required",
        discriminator: "kty",
        values: ["EC"],
        negated: false,
        required: ["crv", "x", "y"],
        field: null,
        format: null,
        target: null,
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
      },
      {
        kind: "required",
        discriminator: "kty",
        values: ["OKP"],
        negated: false,
        required: ["crv", "x"],
        field: null,
        format: null,
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
      if (rule.kind === "format") {
        const field = rule.field;
        const fieldValue = field === null ? undefined : record[field];
        if (rule.format === "uri" && typeof fieldValue === "string") {
          if (!z.string().url().safeParse(fieldValue).success && field !== null)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: "Value must be a valid URI",
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
export type JwkPublicKey = z.infer<typeof JwkPublicKeySchema>;

export const LocalitySchema = z
  .object({
    address_country: z.string().optional(),
    address_region: z.string().optional(),
    postal_code: z.string().optional(),
  })
  .catchall(z.any());
export type Locality = z.infer<typeof LocalitySchema>;

export const LocationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    address: PostalAddressSchema.optional(),
    geo: GeoSchema.optional(),
    amenities: z.record(AmenityTypeSchema, AmenitySchema).optional(),
    hours: z.array(DailyHourSchema).optional(),
    exception_hours: z.array(ExceptionHourSchema).optional(),
    timezone: z.string().optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    for (const [subject, dependents] of [
      ["exception_hours", ["timezone"]],
      ["hours", ["timezone"]],
    ] as [string, string[]][]) {
      if (record[subject] === undefined) continue;
      for (const field of dependents) {
        if (record[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Field is required when ${subject} is present (dependentRequired)`,
          });
      }
    }
  });
export type Location = z.infer<typeof LocationSchema>;

export const LocationDistanceSchema = z
  .object({ center: GeoSchema, max: z.number().gte(0) })
  .catchall(z.any());
export type LocationDistance = z.infer<typeof LocationDistanceSchema>;

export const LocationFilterHoursSchema = z
  .object({
    open_at: z
      .string()
      .datetime({ offset: true })
      .regex(new RegExp("(?:[Zz]|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$")),
  })
  .catchall(z.any());
export type LocationFilterHours = z.infer<typeof LocationFilterHoursSchema>;

export const LocationFilterSchema = z
  .object({
    hours: LocationFilterHoursSchema.optional(),
    amenities: z.array(AmenityTypeSchema).optional(),
    items: z
      .array(z.string().min(1))
      .min(1)
      .refine(
        (items) =>
          new Set(items.map((item) => JSON.stringify(item))).size ===
          items.length,
        { message: "Array items must be unique (uniqueItems)" }
      )
      .optional(),
  })
  .catchall(z.any());
export type LocationFilter = z.infer<typeof LocationFilterSchema>;

export const LocationServesAddressCountrySchema = z
  .object({
    address_country: z.string().min(1),
    address_region: z.string().optional(),
    postal_code: z.string().optional(),
  })
  .catchall(z.any());
export type LocationServesAddressCountry = z.infer<
  typeof LocationServesAddressCountrySchema
>;

export const LocationServesAddressPostalCodeSchema = z
  .object({
    address_country: z.string().optional(),
    address_region: z.string().optional(),
    postal_code: z.string().min(1),
  })
  .catchall(z.any());
export type LocationServesAddressPostalCode = z.infer<
  typeof LocationServesAddressPostalCodeSchema
>;

export const LocationServesAddressRegionSchema = z
  .object({
    address_country: z.string().optional(),
    address_region: z.string().min(1),
    postal_code: z.string().optional(),
  })
  .catchall(z.any());
export type LocationServesAddressRegion = z.infer<
  typeof LocationServesAddressRegionSchema
>;

export const LocationServesSchema = z
  .object({
    point: GeoSchema.optional(),
    address: z
      .union([
        LocationServesAddressCountrySchema,
        LocationServesAddressRegionSchema,
        LocationServesAddressPostalCodeSchema,
      ])
      .optional(),
  })
  .catchall(z.any())
  .refine((value) => Object.keys(value).length >= 1, {
    message: "Object must contain at least 1 property(ies) (minProperties)",
  })
  .refine((value) => Object.keys(value).length <= 1, {
    message: "Object must contain at most 1 property(ies) (maxProperties)",
  });
export type LocationServes = z.infer<typeof LocationServesSchema>;

export const LocationLookupRequestSchema = z
  .object({
    ids: z.array(z.string()).min(1),
    distance: LocationDistanceSchema.optional(),
    serves: LocationServesSchema.optional(),
    filters: LocationFilterSchema.optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
  })
  .catchall(z.any());
export type LocationLookupRequest = z.infer<typeof LocationLookupRequestSchema>;

export const LookupLocationInputSchema = z
  .object({ id: z.string() })
  .catchall(z.any());
export type LookupLocationInput = z.infer<typeof LookupLocationInputSchema>;

export const LookupLocationSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    address: PostalAddressSchema.optional(),
    geo: GeoSchema.optional(),
    amenities: z.record(AmenityTypeSchema, AmenitySchema).optional(),
    hours: z.array(DailyHourSchema).optional(),
    exception_hours: z.array(ExceptionHourSchema).optional(),
    timezone: z.string().optional(),
    inputs: z.array(LookupLocationInputSchema).min(1),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    for (const [subject, dependents] of [
      ["exception_hours", ["timezone"]],
      ["hours", ["timezone"]],
    ] as [string, string[]][]) {
      if (record[subject] === undefined) continue;
      for (const field of dependents) {
        if (record[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Field is required when ${subject} is present (dependentRequired)`,
          });
      }
    }
  });
export type LookupLocation = z.infer<typeof LookupLocationSchema>;

export const ResponseLocationSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityResponseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type ResponseLocation = z.infer<typeof ResponseLocationSchema>;

export const LocationLookupResponseSchema = z
  .object({
    ucp: ResponseLocationSchema,
    locations: z.array(LookupLocationSchema),
    messages: z.array(MessageSchema).optional(),
  })
  .catchall(z.any());
export type LocationLookupResponse = z.infer<
  typeof LocationLookupResponseSchema
>;

export const LocationSearchRequestSchema = z
  .object({
    query: z.string().optional(),
    context: ContextSchema.optional(),
    signals: SignalsSchema.optional(),
    distance: LocationDistanceSchema.optional(),
    serves: LocationServesSchema.optional(),
    filters: LocationFilterSchema.optional(),
    pagination: PaginationRequestSchema.optional(),
  })
  .catchall(z.any());
export type LocationSearchRequest = z.infer<typeof LocationSearchRequestSchema>;

export const LocationSearchResponseSchema = z
  .object({
    ucp: ResponseLocationSchema,
    locations: z.array(LocationSchema),
    pagination: PaginationResponseSchema.optional(),
    messages: z.array(MessageSchema).optional(),
  })
  .catchall(z.any());
export type LocationSearchResponse = z.infer<
  typeof LocationSearchResponseSchema
>;

export const LocationSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    address: PostalAddressSchema.optional(),
  })
  .catchall(z.any());
export type LocationSummary = z.infer<typeof LocationSummarySchema>;

export const LookupVariantBarcodeSchema = z
  .object({ type: z.string(), value: z.string() })
  .catchall(z.any());
export type LookupVariantBarcode = z.infer<typeof LookupVariantBarcodeSchema>;

export const LookupVariantSellerSchema = z
  .object({
    name: z.string().optional(),
    links: z.array(LinkSchema).optional(),
  })
  .catchall(z.any());
export type LookupVariantSeller = z.infer<typeof LookupVariantSellerSchema>;

export const LookupVariantSchema = z
  .object({
    id: z.string(),
    sku: z.string().optional(),
    barcodes: z.array(LookupVariantBarcodeSchema).optional(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price: PriceSchema,
    quantity_unit: QuantityUnitSchema.optional(),
    list_price: PriceSchema.optional(),
    unit_price: UnitPriceSchema.optional(),
    availability: AvailabilitySchema.optional(),
    options: z.array(SelectedOptionSchema).optional(),
    media: z.array(MediaSchema).optional(),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
    seller: LookupVariantSellerSchema.optional(),
    inputs: z.array(InputCorrelationSchema).min(1),
  })
  .catchall(z.any());
export type LookupVariant = z.infer<typeof LookupVariantSchema>;

export const McpToolCallRequestParamsSchema = z
  .object({ name: z.string().min(1), arguments: ArgumentsSchema })
  .catchall(z.any());
export type McpToolCallRequestParams = z.infer<
  typeof McpToolCallRequestParamsSchema
>;

export const McpToolCallRequestSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema.optional(),
    method: z.literal("tools/call"),
    params: McpToolCallRequestParamsSchema,
  })
  .catchall(z.any());
export type McpToolCallRequest = z.infer<typeof McpToolCallRequestSchema>;

export const McpToolCallResponseResultSchema = z
  .object({
    structuredContent: z.record(z.any()),
    content: z.array(ContentPartSchema).optional(),
  })
  .catchall(z.any());
export type McpToolCallResponseResult = z.infer<
  typeof McpToolCallResponseResultSchema
>;

export const McpToolCallResponseSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: IdSchema,
    result: McpToolCallResponseResultSchema,
  })
  .catchall(z.any());
export type McpToolCallResponse = z.infer<typeof McpToolCallResponseSchema>;

export const McpToolCallSchema = z.union([
  McpToolCallRequestSchema,
  McpToolCallResponseSchema,
  JsonrpcErrorResponseSchema,
]);
export type McpToolCall = z.infer<typeof McpToolCallSchema>;

export const RequestConstraintsSchema = z
  .object({
    path: z.string().optional(),
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
    properties: z
      .record(z.union([ConstraintExpressionSchema, ValueConstraintSchema]))
      .refine((value) => Object.keys(value).length >= 1, {
        message: "Object must contain at least 1 property(ies) (minProperties)",
      })
      .optional(),
    anyOf: z.array(ConstraintExpressionSchema).min(1).optional(),
  })
  .strict();
export type RequestConstraints = z.infer<typeof RequestConstraintsSchema>;

export const MembersSchema = z
  .object({
    map_order: MapOrderSchema.optional(),
    request_constraints: RequestConstraintsSchema.optional(),
  })
  .catchall(z.any());
export type Members = z.infer<typeof MembersSchema>;

export const NetworkTokenCredentialSchema = z
  .object({
    type: z.literal("network_token"),
    number: z.string(),
    expiry_month: z.number().int().optional(),
    expiry_year: z.number().int().optional(),
    name: z.string().optional(),
    cryptogram: z.string(),
    eci_value: z.string().optional(),
    token_requestor_id: z.string().optional(),
  })
  .catchall(z.any());
export type NetworkTokenCredential = z.infer<
  typeof NetworkTokenCredentialSchema
>;

export const OrderFulfillmentSchema = z
  .object({
    expectations: z.array(ExpectationSchema).optional(),
    events: z.array(FulfillmentEventSchema).optional(),
  })
  .catchall(z.any());
export type OrderFulfillment = z.infer<typeof OrderFulfillmentSchema>;

export const OrderLineItemQuantitySchema = z
  .object({
    original: z.number().int().gte(0).lte(9007199254740991).optional(),
    total: z.number().int().gte(0).lte(9007199254740991),
    fulfilled: z.number().int().gte(0).lte(9007199254740991),
  })
  .catchall(z.any());
export type OrderLineItemQuantity = z.infer<typeof OrderLineItemQuantitySchema>;

export const OrderLineItemSchema = z
  .object({
    id: z.string(),
    item: ItemSchema,
    quantity: OrderLineItemQuantitySchema,
    totals: z.array(TotalSchema),
    status: z.enum(["processing", "partial", "fulfilled", "removed"]),
    parent_id: z.string().optional(),
  })
  .catchall(z.any());
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;

export const OrderPaymentSchema = z
  .object({ accepted_term: PaymentTermSchema.optional() })
  .catchall(z.any());
export type OrderPayment = z.infer<typeof OrderPaymentSchema>;

export const ResponseOrderSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityResponseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type ResponseOrder = z.infer<typeof ResponseOrderSchema>;

export const OrderSchema = z
  .object({
    ucp: ResponseOrderSchema,
    id: z.string(),
    label: z.string().optional(),
    checkout_id: z.string(),
    permalink_url: z.string().url(),
    line_items: z.array(OrderLineItemSchema),
    fulfillment: OrderFulfillmentSchema,
    adjustments: z.array(AdjustmentSchema).optional(),
    currency: z.string(),
    totals: TotalsSchema,
    policies: z.array(PolicySchema).optional(),
    messages: z.array(MessageSchema).optional(),
    attribution: AttributionSchema.optional(),
    payment: OrderPaymentSchema.optional(),
  })
  .catchall(z.any());
export type Order = z.infer<typeof OrderSchema>;

export const OrderPlatformSchema = z
  .object({ webhook_url: z.string().url() })
  .catchall(z.any());
export type OrderPlatform = z.infer<typeof OrderPlatformSchema>;

export const PanCredentialSchema = z
  .object({
    type: z.literal("pan"),
    number: z.string(),
    expiry_month: z.number().int().optional(),
    expiry_year: z.number().int().optional(),
    name: z.string().optional(),
    cvc: z.string().max(4).optional(),
  })
  .catchall(z.any());
export type PanCredential = z.infer<typeof PanCredentialSchema>;

export const PaymentAp2MandateErrorCodeSchema = z.enum([
  "mandate_required",
  "agent_missing_key",
  "mandate_invalid_signature",
  "mandate_expired",
  "mandate_scope_mismatch",
  "merchant_authorization_invalid",
  "merchant_authorization_missing",
]);
export type PaymentAp2MandateErrorCode = z.infer<
  typeof PaymentAp2MandateErrorCodeSchema
>;

export const PaymentHandlerBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string(),
    config: z.record(z.any()).optional(),
    available_instruments: z
      .array(AvailablePaymentInstrumentSchema)
      .min(1)
      .optional(),
  })
  .catchall(z.any());
export type PaymentHandlerBusiness = z.infer<
  typeof PaymentHandlerBusinessSchema
>;

export const PaymentHandlerPlatformSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string(),
    config: z.record(z.any()).optional(),
    available_instruments: z
      .array(AvailablePaymentInstrumentSchema)
      .min(1)
      .optional(),
  })
  .catchall(z.any());
export type PaymentHandlerPlatform = z.infer<
  typeof PaymentHandlerPlatformSchema
>;

export const PaymentIdentitySchema = z
  .object({ access_token: z.string() })
  .catchall(z.any());
export type PaymentIdentity = z.infer<typeof PaymentIdentitySchema>;

export const PaymentInstrumentSchema = z
  .object({
    id: z.string(),
    handler_id: z.string(),
    type: z.string(),
    billing_address: PostalAddressSchema.optional(),
    credential: PaymentCredentialSchema.optional(),
    display: z.record(z.any()).optional(),
    amount: AmountSchema.optional(),
  })
  .catchall(z.any());
export type PaymentInstrument = z.infer<typeof PaymentInstrumentSchema>;

export const PaymentSplitPaymentsBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: BusinessSplitPaymentsConfigSchema.optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type PaymentSplitPaymentsBusiness = z.infer<
  typeof PaymentSplitPaymentsBusinessSchema
>;

export const PermalinkEndpointSchema = z
  .string()
  .url()
  .regex(
    new RegExp("^https://[^/?#\\s\\\\@]+(?:/[^?#\\s\\\\]*[^/?#\\s\\\\])?$")
  );
export type PermalinkEndpoint = z.infer<typeof PermalinkEndpointSchema>;

export const PermalinkConfigSchema = z
  .object({ endpoint: PermalinkEndpointSchema })
  .catchall(z.any());
export type PermalinkConfig = z.infer<typeof PermalinkConfigSchema>;

export const PermalinkBusinessSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: PermalinkConfigSchema,
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type PermalinkBusiness = z.infer<typeof PermalinkBusinessSchema>;

export const PermalinkPlatformSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type PermalinkPlatform = z.infer<typeof PermalinkPlatformSchema>;

export const PermalinkResponseSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    extends: z
      .union([ReverseDomainNameSchema, z.array(ReverseDomainNameSchema).min(1)])
      .optional(),
  })
  .catchall(z.any());
export type PermalinkResponse = z.infer<typeof PermalinkResponseSchema>;

export const ProductSchema = z
  .object({
    id: z.string(),
    handle: z.string().optional(),
    title: z.string(),
    description: DescriptionSchema,
    url: z.string().url().optional(),
    categories: z.array(CategorySchema).optional(),
    price_range: PriceRangeSchema,
    list_price_range: PriceRangeSchema.optional(),
    media: z.array(MediaSchema).optional(),
    options: z.array(ProductOptionSchema).optional(),
    variants: z.array(VariantSchema).min(1),
    rating: RatingSchema.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type Product = z.infer<typeof ProductSchema>;

export const UcpBaseSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityBaseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type UcpBase = z.infer<typeof UcpBaseSchema>;

export const ProfileSchema = z
  .object({ ucp: UcpBaseSchema, keys: z.array(JwkPublicKeySchema).optional() })
  .catchall(z.any());
export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileBaseSchema = z
  .object({ ucp: UcpBaseSchema, keys: z.array(JwkPublicKeySchema).optional() })
  .catchall(z.any());
export type ProfileBase = z.infer<typeof ProfileBaseSchema>;

export const ServiceBusinessSchemaA2aSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("a2a"),
    endpoint: z.string().url(),
  })
  .catchall(z.any());
export type ServiceBusinessSchemaA2a = z.infer<
  typeof ServiceBusinessSchemaA2aSchema
>;

export const ServiceBusinessSchemaEmbeddedSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: EmbeddedConfigSchema.optional(),
    transport: z.literal("embedded"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServiceBusinessSchemaEmbedded = z.infer<
  typeof ServiceBusinessSchemaEmbeddedSchema
>;

export const ServiceBusinessSchemaMcpSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("mcp"),
    endpoint: z.string().url(),
  })
  .catchall(z.any());
export type ServiceBusinessSchemaMcp = z.infer<
  typeof ServiceBusinessSchemaMcpSchema
>;

export const ServiceBusinessSchemaRestSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("rest"),
    endpoint: z.string().url(),
  })
  .catchall(z.any());
export type ServiceBusinessSchemaRest = z.infer<
  typeof ServiceBusinessSchemaRestSchema
>;

export const ServiceBusinessSchema = z.union([
  ServiceBusinessSchemaRestSchema,
  ServiceBusinessSchemaMcpSchema,
  ServiceBusinessSchemaA2aSchema,
  ServiceBusinessSchemaEmbeddedSchema,
]);
export type ServiceBusiness = z.infer<typeof ServiceBusinessSchema>;

export const UcpBusinessSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z.record(ReverseDomainNameSchema, z.array(ServiceBusinessSchema)),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityBusinessSchema))
      .optional(),
    payment_handlers: z.record(
      ReverseDomainNameSchema,
      z.array(PaymentHandlerBusinessSchema)
    ),
    supported_versions: z.record(VersionSchema, z.string().url()).optional(),
  })
  .catchall(z.any());
export type UcpBusiness = z.infer<typeof UcpBusinessSchema>;

export const ProfileBusinessSchema = z
  .object({
    ucp: UcpBusinessSchema,
    keys: z.array(JwkPublicKeySchema).optional(),
  })
  .catchall(z.any());
export type ProfileBusiness = z.infer<typeof ProfileBusinessSchema>;

export const ServicePlatformSchemaA2aSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("a2a"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServicePlatformSchemaA2a = z.infer<
  typeof ServicePlatformSchemaA2aSchema
>;

export const ServicePlatformSchemaEmbeddedSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("embedded"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServicePlatformSchemaEmbedded = z.infer<
  typeof ServicePlatformSchemaEmbeddedSchema
>;

export const ServicePlatformSchemaMcpSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("mcp"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServicePlatformSchemaMcp = z.infer<
  typeof ServicePlatformSchemaMcpSchema
>;

export const ServicePlatformSchemaRestSchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url(),
    schema: z.string().url(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
    transport: z.literal("rest"),
    endpoint: z.string().url().optional(),
  })
  .catchall(z.any());
export type ServicePlatformSchemaRest = z.infer<
  typeof ServicePlatformSchemaRestSchema
>;

export const ServicePlatformSchema = z.union([
  ServicePlatformSchemaRestSchema,
  ServicePlatformSchemaMcpSchema,
  ServicePlatformSchemaA2aSchema,
  ServicePlatformSchemaEmbeddedSchema,
]);
export type ServicePlatform = z.infer<typeof ServicePlatformSchema>;

export const UcpPlatformSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.enum(["success", "error"]).optional(),
    services: z.record(ReverseDomainNameSchema, z.array(ServicePlatformSchema)),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityPlatformSchema))
      .optional(),
    payment_handlers: z.record(
      ReverseDomainNameSchema,
      z.array(PaymentHandlerPlatformSchema)
    ),
  })
  .catchall(z.any());
export type UcpPlatform = z.infer<typeof UcpPlatformSchema>;

export const ProfilePlatformSchema = z
  .object({
    ucp: UcpPlatformSchema,
    keys: z.array(JwkPublicKeySchema).optional(),
  })
  .catchall(z.any());
export type ProfilePlatform = z.infer<typeof ProfilePlatformSchema>;

export const VersionConstraintSchema = z
  .object({ min: VersionSchema, max: VersionSchema.optional() })
  .catchall(z.any());
export type VersionConstraint = z.infer<typeof VersionConstraintSchema>;

export const RequiresSchema = z
  .object({
    protocol: VersionConstraintSchema.optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, VersionConstraintSchema)
      .optional(),
  })
  .catchall(z.any());
export type Requires = z.infer<typeof RequiresSchema>;

export const SearchFiltersSchema = z
  .object({
    categories: z.array(z.string()).optional(),
    price: PriceFilterSchema.optional(),
  })
  .catchall(z.any());
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

export const SuccessSchema = z
  .object({
    version: VersionSchema,
    map_order: MapOrderSchema.optional(),
    status: z.literal("success"),
    services: z
      .record(ReverseDomainNameSchema, z.array(ServiceBaseSchema))
      .optional(),
    capabilities: z
      .record(ReverseDomainNameSchema, z.array(CapabilityBaseSchema))
      .optional(),
    payment_handlers: z
      .record(ReverseDomainNameSchema, z.array(PaymentHandlerBaseSchema))
      .optional(),
  })
  .catchall(z.any());
export type Success = z.infer<typeof SuccessSchema>;

export const TimeIntervalSchema = z
  .object({
    opens: z
      .string()
      .regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$"))
      .optional(),
    closes: z
      .string()
      .regex(new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9]$"))
      .optional(),
  })
  .catchall(z.any())
  .superRefine((value, ctx) => {
    const record = value as Record<string, unknown>;
    for (const [subject, dependents] of [
      ["closes", ["opens"]],
      ["opens", ["closes"]],
    ] as [string, string[]][]) {
      if (record[subject] === undefined) continue;
      for (const field of dependents) {
        if (record[field] === undefined)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message: `Field is required when ${subject} is present (dependentRequired)`,
          });
      }
    }
  });
export type TimeInterval = z.infer<typeof TimeIntervalSchema>;

export const TokenCredentialSchema = z
  .object({ type: z.string() })
  .catchall(z.any());
export type TokenCredential = z.infer<typeof TokenCredentialSchema>;

export const UcpEntitySchema = z
  .object({
    version: VersionSchema,
    spec: z.string().url().optional(),
    schema: z.string().url().optional(),
    id: z.string().optional(),
    config: z.record(z.any()).optional(),
  })
  .catchall(z.any());
export type UcpEntity = z.infer<typeof UcpEntitySchema>;

export const UnitSchema = z
  .object({
    unit: z.string(),
    scale: z.number().int().gte(0).lte(15).optional(),
    display_text: z.string(),
  })
  .catchall(z.any());
export type Unit = z.infer<typeof UnitSchema>;

export const BusinessLocationDestinationSchema = LocationDestinationSchema;
export type BusinessLocationDestination = LocationDestination;

export const BusinessLocationDestinationResponseSchema =
  LocationDestinationSchema;
export type BusinessLocationDestinationResponse = LocationDestination;

export const CapabilitySchema = CapabilityResponseSchema;
export type Capability = CapabilityResponse;

export const CapabilityDiscoverySchema = CapabilityPlatformSchema;
export type CapabilityDiscovery = CapabilityPlatform;

export const CartResponseSchema = CartSchema;
export type CartResponse = Cart;

export const CatalogLookupRequestSignalsSchema = SignalsSchema;
export type CatalogLookupRequestSignals = Signals;

export const CheckoutCreateRequestContextSchema = ContextSchema;
export type CheckoutCreateRequestContext = Context;

export const CheckoutCreateRequestSignalsSchema = SignalsSchema;
export type CheckoutCreateRequestSignals = Signals;

export const CheckoutResponseSchema = CheckoutSchema;
export type CheckoutResponse = Checkout;

export const CheckoutResponseMessageSchema = MessageSchema;
export type CheckoutResponseMessage = Message;

export const CheckoutWithFulfillmentCreateRequestSchema =
  CheckoutCreateRequestSchema;
export type CheckoutWithFulfillmentCreateRequest = CheckoutCreateRequest;

export const CheckoutWithFulfillmentUpdateRequestSchema =
  CheckoutUpdateRequestSchema;
export type CheckoutWithFulfillmentUpdateRequest = CheckoutUpdateRequest;

export const DiscoveryProfileSchema = ProfileBusinessSchema;
export type DiscoveryProfile = ProfileBusiness;

export const EmbeddedSchema = EmbeddedConfigSchema;
export type Embedded = EmbeddedConfig;

export const FulfillmentAvailableMethodResponseSchema =
  FulfillmentAvailableMethodSchema;
export type FulfillmentAvailableMethodResponse = FulfillmentAvailableMethod;

export const FulfillmentDestinationResponseSchema =
  FulfillmentDestinationSchema;
export type FulfillmentDestinationResponse = FulfillmentDestination;

export const FulfillmentExpectationLineItemSchema = ExpectationLineItemSchema;
export type FulfillmentExpectationLineItem = ExpectationLineItem;

export const FulfillmentGroupResponseSchema = FulfillmentGroupSchema;
export type FulfillmentGroupResponse = FulfillmentGroup;

export const FulfillmentMethodResponseSchema = FulfillmentMethodSchema;
export type FulfillmentMethodResponse = FulfillmentMethod;

export const FulfillmentOptionBaseResponseSchema = FulfillmentOptionBaseSchema;
export type FulfillmentOptionBaseResponse = FulfillmentOptionBase;

export const FulfillmentOptionResponseSchema = FulfillmentOptionSchema;
export type FulfillmentOptionResponse = FulfillmentOption;

export const FulfillmentResponseSchema = FulfillmentSchema;
export type FulfillmentResponse = Fulfillment;

export const GetProductRequestSchema = CatalogGetProductRequestSchema;
export type GetProductRequest = CatalogGetProductRequest;

export const GetProductResponseSchema = CatalogGetProductResponseSchema;
export type GetProductResponse = CatalogGetProductResponse;

export const ItemResponseSchema = ItemSchema;
export type ItemResponse = Item;

export const LineItemQuantityRefSchema = AdjustmentLineItemSchema;
export type LineItemQuantityRef = AdjustmentLineItem;

export const LineItemResponseSchema = LineItemSchema;
export type LineItemResponse = LineItem;

export const LookupRequestSchema = CatalogLookupRequestSchema;
export type LookupRequest = CatalogLookupRequest;

export const LookupRequestSignalsSchema = SignalsSchema;
export type LookupRequestSignals = Signals;

export const LookupResponseSchema = CatalogLookupResponseSchema;
export type LookupResponse = CatalogLookupResponse;

export const LookupResponseMessageSchema = MessageSchema;
export type LookupResponseMessage = Message;

export const PaymentHandlerSchema = PaymentHandlerResponseSchema;
export type PaymentHandler = PaymentHandlerResponse;

export const PickupMethodResponseSchema = PickupMethodSchema;
export type PickupMethodResponse = PickupMethod;

export const SearchRequestSchema = CatalogSearchRequestSchema;
export type SearchRequest = CatalogSearchRequest;

export const SearchResponseSchema = CatalogSearchResponseSchema;
export type SearchResponse = CatalogSearchResponse;

export const SearchResponsePaginationSchema = PaginationResponseSchema;
export type SearchResponsePagination = PaginationResponse;

export const ServiceSchema = ServiceResponseSchema;
export type Service = ServiceResponse;

export const ShippingDestinationResponseSchema = ShippingDestinationSchema;
export type ShippingDestinationResponse = ShippingDestination;

export const ShippingMethodResponseSchema = ShippingMethodSchema;
export type ShippingMethodResponse = ShippingMethod;

export const TotalResponseSchema = TotalSchema;
export type TotalResponse = Total;

export const TotalsResponseSchema = TotalsItemSchema;
export type TotalsResponse = TotalsItem;

export const UcpSchema = UcpBusinessSchema;
export type Ucp = UcpBusiness;

export const UcpCheckoutResponseSchema = ResponseCheckoutSchema;
export type UcpCheckoutResponse = ResponseCheckout;

export const UcpDiscoveryProfileSchema = ProfileBusinessSchema;
export type UcpDiscoveryProfile = ProfileBusiness;

export const UcpProfileDocumentSchema = ProfileSchema;
export type UcpProfileDocument = Profile;

export const UcpServiceSchema = ServiceBusinessSchema;
export type UcpService = ServiceBusiness;

export const UcpResponseSchema = ResponseCheckoutSchema.partial({
  payment_handlers: true,
});
export type UcpResponse = z.infer<typeof UcpResponseSchema>;
