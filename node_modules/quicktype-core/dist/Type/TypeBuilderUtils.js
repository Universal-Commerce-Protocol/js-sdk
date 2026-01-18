"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringTypeMappingGet = stringTypeMappingGet;
exports.getNoStringTypeMapping = getNoStringTypeMapping;
const TransformedStringType_1 = require("./TransformedStringType");
function stringTypeMappingGet(stm, kind) {
    const mapped = stm.get(kind);
    if (mapped === undefined)
        return "string";
    return mapped;
}
let noStringTypeMapping;
function getNoStringTypeMapping() {
    if (noStringTypeMapping === undefined) {
        noStringTypeMapping = new Map(Array.from(TransformedStringType_1.transformedStringTypeKinds).map((k) => [k, k]));
    }
    return noStringTypeMapping;
}
