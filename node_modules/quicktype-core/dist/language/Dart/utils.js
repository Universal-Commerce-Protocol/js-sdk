"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEscape = exports.enumCaseNamingFunction = exports.propertyNamingFunction = exports.typeNamingFunction = void 0;
exports.dartNameStyle = dartNameStyle;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
exports.typeNamingFunction = (0, Naming_1.funPrefixNamer)("types", (n) => dartNameStyle(true, false, n));
exports.propertyNamingFunction = (0, Naming_1.funPrefixNamer)("properties", (n) => dartNameStyle(false, false, n));
exports.enumCaseNamingFunction = (0, Naming_1.funPrefixNamer)("enum-cases", (n) => dartNameStyle(true, true, n));
// Escape the dollar sign, which is used in string interpolation
exports.stringEscape = (0, Strings_1.utf16ConcatMap)((0, Strings_1.escapeNonPrintableMapper)((cp) => (0, Strings_1.isPrintable)(cp) && cp !== 0x24, Strings_1.standardUnicodeHexEscape));
function isStartCharacter(codePoint) {
    if (codePoint === 0x5f)
        return false; // underscore
    return (0, Strings_1.isAscii)(codePoint) && (0, Strings_1.isLetter)(codePoint);
}
function isPartCharacter(codePoint) {
    return (isStartCharacter(codePoint) ||
        ((0, Strings_1.isAscii)(codePoint) && (0, Strings_1.isDigit)(codePoint)));
}
const legalizeName = (0, Strings_1.utf16LegalizeCharacters)(isPartCharacter);
// FIXME: Handle acronyms consistently.  In particular, that means that
// we have to use namers to produce the getter and setter names - we can't
// just capitalize and concatenate.
// https://stackoverflow.com/questions/8277355/naming-convention-for-upper-case-abbreviations
function dartNameStyle(startWithUpper, upperUnderscore, original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    const firstWordStyle = upperUnderscore
        ? Strings_1.allUpperWordStyle
        : startWithUpper
            ? Strings_1.firstUpperWordStyle
            : Strings_1.allLowerWordStyle;
    const restWordStyle = upperUnderscore
        ? Strings_1.allUpperWordStyle
        : Strings_1.firstUpperWordStyle;
    return (0, Strings_1.combineWords)(words, legalizeName, firstWordStyle, restWordStyle, firstWordStyle, restWordStyle, upperUnderscore ? "_" : "", isStartCharacter);
}
