"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classNameStyle = classNameStyle;
exports.snakeNameStyle = snakeNameStyle;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Strings_1 = require("../../support/Strings");
function isNormalizedStartCharacter3(utf16Unit) {
    // FIXME: add Other_ID_Start - https://docs.python.org/3/reference/lexical_analysis.html#identifiers
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    return ["Lu", "Ll", "Lt", "Lm", "Lo", "Nl"].includes(category);
}
function isNormalizedPartCharacter3(utf16Unit) {
    // FIXME: add Other_ID_Continue - https://docs.python.org/3/reference/lexical_analysis.html#identifiers
    if (isNormalizedStartCharacter3(utf16Unit))
        return true;
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    return ["Mn", "Mc", "Nd", "Pc"].includes(category);
}
function isStartCharacter3(utf16Unit) {
    const s = String.fromCharCode(utf16Unit).normalize("NFKC");
    const l = s.length;
    if (l === 0 || !isNormalizedStartCharacter3(s.charCodeAt(0)))
        return false;
    for (let i = 1; i < l; i++) {
        if (!isNormalizedPartCharacter3(s.charCodeAt(i)))
            return false;
    }
    return true;
}
function isPartCharacter3(utf16Unit) {
    const s = String.fromCharCode(utf16Unit).normalize("NFKC");
    const l = s.length;
    for (let i = 0; i < l; i++) {
        if (!isNormalizedPartCharacter3(s.charCodeAt(i)))
            return false;
    }
    return true;
}
const legalizeName3 = (0, Strings_1.utf16LegalizeCharacters)(isPartCharacter3);
function classNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName3, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter3);
}
function getWordStyle(uppercase, forceSnakeNameStyle) {
    if (!forceSnakeNameStyle) {
        return Strings_1.originalWord;
    }
    return uppercase ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle;
}
function snakeNameStyle(original, uppercase, forceSnakeNameStyle) {
    const wordStyle = getWordStyle(uppercase, forceSnakeNameStyle);
    const separator = forceSnakeNameStyle ? "_" : "";
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName3, wordStyle, wordStyle, wordStyle, wordStyle, separator, isStartCharacter3);
}
