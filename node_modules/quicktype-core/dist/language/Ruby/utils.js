"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEscape = exports.forbiddenForObjectProperties = exports.Strictness = void 0;
exports.simpleNameStyle = simpleNameStyle;
exports.memberNameStyle = memberNameStyle;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Strings_1 = require("../../support/Strings");
const keywords = __importStar(require("./constants"));
var Strictness;
(function (Strictness) {
    Strictness["Strict"] = "Strict::";
    Strictness["Coercible"] = "Coercible::";
    Strictness["None"] = "Types::";
})(Strictness || (exports.Strictness = Strictness = {}));
exports.forbiddenForObjectProperties = Array.from(new Set([...keywords.keywords, ...keywords.reservedProperties]));
function unicodeEscape(codePoint) {
    return "\\u{" + (0, Strings_1.intToHex)(codePoint, 0) + "}";
}
exports.stringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, unicodeEscape));
const isStartCharacter = Strings_1.isLetterOrUnderscore;
function isPartCharacter(utf16Unit) {
    const category = unicode_properties_1.default.getCategory(utf16Unit);
    return (["Nd", "Pc", "Mn", "Mc"].includes(category) ||
        isStartCharacter(utf16Unit));
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isPartCharacter);
function simpleNameStyle(original, uppercase) {
    if (/^[0-9]+$/.test(original)) {
        original = original + "N";
    }
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, uppercase ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, uppercase ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter);
}
function memberNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, Strings_1.allLowerWordStyle, "_", isStartCharacter);
}
