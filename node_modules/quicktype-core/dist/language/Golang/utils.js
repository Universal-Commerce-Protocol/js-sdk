"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compoundTypeKinds = exports.primitiveValueTypeKinds = exports.namingFunction = void 0;
exports.isValueType = isValueType;
exports.canOmitEmpty = canOmitEmpty;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
exports.namingFunction = (0, Naming_1.funPrefixNamer)("namer", goNameStyle);
const legalizeName = (0, Strings_1.legalizeCharacters)(Strings_1.isLetterOrUnderscoreOrDigit);
function goNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", Strings_1.isLetterOrUnderscore);
}
exports.primitiveValueTypeKinds = [
    "integer",
    "double",
    "bool",
    "string",
];
exports.compoundTypeKinds = ["array", "class", "map", "enum"];
function isValueType(t) {
    const kind = t.kind;
    return (exports.primitiveValueTypeKinds.includes(kind) ||
        kind === "class" ||
        kind === "enum" ||
        kind === "date-time");
}
function canOmitEmpty(cp, omitEmptyOption) {
    if (!cp.isOptional)
        return false;
    if (omitEmptyOption)
        return true;
    const t = cp.type;
    return !["union", "null", "any"].includes(t.kind);
}
