export declare enum __DirectiveLocation {
    QUERY = "QUERY",// Location adjacent to a query operation.
    MUTATION = "MUTATION",// Location adjacent to a mutation operation.
    SUBSCRIPTION = "SUBSCRIPTION",// Location adjacent to a subscription operation.
    FIELD = "FIELD",// Location adjacent to a field.
    FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION",// Location adjacent to a fragment definition.
    FRAGMENT_SPREAD = "FRAGMENT_SPREAD",// Location adjacent to a fragment spread.
    INLINE_FRAGMENT = "INLINE_FRAGMENT",// Location adjacent to an inline fragment.
    SCHEMA = "SCHEMA",// Location adjacent to a schema definition.
    SCALAR = "SCALAR",// Location adjacent to a scalar definition.
    OBJECT = "OBJECT",// Location adjacent to an object type definition.
    FIELD_DEFINITION = "FIELD_DEFINITION",// Location adjacent to a field definition.
    ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION",// Location adjacent to an argument definition.
    INTERFACE = "INTERFACE",// Location adjacent to an interface definition.
    UNION = "UNION",// Location adjacent to a union definition.
    ENUM = "ENUM",// Location adjacent to an enum definition.
    ENUM_VALUE = "ENUM_VALUE",// Location adjacent to an enum value definition.
    INPUT_OBJECT = "INPUT_OBJECT",// Location adjacent to an input object type definition.
    INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION"
}
export declare enum TypeKind {
    SCALAR = "SCALAR",// Indicates this type is a scalar.
    OBJECT = "OBJECT",// Indicates this type is an object. `fields` and `interfaces` are valid fields.
    INTERFACE = "INTERFACE",// Indicates this type is an interface. `fields` and `possibleTypes` are valid fields.
    UNION = "UNION",// Indicates this type is a union. `possibleTypes` is a valid field.
    ENUM = "ENUM",// Indicates this type is an enum. `enumValues` is a valid field.
    INPUT_OBJECT = "INPUT_OBJECT",// Indicates this type is an input object. `inputFields` is a valid field.
    LIST = "LIST",// Indicates this type is a list. `ofType` is a valid field.
    NON_NULL = "NON_NULL"
}
export type GraphQLSchema = {
    __schema: {
        __typename: "__Schema";
        queryType: {
            __typename: "__Type";
            name: string | null;
        };
        mutationType: {
            __typename: "__Type";
            name: string | null;
        } | null;
        subscriptionType: {
            __typename: "__Type";
            name: string | null;
        } | null;
        types: Array<{
            __typename: "__Type";
            kind: TypeKind;
            name: string | null;
            description: string | null;
            fields: Array<{
                __typename: "__Field";
                name: string;
                description: string | null;
                args: Array<{
                    __typename: "__InputValue";
                    name: string;
                    description: string | null;
                    type: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                            ofType: {
                                                __typename: "__Type";
                                                kind: TypeKind;
                                                name: string | null;
                                                ofType: {
                                                    __typename: "__Type";
                                                    kind: TypeKind;
                                                    name: string | null;
                                                } | null;
                                            } | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    };
                    defaultValue: string | null;
                }>;
                type: {
                    __typename: "__Type";
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                            ofType: {
                                                __typename: "__Type";
                                                kind: TypeKind;
                                                name: string | null;
                                            } | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                };
                isDeprecated: boolean;
                deprecationReason: string | null;
            }> | null;
            inputFields: Array<{
                __typename: "__InputValue";
                name: string;
                description: string | null;
                type: {
                    __typename: "__Type";
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                            ofType: {
                                                __typename: "__Type";
                                                kind: TypeKind;
                                                name: string | null;
                                            } | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                };
                defaultValue: string | null;
            }> | null;
            interfaces: Array<{
                __typename: "__Type";
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: "__Type";
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            }> | null;
            enumValues: Array<{
                __typename: "__EnumValue";
                name: string;
                description: string | null;
            }> | null;
            possibleTypes: Array<{
                __typename: "__Type";
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: "__Type";
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            }> | null;
        }>;
        directives: Array<{
            __typename: "__Directive";
            name: string;
            description: string | null;
            locations: Array<__DirectiveLocation>;
            args: Array<{
                __typename: "__InputValue";
                name: string;
                description: string | null;
                type: {
                    __typename: "__Type";
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: "__Type";
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: "__Type";
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: "__Type";
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: "__Type";
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: "__Type";
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: "__Type";
                                            kind: TypeKind;
                                            name: string | null;
                                            ofType: {
                                                __typename: "__Type";
                                                kind: TypeKind;
                                                name: string | null;
                                            } | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                };
                defaultValue: string | null;
            }>;
        }>;
    };
};
export type FullTypeFragment = {
    __typename: "__Type";
    kind: TypeKind;
    name: string | null;
    description: string | null;
    fields: Array<{
        __typename: string;
        name: string;
        description: string | null;
        args: Array<{
            __typename: string;
            name: string;
            description: string | null;
            type: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: string;
                                        kind: TypeKind;
                                        name: string | null;
                                        ofType: {
                                            __typename: string;
                                            kind: TypeKind;
                                            name: string | null;
                                        } | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            };
            defaultValue: string | null;
        }>;
        type: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: string;
                                        kind: TypeKind;
                                        name: string | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        };
        isDeprecated: boolean;
        deprecationReason: string | null;
    }> | null;
    inputFields: Array<{
        __typename: string;
        name: string;
        description: string | null;
        type: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                    ofType: {
                                        __typename: string;
                                        kind: TypeKind;
                                        name: string | null;
                                    } | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        };
        defaultValue: string | null;
    }> | null;
    interfaces: Array<{
        __typename: string;
        kind: TypeKind;
        name: string | null;
        ofType: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    }> | null;
    enumValues: Array<{
        __typename: string;
        name: string;
        description: string | null;
    }> | null;
    possibleTypes: Array<{
        __typename: string;
        kind: TypeKind;
        name: string | null;
        ofType: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    }> | null;
};
export type InputValueFragment = {
    __typename: "__InputValue";
    name: string;
    description: string | null;
    type: {
        __typename: string;
        kind: TypeKind;
        name: string | null;
        ofType: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                                ofType: {
                                    __typename: string;
                                    kind: TypeKind;
                                    name: string | null;
                                } | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    };
    defaultValue: string | null;
};
export type TypeRefFragment = {
    __typename: "__Type";
    kind: TypeKind;
    name: string | null;
    ofType: {
        __typename: string;
        kind: TypeKind;
        name: string | null;
        ofType: {
            __typename: string;
            kind: TypeKind;
            name: string | null;
            ofType: {
                __typename: string;
                kind: TypeKind;
                name: string | null;
                ofType: {
                    __typename: string;
                    kind: TypeKind;
                    name: string | null;
                    ofType: {
                        __typename: string;
                        kind: TypeKind;
                        name: string | null;
                        ofType: {
                            __typename: string;
                            kind: TypeKind;
                            name: string | null;
                            ofType: {
                                __typename: string;
                                kind: TypeKind;
                                name: string | null;
                            } | null;
                        } | null;
                    } | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
