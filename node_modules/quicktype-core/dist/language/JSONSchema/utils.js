"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namingFunction = void 0;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
exports.namingFunction = (0, Naming_1.funPrefixNamer)("namer", jsonNameStyle);
const legalizeName = (0, Strings_1.legalizeCharacters)((cp) => cp >= 32 && cp < 128 && cp !== 0x2f /* slash */);
function jsonNameStyle(original) {
    const words = (0, Strings_1.splitIntoWords)(original);
    return (0, Strings_1.combineWords)(words, legalizeName, Strings_1.firstUpperWordStyle, Strings_1.firstUpperWordStyle, Strings_1.allUpperWordStyle, Strings_1.allUpperWordStyle, "", (_) => true);
}
