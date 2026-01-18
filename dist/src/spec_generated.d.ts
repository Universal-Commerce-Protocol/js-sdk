import * as z from "zod";
export declare const UseSchema: z.ZodEnum<["enc", "sig"]>;
export type Use = z.infer<typeof UseSchema>;
export declare const TotalResponseTypeSchema: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
export type TotalResponseType = z.infer<typeof TotalResponseTypeSchema>;
export declare const ContentTypeSchema: z.ZodEnum<["markdown", "plain"]>;
export type ContentType = z.infer<typeof ContentTypeSchema>;
export declare const SeveritySchema: z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>;
export type Severity = z.infer<typeof SeveritySchema>;
export declare const MessageTypeSchema: z.ZodEnum<["error", "info", "warning"]>;
export type MessageType = z.infer<typeof MessageTypeSchema>;
export declare const CardNumberTypeSchema: z.ZodEnum<["dpan", "fpan", "network_token"]>;
export type CardNumberType = z.infer<typeof CardNumberTypeSchema>;
export declare const CardPaymentInstrumentTypeSchema: z.ZodEnum<["card"]>;
export type CardPaymentInstrumentType = z.infer<typeof CardPaymentInstrumentTypeSchema>;
export declare const CheckoutResponseStatusSchema: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
export type CheckoutResponseStatus = z.infer<typeof CheckoutResponseStatusSchema>;
export declare const AdjustmentStatusSchema: z.ZodEnum<["completed", "failed", "pending"]>;
export type AdjustmentStatus = z.infer<typeof AdjustmentStatusSchema>;
export declare const MethodTypeSchema: z.ZodEnum<["digital", "pickup", "shipping"]>;
export type MethodType = z.infer<typeof MethodTypeSchema>;
export declare const LineItemStatusSchema: z.ZodEnum<["fulfilled", "partial", "processing"]>;
export type LineItemStatus = z.infer<typeof LineItemStatusSchema>;
export declare const TypeElementSchema: z.ZodEnum<["pickup", "shipping"]>;
export type TypeElement = z.infer<typeof TypeElementSchema>;
export declare const MessageErrorTypeSchema: z.ZodEnum<["error"]>;
export type MessageErrorType = z.infer<typeof MessageErrorTypeSchema>;
export declare const MessageInfoTypeSchema: z.ZodEnum<["info"]>;
export type MessageInfoType = z.infer<typeof MessageInfoTypeSchema>;
export declare const MessageWarningTypeSchema: z.ZodEnum<["warning"]>;
export type MessageWarningType = z.infer<typeof MessageWarningTypeSchema>;
export declare const MethodSchema: z.ZodEnum<["across", "each"]>;
export type Method = z.infer<typeof MethodSchema>;
export declare const PaymentHandlerResponseSchema: z.ZodObject<{
    config: z.ZodRecord<z.ZodString, z.ZodAny>;
    config_schema: z.ZodString;
    id: z.ZodString;
    instrument_schemas: z.ZodArray<z.ZodString, "many">;
    name: z.ZodString;
    spec: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    config: Record<string, any>;
    config_schema: string;
    id: string;
    instrument_schemas: string[];
    name: string;
    spec: string;
    version: string;
}, {
    config: Record<string, any>;
    config_schema: string;
    id: string;
    instrument_schemas: string[];
    name: string;
    spec: string;
    version: string;
}>;
export type PaymentHandlerResponse = z.infer<typeof PaymentHandlerResponseSchema>;
export declare const SigningKeySchema: z.ZodObject<{
    alg: z.ZodOptional<z.ZodString>;
    crv: z.ZodOptional<z.ZodString>;
    e: z.ZodOptional<z.ZodString>;
    kid: z.ZodString;
    kty: z.ZodString;
    n: z.ZodOptional<z.ZodString>;
    use: z.ZodOptional<z.ZodEnum<["enc", "sig"]>>;
    x: z.ZodOptional<z.ZodString>;
    y: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    kid: string;
    kty: string;
    alg?: string | undefined;
    crv?: string | undefined;
    e?: string | undefined;
    n?: string | undefined;
    use?: "enc" | "sig" | undefined;
    x?: string | undefined;
    y?: string | undefined;
}, {
    kid: string;
    kty: string;
    alg?: string | undefined;
    crv?: string | undefined;
    e?: string | undefined;
    n?: string | undefined;
    use?: "enc" | "sig" | undefined;
    x?: string | undefined;
    y?: string | undefined;
}>;
export type SigningKey = z.infer<typeof SigningKeySchema>;
export declare const CapabilityDiscoverySchema: z.ZodObject<{
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    extends: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    schema: z.ZodString;
    spec: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    spec: string;
    version: string;
    schema: string;
    config?: Record<string, any> | undefined;
    extends?: string | undefined;
}, {
    name: string;
    spec: string;
    version: string;
    schema: string;
    config?: Record<string, any> | undefined;
    extends?: string | undefined;
}>;
export type CapabilityDiscovery = z.infer<typeof CapabilityDiscoverySchema>;
export declare const A2ASchema: z.ZodObject<{
    endpoint: z.ZodString;
}, "strip", z.ZodTypeAny, {
    endpoint: string;
}, {
    endpoint: string;
}>;
export type A2A = z.infer<typeof A2ASchema>;
export declare const EmbeddedSchema: z.ZodObject<{
    schema: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema: string;
}, {
    schema: string;
}>;
export type Embedded = z.infer<typeof EmbeddedSchema>;
export declare const McpSchema: z.ZodObject<{
    endpoint: z.ZodString;
    schema: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema: string;
    endpoint: string;
}, {
    schema: string;
    endpoint: string;
}>;
export type Mcp = z.infer<typeof McpSchema>;
export declare const RestSchema: z.ZodObject<{
    endpoint: z.ZodString;
    schema: z.ZodString;
}, "strip", z.ZodTypeAny, {
    schema: string;
    endpoint: string;
}, {
    schema: string;
    endpoint: string;
}>;
export type Rest = z.infer<typeof RestSchema>;
export declare const BuyerClassSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
}, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
}>;
export type BuyerClass = z.infer<typeof BuyerClassSchema>;
export declare const ItemResponseSchema: z.ZodObject<{
    id: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    price: number;
    title: string;
    image_url?: string | undefined;
}, {
    id: string;
    price: number;
    title: string;
    image_url?: string | undefined;
}>;
export type ItemResponse = z.infer<typeof ItemResponseSchema>;
export declare const TotalResponseSchema: z.ZodObject<{
    amount: z.ZodNumber;
    display_text: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
}, "strip", z.ZodTypeAny, {
    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
    amount: number;
    display_text?: string | undefined;
}, {
    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
    amount: number;
    display_text?: string | undefined;
}>;
export type TotalResponse = z.infer<typeof TotalResponseSchema>;
export declare const LinkElementSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    title?: string | undefined;
}, {
    type: string;
    url: string;
    title?: string | undefined;
}>;
export type LinkElement = z.infer<typeof LinkElementSchema>;
export declare const MessageElementSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
    path: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
    type: z.ZodEnum<["error", "info", "warning"]>;
}, "strip", z.ZodTypeAny, {
    type: "error" | "info" | "warning";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
    severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
}, {
    type: "error" | "info" | "warning";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
    severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
}>;
export type MessageElement = z.infer<typeof MessageElementSchema>;
export declare const OrderClassSchema: z.ZodObject<{
    id: z.ZodString;
    permalink_url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    permalink_url: string;
}, {
    id: string;
    permalink_url: string;
}>;
export type OrderClass = z.infer<typeof OrderClassSchema>;
export declare const BillingAddressClassSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}, {
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}>;
export type BillingAddressClass = z.infer<typeof BillingAddressClassSchema>;
export declare const PaymentCredentialSchema: z.ZodObject<{
    type: z.ZodString;
    card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
    cryptogram: z.ZodOptional<z.ZodString>;
    cvc: z.ZodOptional<z.ZodString>;
    eci_value: z.ZodOptional<z.ZodString>;
    expiry_month: z.ZodOptional<z.ZodNumber>;
    expiry_year: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: string;
    number?: string | undefined;
    name?: string | undefined;
    card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
    cryptogram?: string | undefined;
    cvc?: string | undefined;
    eci_value?: string | undefined;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
}, {
    type: string;
    number?: string | undefined;
    name?: string | undefined;
    card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
    cryptogram?: string | undefined;
    cvc?: string | undefined;
    eci_value?: string | undefined;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
}>;
export type PaymentCredential = z.infer<typeof PaymentCredentialSchema>;
export declare const CapabilityResponseSchema: z.ZodObject<{
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    extends: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    schema: z.ZodOptional<z.ZodString>;
    spec: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    version: string;
    config?: Record<string, any> | undefined;
    spec?: string | undefined;
    extends?: string | undefined;
    schema?: string | undefined;
}, {
    name: string;
    version: string;
    config?: Record<string, any> | undefined;
    spec?: string | undefined;
    extends?: string | undefined;
    schema?: string | undefined;
}>;
export type CapabilityResponse = z.infer<typeof CapabilityResponseSchema>;
export declare const ItemClassSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type ItemClass = z.infer<typeof ItemClassSchema>;
export declare const LineItemItemSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type LineItemItem = z.infer<typeof LineItemItemSchema>;
export declare const AdjustmentLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type AdjustmentLineItem = z.infer<typeof AdjustmentLineItemSchema>;
export declare const EventLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type EventLineItem = z.infer<typeof EventLineItemSchema>;
export declare const ExpectationLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type ExpectationLineItem = z.infer<typeof ExpectationLineItemSchema>;
export declare const LineItemQuantitySchema: z.ZodObject<{
    fulfilled: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    fulfilled: number;
}, {
    total: number;
    fulfilled: number;
}>;
export type LineItemQuantity = z.infer<typeof LineItemQuantitySchema>;
export declare const UcpOrderResponseSchema: z.ZodObject<{
    capabilities: z.ZodArray<z.ZodObject<{
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        extends: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        schema: z.ZodOptional<z.ZodString>;
        spec: z.ZodOptional<z.ZodString>;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }, {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }>, "many">;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: string;
    capabilities: {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }[];
}, {
    version: string;
    capabilities: {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }[];
}>;
export type UcpOrderResponse = z.infer<typeof UcpOrderResponseSchema>;
export declare const PaymentAccountInfoSchema: z.ZodObject<{
    payment_account_reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    payment_account_reference?: string | undefined;
}, {
    payment_account_reference?: string | undefined;
}>;
export type PaymentAccountInfo = z.infer<typeof PaymentAccountInfoSchema>;
export declare const AdjustmentLineItemClassSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type AdjustmentLineItemClass = z.infer<typeof AdjustmentLineItemClassSchema>;
export declare const IdentityClassSchema: z.ZodObject<{
    access_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    access_token: string;
}, {
    access_token: string;
}>;
export type IdentityClass = z.infer<typeof IdentityClassSchema>;
export declare const BuyerSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
}, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
}>;
export type Buyer = z.infer<typeof BuyerSchema>;
export declare const CardCredentialSchema: z.ZodObject<{
    card_number_type: z.ZodEnum<["dpan", "fpan", "network_token"]>;
    cryptogram: z.ZodOptional<z.ZodString>;
    cvc: z.ZodOptional<z.ZodString>;
    eci_value: z.ZodOptional<z.ZodString>;
    expiry_month: z.ZodOptional<z.ZodNumber>;
    expiry_year: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["card"]>;
}, "strip", z.ZodTypeAny, {
    type: "card";
    card_number_type: "dpan" | "fpan" | "network_token";
    number?: string | undefined;
    name?: string | undefined;
    cryptogram?: string | undefined;
    cvc?: string | undefined;
    eci_value?: string | undefined;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
}, {
    type: "card";
    card_number_type: "dpan" | "fpan" | "network_token";
    number?: string | undefined;
    name?: string | undefined;
    cryptogram?: string | undefined;
    cvc?: string | undefined;
    eci_value?: string | undefined;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
}>;
export type CardCredential = z.infer<typeof CardCredentialSchema>;
export declare const CardPaymentInstrumentSchema: z.ZodObject<{
    billing_address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    credential: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
        cryptogram: z.ZodOptional<z.ZodString>;
        cvc: z.ZodOptional<z.ZodString>;
        eci_value: z.ZodOptional<z.ZodString>;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }>>;
    handler_id: z.ZodString;
    id: z.ZodString;
    type: z.ZodEnum<["card"]>;
    brand: z.ZodString;
    expiry_month: z.ZodOptional<z.ZodNumber>;
    expiry_year: z.ZodOptional<z.ZodNumber>;
    last_digits: z.ZodString;
    rich_card_art: z.ZodOptional<z.ZodString>;
    rich_text_description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "card";
    id: string;
    handler_id: string;
    brand: string;
    last_digits: string;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
    rich_card_art?: string | undefined;
    rich_text_description?: string | undefined;
}, {
    type: "card";
    id: string;
    handler_id: string;
    brand: string;
    last_digits: string;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
    rich_card_art?: string | undefined;
    rich_text_description?: string | undefined;
}>;
export type CardPaymentInstrument = z.infer<typeof CardPaymentInstrumentSchema>;
export declare const ExpectationLineItemClassSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type ExpectationLineItemClass = z.infer<typeof ExpectationLineItemClassSchema>;
export declare const FulfillmentDestinationRequestSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}>;
export type FulfillmentDestinationRequest = z.infer<typeof FulfillmentDestinationRequestSchema>;
export declare const FulfillmentEventLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
}, {
    id: string;
    quantity: number;
}>;
export type FulfillmentEventLineItem = z.infer<typeof FulfillmentEventLineItemSchema>;
export declare const FulfillmentGroupCreateRequestSchema: z.ZodObject<{
    selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    selected_option_id?: string | null | undefined;
}, {
    selected_option_id?: string | null | undefined;
}>;
export type FulfillmentGroupCreateRequest = z.infer<typeof FulfillmentGroupCreateRequestSchema>;
export declare const FulfillmentGroupUpdateRequestSchema: z.ZodObject<{
    id: z.ZodString;
    selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    selected_option_id?: string | null | undefined;
}, {
    id: string;
    selected_option_id?: string | null | undefined;
}>;
export type FulfillmentGroupUpdateRequest = z.infer<typeof FulfillmentGroupUpdateRequestSchema>;
export declare const FulfillmentDestinationRequestElementSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}, {
    id?: string | undefined;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}>;
