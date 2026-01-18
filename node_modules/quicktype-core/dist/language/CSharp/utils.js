"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.denseNullValueHandlingEnumName = exports.denseRequiredEnumName = exports.denseJsonPropertyName = exports.namingFunctionKeep = exports.namingFunction = exports.AccessModifier = void 0;
exports.noFollow = noFollow;
exports.needTransformerForType = needTransformerForType;
exports.alwaysApplyTransformation = alwaysApplyTransformation;
exports.csTypeForTransformedStringType = csTypeForTransformedStringType;
exports.isStartCharacter = isStartCharacter;
exports.csNameStyle = csNameStyle;
exports.isValueType = isValueType;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Constraints_1 = require("../../attributes/Constraints");
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
var AccessModifier;
(function (AccessModifier) {
    AccessModifier["None"] = "None";
    AccessModifier["Public"] = "Public";
    AccessModifier["Internal"] = "Internal";
})(AccessModifier || (exports.AccessModifier = AccessModifier = {}));
function noFollow(t) {
    return t;
}
function needTransformerForType(t) {
    if (t instanceof Type_1.UnionType) {
        const maybeNullable = (0, TypeUtils_1.nullableFromUnion)(t);
        if (maybeNullable === null)
            return "automatic";
        if (needTransformerForType(maybeNullable) === "manual")
            return "nullable";
        return "none";
    }
    if (t instanceof Type_1.ArrayType) {
        const itemsNeed = needTransformerForType(t.items);
        if (itemsNeed === "manual" || itemsNeed === "nullable")
            return "automatic";
        return "none";
    }
    if (t instanceof Type_1.EnumType)
        return "automatic";
    if (t.kind === "double")
        return (0, Constraints_1.minMaxValueForType)(t) !== undefined ? "manual" : "none";
    if (t.kind === "integer-string" || t.kind === "bool-string")
        return "manual";
    if (t.kind === "string") {
        return (0, Constraints_1.minMaxLengthForType)(t) !== undefined ? "manual" : "none";
    }
    return "none";
}
function alwaysApplyTransformation(xf) {
    const t = xf.targetType;
    if (t instanceof Type_1.EnumType)
        return true;
    if (t instanceof Type_1.UnionType)
        return (0, TypeUtils_1.nullableFromUnion)(t) === null;
    return false;
}
/**
 * The C# type for a given transformed string type.
 */
function csTypeForTransformedStringType(t) {
    switch (t.kind) {
        case "date-time":
            return "DateTimeOffset";
        case "uuid":
            return "Guid";
        case "uri":
            return "Uri";
        default:
            return (0, Support_1.panic)(`Transformed string type ${t.kind} not supported`);
    }
}
exports.namingFunction = (0, Naming_1.funPrefixNamer)("namer", csNameStyle);
exports.namingFunctionKeep = (0, Naming_1.funPrefixNamer)("namerKeep", csNameStyleKeep);
// FIXME: Make a Named?
exports.denseJsonPropertyName = "J";
exports.denseRequiredEnumName = "R";
exports.denseNullValueHandlingEnumName = "N";
function isStartCharacter(utf16Unit) {
    if (unicode_properties_1.default.isAlphabetic(utf16Unit)) {
        return true;
    }
    return utf16Unit === 0x5f; // underscore
}
function isPartCharacter(utf16Unit) {
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    if (["Nd", "Pc", "Mn", "Mc"].includes(category)) {
        return true;
    }
    return isStartCharacter(utf16Unit);
}
const legalizeName = (0, Strings_1.utf16LegalizeCharacters)(isPartCharacter);
function csNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, "", isStartCharacter);
}
function csNameStyleKeep(original) {
    const words = [
        {
            word: original,
            isAcronym: false,
        },
    ];
    const result = (0, Strings_1.combineWords)(words, legalizeName, (x) => x, (x) => x, (x) => x, (x) => x, "", isStartCharacter);
    // @ts-expect-error needs strong type
    return constants_1.keywords.includes(result) ? `@${result}` : result;
}
function isValueType(t) {
    if (t instanceof Type_1.UnionType) {
        return (0, TypeUtils_1.nullableFromUnion)(t) === null;
    }
    return ["integer", "double", "bool", "enum", "date-time", "uuid"].includes(t.kind);
}
