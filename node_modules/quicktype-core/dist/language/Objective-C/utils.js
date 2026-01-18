"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenForEnumCases = exports.staticEnumValuesIdentifier = exports.DEFAULT_CLASS_PREFIX = void 0;
exports.typeNameStyle = typeNameStyle;
exports.propertyNameStyle = propertyNameStyle;
exports.splitExtension = splitExtension;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Strings_1 = require("../../support/Strings");
const constants_1 = require("./constants");
exports.DEFAULT_CLASS_PREFIX = "QT";
function typeNameStyle(prefix, original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    const result = (0, Strings_1.combineWords)(words, legalizeName, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter);
    return (0, Strings_1.addPrefixIfNecessary)(prefix, result);
}
function propertyNameStyle(original, isBool = false) {
    // Objective-C developers are uncomfortable with property "id"
    // so we use an alternate name in this special case.
    if (original === "id") {
        original = "identifier";
    }
    let words = (0, Strings_1.splitIntoWords)(original);
    if (isBool) {
        if (words.length === 0) {
            words = [{ word: "flag", isAcronym: false }];
        }
        else if (!words[0].isAcronym &&
            // @ts-expect-error needs strict type
            !constants_1.booleanPrefixes.includes(words[0].word)) {
            words = [{ word: "is", isAcronym: false }, ...words];
        }
    }
    // Properties cannot even begin with any of the forbidden names
    // For example, properies named new* are treated differently by ARC
    // @ts-expect-error needs strict type
    if (words.length > 0 && constants_1.forbiddenPropertyNames.includes(words[0].word)) {
        words = [{ word: "the", isAcronym: false }, ...words];
    }
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter);
}
function isStartCharacter(utf16Unit) {
    return unicode_properties_1.default.isAlphabetic(utf16Unit) || utf16Unit === 0x5f; // underscore
}
function isPartCharacter(utf16Unit) {
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    return (["Nd", "Pc", "Mn", "Mc"].includes(category) ||
        isStartCharacter(utf16Unit));
}
const legalizeName = (0, Strings_1.utf16LegalizeCharacters)(isPartCharacter);
exports.staticEnumValuesIdentifier = "values";
exports.forbiddenForEnumCases = ["new", exports.staticEnumValuesIdentifier];
function splitExtension(filename) {
    const i = filename.lastIndexOf(".");
    const extension = i !== -1 ? filename.split(".").pop() : "m";
    filename = i !== -1 ? filename.slice(0, i) : filename;
    return [filename, extension !== null && extension !== void 0 ? extension : "m"];
}
