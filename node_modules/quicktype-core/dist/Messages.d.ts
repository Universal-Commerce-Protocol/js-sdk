import type { Ref } from "./input/JSONSchemaInput";
import type { StringMap } from "./support/Support";
export type ErrorProperties = {
    kind: "InternalError";
    properties: {
        message: string;
    };
} | {
    kind: "MiscJSONParseError";
    properties: {
        address: string;
        description: string;
        message: string;
    };
} | {
    kind: "MiscReadError";
    properties: {
        fileOrURL: string;
        message: string;
    };
} | {
    kind: "MiscUnicodeHighSurrogateWithoutLowSurrogate";
    properties: {};
} | {
    kind: "MiscInvalidMinMaxConstraint";
    properties: {
        max: number;
        min: number;
    };
} | {
    kind: "InferenceJSONReferenceNotRooted";
    properties: {
        reference: string;
    };
} | {
    kind: "InferenceJSONReferenceToUnion";
    properties: {
        reference: string;
    };
} | {
    kind: "InferenceJSONReferenceWrongProperty";
    properties: {
        reference: string;
    };
} | {
    kind: "InferenceJSONReferenceInvalidArrayIndex";
    properties: {
        reference: string;
    };
} | {
    kind: "SchemaArrayIsInvalidSchema";
    properties: {
        ref: Ref;
    };
} | {
    kind: "SchemaNullIsInvalidSchema";
    properties: {
        ref: Ref;
    };
} | {
    kind: "SchemaRefMustBeString";
    properties: {
        actual: string;
        ref: Ref;
    };
} | {
    kind: "SchemaAdditionalTypesForbidRequired";
    properties: {
        ref: Ref;
    };
} | {
    kind: "SchemaNoTypeSpecified";
    properties: {
        ref: Ref;
    };
} | {
    kind: "SchemaInvalidType";
    properties: {
        ref: Ref;
        type: string;
    };
} | {
    kind: "SchemaFalseNotSupported";
    properties: {
        ref: Ref;
    };
} | {
    kind: "SchemaInvalidJSONSchemaType";
    properties: {
        ref: Ref;
        type: string;
    };
} | {
    kind: "SchemaRequiredMustBeStringOrStringArray";
    properties: {
        actual: any;
        ref: Ref;
    };
} | {
    kind: "SchemaRequiredElementMustBeString";
    properties: {
        element: any;
        ref: Ref;
    };
} | {
    kind: "SchemaTypeMustBeStringOrStringArray";
    properties: {
        actual: any;
    };
} | {
    kind: "SchemaTypeElementMustBeString";
    properties: {
        element: any;
        ref: Ref;
    };
} | {
    kind: "SchemaArrayItemsMustBeStringOrArray";
    properties: {
        actual: any;
        ref: Ref;
    };
} | {
    kind: "SchemaIDMustHaveAddress";
    properties: {
        id: string;
        ref: Ref;
    };
} | {
    kind: "SchemaWrongAccessorEntryArrayLength";
    properties: {
        operation: string;
        ref: Ref;
    };
} | {
    kind: "SchemaSetOperationCasesIsNotArray";
    properties: {
        cases: any;
        operation: string;
        ref: Ref;
    };
} | {
    kind: "SchemaMoreThanOneUnionMemberName";
    properties: {
        names: string[];
    };
} | {
    kind: "SchemaCannotGetTypesFromBoolean";
    properties: {
        ref: string;
    };
} | {
    kind: "SchemaCannotIndexArrayWithNonNumber";
    properties: {
        actual: string;
        ref: Ref;
    };
} | {
    kind: "SchemaIndexNotInArray";
    properties: {
        index: number;
        ref: Ref;
    };
} | {
    kind: "SchemaKeyNotInObject";
    properties: {
        key: string;
        ref: Ref;
    };
} | {
    kind: "SchemaFetchError";
    properties: {
        address: string;
        base: Ref;
    };
} | {
    kind: "SchemaFetchErrorTopLevel";
    properties: {
        address: string;
    };
} | {
    kind: "SchemaFetchErrorAdditional";
    properties: {
        address: string;
    };
} | {
    kind: "GraphQLNoQueriesDefined";
    properties: {};
} | {
    kind: "DriverUnknownSourceLanguage";
    properties: {
        lang: string;
    };
} | {
    kind: "DriverUnknownOutputLanguage";
    properties: {
        lang: string;
    };
} | {
    kind: "DriverMoreThanOneInputGiven";
    properties: {
        topLevel: string;
    };
} | {
    kind: "DriverCannotInferNameForSchema";
    properties: {
        uri: string;
    };
} | {
    kind: "DriverNoGraphQLQueryGiven";
    properties: {};
} | {
    kind: "DriverNoGraphQLSchemaInDir";
    properties: {
        dir: string;
    };
} | {
    kind: "DriverMoreThanOneGraphQLSchemaInDir";
    properties: {
        dir: string;
    };
} | {
    kind: "DriverSourceLangMustBeGraphQL";
    properties: {};
} | {
    kind: "DriverGraphQLSchemaNeeded";
    properties: {};
} | {
    kind: "DriverInputFileDoesNotExist";
    properties: {
        filename: string;
    };
} | {
    kind: "DriverCannotMixJSONWithOtherSamples";
    properties: {
        dir: string;
    };
} | {
    kind: "DriverCannotMixNonJSONInputs";
    properties: {
        dir: string;
    };
} | {
    kind: "DriverUnknownDebugOption";
    properties: {
        option: string;
    };
} | {
    kind: "DriverNoLanguageOrExtension";
    properties: {};
} | {
    kind: "DriverCLIOptionParsingFailed";
    properties: {
        message: string;
    };
} | {
    kind: "IRNoForwardDeclarableTypeInCycle";
    properties: {};
} | {
    kind: "IRTypeAttributesNotPropagated";
    properties: {
        count: number;
        indexes: number[];
    };
} | {
    kind: "IRNoEmptyUnions";
    properties: {};
} | {
    kind: "RendererUnknownOptionValue";
    properties: {
        name: string;
        value: string;
    };
} | {
    kind: "TypeScriptCompilerError";
    properties: {
        message: string;
    };
};
export type ErrorKinds = ErrorProperties["kind"];
export type ErrorPropertiesForKind<K extends ErrorKinds = ErrorKinds> = Extract<ErrorProperties, {
    kind: K;
}> extends {
    properties: infer P;
} ? P : never;
export declare class QuickTypeError extends Error {
    readonly errorMessage: string;
    readonly messageName: string;
    userMessage: string;
    readonly properties: StringMap;
    constructor(errorMessage: string, messageName: string, userMessage: string, properties: StringMap);
}
export declare function messageError<Kind extends ErrorKinds>(kind: Kind, properties: ErrorPropertiesForKind<Kind>): never;
export declare function messageAssert<Kind extends ErrorKinds>(assertion: boolean, kind: Kind, properties: ErrorPropertiesForKind<Kind>): void;
