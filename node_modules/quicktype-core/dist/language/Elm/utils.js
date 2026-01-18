"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowerNamingFunction = exports.upperNamingFunction = void 0;
exports.requiredOrOptional = requiredOrOptional;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const legalizeName = (0, Strings_1.legalizeCharacters)((cp) => (0, Strings_1.isAscii)(cp) && (0, Strings_1.isLetterOrUnderscoreOrDigit)(cp));
function elmNameStyle(original, upper) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, upper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, upper ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, "", Strings_1.isLetterOrUnderscore);
}
exports.upperNamingFunction = (0, Naming_1.funPrefixNamer)("upper", (n) => elmNameStyle(n, true));
exports.lowerNamingFunction = (0, Naming_1.funPrefixNamer)("lower", (n) => elmNameStyle(n, false));
function requiredOrOptional(p) {
    function optional(fallback) {
        return { reqOrOpt: "Jpipe.optional", fallback };
    }
    const t = p.type;
    if (p.isOptional ||
        (t instanceof Type_1.UnionType && (0, TypeUtils_1.nullableFromUnion)(t) !== null)) {
        return optional(" Nothing");
    }
    if (t.kind === "null") {
        return optional(" ()");
    }
    return { reqOrOpt: "Jpipe.required", fallback: "" };
}