export type FulfillmentDestinationRequestElement = z.infer<typeof FulfillmentDestinationRequestElementSchema>;
export declare const GroupElementSchema: z.ZodObject<{
    selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    selected_option_id?: string | null | undefined;
}, {
    selected_option_id?: string | null | undefined;
}>;
export type GroupElement = z.infer<typeof GroupElementSchema>;
export declare const GroupClassSchema: z.ZodObject<{
    id: z.ZodString;
    selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    selected_option_id?: string | null | undefined;
}, {
    id: string;
    selected_option_id?: string | null | undefined;
}>;
export type GroupClass = z.infer<typeof GroupClassSchema>;
export declare const ItemCreateRequestSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type ItemCreateRequest = z.infer<typeof ItemCreateRequestSchema>;
export declare const ItemUpdateRequestSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type ItemUpdateRequest = z.infer<typeof ItemUpdateRequestSchema>;
export declare const LineItemCreateRequestSchema: z.ZodObject<{
    item: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    item: {
        id: string;
    };
}, {
    quantity: number;
    item: {
        id: string;
    };
}>;
export type LineItemCreateRequest = z.infer<typeof LineItemCreateRequestSchema>;
export declare const LineItemUpdateRequestSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    item: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    parent_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    item: {
        id: string;
    };
    id?: string | undefined;
    parent_id?: string | undefined;
}, {
    quantity: number;
    item: {
        id: string;
    };
    id?: string | undefined;
    parent_id?: string | undefined;
}>;
export type LineItemUpdateRequest = z.infer<typeof LineItemUpdateRequestSchema>;
export declare const LinkSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    title?: string | undefined;
}, {
    type: string;
    url: string;
    title?: string | undefined;
}>;
export type Link = z.infer<typeof LinkSchema>;
export declare const AllowsMultiDestinationSchema: z.ZodObject<{
    pickup: z.ZodOptional<z.ZodBoolean>;
    shipping: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    pickup?: boolean | undefined;
    shipping?: boolean | undefined;
}, {
    pickup?: boolean | undefined;
    shipping?: boolean | undefined;
}>;
export type AllowsMultiDestination = z.infer<typeof AllowsMultiDestinationSchema>;
export declare const MessageErrorSchema: z.ZodObject<{
    code: z.ZodString;
    content: z.ZodString;
    content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
    path: z.ZodOptional<z.ZodString>;
    severity: z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>;
    type: z.ZodEnum<["error"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    type: "error";
    content: string;
    severity: "recoverable" | "requires_buyer_input" | "requires_buyer_review";
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}, {
    code: string;
    type: "error";
    content: string;
    severity: "recoverable" | "requires_buyer_input" | "requires_buyer_review";
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}>;
export type MessageError = z.infer<typeof MessageErrorSchema>;
export declare const MessageInfoSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
    path: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["info"]>;
}, "strip", z.ZodTypeAny, {
    type: "info";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}, {
    type: "info";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}>;
export type MessageInfo = z.infer<typeof MessageInfoSchema>;
export declare const MessageWarningSchema: z.ZodObject<{
    code: z.ZodString;
    content: z.ZodString;
    content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
    path: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["warning"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    type: "warning";
    content: string;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}, {
    code: string;
    type: "warning";
    content: string;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
}>;
export type MessageWarning = z.infer<typeof MessageWarningSchema>;
export declare const MessageSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
    path: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
    type: z.ZodEnum<["error", "info", "warning"]>;
}, "strip", z.ZodTypeAny, {
    type: "error" | "info" | "warning";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
    severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
}, {
    type: "error" | "info" | "warning";
    content: string;
    code?: string | undefined;
    path?: string | undefined;
    content_type?: "markdown" | "plain" | undefined;
    severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
export declare const OrderConfirmationSchema: z.ZodObject<{
    id: z.ZodString;
    permalink_url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    permalink_url: string;
}, {
    id: string;
    permalink_url: string;
}>;
export type OrderConfirmation = z.infer<typeof OrderConfirmationSchema>;
export declare const OrderLineItemQuantitySchema: z.ZodObject<{
    fulfilled: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    fulfilled: number;
}, {
    total: number;
    fulfilled: number;
}>;
export type OrderLineItemQuantity = z.infer<typeof OrderLineItemQuantitySchema>;
export declare const PaymentIdentitySchema: z.ZodObject<{
    access_token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    access_token: string;
}, {
    access_token: string;
}>;
export type PaymentIdentity = z.infer<typeof PaymentIdentitySchema>;
export declare const PaymentInstrumentBaseSchema: z.ZodObject<{
    billing_address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    credential: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
        cryptogram: z.ZodOptional<z.ZodString>;
        cvc: z.ZodOptional<z.ZodString>;
        eci_value: z.ZodOptional<z.ZodString>;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }>>;
    handler_id: z.ZodString;
    id: z.ZodString;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    handler_id: string;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
}, {
    type: string;
    id: string;
    handler_id: string;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
}>;
export type PaymentInstrumentBase = z.infer<typeof PaymentInstrumentBaseSchema>;
export declare const PlatformFulfillmentConfigSchema: z.ZodObject<{
    supports_multi_group: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    supports_multi_group?: boolean | undefined;
}, {
    supports_multi_group?: boolean | undefined;
}>;
export type PlatformFulfillmentConfig = z.infer<typeof PlatformFulfillmentConfigSchema>;
export declare const PostalAddressSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}, {
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}>;
export type PostalAddress = z.infer<typeof PostalAddressSchema>;
export declare const RetailLocationRequestSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}, {
    name: string;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}>;
export type RetailLocationRequest = z.infer<typeof RetailLocationRequestSchema>;
export declare const RetailLocationResponseSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}, {
    id: string;
    name: string;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}>;
export type RetailLocationResponse = z.infer<typeof RetailLocationResponseSchema>;
export declare const ShippingDestinationRequestSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}, {
    id?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}>;
export type ShippingDestinationRequest = z.infer<typeof ShippingDestinationRequestSchema>;
export declare const ShippingDestinationResponseSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}, {
    id: string;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
}>;
export type ShippingDestinationResponse = z.infer<typeof ShippingDestinationResponseSchema>;
export declare const TokenCredentialResponseSchema: z.ZodObject<{
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
}, {
    type: string;
}>;
export type TokenCredentialResponse = z.infer<typeof TokenCredentialResponseSchema>;
export declare const TokenCredentialCreateRequestSchema: z.ZodObject<{
    token: z.ZodString;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    token: string;
}, {
    type: string;
    token: string;
}>;
export type TokenCredentialCreateRequest = z.infer<typeof TokenCredentialCreateRequestSchema>;
export declare const TokenCredentialUpdateRequestSchema: z.ZodObject<{
    token: z.ZodString;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    token: string;
}, {
    type: string;
    token: string;
}>;
export type TokenCredentialUpdateRequest = z.infer<typeof TokenCredentialUpdateRequestSchema>;
export declare const Ap2CompleteRequestObjectSchema: z.ZodObject<{
    checkout_mandate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    checkout_mandate: string;
}, {
    checkout_mandate: string;
}>;
export type Ap2CompleteRequestObject = z.infer<typeof Ap2CompleteRequestObjectSchema>;
export declare const Ap2CheckoutResponseObjectSchema: z.ZodObject<{
    merchant_authorization: z.ZodString;
}, "strip", z.ZodTypeAny, {
    merchant_authorization: string;
}, {
    merchant_authorization: string;
}>;
export type Ap2CheckoutResponseObject = z.infer<typeof Ap2CheckoutResponseObjectSchema>;
export declare const PurpleConsentSchema: z.ZodObject<{
    analytics: z.ZodOptional<z.ZodBoolean>;
    marketing: z.ZodOptional<z.ZodBoolean>;
    preferences: z.ZodOptional<z.ZodBoolean>;
    sale_of_data: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}>;
export type PurpleConsent = z.infer<typeof PurpleConsentSchema>;
export declare const FluffyConsentSchema: z.ZodObject<{
    analytics: z.ZodOptional<z.ZodBoolean>;
    marketing: z.ZodOptional<z.ZodBoolean>;
    preferences: z.ZodOptional<z.ZodBoolean>;
    sale_of_data: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}>;
