"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedTypeNamingFunction = exports.namingFunction = exports.enumNamingFunction = void 0;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
const legalizeName = (0, Strings_1.legalizeCharacters)(Strings_1.isLetterOrUnderscoreOrDigit);
exports.enumNamingFunction = (0, Naming_1.funPrefixNamer)("enumNamer", (0, Strings_1.makeNameStyle)("upper-underscore", legalizeName));
exports.namingFunction = (0, Naming_1.funPrefixNamer)("genericNamer", (0, Strings_1.makeNameStyle)("underscore", legalizeName));
exports.namedTypeNamingFunction = (0, Naming_1.funPrefixNamer)("typeNamer", (0, Strings_1.makeNameStyle)("pascal", legalizeName));
