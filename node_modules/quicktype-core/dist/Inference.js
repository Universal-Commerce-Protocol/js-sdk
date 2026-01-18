"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultInferenceFlags = exports.inferenceFlags = exports.inferenceFlagNames = exports.inferenceFlagsObject = void 0;
exports.inferenceFlagsObject = {
    /** Whether to infer map types from JSON data */
    inferMaps: {
        description: "Detect maps",
        negationDescription: "Don't infer maps, always use classes",
        explanation: "Infer maps when object keys look like map keys.",
        order: 1,
    },
    /** Whether to infer enum types from JSON data */
    inferEnums: {
        description: "Detect enums",
        negationDescription: "Don't infer enums, always use strings",
        explanation: "If string values occur within a relatively small domain,\ninfer them as enum values.",
        order: 2,
    },
    /** Whether to convert UUID strings to UUID objects */
    inferUuids: {
        description: "Detect UUIDs",
        negationDescription: "Don't convert UUIDs to UUID objects",
        explanation: "Detect UUIDs like '123e4567-e89b-12d3-a456-426655440000' (partial support).",
        stringType: "uuid",
        order: 3,
    },
    /** Whether to assume that JSON strings that look like dates are dates */
    inferDateTimes: {
        description: "Detect dates & times",
        negationDescription: "Don't infer dates or times",
        explanation: "Infer dates from strings (partial support).",
        stringType: "date-time",
        order: 4,
    },
    /** Whether to convert stringified integers to integers */
    inferIntegerStrings: {
        description: "Detect integers in strings",
        negationDescription: "Don't convert stringified integers to integers",
        explanation: 'Automatically convert stringified integers to integers.\nFor example, "1" is converted to 1.',
        stringType: "integer-string",
        order: 5,
    },
    /** Whether to convert stringified booleans to boolean values */
    inferBooleanStrings: {
        description: "Detect booleans in strings",
        negationDescription: "Don't convert stringified booleans to booleans",
        explanation: 'Automatically convert stringified booleans to booleans.\nFor example, "true" is converted to true.',
        stringType: "bool-string",
        order: 6,
    },
    /** Combine similar classes.  This doesn't apply to classes from a schema, only from inference. */
    combineClasses: {
        description: "Merge similar classes",
        negationDescription: "Don't combine similar classes",
        explanation: "Combine classes with significantly overlapping properties,\ntreating contingent properties as nullable.",
        order: 7,
    },
    /** Whether to treat $ref as references within JSON */
    ignoreJsonRefs: {
        description: "Don't treat $ref as a reference in JSON",
        negationDescription: "Treat $ref as a reference in JSON",
        explanation: "Like in JSON Schema, allow objects like\n'{ $ref: \"#/foo/bar\" }' to refer\nto another part of the input.",
        order: 8,
    },
};
exports.inferenceFlagNames = Object.getOwnPropertyNames(exports.inferenceFlagsObject);
exports.inferenceFlags = exports.inferenceFlagsObject;
function makeDefaultInferenceFlags() {
    const flags = {};
    for (const flag of exports.inferenceFlagNames) {
        flags[flag] = true;
    }
    return flags;
}
exports.defaultInferenceFlags = makeDefaultInferenceFlags();
