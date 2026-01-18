"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsFlowTypeAnnotations = void 0;
exports.quotePropertyName = quotePropertyName;
const Strings_1 = require("../../support/Strings");
const unicodeMaps_1 = require("../JavaScript/unicodeMaps");
const utils_1 = require("../JavaScript/utils");
exports.tsFlowTypeAnnotations = {
    any: ": any",
    anyArray: ": any[]",
    anyMap: ": { [k: string]: any }",
    string: ": string",
    stringArray: ": string[]",
    boolean: ": boolean",
};
function quotePropertyName(original) {
    const escaped = (0, Strings_1.utf16StringEscape)(original);
    const quoted = `"${escaped}"`;
    if (original.length === 0) {
        return quoted;
    }
    else if (!(0, unicodeMaps_1.isES3IdentifierStart)(original.codePointAt(0))) {
        return quoted;
    }
    else if (escaped !== original) {
        return quoted;
    }
    else if ((0, utils_1.legalizeName)(original) !== original) {
        return quoted;
    }
    else {
        return original;
    }
}
