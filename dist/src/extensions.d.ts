import { z } from "zod";
export declare const ExtendedPaymentCredentialSchema: z.ZodObject<{
    type: z.ZodString;
    card_number_type: z.ZodOptional<z.ZodEnum<["dpan", "fpan", "network_token"]>>;
    cryptogram: z.ZodOptional<z.ZodString>;
    cvc: z.ZodOptional<z.ZodString>;
    eci_value: z.ZodOptional<z.ZodString>;
    expiry_month: z.ZodOptional<z.ZodNumber>;
    expiry_year: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodString>;
} & {
    token: z.ZodOptional<z.ZodString>;
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
    token?: string | undefined;
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
    token?: string | undefined;
}>;
export type ExtendedPaymentCredential = z.infer<typeof ExtendedPaymentCredentialSchema>;
export declare const PlatformConfigSchema: z.ZodObject<{
    webhook_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    webhook_url?: string | undefined;
}, {
    webhook_url?: string | undefined;
}>;
export type PlatformConfig = z.infer<typeof PlatformConfigSchema>;
export declare const ExtendedCheckoutResponseSchema: z.ZodObject<{
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
} & {
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
} & {
    order_id: z.ZodOptional<z.ZodString>;
    order_permalink_url: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodObject<{
        webhook_url: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        webhook_url?: string | undefined;
    }, {
        webhook_url?: string | undefined;
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
    order_id?: string | undefined;
    order_permalink_url?: string | undefined;
    platform?: {
        webhook_url?: string | undefined;
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
    order_id?: string | undefined;
    order_permalink_url?: string | undefined;
    platform?: {
        webhook_url?: string | undefined;
    } | undefined;
}>;
export type ExtendedCheckoutResponse = z.infer<typeof ExtendedCheckoutResponseSchema>;
export declare const ExtendedCheckoutCreateRequestSchema: z.ZodObject<{
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
} & {
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
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
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
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
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
export type ExtendedCheckoutCreateRequest = z.infer<typeof ExtendedCheckoutCreateRequestSchema>;
export declare const ExtendedCheckoutUpdateRequestSchema: z.ZodObject<{
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
} & {
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
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
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
        consent?: {
            analytics?: boolean | undefined;
            marketing?: boolean | undefined;
            preferences?: boolean | undefined;
            sale_of_data?: boolean | undefined;
        } | undefined;
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
export type ExtendedCheckoutUpdateRequest = z.infer<typeof ExtendedCheckoutUpdateRequestSchema>;
export declare const OrderUpdateSchema: z.ZodObject<{
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
export type OrderUpdate = z.infer<typeof OrderUpdateSchema>;