export type FluffyConsent = z.infer<typeof FluffyConsentSchema>;
export declare const TentacledConsentSchema: z.ZodObject<{
    analytics: z.ZodOptional<z.ZodBoolean>;
    marketing: z.ZodOptional<z.ZodBoolean>;
    preferences: z.ZodOptional<z.ZodBoolean>;
    sale_of_data: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}, {
    analytics?: boolean | undefined;
    marketing?: boolean | undefined;
    preferences?: boolean | undefined;
    sale_of_data?: boolean | undefined;
}>;
export type TentacledConsent = z.infer<typeof TentacledConsentSchema>;
export declare const AllocationElementSchema: z.ZodObject<{
    amount: z.ZodNumber;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    amount: number;
}, {
    path: string;
    amount: number;
}>;
export type AllocationElement = z.infer<typeof AllocationElementSchema>;
export declare const AllocationClassSchema: z.ZodObject<{
    amount: z.ZodNumber;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    amount: number;
}, {
    path: string;
    amount: number;
}>;
export type AllocationClass = z.infer<typeof AllocationClassSchema>;
export declare const AppliedAllocationSchema: z.ZodObject<{
    amount: z.ZodNumber;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    amount: number;
}, {
    path: string;
    amount: number;
}>;
export type AppliedAllocation = z.infer<typeof AppliedAllocationSchema>;
export declare const MethodElementSchema: z.ZodObject<{
    destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }>, "many">>;
    groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    }, "strip", z.ZodTypeAny, {
        selected_option_id?: string | null | undefined;
    }, {
        selected_option_id?: string | null | undefined;
    }>, "many">>;
    line_item_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    type: z.ZodEnum<["pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    type: "pickup" | "shipping";
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    line_item_ids?: string[] | undefined;
    selected_destination_id?: string | null | undefined;
}, {
    type: "pickup" | "shipping";
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    line_item_ids?: string[] | undefined;
    selected_destination_id?: string | null | undefined;
}>;
export type MethodElement = z.infer<typeof MethodElementSchema>;
export declare const FulfillmentAvailableMethodResponseSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    fulfillable_on: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    line_item_ids: z.ZodArray<z.ZodString, "many">;
    type: z.ZodEnum<["pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    type: "pickup" | "shipping";
    line_item_ids: string[];
    description?: string | undefined;
    fulfillable_on?: string | null | undefined;
}, {
    type: "pickup" | "shipping";
    line_item_ids: string[];
    description?: string | undefined;
    fulfillable_on?: string | null | undefined;
}>;
export type FulfillmentAvailableMethodResponse = z.infer<typeof FulfillmentAvailableMethodResponseSchema>;
export declare const FulfillmentDestinationResponseSchema: z.ZodObject<{
    address_country: z.ZodOptional<z.ZodString>;
    address_locality: z.ZodOptional<z.ZodString>;
    address_region: z.ZodOptional<z.ZodString>;
    extended_address: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    postal_code: z.ZodOptional<z.ZodString>;
    street_address: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}, {
    id: string;
    name?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    address_country?: string | undefined;
    address_locality?: string | undefined;
    address_region?: string | undefined;
    extended_address?: string | undefined;
    postal_code?: string | undefined;
    street_address?: string | undefined;
    address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
}>;
export type FulfillmentDestinationResponse = z.infer<typeof FulfillmentDestinationResponseSchema>;
export declare const FulfillmentOptionResponseSchema: z.ZodObject<{
    carrier: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    earliest_fulfillment_time: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    latest_fulfillment_time: z.ZodOptional<z.ZodDate>;
    title: z.ZodString;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    description?: string | undefined;
    carrier?: string | undefined;
    earliest_fulfillment_time?: Date | undefined;
    latest_fulfillment_time?: Date | undefined;
}, {
    id: string;
    title: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    description?: string | undefined;
    carrier?: string | undefined;
    earliest_fulfillment_time?: Date | undefined;
    latest_fulfillment_time?: Date | undefined;
}>;
export type FulfillmentOptionResponse = z.infer<typeof FulfillmentOptionResponseSchema>;
export declare const PaymentSchema: z.ZodObject<{
    handlers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        config: z.ZodRecord<z.ZodString, z.ZodAny>;
        config_schema: z.ZodString;
        id: z.ZodString;
        instrument_schemas: z.ZodArray<z.ZodString, "many">;
        name: z.ZodString;
        spec: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }, {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    handlers?: {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }[] | undefined;
}, {
    handlers?: {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }[] | undefined;
}>;
export type Payment = z.infer<typeof PaymentSchema>;
export declare const UcpServiceSchema: z.ZodObject<{
    a2a: z.ZodOptional<z.ZodObject<{
        endpoint: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        endpoint: string;
    }, {
        endpoint: string;
    }>>;
    embedded: z.ZodOptional<z.ZodObject<{
        schema: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schema: string;
    }, {
        schema: string;
    }>>;
    mcp: z.ZodOptional<z.ZodObject<{
        endpoint: z.ZodString;
        schema: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schema: string;
        endpoint: string;
    }, {
        schema: string;
        endpoint: string;
    }>>;
    rest: z.ZodOptional<z.ZodObject<{
        endpoint: z.ZodString;
        schema: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schema: string;
        endpoint: string;
    }, {
        schema: string;
        endpoint: string;
    }>>;
    spec: z.ZodString;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    spec: string;
    version: string;
    a2a?: {
        endpoint: string;
    } | undefined;
    embedded?: {
        schema: string;
    } | undefined;
    mcp?: {
        schema: string;
        endpoint: string;
    } | undefined;
    rest?: {
        schema: string;
        endpoint: string;
    } | undefined;
}, {
    spec: string;
    version: string;
    a2a?: {
        endpoint: string;
    } | undefined;
    embedded?: {
        schema: string;
    } | undefined;
    mcp?: {
        schema: string;
        endpoint: string;
    } | undefined;
    rest?: {
        schema: string;
        endpoint: string;
    } | undefined;
}>;
export type UcpService = z.infer<typeof UcpServiceSchema>;
export declare const LineItemResponseSchema: z.ZodObject<{
    id: z.ZodString;
    item: z.ZodObject<{
        id: z.ZodString;
        image_url: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }>;
    parent_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    quantity: number;
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}, {
    id: string;
    quantity: number;
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}>;
export type LineItemResponse = z.infer<typeof LineItemResponseSchema>;
export declare const PaymentInstrumentSchema: z.ZodObject<{
    billing_address: z.ZodOptional<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>>;
    credential: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
        cryptogram: z.ZodOptional<z.ZodString>;
        cvc: z.ZodOptional<z.ZodString>;
        eci_value: z.ZodOptional<z.ZodString>;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        name: z.ZodOptional<z.ZodString>;
        number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }, {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    }>>;
    handler_id: z.ZodString;
    id: z.ZodString;
    type: z.ZodEnum<["card"]>;
    brand: z.ZodString;
    expiry_month: z.ZodOptional<z.ZodNumber>;
    expiry_year: z.ZodOptional<z.ZodNumber>;
    last_digits: z.ZodString;
    rich_card_art: z.ZodOptional<z.ZodString>;
    rich_text_description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "card";
    id: string;
    handler_id: string;
    brand: string;
    last_digits: string;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
    rich_card_art?: string | undefined;
    rich_text_description?: string | undefined;
}, {
    type: "card";
    id: string;
    handler_id: string;
    brand: string;
    last_digits: string;
    expiry_month?: number | undefined;
    expiry_year?: number | undefined;
    billing_address?: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    } | undefined;
    credential?: {
        type: string;
        number?: string | undefined;
        name?: string | undefined;
        card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
        cryptogram?: string | undefined;
        cvc?: string | undefined;
        eci_value?: string | undefined;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
    } | undefined;
    rich_card_art?: string | undefined;
    rich_text_description?: string | undefined;
}>;
export type PaymentInstrument = z.infer<typeof PaymentInstrumentSchema>;
export declare const UcpCheckoutResponseSchema: z.ZodObject<{
    capabilities: z.ZodArray<z.ZodObject<{
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        extends: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        schema: z.ZodOptional<z.ZodString>;
        spec: z.ZodOptional<z.ZodString>;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }, {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }>, "many">;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: string;
    capabilities: {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }[];
}, {
    version: string;
    capabilities: {
        name: string;
        version: string;
        config?: Record<string, any> | undefined;
        spec?: string | undefined;
        extends?: string | undefined;
        schema?: string | undefined;
    }[];
}>;
export type UcpCheckoutResponse = z.infer<typeof UcpCheckoutResponseSchema>;
export declare const LineItemElementSchema: z.ZodObject<{
    item: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    item: {
        id: string;
    };
}, {
    quantity: number;
    item: {
        id: string;
    };
}>;
export type LineItemElement = z.infer<typeof LineItemElementSchema>;
export declare const PaymentClassSchema: z.ZodObject<{
    instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>, "many">>;
    selected_instrument_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}>;
export type PaymentClass = z.infer<typeof PaymentClassSchema>;
export declare const LineItemClassSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    item: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    parent_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    item: {
        id: string;
    };
    id?: string | undefined;
    parent_id?: string | undefined;
}, {
    quantity: number;
    item: {
        id: string;
    };
    id?: string | undefined;
    parent_id?: string | undefined;
}>;
export type LineItemClass = z.infer<typeof LineItemClassSchema>;
export declare const CheckoutUpdateRequestPaymentSchema: z.ZodObject<{
    instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>, "many">>;
    selected_instrument_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}>;
export type CheckoutUpdateRequestPayment = z.infer<typeof CheckoutUpdateRequestPaymentSchema>;
export declare const AdjustmentElementSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">>;
    occurred_at: z.ZodDate;
    status: z.ZodEnum<["completed", "failed", "pending"]>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    status: "completed" | "failed" | "pending";
    id: string;
    occurred_at: Date;
    amount?: number | undefined;
    description?: string | undefined;
    line_items?: {
        id: string;
        quantity: number;
    }[] | undefined;
}, {
    type: string;
    status: "completed" | "failed" | "pending";
    id: string;
    occurred_at: Date;
    amount?: number | undefined;
    description?: string | undefined;
    line_items?: {
        id: string;
        quantity: number;
    }[] | undefined;
}>;
export type AdjustmentElement = z.infer<typeof AdjustmentElementSchema>;
export declare const EventElementSchema: z.ZodObject<{
    carrier: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">;
    occurred_at: z.ZodDate;
    tracking_number: z.ZodOptional<z.ZodString>;
    tracking_url: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    occurred_at: Date;
    description?: string | undefined;
    carrier?: string | undefined;
    tracking_number?: string | undefined;
    tracking_url?: string | undefined;
}, {
    type: string;
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    occurred_at: Date;
    description?: string | undefined;
    carrier?: string | undefined;
    tracking_number?: string | undefined;
    tracking_url?: string | undefined;
}>;
export type EventElement = z.infer<typeof EventElementSchema>;
export declare const ExpectationElementSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    destination: z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>;
    fulfillable_on: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">;
    method_type: z.ZodEnum<["digital", "pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    destination: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    };
    method_type: "digital" | "pickup" | "shipping";
    description?: string | undefined;
    fulfillable_on?: string | undefined;
}, {
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    destination: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    };
    method_type: "digital" | "pickup" | "shipping";
    description?: string | undefined;
    fulfillable_on?: string | undefined;
}>;
export type ExpectationElement = z.infer<typeof ExpectationElementSchema>;
export declare const OrderLineItemClassSchema: z.ZodObject<{
    id: z.ZodString;
    item: z.ZodObject<{
        id: z.ZodString;
        image_url: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }>;
    parent_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodObject<{
        fulfilled: z.ZodNumber;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        fulfilled: number;
    }, {
        total: number;
        fulfilled: number;
    }>;
    status: z.ZodEnum<["fulfilled", "partial", "processing"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "fulfilled" | "partial" | "processing";
    id: string;
    quantity: {
        total: number;
        fulfilled: number;
    };
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}, {
    status: "fulfilled" | "partial" | "processing";
    id: string;
    quantity: {
        total: number;
        fulfilled: number;
    };
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}>;
export type OrderLineItemClass = z.infer<typeof OrderLineItemClassSchema>;
export declare const PaymentDataSchema: z.ZodObject<{
    payment_data: z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    payment_data: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    };
}, {
    payment_data: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    };
}>;
export type PaymentData = z.infer<typeof PaymentDataSchema>;
export declare const PaymentCreateRequestSchema: z.ZodObject<{
    instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>, "many">>;
    selected_instrument_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}>;
