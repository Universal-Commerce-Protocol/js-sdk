"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rustStringEscape = exports.camelNamingFunction = exports.snakeNamingFunction = exports.namingStyles = exports.Visibility = exports.Density = void 0;
exports.getPreferredNamingStyle = getPreferredNamingStyle;
exports.listMatchingNamingStyles = listMatchingNamingStyles;
exports.nameWithNamingStyle = nameWithNamingStyle;
const Naming_1 = require("../../Naming");
const Strings_1 = require("../../support/Strings");
var Density;
(function (Density) {
    Density["Normal"] = "Normal";
    Density["Dense"] = "Dense";
})(Density || (exports.Density = Density = {}));
var Visibility;
(function (Visibility) {
    Visibility["Private"] = "Private";
    Visibility["Crate"] = "Crate";
    Visibility["Public"] = "Public";
})(Visibility || (exports.Visibility = Visibility = {}));
exports.namingStyles = {
    snake_case: {
        regex: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,
        toParts: (name) => name.split("_"),
        fromParts: (parts) => parts.map((p) => p.toLowerCase()).join("_"),
    },
    SCREAMING_SNAKE_CASE: {
        regex: /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/,
        toParts: (name) => name.split("_"),
        fromParts: (parts) => parts.map((p) => p.toUpperCase()).join("_"),
    },
    camelCase: {
        regex: /^[a-z]+([A-Z0-9][a-z]*)*$/,
        toParts: (name) => exports.namingStyles.snake_case.toParts(name.replace(/(.)([A-Z])/g, "$1_$2")),
        fromParts: (parts) => parts
            .map((p, i) => i === 0
            ? p.toLowerCase()
            : p.substring(0, 1).toUpperCase() +
                p.substring(1).toLowerCase())
            .join(""),
    },
    PascalCase: {
        regex: /^[A-Z][a-z]*([A-Z0-9][a-z]*)*$/,
        toParts: (name) => exports.namingStyles.snake_case.toParts(name.replace(/(.)([A-Z])/g, "$1_$2")),
        fromParts: (parts) => parts
            .map((p) => p.substring(0, 1).toUpperCase() +
            p.substring(1).toLowerCase())
            .join(""),
    },
    "kebab-case": {
        regex: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/,
        toParts: (name) => name.split("-"),
        fromParts: (parts) => parts.map((p) => p.toLowerCase()).join("-"),
    },
    "SCREAMING-KEBAB-CASE": {
        regex: /^[A-Z][A-Z0-9]*(-[A-Z0-9]+)*$/,
        toParts: (name) => name.split("-"),
        fromParts: (parts) => parts.map((p) => p.toUpperCase()).join("-"),
    },
    lowercase: {
        regex: /^[a-z][a-z0-9]*$/,
        toParts: (name) => [name],
        fromParts: (parts) => parts.map((p) => p.toLowerCase()).join(""),
    },
    UPPERCASE: {
        regex: /^[A-Z][A-Z0-9]*$/,
        toParts: (name) => [name],
        fromParts: (parts) => parts.map((p) => p.toUpperCase()).join(""),
    },
};
exports.namingStyles;
const isAsciiLetterOrUnderscoreOrDigit = (codePoint) => {
    if (!(0, Strings_1.isAscii)(codePoint)) {
        return false;
    }
    return (0, Strings_1.isLetterOrUnderscoreOrDigit)(codePoint);
};
const isAsciiLetterOrUnderscore = (codePoint) => {
    if (!(0, Strings_1.isAscii)(codePoint)) {
        return false;
    }
    return (0, Strings_1.isLetterOrUnderscore)(codePoint);
};
const legalizeName = (0, Strings_1.legalizeCharacters)(isAsciiLetterOrUnderscoreOrDigit);
function rustStyle(original, isSnakeCase) {
    const words = (0, Strings_1.splitIntoWords)(original);
    const wordStyle = isSnakeCase ? Strings_1.allLowerWordStyle : Strings_1.firstUpperWordStyle;
    const combined = (0, Strings_1.combineWords)(words, legalizeName, wordStyle, wordStyle, wordStyle, wordStyle, isSnakeCase ? "_" : "", isAsciiLetterOrUnderscore);
    return combined === "_" ? "_underscore" : combined;
}
exports.snakeNamingFunction = (0, Naming_1.funPrefixNamer)("default", (original) => rustStyle(original, true));
exports.camelNamingFunction = (0, Naming_1.funPrefixNamer)("camel", (original) => rustStyle(original, false));
const standardUnicodeRustEscape = (codePoint) => {
    if (codePoint <= 0xffff) {
        return "\\u{" + (0, Strings_1.intToHex)(codePoint, 4) + "}";
    }
    else {
        return "\\u{" + (0, Strings_1.intToHex)(codePoint, 6) + "}";
    }
};
exports.rustStringEscape = (0, Strings_1.utf32ConcatMap)((0, Strings_1.escapeNonPrintableMapper)(Strings_1.isPrintable, standardUnicodeRustEscape));
function getPreferredNamingStyle(namingStyleOccurences, defaultStyle) {
    const occurrences = Object.fromEntries(Object.keys(exports.namingStyles).map((key) => [key, 0]));
    namingStyleOccurences.forEach((style) => ++occurrences[style]);
    const max = Math.max(...Object.values(occurrences));
    const preferedStyles = Object.entries(occurrences).flatMap(([style, num]) => (num === max ? [style] : []));
    if (preferedStyles.includes(defaultStyle)) {
        return defaultStyle;
    }
    return preferedStyles[0];
}
function listMatchingNamingStyles(name) {
    return Object.entries(exports.namingStyles).flatMap(([namingStyleKey, { regex }]) => regex.test(name) ? [namingStyleKey] : []);
}
function nameWithNamingStyle(name, style) {
    if (exports.namingStyles[style].regex.test(name)) {
        return name;
    }
    const fromStyle = listMatchingNamingStyles(name)[0];
    if (fromStyle === undefined) {
        return name;
    }
    return exports.namingStyles[style].fromParts(exports.namingStyles[fromStyle].toParts(name));
}
