"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowerNamingFunction = exports.upperNamingFunction = void 0;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
const legalizeName = (0, Strings_1.legalizeCharacters)((cp) => (0, Strings_1.isAscii)(cp) && (0, Strings_1.isLetterOrUnderscoreOrDigit)(cp));
function haskellNameStyle(original, upper) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, upper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, upper ? Strings_1.allUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.allUpperWordStyle, "", Strings_1.isLetterOrUnderscore);
}
exports.upperNamingFunction = (0, Naming_1.funPrefixNamer)("upper", (n) => haskellNameStyle(n, true));
exports.lowerNamingFunction = (0, Naming_1.funPrefixNamer)("lower", (n) => haskellNameStyle(n, false));
