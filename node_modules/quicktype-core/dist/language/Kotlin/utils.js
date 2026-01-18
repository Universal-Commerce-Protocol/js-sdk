"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kotlinNameStyle = kotlinNameStyle;
exports.stringEscape = stringEscape;
const Strings_1 = require("../../support/Strings");
function isPartCharacter(codePoint) {
    return (0, Strings_1.isLetterOrUnderscore)(codePoint) || (0, Strings_1.isNumeric)(codePoint);
}
function isStartCharacter(codePoint) {
    return isPartCharacter(codePoint) && !(0, Strings_1.isDigit)(codePoint);
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isPartCharacter);
function kotlinNameStyle(isUpper, original, acronymsStyle = Strings_1.allUpperWordStyle) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, isUpper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, isUpper ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle, acronymsStyle, "", isStartCharacter);
}
function unicodeEscape(codePoint) {
    return "\\u" + (0, Strings_1.intToHex)(codePoint, 4);
}
// eslint-disable-next-line @typescript-eslint/naming-convention
const _stringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, unicodeEscape));
function stringEscape(s) {
    // "$this" is a template string in Kotlin so we have to escape $
    return _stringEscape(s).replace(/\$/g, "\\$");
}
