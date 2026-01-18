"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalizeName = void 0;
const Strings_1 = require("../../support/Strings");
const unicodeMaps_1 = require("./unicodeMaps");
exports.legalizeName = (0, Strings_1.utf16LegalizeCharacters)(unicodeMaps_1.isES3IdentifierPart);