export type PaymentCreateRequest = z.infer<typeof PaymentCreateRequestSchema>;
export declare const PaymentUpdateRequestSchema: z.ZodObject<{
    instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>, "many">>;
    selected_instrument_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}, {
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}>;
export type PaymentUpdateRequest = z.infer<typeof PaymentUpdateRequestSchema>;
export declare const AdjustmentSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">>;
    occurred_at: z.ZodDate;
    status: z.ZodEnum<["completed", "failed", "pending"]>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    status: "completed" | "failed" | "pending";
    id: string;
    occurred_at: Date;
    amount?: number | undefined;
    description?: string | undefined;
    line_items?: {
        id: string;
        quantity: number;
    }[] | undefined;
}, {
    type: string;
    status: "completed" | "failed" | "pending";
    id: string;
    occurred_at: Date;
    amount?: number | undefined;
    description?: string | undefined;
    line_items?: {
        id: string;
        quantity: number;
    }[] | undefined;
}>;
export type Adjustment = z.infer<typeof AdjustmentSchema>;
export declare const BindingSchema: z.ZodObject<{
    checkout_id: z.ZodString;
    identity: z.ZodOptional<z.ZodObject<{
        access_token: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        access_token: string;
    }, {
        access_token: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    checkout_id: string;
    identity?: {
        access_token: string;
    } | undefined;
}, {
    checkout_id: string;
    identity?: {
        access_token: string;
    } | undefined;
}>;
export type Binding = z.infer<typeof BindingSchema>;
export declare const ExpectationSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    destination: z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }, {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    }>;
    fulfillable_on: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">;
    method_type: z.ZodEnum<["digital", "pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    destination: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    };
    method_type: "digital" | "pickup" | "shipping";
    description?: string | undefined;
    fulfillable_on?: string | undefined;
}, {
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    destination: {
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
    };
    method_type: "digital" | "pickup" | "shipping";
    description?: string | undefined;
    fulfillable_on?: string | undefined;
}>;
export type Expectation = z.infer<typeof ExpectationSchema>;
export declare const FulfillmentEventSchema: z.ZodObject<{
    carrier: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
    }, {
        id: string;
        quantity: number;
    }>, "many">;
    occurred_at: z.ZodDate;
    tracking_number: z.ZodOptional<z.ZodString>;
    tracking_url: z.ZodOptional<z.ZodString>;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    occurred_at: Date;
    description?: string | undefined;
    carrier?: string | undefined;
    tracking_number?: string | undefined;
    tracking_url?: string | undefined;
}, {
    type: string;
    id: string;
    line_items: {
        id: string;
        quantity: number;
    }[];
    occurred_at: Date;
    description?: string | undefined;
    carrier?: string | undefined;
    tracking_number?: string | undefined;
    tracking_url?: string | undefined;
}>;
export type FulfillmentEvent = z.infer<typeof FulfillmentEventSchema>;
export declare const FulfillmentMethodCreateRequestSchema: z.ZodObject<{
    destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }>, "many">>;
    groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    }, "strip", z.ZodTypeAny, {
        selected_option_id?: string | null | undefined;
    }, {
        selected_option_id?: string | null | undefined;
    }>, "many">>;
    line_item_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    type: z.ZodEnum<["pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    type: "pickup" | "shipping";
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    line_item_ids?: string[] | undefined;
    selected_destination_id?: string | null | undefined;
}, {
    type: "pickup" | "shipping";
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    line_item_ids?: string[] | undefined;
    selected_destination_id?: string | null | undefined;
}>;
export type FulfillmentMethodCreateRequest = z.infer<typeof FulfillmentMethodCreateRequestSchema>;
export declare const FulfillmentMethodUpdateRequestSchema: z.ZodObject<{
    destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
        id: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }, {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }>, "many">>;
    groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        selected_option_id?: string | null | undefined;
    }, {
        id: string;
        selected_option_id?: string | null | undefined;
    }>, "many">>;
    id: z.ZodString;
    line_item_ids: z.ZodArray<z.ZodString, "many">;
    selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_item_ids: string[];
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        id: string;
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    selected_destination_id?: string | null | undefined;
}, {
    id: string;
    line_item_ids: string[];
    destinations?: {
        id?: string | undefined;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        id: string;
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    selected_destination_id?: string | null | undefined;
}>;
export type FulfillmentMethodUpdateRequest = z.infer<typeof FulfillmentMethodUpdateRequestSchema>;
export declare const MerchantFulfillmentConfigSchema: z.ZodObject<{
    allows_method_combinations: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodEnum<["pickup", "shipping"]>, "many">, "many">>;
    allows_multi_destination: z.ZodOptional<z.ZodObject<{
        pickup: z.ZodOptional<z.ZodBoolean>;
        shipping: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        pickup?: boolean | undefined;
        shipping?: boolean | undefined;
    }, {
        pickup?: boolean | undefined;
        shipping?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    allows_method_combinations?: ("pickup" | "shipping")[][] | undefined;
    allows_multi_destination?: {
        pickup?: boolean | undefined;
        shipping?: boolean | undefined;
    } | undefined;
}, {
    allows_method_combinations?: ("pickup" | "shipping")[][] | undefined;
    allows_multi_destination?: {
        pickup?: boolean | undefined;
        shipping?: boolean | undefined;
    } | undefined;
}>;
export type MerchantFulfillmentConfig = z.infer<typeof MerchantFulfillmentConfigSchema>;
export declare const OrderLineItemSchema: z.ZodObject<{
    id: z.ZodString;
    item: z.ZodObject<{
        id: z.ZodString;
        image_url: z.ZodOptional<z.ZodString>;
        price: z.ZodNumber;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }, {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    }>;
    parent_id: z.ZodOptional<z.ZodString>;
    quantity: z.ZodObject<{
        fulfilled: z.ZodNumber;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        fulfilled: number;
    }, {
        total: number;
        fulfilled: number;
    }>;
    status: z.ZodEnum<["fulfilled", "partial", "processing"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "fulfilled" | "partial" | "processing";
    id: string;
    quantity: {
        total: number;
        fulfilled: number;
    };
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}, {
    status: "fulfilled" | "partial" | "processing";
    id: string;
    quantity: {
        total: number;
        fulfilled: number;
    };
    item: {
        id: string;
        price: number;
        title: string;
        image_url?: string | undefined;
    };
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    parent_id?: string | undefined;
}>;
export type OrderLineItem = z.infer<typeof OrderLineItemSchema>;
export declare const CompleteCheckoutRequestWithAp2Schema: z.ZodObject<{
    ap2: z.ZodOptional<z.ZodObject<{
        checkout_mandate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        checkout_mandate: string;
    }, {
        checkout_mandate: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    ap2?: {
        checkout_mandate: string;
    } | undefined;
}, {
    ap2?: {
        checkout_mandate: string;
    } | undefined;
}>;
export type CompleteCheckoutRequestWithAp2 = z.infer<typeof CompleteCheckoutRequestWithAp2Schema>;
export declare const BuyerWithConsentCreateRequestSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    consent: z.ZodOptional<z.ZodObject<{
        analytics: z.ZodOptional<z.ZodBoolean>;
        marketing: z.ZodOptional<z.ZodBoolean>;
        preferences: z.ZodOptional<z.ZodBoolean>;
        sale_of_data: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}>;
export type BuyerWithConsentCreateRequest = z.infer<typeof BuyerWithConsentCreateRequestSchema>;
export declare const BuyerWithConsentUpdateRequestSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    consent: z.ZodOptional<z.ZodObject<{
        analytics: z.ZodOptional<z.ZodBoolean>;
        marketing: z.ZodOptional<z.ZodBoolean>;
        preferences: z.ZodOptional<z.ZodBoolean>;
        sale_of_data: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}>;
export type BuyerWithConsentUpdateRequest = z.infer<typeof BuyerWithConsentUpdateRequestSchema>;
export declare const BuyerWithConsentResponseSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    first_name: z.ZodOptional<z.ZodString>;
    full_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodString>;
    phone_number: z.ZodOptional<z.ZodString>;
    consent: z.ZodOptional<z.ZodObject<{
        analytics: z.ZodOptional<z.ZodBoolean>;
        marketing: z.ZodOptional<z.ZodBoolean>;
        preferences: z.ZodOptional<z.ZodBoolean>;
        sale_of_data: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }, {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}, {
    email?: string | undefined;
    first_name?: string | undefined;
    full_name?: string | undefined;
    last_name?: string | undefined;
    phone_number?: string | undefined;
    consent?: {
        analytics?: boolean | undefined;
        marketing?: boolean | undefined;
        preferences?: boolean | undefined;
        sale_of_data?: boolean | undefined;
    } | undefined;
}>;
export type BuyerWithConsentResponse = z.infer<typeof BuyerWithConsentResponseSchema>;
export declare const AppliedElementSchema: z.ZodObject<{
    allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        amount: number;
    }, {
        path: string;
        amount: number;
    }>, "many">>;
    amount: z.ZodNumber;
    automatic: z.ZodOptional<z.ZodBoolean>;
    code: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
    priority: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}>;
export type AppliedElement = z.infer<typeof AppliedElementSchema>;
export declare const AppliedClassSchema: z.ZodObject<{
    allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        amount: number;
    }, {
        path: string;
        amount: number;
    }>, "many">>;
    amount: z.ZodNumber;
    automatic: z.ZodOptional<z.ZodBoolean>;
    code: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
    priority: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}>;
export type AppliedClass = z.infer<typeof AppliedClassSchema>;
export declare const DiscountsAppliedSchema: z.ZodObject<{
    allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        path: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        amount: number;
    }, {
        path: string;
        amount: number;
    }>, "many">>;
    amount: z.ZodNumber;
    automatic: z.ZodOptional<z.ZodBoolean>;
    code: z.ZodOptional<z.ZodString>;
    method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
    priority: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}, {
    title: string;
    amount: number;
    code?: string | undefined;
    allocations?: {
        path: string;
        amount: number;
    }[] | undefined;
    automatic?: boolean | undefined;
    method?: "across" | "each" | undefined;
    priority?: number | undefined;
}>;
export type DiscountsApplied = z.infer<typeof DiscountsAppliedSchema>;
export declare const FulfillmentRequestSchema: z.ZodObject<{
    methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
        destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
            id: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }, {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }>, "many">>;
        groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
        }, "strip", z.ZodTypeAny, {
            selected_option_id?: string | null | undefined;
        }, {
            selected_option_id?: string | null | undefined;
        }>, "many">>;
        line_item_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
        type: z.ZodEnum<["pickup", "shipping"]>;
    }, "strip", z.ZodTypeAny, {
        type: "pickup" | "shipping";
        destinations?: {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        line_item_ids?: string[] | undefined;
        selected_destination_id?: string | null | undefined;
    }, {
        type: "pickup" | "shipping";
        destinations?: {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        line_item_ids?: string[] | undefined;
        selected_destination_id?: string | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    methods?: {
        type: "pickup" | "shipping";
        destinations?: {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        line_item_ids?: string[] | undefined;
        selected_destination_id?: string | null | undefined;
    }[] | undefined;
}, {
    methods?: {
        type: "pickup" | "shipping";
        destinations?: {
            id?: string | undefined;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        line_item_ids?: string[] | undefined;
        selected_destination_id?: string | null | undefined;
    }[] | undefined;
}>;
export type FulfillmentRequest = z.infer<typeof FulfillmentRequestSchema>;
export declare const CheckoutWithFulfillmentUpdateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    fulfillment: z.ZodOptional<z.ZodObject<{
        methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
            destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
                id: z.ZodOptional<z.ZodString>;
                address: z.ZodOptional<z.ZodObject<{
                    address_country: z.ZodOptional<z.ZodString>;
                    address_locality: z.ZodOptional<z.ZodString>;
                    address_region: z.ZodOptional<z.ZodString>;
                    extended_address: z.ZodOptional<z.ZodString>;
                    first_name: z.ZodOptional<z.ZodString>;
                    full_name: z.ZodOptional<z.ZodString>;
                    last_name: z.ZodOptional<z.ZodString>;
                    phone_number: z.ZodOptional<z.ZodString>;
                    postal_code: z.ZodOptional<z.ZodString>;
                    street_address: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }>>;
                name: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }, {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }>, "many">>;
            groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
                selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            }, "strip", z.ZodTypeAny, {
                selected_option_id?: string | null | undefined;
            }, {
                selected_option_id?: string | null | undefined;
            }>, "many">>;
            line_item_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            type: z.ZodEnum<["pickup", "shipping"]>;
        }, "strip", z.ZodTypeAny, {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }, {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    }, {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}>;
export type CheckoutWithFulfillmentUpdateRequest = z.infer<typeof CheckoutWithFulfillmentUpdateRequestSchema>;
export declare const FulfillmentGroupResponseSchema: z.ZodObject<{
    id: z.ZodString;
    line_item_ids: z.ZodArray<z.ZodString, "many">;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        carrier: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        earliest_fulfillment_time: z.ZodOptional<z.ZodDate>;
        id: z.ZodString;
        latest_fulfillment_time: z.ZodOptional<z.ZodDate>;
        title: z.ZodString;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        description?: string | undefined;
        carrier?: string | undefined;
        earliest_fulfillment_time?: Date | undefined;
        latest_fulfillment_time?: Date | undefined;
    }, {
        id: string;
        title: string;
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        description?: string | undefined;
        carrier?: string | undefined;
        earliest_fulfillment_time?: Date | undefined;
        latest_fulfillment_time?: Date | undefined;
    }>, "many">>;
    selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_item_ids: string[];
    options?: {
        id: string;
        title: string;
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        description?: string | undefined;
        carrier?: string | undefined;
        earliest_fulfillment_time?: Date | undefined;
        latest_fulfillment_time?: Date | undefined;
    }[] | undefined;
    selected_option_id?: string | null | undefined;
}, {
    id: string;
    line_item_ids: string[];
    options?: {
        id: string;
        title: string;
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        description?: string | undefined;
        carrier?: string | undefined;
        earliest_fulfillment_time?: Date | undefined;
        latest_fulfillment_time?: Date | undefined;
    }[] | undefined;
    selected_option_id?: string | null | undefined;
}>;
export type FulfillmentGroupResponse = z.infer<typeof FulfillmentGroupResponseSchema>;
export declare const UcpClassSchema: z.ZodObject<{
    capabilities: z.ZodArray<z.ZodObject<{
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        extends: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        schema: z.ZodString;
        spec: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        spec: string;
        version: string;
        schema: string;
        config?: Record<string, any> | undefined;
        extends?: string | undefined;
    }, {
        name: string;
        spec: string;
        version: string;
        schema: string;
        config?: Record<string, any> | undefined;
        extends?: string | undefined;
    }>, "many">;
    services: z.ZodRecord<z.ZodString, z.ZodObject<{
        a2a: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            endpoint: string;
        }, {
            endpoint: string;
        }>>;
        embedded: z.ZodOptional<z.ZodObject<{
            schema: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schema: string;
        }, {
            schema: string;
        }>>;
        mcp: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            schema: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schema: string;
            endpoint: string;
        }, {
            schema: string;
            endpoint: string;
        }>>;
        rest: z.ZodOptional<z.ZodObject<{
            endpoint: z.ZodString;
            schema: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schema: string;
            endpoint: string;
        }, {
            schema: string;
            endpoint: string;
        }>>;
        spec: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        spec: string;
        version: string;
        a2a?: {
            endpoint: string;
        } | undefined;
        embedded?: {
            schema: string;
        } | undefined;
        mcp?: {
            schema: string;
            endpoint: string;
        } | undefined;
        rest?: {
            schema: string;
            endpoint: string;
        } | undefined;
    }, {
        spec: string;
        version: string;
        a2a?: {
            endpoint: string;
        } | undefined;
        embedded?: {
            schema: string;
        } | undefined;
        mcp?: {
            schema: string;
            endpoint: string;
        } | undefined;
        rest?: {
            schema: string;
            endpoint: string;
        } | undefined;
    }>>;
    version: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: string;
    capabilities: {
        name: string;
        spec: string;
        version: string;
        schema: string;
        config?: Record<string, any> | undefined;
        extends?: string | undefined;
    }[];
    services: Record<string, {
        spec: string;
        version: string;
        a2a?: {
            endpoint: string;
        } | undefined;
        embedded?: {
            schema: string;
        } | undefined;
        mcp?: {
            schema: string;
            endpoint: string;
        } | undefined;
        rest?: {
            schema: string;
            endpoint: string;
        } | undefined;
    }>;
}, {
    version: string;
    capabilities: {
        name: string;
        spec: string;
        version: string;
        schema: string;
        config?: Record<string, any> | undefined;
        extends?: string | undefined;
    }[];
    services: Record<string, {
        spec: string;
        version: string;
        a2a?: {
            endpoint: string;
        } | undefined;
        embedded?: {
            schema: string;
        } | undefined;
        mcp?: {
            schema: string;
            endpoint: string;
        } | undefined;
        rest?: {
            schema: string;
            endpoint: string;
        } | undefined;
    }>;
}>;
export type UcpClass = z.infer<typeof UcpClassSchema>;
export declare const PaymentResponseSchema: z.ZodObject<{
    handlers: z.ZodArray<z.ZodObject<{
        config: z.ZodRecord<z.ZodString, z.ZodAny>;
        config_schema: z.ZodString;
        id: z.ZodString;
        instrument_schemas: z.ZodArray<z.ZodString, "many">;
        name: z.ZodString;
        spec: z.ZodString;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }, {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }>, "many">;
    instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        billing_address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        credential: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
            cryptogram: z.ZodOptional<z.ZodString>;
            cvc: z.ZodOptional<z.ZodString>;
            eci_value: z.ZodOptional<z.ZodString>;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            name: z.ZodOptional<z.ZodString>;
            number: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }, {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        }>>;
        handler_id: z.ZodString;
        id: z.ZodString;
        type: z.ZodEnum<["card"]>;
        brand: z.ZodString;
        expiry_month: z.ZodOptional<z.ZodNumber>;
        expiry_year: z.ZodOptional<z.ZodNumber>;
        last_digits: z.ZodString;
        rich_card_art: z.ZodOptional<z.ZodString>;
        rich_text_description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }, {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }>, "many">>;
    selected_instrument_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    handlers: {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }[];
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}, {
    handlers: {
        config: Record<string, any>;
        config_schema: string;
        id: string;
        instrument_schemas: string[];
        name: string;
        spec: string;
        version: string;
    }[];
    instruments?: {
        type: "card";
        id: string;
        handler_id: string;
        brand: string;
        last_digits: string;
        expiry_month?: number | undefined;
        expiry_year?: number | undefined;
        billing_address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
        credential?: {
            type: string;
            number?: string | undefined;
            name?: string | undefined;
            card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
            cryptogram?: string | undefined;
            cvc?: string | undefined;
            eci_value?: string | undefined;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
        } | undefined;
        rich_card_art?: string | undefined;
        rich_text_description?: string | undefined;
    }[] | undefined;
    selected_instrument_id?: string | undefined;
}>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export declare const CheckoutCreateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
    }, {
        quantity: number;
        item: {
            id: string;
        };
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}>;
export type CheckoutCreateRequest = z.infer<typeof CheckoutCreateRequestSchema>;
export declare const CheckoutUpdateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}>;
export type CheckoutUpdateRequest = z.infer<typeof CheckoutUpdateRequestSchema>;
export declare const FulfillmentSchema: z.ZodObject<{
    events: z.ZodOptional<z.ZodArray<z.ZodObject<{
        carrier: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        line_items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            quantity: number;
        }, {
            id: string;
            quantity: number;
        }>, "many">;
        occurred_at: z.ZodDate;
        tracking_number: z.ZodOptional<z.ZodString>;
        tracking_url: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        occurred_at: Date;
        description?: string | undefined;
        carrier?: string | undefined;
        tracking_number?: string | undefined;
        tracking_url?: string | undefined;
    }, {
        type: string;
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        occurred_at: Date;
        description?: string | undefined;
        carrier?: string | undefined;
        tracking_number?: string | undefined;
        tracking_url?: string | undefined;
    }>, "many">>;
    expectations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        destination: z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>;
        fulfillable_on: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        line_items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            quantity: number;
        }, {
            id: string;
            quantity: number;
        }>, "many">;
        method_type: z.ZodEnum<["digital", "pickup", "shipping"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        destination: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        };
        method_type: "digital" | "pickup" | "shipping";
        description?: string | undefined;
        fulfillable_on?: string | undefined;
    }, {
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        destination: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        };
        method_type: "digital" | "pickup" | "shipping";
        description?: string | undefined;
        fulfillable_on?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    events?: {
        type: string;
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        occurred_at: Date;
        description?: string | undefined;
        carrier?: string | undefined;
        tracking_number?: string | undefined;
        tracking_url?: string | undefined;
    }[] | undefined;
    expectations?: {
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        destination: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        };
        method_type: "digital" | "pickup" | "shipping";
        description?: string | undefined;
        fulfillable_on?: string | undefined;
    }[] | undefined;
}, {
    events?: {
        type: string;
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        occurred_at: Date;
        description?: string | undefined;
        carrier?: string | undefined;
        tracking_number?: string | undefined;
        tracking_url?: string | undefined;
    }[] | undefined;
    expectations?: {
        id: string;
        line_items: {
            id: string;
            quantity: number;
        }[];
        destination: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        };
        method_type: "digital" | "pickup" | "shipping";
        description?: string | undefined;
        fulfillable_on?: string | undefined;
    }[] | undefined;
}>;
export type Fulfillment = z.infer<typeof FulfillmentSchema>;
export declare const CheckoutWithAp2MandateSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    continue_url: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    expires_at: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        title?: string | undefined;
    }, {
        type: string;
        url: string;
        title?: string | undefined;
    }>, "many">;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
        path: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
        type: z.ZodEnum<["error", "info", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }>, "many">>;
    order: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        permalink_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        permalink_url: string;
    }, {
        id: string;
        permalink_url: string;
    }>>;
    payment: z.ZodObject<{
        handlers: z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">;
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    status: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
    ap2: z.ZodOptional<z.ZodObject<{
        merchant_authorization: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        merchant_authorization: string;
    }, {
        merchant_authorization: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    ap2?: {
        merchant_authorization: string;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    ap2?: {
        merchant_authorization: string;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}>;
export type CheckoutWithAp2Mandate = z.infer<typeof CheckoutWithAp2MandateSchema>;
export declare const CheckoutWithBuyerConsentCreateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        consent: z.ZodOptional<z.ZodObject<{
            analytics: z.ZodOptional<z.ZodBoolean>;
            marketing: z.ZodOptional<z.ZodBoolean>;
            preferences: z.ZodOptional<z.ZodBoolean>;
            sale_of_data: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }>>;
    currency: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
    }, {
        quantity: number;
        item: {
            id: string;
        };
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
export type CheckoutWithBuyerConsentCreateRequest = z.infer<typeof CheckoutWithBuyerConsentCreateRequestSchema>;
export declare const CheckoutWithBuyerConsentUpdateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        consent: z.ZodOptional<z.ZodObject<{
            analytics: z.ZodOptional<z.ZodBoolean>;
            marketing: z.ZodOptional<z.ZodBoolean>;
            preferences: z.ZodOptional<z.ZodBoolean>;
            sale_of_data: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }>>;
    currency: z.ZodString;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
export type CheckoutWithBuyerConsentUpdateRequest = z.infer<typeof CheckoutWithBuyerConsentUpdateRequestSchema>;
export declare const CheckoutWithBuyerConsentResponseSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        consent: z.ZodOptional<z.ZodObject<{
            analytics: z.ZodOptional<z.ZodBoolean>;
            marketing: z.ZodOptional<z.ZodBoolean>;
            preferences: z.ZodOptional<z.ZodBoolean>;
            sale_of_data: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }, {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    }>>;
    continue_url: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    expires_at: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        title?: string | undefined;
    }, {
        type: string;
        url: string;
        title?: string | undefined;
    }>, "many">;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
        path: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
        type: z.ZodEnum<["error", "info", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }>, "many">>;
    order: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        permalink_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        permalink_url: string;
    }, {
        id: string;
        permalink_url: string;
    }>>;
    payment: z.ZodObject<{
        handlers: z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">;
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    status: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}>;
export type CheckoutWithBuyerConsentResponse = z.infer<typeof CheckoutWithBuyerConsentResponseSchema>;
export declare const CheckoutWithDiscountCreateRequestDiscountsSchema: z.ZodObject<{
    applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
        allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            amount: number;
        }, {
            path: string;
            amount: number;
        }>, "many">>;
        amount: z.ZodNumber;
        automatic: z.ZodOptional<z.ZodBoolean>;
        code: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
        priority: z.ZodOptional<z.ZodNumber>;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }>, "many">>;
    codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}>;
