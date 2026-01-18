"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowerNamingFunction = exports.upperNamingFunction = exports.shouldAddBacktick = void 0;
exports.scalaNameStyle = scalaNameStyle;
const unicode_properties_1 = require("unicode-properties");
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
const constants_1 = require("./constants");
/**
 * Check if given parameter name should be wrapped in a backtick
 * @param paramName
 */
const shouldAddBacktick = (paramName) => {
    return (constants_1.keywords.some((s) => paramName === s) ||
        constants_1.invalidSymbols.some((s) => paramName.includes(s)) ||
        !isNaN(Number.parseFloat(paramName)) ||
        !isNaN(Number.parseInt(paramName.charAt(0))));
};
exports.shouldAddBacktick = shouldAddBacktick;
function isPartCharacter(codePoint) {
    return (0, Strings_1.isLetterOrUnderscore)(codePoint) || (0, Strings_1.isNumeric)(codePoint);
}
function isStartCharacter(codePoint) {
    return isPartCharacter(codePoint) && !(0, unicode_properties_1.isDigit)(codePoint);
}
const legalizeName = (0, Strings_1.legalizeCharacters)(isPartCharacter);
function scalaNameStyle(isUpper, original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, isUpper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, isUpper ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, "", isStartCharacter);
}
exports.upperNamingFunction = (0, Naming_1.funPrefixNamer)("upper", (s) => scalaNameStyle(true, s));
exports.lowerNamingFunction = (0, Naming_1.funPrefixNamer)("lower", (s) => scalaNameStyle(false, s));
