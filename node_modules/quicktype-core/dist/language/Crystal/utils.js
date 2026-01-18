"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crystalStringEscape = exports.camelNamingFunction = exports.snakeNamingFunction = void 0;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
function isAsciiLetterOrUnderscoreOrDigit(codePoint) {
    if (!(0, Strings_1.isAscii)(codePoint)) {
        return false;
    }
    return (0, Strings_1.isLetterOrUnderscoreOrDigit)(codePoint);
}
function isAsciiLetterOrUnderscore(codePoint) {
    if (!(0, Strings_1.isAscii)(codePoint)) {
        return false;
    }
    return (0, Strings_1.isLetterOrUnderscore)(codePoint);
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isAsciiLetterOrUnderscoreOrDigit);
function crystalStyle(original, isSnakeCase) {
    const words = (0, Strings_1.splitIntoWords)(original);
    const wordStyle = isSnakeCase ? Strings_1.allLowerWordStyle : Strings_1.firstUpperWordStyle;
    const combined = (0, Strings_1.combineWords)(words, legalizeName, wordStyle, wordStyle, wordStyle, wordStyle, isSnakeCase ? "_" : "", isAsciiLetterOrUnderscore);
    return combined === "_" ? "_underscore" : combined;
}
exports.snakeNamingFunction = (0, Naming_1.funPrefixNamer)("default", (original) => crystalStyle(original, true));
exports.camelNamingFunction = (0, Naming_1.funPrefixNamer)("camel", (original) => crystalStyle(original, false));
function standardUnicodeCrystalEscape(codePoint) {
    if (codePoint <= 0xffff) {
        return "\\u{" + (0, Strings_1.intToHex)(codePoint, 4) + "}";
    }
    else {
        return "\\u{" + (0, Strings_1.intToHex)(codePoint, 6) + "}";
    }
}
exports.crystalStringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, standardUnicodeCrystalEscape));
