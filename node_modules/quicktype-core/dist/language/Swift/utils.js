"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEscape = exports.SwiftDateTimeRecognizer = exports.MAX_SAMELINE_PROPERTIES = void 0;
exports.swiftNameStyle = swiftNameStyle;
const DateTime_1 = require("../../DateTime");
const Strings_1 = require("../../support/Strings");
exports.MAX_SAMELINE_PROPERTIES = 4;
// These are all recognized by Swift as ISO8601 date-times:
//
// 2018-08-14T02:45:50+00:00
// 2018-08-14T02:45:50+00
// 2018-08-14T02:45:50+1
// 2018-08-14T02:45:50+1111
// 2018-08-14T02:45:50+1111:1:33
// 2018-08-14T02:45:50-00
// 2018-08-14T02:45:50z
// 2018-00008-1T002:45:3Z
const swiftDateTimeRegex = /^\d+-\d+-\d+T\d+:\d+:\d+([zZ]|[+-]\d+(:\d+)?)$/;
class SwiftDateTimeRecognizer extends DateTime_1.DefaultDateTimeRecognizer {
    isDateTime(str) {
        return swiftDateTimeRegex.exec(str) !== null;
    }
}
exports.SwiftDateTimeRecognizer = SwiftDateTimeRecognizer;
function isPartCharacter(codePoint) {
    return (0, Strings_1.isLetterOrUnderscore)(codePoint) || (0, Strings_1.isNumeric)(codePoint);
}
function isStartCharacter(codePoint) {
    return isPartCharacter(codePoint) && !(0, Strings_1.isDigit)(codePoint);
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isPartCharacter);
function swiftNameStyle(prefix, isUpper, original, acronymsStyle = Strings_1.allUpperWordStyle) {
    const words = (0, Strings_1.splitIntoWords)(original);
    const combined = (0, Strings_1.combineWords)(words, legalizeName, isUpper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, isUpper ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle, acronymsStyle, "", isStartCharacter);
    return (0, Strings_1.addPrefixIfNecessary)(prefix, combined);
}
function unicodeEscape(codePoint) {
    return "\\u{" + (0, Strings_1.intToHex)(codePoint, 0) + "}";
}
exports.stringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, unicodeEscape));
