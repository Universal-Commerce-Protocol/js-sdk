"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformedStringTypeKinds = exports.transformedStringTypeTargetTypeKindsMap = void 0;
exports.isPrimitiveStringTypeKind = isPrimitiveStringTypeKind;
exports.targetTypeKindForTransformedStringTypeKind = targetTypeKindForTransformedStringTypeKind;
exports.isNumberTypeKind = isNumberTypeKind;
exports.isPrimitiveTypeKind = isPrimitiveTypeKind;
exports.triviallyStructurallyCompatible = triviallyStructurallyCompatible;
const collection_utils_1 = require("collection-utils");
const URIAttributes_1 = require("../attributes/URIAttributes");
/**
 * All the transformed string type kinds and the JSON Schema formats and
 * primitive type kinds they map to.  Not all transformed string types map to
 * primitive types.  Date-time types, for example, stand on their own, but
 * stringified integers map to integers.
 */
const transformedStringTypeTargetTypeKinds = {
    date: { jsonSchema: "date", primitive: undefined },
    time: { jsonSchema: "time", primitive: undefined },
    "date-time": { jsonSchema: "date-time", primitive: undefined },
    uuid: { jsonSchema: "uuid", primitive: undefined },
    uri: {
        jsonSchema: "uri",
        primitive: undefined,
        attributesProducer: URIAttributes_1.uriInferenceAttributesProducer,
    },
    "integer-string": {
        jsonSchema: "integer",
        primitive: "integer",
    },
    "bool-string": {
        jsonSchema: "boolean",
        primitive: "bool",
    },
};
exports.transformedStringTypeTargetTypeKindsMap = (0, collection_utils_1.mapFromObject)(transformedStringTypeTargetTypeKinds);
exports.transformedStringTypeKinds = new Set(Object.getOwnPropertyNames(transformedStringTypeTargetTypeKinds));
function isPrimitiveStringTypeKind(kind) {
    return (kind === "string" ||
        (0, collection_utils_1.hasOwnProperty)(transformedStringTypeTargetTypeKinds, kind));
}
function targetTypeKindForTransformedStringTypeKind(kind) {
    const target = exports.transformedStringTypeTargetTypeKindsMap.get(kind);
    if (target === undefined)
        return undefined;
    return target.primitive;
}
function isNumberTypeKind(kind) {
    return kind === "integer" || kind === "double";
}
function isPrimitiveTypeKind(kind) {
    if (isPrimitiveStringTypeKind(kind))
        return true;
    if (isNumberTypeKind(kind))
        return true;
    return (kind === "none" || kind === "any" || kind === "null" || kind === "bool");
}
function triviallyStructurallyCompatible(x, y) {
    if (x.index === y.index)
        return true;
    if (x.kind === "none" || y.kind === "none")
        return true;
    return false;
}