export type CheckoutWithDiscountCreateRequestDiscounts = z.infer<typeof CheckoutWithDiscountCreateRequestDiscountsSchema>;
export declare const CheckoutWithDiscountUpdateRequestDiscountsSchema: z.ZodObject<{
    applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
        allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            amount: number;
        }, {
            path: string;
            amount: number;
        }>, "many">>;
        amount: z.ZodNumber;
        automatic: z.ZodOptional<z.ZodBoolean>;
        code: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
        priority: z.ZodOptional<z.ZodNumber>;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }>, "many">>;
    codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}>;
export type CheckoutWithDiscountUpdateRequestDiscounts = z.infer<typeof CheckoutWithDiscountUpdateRequestDiscountsSchema>;
export declare const CheckoutWithDiscountResponseDiscountsSchema: z.ZodObject<{
    applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
        allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            path: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            amount: number;
        }, {
            path: string;
            amount: number;
        }>, "many">>;
        amount: z.ZodNumber;
        automatic: z.ZodOptional<z.ZodBoolean>;
        code: z.ZodOptional<z.ZodString>;
        method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
        priority: z.ZodOptional<z.ZodNumber>;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }, {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }>, "many">>;
    codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}, {
    applied?: {
        title: string;
        amount: number;
        code?: string | undefined;
        allocations?: {
            path: string;
            amount: number;
        }[] | undefined;
        automatic?: boolean | undefined;
        method?: "across" | "each" | undefined;
        priority?: number | undefined;
    }[] | undefined;
    codes?: string[] | undefined;
}>;
export type CheckoutWithDiscountResponseDiscounts = z.infer<typeof CheckoutWithDiscountResponseDiscountsSchema>;
export declare const CheckoutWithFulfillmentCreateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
    }, {
        quantity: number;
        item: {
            id: string;
        };
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    fulfillment: z.ZodOptional<z.ZodObject<{
        methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
            destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
                id: z.ZodOptional<z.ZodString>;
                address: z.ZodOptional<z.ZodObject<{
                    address_country: z.ZodOptional<z.ZodString>;
                    address_locality: z.ZodOptional<z.ZodString>;
                    address_region: z.ZodOptional<z.ZodString>;
                    extended_address: z.ZodOptional<z.ZodString>;
                    first_name: z.ZodOptional<z.ZodString>;
                    full_name: z.ZodOptional<z.ZodString>;
                    last_name: z.ZodOptional<z.ZodString>;
                    phone_number: z.ZodOptional<z.ZodString>;
                    postal_code: z.ZodOptional<z.ZodString>;
                    street_address: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }>>;
                name: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }, {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }>, "many">>;
            groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
                selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            }, "strip", z.ZodTypeAny, {
                selected_option_id?: string | null | undefined;
            }, {
                selected_option_id?: string | null | undefined;
            }>, "many">>;
            line_item_ids: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            type: z.ZodEnum<["pickup", "shipping"]>;
        }, "strip", z.ZodTypeAny, {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }, {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    }, {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            destinations?: {
                id?: string | undefined;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            line_item_ids?: string[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
}>;
export type CheckoutWithFulfillmentCreateRequest = z.infer<typeof CheckoutWithFulfillmentCreateRequestSchema>;
export declare const FulfillmentMethodResponseSchema: z.ZodObject<{
    destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        address_country: z.ZodOptional<z.ZodString>;
        address_locality: z.ZodOptional<z.ZodString>;
        address_region: z.ZodOptional<z.ZodString>;
        extended_address: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
        postal_code: z.ZodOptional<z.ZodString>;
        street_address: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        address: z.ZodOptional<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }, {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        }>>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }, {
        id: string;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }>, "many">>;
    groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        line_item_ids: z.ZodArray<z.ZodString, "many">;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            carrier: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            earliest_fulfillment_time: z.ZodOptional<z.ZodDate>;
            id: z.ZodString;
            latest_fulfillment_time: z.ZodOptional<z.ZodDate>;
            title: z.ZodString;
            totals: z.ZodArray<z.ZodObject<{
                amount: z.ZodNumber;
                display_text: z.ZodOptional<z.ZodString>;
                type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
            }, "strip", z.ZodTypeAny, {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }, {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }, {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }>, "many">>;
        selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        line_item_ids: string[];
        options?: {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }[] | undefined;
        selected_option_id?: string | null | undefined;
    }, {
        id: string;
        line_item_ids: string[];
        options?: {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }[] | undefined;
        selected_option_id?: string | null | undefined;
    }>, "many">>;
    id: z.ZodString;
    line_item_ids: z.ZodArray<z.ZodString, "many">;
    selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
    type: z.ZodEnum<["pickup", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    type: "pickup" | "shipping";
    id: string;
    line_item_ids: string[];
    destinations?: {
        id: string;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        id: string;
        line_item_ids: string[];
        options?: {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }[] | undefined;
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    selected_destination_id?: string | null | undefined;
}, {
    type: "pickup" | "shipping";
    id: string;
    line_item_ids: string[];
    destinations?: {
        id: string;
        name?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
        address_country?: string | undefined;
        address_locality?: string | undefined;
        address_region?: string | undefined;
        extended_address?: string | undefined;
        postal_code?: string | undefined;
        street_address?: string | undefined;
        address?: {
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
        } | undefined;
    }[] | undefined;
    groups?: {
        id: string;
        line_item_ids: string[];
        options?: {
            id: string;
            title: string;
            totals: {
                type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                amount: number;
                display_text?: string | undefined;
            }[];
            description?: string | undefined;
            carrier?: string | undefined;
            earliest_fulfillment_time?: Date | undefined;
            latest_fulfillment_time?: Date | undefined;
        }[] | undefined;
        selected_option_id?: string | null | undefined;
    }[] | undefined;
    selected_destination_id?: string | null | undefined;
}>;
export type FulfillmentMethodResponse = z.infer<typeof FulfillmentMethodResponseSchema>;
export declare const UcpDiscoveryProfileSchema: z.ZodObject<{
    payment: z.ZodOptional<z.ZodObject<{
        handlers: z.ZodOptional<z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        handlers?: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[] | undefined;
    }, {
        handlers?: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[] | undefined;
    }>>;
    signing_keys: z.ZodOptional<z.ZodArray<z.ZodObject<{
        alg: z.ZodOptional<z.ZodString>;
        crv: z.ZodOptional<z.ZodString>;
        e: z.ZodOptional<z.ZodString>;
        kid: z.ZodString;
        kty: z.ZodString;
        n: z.ZodOptional<z.ZodString>;
        use: z.ZodOptional<z.ZodEnum<["enc", "sig"]>>;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        kid: string;
        kty: string;
        alg?: string | undefined;
        crv?: string | undefined;
        e?: string | undefined;
        n?: string | undefined;
        use?: "enc" | "sig" | undefined;
        x?: string | undefined;
        y?: string | undefined;
    }, {
        kid: string;
        kty: string;
        alg?: string | undefined;
        crv?: string | undefined;
        e?: string | undefined;
        n?: string | undefined;
        use?: "enc" | "sig" | undefined;
        x?: string | undefined;
        y?: string | undefined;
    }>, "many">>;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }, {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }>, "many">;
        services: z.ZodRecord<z.ZodString, z.ZodObject<{
            a2a: z.ZodOptional<z.ZodObject<{
                endpoint: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                endpoint: string;
            }, {
                endpoint: string;
            }>>;
            embedded: z.ZodOptional<z.ZodObject<{
                schema: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                schema: string;
            }, {
                schema: string;
            }>>;
            mcp: z.ZodOptional<z.ZodObject<{
                endpoint: z.ZodString;
                schema: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                schema: string;
                endpoint: string;
            }, {
                schema: string;
                endpoint: string;
            }>>;
            rest: z.ZodOptional<z.ZodObject<{
                endpoint: z.ZodString;
                schema: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                schema: string;
                endpoint: string;
            }, {
                schema: string;
                endpoint: string;
            }>>;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }>>;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }[];
        services: Record<string, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }>;
    }, {
        version: string;
        capabilities: {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }[];
        services: Record<string, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }>;
    }>;
}, "strip", z.ZodTypeAny, {
    ucp: {
        version: string;
        capabilities: {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }[];
        services: Record<string, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }>;
    };
    payment?: {
        handlers?: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[] | undefined;
    } | undefined;
    signing_keys?: {
        kid: string;
        kty: string;
        alg?: string | undefined;
        crv?: string | undefined;
        e?: string | undefined;
        n?: string | undefined;
        use?: "enc" | "sig" | undefined;
        x?: string | undefined;
        y?: string | undefined;
    }[] | undefined;
}, {
    ucp: {
        version: string;
        capabilities: {
            name: string;
            spec: string;
            version: string;
            schema: string;
            config?: Record<string, any> | undefined;
            extends?: string | undefined;
        }[];
        services: Record<string, {
            spec: string;
            version: string;
            a2a?: {
                endpoint: string;
            } | undefined;
            embedded?: {
                schema: string;
            } | undefined;
            mcp?: {
                schema: string;
                endpoint: string;
            } | undefined;
            rest?: {
                schema: string;
                endpoint: string;
            } | undefined;
        }>;
    };
    payment?: {
        handlers?: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[] | undefined;
    } | undefined;
    signing_keys?: {
        kid: string;
        kty: string;
        alg?: string | undefined;
        crv?: string | undefined;
        e?: string | undefined;
        n?: string | undefined;
        use?: "enc" | "sig" | undefined;
        x?: string | undefined;
        y?: string | undefined;
    }[] | undefined;
}>;
export type UcpDiscoveryProfile = z.infer<typeof UcpDiscoveryProfileSchema>;
export declare const CheckoutResponseSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    continue_url: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    expires_at: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        title?: string | undefined;
    }, {
        type: string;
        url: string;
        title?: string | undefined;
    }>, "many">;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
        path: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
        type: z.ZodEnum<["error", "info", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }>, "many">>;
    order: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        permalink_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        permalink_url: string;
    }, {
        id: string;
        permalink_url: string;
    }>>;
    payment: z.ZodObject<{
        handlers: z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">;
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    status: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}>;
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
export declare const OrderSchema: z.ZodObject<{
    adjustments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        amount: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        id: z.ZodString;
        line_items: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            quantity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            quantity: number;
        }, {
            id: string;
            quantity: number;
        }>, "many">>;
        occurred_at: z.ZodDate;
        status: z.ZodEnum<["completed", "failed", "pending"]>;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        status: "completed" | "failed" | "pending";
        id: string;
        occurred_at: Date;
        amount?: number | undefined;
        description?: string | undefined;
        line_items?: {
            id: string;
            quantity: number;
        }[] | undefined;
    }, {
        type: string;
        status: "completed" | "failed" | "pending";
        id: string;
        occurred_at: Date;
        amount?: number | undefined;
        description?: string | undefined;
        line_items?: {
            id: string;
            quantity: number;
        }[] | undefined;
    }>, "many">>;
    checkout_id: z.ZodString;
    fulfillment: z.ZodObject<{
        events: z.ZodOptional<z.ZodArray<z.ZodObject<{
            carrier: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            line_items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                quantity: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id: string;
                quantity: number;
            }, {
                id: string;
                quantity: number;
            }>, "many">;
            occurred_at: z.ZodDate;
            tracking_number: z.ZodOptional<z.ZodString>;
            tracking_url: z.ZodOptional<z.ZodString>;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }, {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }>, "many">>;
        expectations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            description: z.ZodOptional<z.ZodString>;
            destination: z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>;
            fulfillable_on: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            line_items: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                quantity: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                id: string;
                quantity: number;
            }, {
                id: string;
                quantity: number;
            }>, "many">;
            method_type: z.ZodEnum<["digital", "pickup", "shipping"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }, {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        events?: {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }[] | undefined;
        expectations?: {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }[] | undefined;
    }, {
        events?: {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }[] | undefined;
        expectations?: {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }[] | undefined;
    }>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodObject<{
            fulfilled: z.ZodNumber;
            total: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            total: number;
            fulfilled: number;
        }, {
            total: number;
            fulfilled: number;
        }>;
        status: z.ZodEnum<["fulfilled", "partial", "processing"]>;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "fulfilled" | "partial" | "processing";
        id: string;
        quantity: {
            total: number;
            fulfilled: number;
        };
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        status: "fulfilled" | "partial" | "processing";
        id: string;
        quantity: {
            total: number;
            fulfilled: number;
        };
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    permalink_url: z.ZodString;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    fulfillment: {
        events?: {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }[] | undefined;
        expectations?: {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }[] | undefined;
    };
    id: string;
    permalink_url: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        status: "fulfilled" | "partial" | "processing";
        id: string;
        quantity: {
            total: number;
            fulfilled: number;
        };
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    checkout_id: string;
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    adjustments?: {
        type: string;
        status: "completed" | "failed" | "pending";
        id: string;
        occurred_at: Date;
        amount?: number | undefined;
        description?: string | undefined;
        line_items?: {
            id: string;
            quantity: number;
        }[] | undefined;
    }[] | undefined;
}, {
    fulfillment: {
        events?: {
            type: string;
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            occurred_at: Date;
            description?: string | undefined;
            carrier?: string | undefined;
            tracking_number?: string | undefined;
            tracking_url?: string | undefined;
        }[] | undefined;
        expectations?: {
            id: string;
            line_items: {
                id: string;
                quantity: number;
            }[];
            destination: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            };
            method_type: "digital" | "pickup" | "shipping";
            description?: string | undefined;
            fulfillable_on?: string | undefined;
        }[] | undefined;
    };
    id: string;
    permalink_url: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        status: "fulfilled" | "partial" | "processing";
        id: string;
        quantity: {
            total: number;
            fulfilled: number;
        };
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    checkout_id: string;
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    adjustments?: {
        type: string;
        status: "completed" | "failed" | "pending";
        id: string;
        occurred_at: Date;
        amount?: number | undefined;
        description?: string | undefined;
        line_items?: {
            id: string;
            quantity: number;
        }[] | undefined;
    }[] | undefined;
}>;
export type Order = z.infer<typeof OrderSchema>;
export declare const CheckoutWithDiscountCreateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
    }, {
        quantity: number;
        item: {
            id: string;
        };
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    discounts: z.ZodOptional<z.ZodObject<{
        applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
            allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                amount: z.ZodNumber;
                path: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                amount: number;
            }, {
                path: string;
                amount: number;
            }>, "many">>;
            amount: z.ZodNumber;
            automatic: z.ZodOptional<z.ZodBoolean>;
            code: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
            priority: z.ZodOptional<z.ZodNumber>;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }>, "many">>;
        codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}, {
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}>;
export type CheckoutWithDiscountCreateRequest = z.infer<typeof CheckoutWithDiscountCreateRequestSchema>;
export declare const CheckoutWithDiscountUpdateRequestSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    currency: z.ZodString;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        item: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }, {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }>, "many">;
    payment: z.ZodObject<{
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    discounts: z.ZodOptional<z.ZodObject<{
        applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
            allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                amount: z.ZodNumber;
                path: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                amount: number;
            }, {
                path: string;
                amount: number;
            }>, "many">>;
            amount: z.ZodNumber;
            automatic: z.ZodOptional<z.ZodBoolean>;
            code: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
            priority: z.ZodOptional<z.ZodNumber>;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }>, "many">>;
        codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}, {
    id: string;
    line_items: {
        quantity: number;
        item: {
            id: string;
        };
        id?: string | undefined;
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}>;
export type CheckoutWithDiscountUpdateRequest = z.infer<typeof CheckoutWithDiscountUpdateRequestSchema>;
export declare const CheckoutWithDiscountResponseSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    continue_url: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    expires_at: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        title?: string | undefined;
    }, {
        type: string;
        url: string;
        title?: string | undefined;
    }>, "many">;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
        path: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
        type: z.ZodEnum<["error", "info", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }>, "many">>;
    order: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        permalink_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        permalink_url: string;
    }, {
        id: string;
        permalink_url: string;
    }>>;
    payment: z.ZodObject<{
        handlers: z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">;
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    status: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
    discounts: z.ZodOptional<z.ZodObject<{
        applied: z.ZodOptional<z.ZodArray<z.ZodObject<{
            allocations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                amount: z.ZodNumber;
                path: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                amount: number;
            }, {
                path: string;
                amount: number;
            }>, "many">>;
            amount: z.ZodNumber;
            automatic: z.ZodOptional<z.ZodBoolean>;
            code: z.ZodOptional<z.ZodString>;
            method: z.ZodOptional<z.ZodEnum<["across", "each"]>>;
            priority: z.ZodOptional<z.ZodNumber>;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }, {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }>, "many">>;
        codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }, {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
    discounts?: {
        applied?: {
            title: string;
            amount: number;
            code?: string | undefined;
            allocations?: {
                path: string;
                amount: number;
            }[] | undefined;
            automatic?: boolean | undefined;
            method?: "across" | "each" | undefined;
            priority?: number | undefined;
        }[] | undefined;
        codes?: string[] | undefined;
    } | undefined;
}>;
export type CheckoutWithDiscountResponse = z.infer<typeof CheckoutWithDiscountResponseSchema>;
export declare const FulfillmentResponseSchema: z.ZodObject<{
    available_methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodString>;
        fulfillable_on: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
        line_item_ids: z.ZodArray<z.ZodString, "many">;
        type: z.ZodEnum<["pickup", "shipping"]>;
    }, "strip", z.ZodTypeAny, {
        type: "pickup" | "shipping";
        line_item_ids: string[];
        description?: string | undefined;
        fulfillable_on?: string | null | undefined;
    }, {
        type: "pickup" | "shipping";
        line_item_ids: string[];
        description?: string | undefined;
        fulfillable_on?: string | null | undefined;
    }>, "many">>;
    methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
        destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            address_country: z.ZodOptional<z.ZodString>;
            address_locality: z.ZodOptional<z.ZodString>;
            address_region: z.ZodOptional<z.ZodString>;
            extended_address: z.ZodOptional<z.ZodString>;
            first_name: z.ZodOptional<z.ZodString>;
            full_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            postal_code: z.ZodOptional<z.ZodString>;
            street_address: z.ZodOptional<z.ZodString>;
            id: z.ZodString;
            address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            name: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }, {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }>, "many">>;
        groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            line_item_ids: z.ZodArray<z.ZodString, "many">;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                carrier: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                earliest_fulfillment_time: z.ZodOptional<z.ZodDate>;
                id: z.ZodString;
                latest_fulfillment_time: z.ZodOptional<z.ZodDate>;
                title: z.ZodString;
                totals: z.ZodArray<z.ZodObject<{
                    amount: z.ZodNumber;
                    display_text: z.ZodOptional<z.ZodString>;
                    type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
                }, "strip", z.ZodTypeAny, {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }, {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }, {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }>, "many">>;
            selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }, {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }>, "many">>;
        id: z.ZodString;
        line_item_ids: z.ZodArray<z.ZodString, "many">;
        selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
        type: z.ZodEnum<["pickup", "shipping"]>;
    }, "strip", z.ZodTypeAny, {
        type: "pickup" | "shipping";
        id: string;
        line_item_ids: string[];
        destinations?: {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        selected_destination_id?: string | null | undefined;
    }, {
        type: "pickup" | "shipping";
        id: string;
        line_item_ids: string[];
        destinations?: {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        selected_destination_id?: string | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    methods?: {
        type: "pickup" | "shipping";
        id: string;
        line_item_ids: string[];
        destinations?: {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        selected_destination_id?: string | null | undefined;
    }[] | undefined;
    available_methods?: {
        type: "pickup" | "shipping";
        line_item_ids: string[];
        description?: string | undefined;
        fulfillable_on?: string | null | undefined;
    }[] | undefined;
}, {
    methods?: {
        type: "pickup" | "shipping";
        id: string;
        line_item_ids: string[];
        destinations?: {
            id: string;
            name?: string | undefined;
            first_name?: string | undefined;
            full_name?: string | undefined;
            last_name?: string | undefined;
            phone_number?: string | undefined;
            address_country?: string | undefined;
            address_locality?: string | undefined;
            address_region?: string | undefined;
            extended_address?: string | undefined;
            postal_code?: string | undefined;
            street_address?: string | undefined;
            address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            line_item_ids: string[];
            options?: {
                id: string;
                title: string;
                totals: {
                    type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                    amount: number;
                    display_text?: string | undefined;
                }[];
                description?: string | undefined;
                carrier?: string | undefined;
                earliest_fulfillment_time?: Date | undefined;
                latest_fulfillment_time?: Date | undefined;
            }[] | undefined;
            selected_option_id?: string | null | undefined;
        }[] | undefined;
        selected_destination_id?: string | null | undefined;
    }[] | undefined;
    available_methods?: {
        type: "pickup" | "shipping";
        line_item_ids: string[];
        description?: string | undefined;
        fulfillable_on?: string | null | undefined;
    }[] | undefined;
}>;
export type FulfillmentResponse = z.infer<typeof FulfillmentResponseSchema>;
export declare const CheckoutWithFulfillmentResponseSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        first_name: z.ZodOptional<z.ZodString>;
        full_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodString>;
        phone_number: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }, {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    }>>;
    continue_url: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    expires_at: z.ZodOptional<z.ZodDate>;
    id: z.ZodString;
    line_items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        item: z.ZodObject<{
            id: z.ZodString;
            image_url: z.ZodOptional<z.ZodString>;
            price: z.ZodNumber;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }, {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        }>;
        parent_id: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        totals: z.ZodArray<z.ZodObject<{
            amount: z.ZodNumber;
            display_text: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
        }, "strip", z.ZodTypeAny, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }, {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }, {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }>, "many">;
    links: z.ZodArray<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        title?: string | undefined;
    }, {
        type: string;
        url: string;
        title?: string | undefined;
    }>, "many">;
    messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        content_type: z.ZodOptional<z.ZodEnum<["markdown", "plain"]>>;
        path: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<["recoverable", "requires_buyer_input", "requires_buyer_review"]>>;
        type: z.ZodEnum<["error", "info", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }, {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }>, "many">>;
    order: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        permalink_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        permalink_url: string;
    }, {
        id: string;
        permalink_url: string;
    }>>;
    payment: z.ZodObject<{
        handlers: z.ZodArray<z.ZodObject<{
            config: z.ZodRecord<z.ZodString, z.ZodAny>;
            config_schema: z.ZodString;
            id: z.ZodString;
            instrument_schemas: z.ZodArray<z.ZodString, "many">;
            name: z.ZodString;
            spec: z.ZodString;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }, {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }>, "many">;
        instruments: z.ZodOptional<z.ZodArray<z.ZodObject<{
            billing_address: z.ZodOptional<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }, {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            }>>;
            credential: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
                cryptogram: z.ZodOptional<z.ZodString>;
                cvc: z.ZodOptional<z.ZodString>;
                eci_value: z.ZodOptional<z.ZodString>;
                expiry_month: z.ZodOptional<z.ZodNumber>;
                expiry_year: z.ZodOptional<z.ZodNumber>;
                name: z.ZodOptional<z.ZodString>;
                number: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }, {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            }>>;
            handler_id: z.ZodString;
            id: z.ZodString;
            type: z.ZodEnum<["card"]>;
            brand: z.ZodString;
            expiry_month: z.ZodOptional<z.ZodNumber>;
            expiry_year: z.ZodOptional<z.ZodNumber>;
            last_digits: z.ZodString;
            rich_card_art: z.ZodOptional<z.ZodString>;
            rich_text_description: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }, {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }>, "many">>;
        selected_instrument_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }, {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    }>;
    status: z.ZodEnum<["canceled", "complete_in_progress", "completed", "incomplete", "ready_for_complete", "requires_escalation"]>;
    totals: z.ZodArray<z.ZodObject<{
        amount: z.ZodNumber;
        display_text: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }, {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }>, "many">;
    ucp: z.ZodObject<{
        capabilities: z.ZodArray<z.ZodObject<{
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            extends: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            schema: z.ZodOptional<z.ZodString>;
            spec: z.ZodOptional<z.ZodString>;
            version: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }, {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }>, "many">;
        version: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }, {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    }>;
    fulfillment: z.ZodOptional<z.ZodObject<{
        available_methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
            description: z.ZodOptional<z.ZodString>;
            fulfillable_on: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            line_item_ids: z.ZodArray<z.ZodString, "many">;
            type: z.ZodEnum<["pickup", "shipping"]>;
        }, "strip", z.ZodTypeAny, {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }, {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }>, "many">>;
        methods: z.ZodOptional<z.ZodArray<z.ZodObject<{
            destinations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                address_country: z.ZodOptional<z.ZodString>;
                address_locality: z.ZodOptional<z.ZodString>;
                address_region: z.ZodOptional<z.ZodString>;
                extended_address: z.ZodOptional<z.ZodString>;
                first_name: z.ZodOptional<z.ZodString>;
                full_name: z.ZodOptional<z.ZodString>;
                last_name: z.ZodOptional<z.ZodString>;
                phone_number: z.ZodOptional<z.ZodString>;
                postal_code: z.ZodOptional<z.ZodString>;
                street_address: z.ZodOptional<z.ZodString>;
                id: z.ZodString;
                address: z.ZodOptional<z.ZodObject<{
                    address_country: z.ZodOptional<z.ZodString>;
                    address_locality: z.ZodOptional<z.ZodString>;
                    address_region: z.ZodOptional<z.ZodString>;
                    extended_address: z.ZodOptional<z.ZodString>;
                    first_name: z.ZodOptional<z.ZodString>;
                    full_name: z.ZodOptional<z.ZodString>;
                    last_name: z.ZodOptional<z.ZodString>;
                    phone_number: z.ZodOptional<z.ZodString>;
                    postal_code: z.ZodOptional<z.ZodString>;
                    street_address: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }, {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                }>>;
                name: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }, {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }>, "many">>;
            groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                line_item_ids: z.ZodArray<z.ZodString, "many">;
                options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    carrier: z.ZodOptional<z.ZodString>;
                    description: z.ZodOptional<z.ZodString>;
                    earliest_fulfillment_time: z.ZodOptional<z.ZodDate>;
                    id: z.ZodString;
                    latest_fulfillment_time: z.ZodOptional<z.ZodDate>;
                    title: z.ZodString;
                    totals: z.ZodArray<z.ZodObject<{
                        amount: z.ZodNumber;
                        display_text: z.ZodOptional<z.ZodString>;
                        type: z.ZodEnum<["discount", "fee", "fulfillment", "items_discount", "subtotal", "tax", "total"]>;
                    }, "strip", z.ZodTypeAny, {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }, {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }>, "many">;
                }, "strip", z.ZodTypeAny, {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }, {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }>, "many">>;
                selected_option_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }, {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }>, "many">>;
            id: z.ZodString;
            line_item_ids: z.ZodArray<z.ZodString, "many">;
            selected_destination_id: z.ZodOptional<z.ZodUnion<[z.ZodNull, z.ZodString]>>;
            type: z.ZodEnum<["pickup", "shipping"]>;
        }, "strip", z.ZodTypeAny, {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }, {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        methods?: {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
        available_methods?: {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }[] | undefined;
    }, {
        methods?: {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
        available_methods?: {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
        available_methods?: {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}, {
    status: "canceled" | "complete_in_progress" | "completed" | "incomplete" | "ready_for_complete" | "requires_escalation";
    id: string;
    totals: {
        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
        amount: number;
        display_text?: string | undefined;
    }[];
    line_items: {
        id: string;
        quantity: number;
        item: {
            id: string;
            price: number;
            title: string;
            image_url?: string | undefined;
        };
        totals: {
            type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
            amount: number;
            display_text?: string | undefined;
        }[];
        parent_id?: string | undefined;
    }[];
    currency: string;
    payment: {
        handlers: {
            config: Record<string, any>;
            config_schema: string;
            id: string;
            instrument_schemas: string[];
            name: string;
            spec: string;
            version: string;
        }[];
        instruments?: {
            type: "card";
            id: string;
            handler_id: string;
            brand: string;
            last_digits: string;
            expiry_month?: number | undefined;
            expiry_year?: number | undefined;
            billing_address?: {
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
            } | undefined;
            credential?: {
                type: string;
                number?: string | undefined;
                name?: string | undefined;
                card_number_type?: "dpan" | "fpan" | "network_token" | undefined;
                cryptogram?: string | undefined;
                cvc?: string | undefined;
                eci_value?: string | undefined;
                expiry_month?: number | undefined;
                expiry_year?: number | undefined;
            } | undefined;
            rich_card_art?: string | undefined;
            rich_text_description?: string | undefined;
        }[] | undefined;
        selected_instrument_id?: string | undefined;
    };
    links: {
        type: string;
        url: string;
        title?: string | undefined;
    }[];
    ucp: {
        version: string;
        capabilities: {
            name: string;
            version: string;
            config?: Record<string, any> | undefined;
            spec?: string | undefined;
            extends?: string | undefined;
            schema?: string | undefined;
        }[];
    };
    fulfillment?: {
        methods?: {
            type: "pickup" | "shipping";
            id: string;
            line_item_ids: string[];
            destinations?: {
                id: string;
                name?: string | undefined;
                first_name?: string | undefined;
                full_name?: string | undefined;
                last_name?: string | undefined;
                phone_number?: string | undefined;
                address_country?: string | undefined;
                address_locality?: string | undefined;
                address_region?: string | undefined;
                extended_address?: string | undefined;
                postal_code?: string | undefined;
                street_address?: string | undefined;
                address?: {
                    first_name?: string | undefined;
                    full_name?: string | undefined;
                    last_name?: string | undefined;
                    phone_number?: string | undefined;
                    address_country?: string | undefined;
                    address_locality?: string | undefined;
                    address_region?: string | undefined;
                    extended_address?: string | undefined;
                    postal_code?: string | undefined;
                    street_address?: string | undefined;
                } | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                line_item_ids: string[];
                options?: {
                    id: string;
                    title: string;
                    totals: {
                        type: "discount" | "fee" | "fulfillment" | "items_discount" | "subtotal" | "tax" | "total";
                        amount: number;
                        display_text?: string | undefined;
                    }[];
                    description?: string | undefined;
                    carrier?: string | undefined;
                    earliest_fulfillment_time?: Date | undefined;
                    latest_fulfillment_time?: Date | undefined;
                }[] | undefined;
                selected_option_id?: string | null | undefined;
            }[] | undefined;
            selected_destination_id?: string | null | undefined;
        }[] | undefined;
        available_methods?: {
            type: "pickup" | "shipping";
            line_item_ids: string[];
            description?: string | undefined;
            fulfillable_on?: string | null | undefined;
        }[] | undefined;
    } | undefined;
    buyer?: {
        email?: string | undefined;
        first_name?: string | undefined;
        full_name?: string | undefined;
        last_name?: string | undefined;
        phone_number?: string | undefined;
    } | undefined;
    continue_url?: string | undefined;
    expires_at?: Date | undefined;
    messages?: {
        type: "error" | "info" | "warning";
        content: string;
        code?: string | undefined;
        path?: string | undefined;
        content_type?: "markdown" | "plain" | undefined;
        severity?: "recoverable" | "requires_buyer_input" | "requires_buyer_review" | undefined;
    }[] | undefined;
    order?: {
        id: string;
        permalink_url: string;
    } | undefined;
}>;
export type CheckoutWithFulfillmentResponse = z.infer<typeof CheckoutWithFulfillmentResponseSchema>;
