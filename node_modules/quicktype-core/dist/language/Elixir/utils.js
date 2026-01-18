"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEscape = void 0;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.escapeDoubleQuotes = escapeDoubleQuotes;
exports.escapeNewLines = escapeNewLines;
exports.simpleNameStyle = simpleNameStyle;
exports.memberNameStyle = memberNameStyle;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Strings_1 = require("../../support/Strings");
function unicodeEscape(codePoint) {
    return `\\u{${(0, Strings_1.intToHex)(codePoint, 0)}}`;
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.stringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, unicodeEscape));
function escapeDoubleQuotes(str) {
    return str.replace(/"/g, '\\"');
}
function escapeNewLines(str) {
    return str.replace(/\n/g, "\\n");
}
const isStartCharacter = Strings_1.isLetterOrUnderscore;
function isPartCharacter(utf16Unit) {
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    return (["Nd", "Pc", "Mn", "Mc"].includes(category) ||
        isStartCharacter(utf16Unit));
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isPartCharacter);
function simpleNameStyle(original, uppercase) {
    if (/^[0-9]+$/.test(original)) {
        original = `${original}N`;
    }
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, uppercase ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, uppercase ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter);
}
function memberNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, "_", isStartCharacter);
}
