"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEscape = void 0;
exports.javaNameStyle = javaNameStyle;
const Strings_1 = require("../../support/Strings");
exports.stringEscape = (0, Strings_1.utf16ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isAscii, Strings_1.standardUnicodeHexEscape));
function isStartCharacter(codePoint) {
    if (codePoint === 0x5f)
        return true; // underscore
    return (0, Strings_1.isAscii)(codePoint) && (0, Strings_1.isLetter)(codePoint);
}
function isPartCharacter(codePoint) {
    return (isStartCharacter(codePoint) ||
        ((0, Strings_1.isAscii)(codePoint) && (0, Strings_1.isDigit)(codePoint)));
}
const legalizeName = (0, Strings_1.utf16LegalizeCharacters)(isPartCharacter);
function javaNameStyle(startWithUpper, upperUnderscore, original, acronymsStyle = Strings_1.allUpperWordStyle) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, upperUnderscore
        ? Strings_1.allUpperWordStyle
        : startWithUpper
            ? Strings_1.firstUpperWordStyle
            : Strings_1.allLowerWordStyle, upperUnderscore ? Strings_1.allUpperWordStyle : Strings_1.firstUpperWordStyle, upperUnderscore || startWithUpper
        ? Strings_1.allUpperWordStyle
        : Strings_1.allLowerWordStyle, acronymsStyle, upperUnderscore ? "_" : "", isStartCharacter);
}
