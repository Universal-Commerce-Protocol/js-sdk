import type { TransformedStringTypeKind } from "./Type";
export interface InferenceFlag {
    description: string;
    explanation: string;
    negationDescription: string;
    order: number;
    stringType?: TransformedStringTypeKind;
}
export declare const inferenceFlagsObject: {
    /** Whether to infer map types from JSON data */
    inferMaps: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to infer enum types from JSON data */
    inferEnums: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to convert UUID strings to UUID objects */
    inferUuids: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: TransformedStringTypeKind;
        order: number;
    };
    /** Whether to assume that JSON strings that look like dates are dates */
    inferDateTimes: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: TransformedStringTypeKind;
        order: number;
    };
    /** Whether to convert stringified integers to integers */
    inferIntegerStrings: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: TransformedStringTypeKind;
        order: number;
    };
    /** Whether to convert stringified booleans to boolean values */
    inferBooleanStrings: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: TransformedStringTypeKind;
        order: number;
    };
    /** Combine similar classes.  This doesn't apply to classes from a schema, only from inference. */
    combineClasses: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to treat $ref as references within JSON */
    ignoreJsonRefs: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
};
export type InferenceFlagName = keyof typeof inferenceFlagsObject;
export declare const inferenceFlagNames: InferenceFlagName[];
export declare const inferenceFlags: {
    [F in InferenceFlagName]: InferenceFlag;
};
export type InferenceFlags = {
    [F in InferenceFlagName]: boolean;
};
export declare const defaultInferenceFlags: InferenceFlags;
