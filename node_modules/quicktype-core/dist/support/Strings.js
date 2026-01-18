"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastIsUpperCase = exports.stringEscape = exports.utf16StringEscape = void 0;
exports.utf16ConcatMap = utf16ConcatMap;
exports.utf32ConcatMap = utf32ConcatMap;
exports.utf16LegalizeCharacters = utf16LegalizeCharacters;
exports.legalizeCharacters = legalizeCharacters;
exports.repeatString = repeatString;
exports.intToHex = intToHex;
exports.standardUnicodeHexEscape = standardUnicodeHexEscape;
exports.escapeNonPrintableMapper = escapeNonPrintableMapper;
exports.isPrintable = isPrintable;
exports.isAscii = isAscii;
exports.isLetter = isLetter;
exports.isDigit = isDigit;
exports.isNumeric = isNumeric;
exports.isLetterOrDigit = isLetterOrDigit;
exports.isLetterOrUnderscore = isLetterOrUnderscore;
exports.isLetterOrUnderscoreOrDigit = isLetterOrUnderscoreOrDigit;
exports.isWordCharacter = isWordCharacter;
exports.trimEnd = trimEnd;
exports.capitalize = capitalize;
exports.decapitalize = decapitalize;
exports.pascalCase = pascalCase;
exports.camelCase = camelCase;
exports.snakeCase = snakeCase;
exports.startWithLetter = startWithLetter;
exports.splitIntoWords = splitIntoWords;
exports.firstUpperWordStyle = firstUpperWordStyle;
exports.allUpperWordStyle = allUpperWordStyle;
exports.originalWord = originalWord;
exports.allLowerWordStyle = allLowerWordStyle;
exports.combineWords = combineWords;
exports.addPrefixIfNecessary = addPrefixIfNecessary;
exports.makeNameStyle = makeNameStyle;
const unicode_properties_1 = __importDefault(require("unicode-properties"));
const Messages_1 = require("../Messages");
const Acronyms_const_1 = require("./Acronyms.const");
const Support_1 = require("./Support");
function computeAsciiMap(mapper) {
    const charStringMap = [];
    const charNoEscapeMap = [];
    for (let i = 0; i < 128; i++) {
        let noEscape = 0;
        const result = mapper(i);
        if (result === String.fromCharCode(i)) {
            noEscape = 1;
        }
        charStringMap.push(result);
        charNoEscapeMap.push(noEscape);
    }
    return { charStringMap, charNoEscapeMap };
}
function precomputedCodePointPredicate(p) {
    const asciiResults = [];
    for (let cp = 0; cp < 128; cp++) {
        asciiResults.push(p(cp));
    }
    return (cp) => cp < 128 ? asciiResults[cp] : p(cp);
}
// FIXME: This is a copy of code in src/Data/String/Util.js
function utf16ConcatMap(mapper) {
    const { charStringMap, charNoEscapeMap } = computeAsciiMap(mapper);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return function stringConcatMap_inner(s) {
        let cs = null;
        let start = 0;
        let i = 0;
        while (i < s.length) {
            const cc = s.charCodeAt(i);
            if (charNoEscapeMap[cc] !== 1) {
                if (cs === null)
                    cs = [];
                cs.push(s.substring(start, i));
                const str = charStringMap[cc];
                if (str === undefined) {
                    cs.push(mapper(s.charCodeAt(i)));
                }
                else {
                    cs.push(str);
                }
                start = i + 1;
            }
            i++;
        }
        if (cs === null)
            return s;
        cs.push(s.substring(start, i));
        return cs.join("");
    };
}
function isHighSurrogate(cc) {
    return cc >= 0xd800 && cc <= 0xdbff;
}
function isLowSurrogate(cc) {
    return cc >= 0xdc00 && cc <= 0xdfff;
}
function utf32ConcatMap(mapper) {
    const { charStringMap, charNoEscapeMap } = computeAsciiMap(mapper);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return function stringConcatMap_inner(s) {
        let cs = null;
        let start = 0;
        let i = 0;
        while (i < s.length) {
            let cc = s.charCodeAt(i);
            if (charNoEscapeMap[cc] !== 1) {
                if (cs === null)
                    cs = [];
                cs.push(s.substring(start, i));
                if (isHighSurrogate(cc)) {
                    const highSurrogate = cc;
                    i++;
                    const lowSurrogate = s.charCodeAt(i);
                    (0, Messages_1.messageAssert)(isLowSurrogate(lowSurrogate), "MiscUnicodeHighSurrogateWithoutLowSurrogate", {});
                    const highBits = highSurrogate - 0xd800;
                    const lowBits = lowSurrogate - 0xdc00;
                    cc = 0x10000 + lowBits + (highBits << 10);
                }
                const str = charStringMap[cc];
                if (str === undefined) {
                    cs.push(mapper(cc));
                }
                else {
                    cs.push(str);
                }
                start = i + 1;
            }
            i++;
        }
        if (cs === null)
            return s;
        cs.push(s.substring(start, i));
        return cs.join("");
    };
}
function utf16LegalizeCharacters(isLegal) {
    return utf16ConcatMap((u) => (isLegal(u) ? String.fromCharCode(u) : ""));
}
function legalizeCharacters(isLegal) {
    return utf32ConcatMap((u) => u <= 0xffff && isLegal(u) ? String.fromCharCode(u) : "");
}
function repeatString(s, n) {
    (0, Support_1.assert)(n >= 0, "Cannot repeat a string a negative number of times");
    if (n === 0)
        return "";
    // From https://github.com/lodash/lodash
    // Leverage the exponentiation by squaring algorithm for a faster repeat.
    // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
    let result = "";
    do {
        if (n % 2 !== 0) {
            result += s;
        }
        n = Math.floor(n / 2);
        if (n > 0) {
            s += s;
        }
    } while (n > 0);
    return result;
}
function intToHex(i, width) {
    const str = i.toString(16);
    if (str.length >= width)
        return str;
    return repeatString("0", width - str.length) + str;
}
function standardUnicodeHexEscape(codePoint) {
    if (codePoint <= 0xffff) {
        return "\\u" + intToHex(codePoint, 4);
    }
    else {
        return "\\U" + intToHex(codePoint, 8);
    }
}
function escapeNonPrintableMapper(printablePredicate, escaper) {
    function mapper(u) {
        switch (u) {
            case 0x5c:
                return "\\\\";
            case 0x22:
                return '\\"';
            case 0x0a:
                return "\\n";
            case 0x09:
                return "\\t";
            default:
                if (printablePredicate(u)) {
                    return String.fromCharCode(u);
                }
                return escaper(u);
        }
    }
    return mapper;
}
exports.utf16StringEscape = utf16ConcatMap(escapeNonPrintableMapper(isPrintable, standardUnicodeHexEscape));
exports.stringEscape = utf32ConcatMap(escapeNonPrintableMapper(isPrintable, standardUnicodeHexEscape));
function isPrintable(codePoint) {
    if (codePoint > 0xffff)
        return false;
    const category = unicode_properties_1.default.getCategory(codePoint);
    return [
        "Mc",
        "No",
        "Sk",
        "Me",
        "Nd",
        "Po",
        "Lt",
        "Pc",
        "Sm",
        "Zs",
        "Lu",
        "Pd",
        "So",
        "Pe",
        "Pf",
        "Ps",
        "Sc",
        "Ll",
        "Lm",
        "Pi",
        "Nl",
        "Mn",
        "Lo",
    ].includes(category);
}
function isAscii(codePoint) {
    return codePoint < 128;
}
function isLetter(codePoint) {
    const category = unicode_properties_1.default.getCategory(codePoint);
    // FIXME: Include Letter, modifier (Lm)?
    return ["Lu", "Ll", "Lt", "Lo"].includes(category);
}
function isDigit(codePoint) {
    const category = unicode_properties_1.default.getCategory(codePoint);
    return ["Nd"].includes(category);
}
function isNumeric(codePoint) {
    const category = unicode_properties_1.default.getCategory(codePoint);
    return ["No", "Nd", "Nl"].includes(category);
}
function isLetterOrDigit(codePoint) {
    return isLetter(codePoint) || isDigit(codePoint);
}
function isLetterOrUnderscore(codePoint) {
    return isLetter(codePoint) || codePoint === 0x5f;
}
function isLetterOrUnderscoreOrDigit(codePoint) {
    return isLetterOrUnderscore(codePoint) || isDigit(codePoint);
}
function isWordCharacter(codePoint) {
    return isLetter(codePoint) || isDigit(codePoint);
}
function trimEnd(str) {
    const l = str.length;
    let firstWS = l;
    for (let i = l - 1; i >= 0; i--) {
        if (!unicode_properties_1.default.isWhiteSpace(str.charCodeAt(i)))
            break;
        firstWS = i;
    }
    if (firstWS === l)
        return str;
    return str.slice(0, firstWS);
}
function modifyFirstChar(f, s) {
    if (s === "")
        return s;
    return f(s[0]) + s.slice(1);
}
function capitalize(str) {
    return modifyFirstChar((c) => c.toUpperCase(), str);
}
function decapitalize(str) {
    return modifyFirstChar((c) => c.toLowerCase(), str);
}
const wordSeparatorRegex = /[-_. ]+/;
function pascalCase(str) {
    const words = str.split(wordSeparatorRegex).map(capitalize);
    return words.join("");
}
function camelCase(str) {
    return decapitalize(pascalCase(str));
}
function snakeCase(str) {
    const words = splitIntoWords(str).map(({ word }) => word.toLowerCase());
    return words.join("_");
}
function startWithLetter(isAllowedStart, // FIXME: technically, this operates on UTF16 units
upper, str) {
    const modify = upper ? capitalize : decapitalize;
    if (str === "")
        return modify("empty");
    if (isAllowedStart(str.charCodeAt(0)))
        return modify(str);
    return modify("the" + str);
}
const knownAcronyms = new Set(Acronyms_const_1.acronyms);
const fastIsWordCharacter = precomputedCodePointPredicate(isWordCharacter);
const fastIsNonWordCharacter = precomputedCodePointPredicate((cp) => !isWordCharacter(cp));
const fastIsLowerCase = precomputedCodePointPredicate((cp) => unicode_properties_1.default.isLowerCase(cp));
exports.fastIsUpperCase = precomputedCodePointPredicate((cp) => unicode_properties_1.default.isUpperCase(cp));
const fastNonLetter = precomputedCodePointPredicate((cp) => !unicode_properties_1.default.isLowerCase(cp) && !unicode_properties_1.default.isUpperCase(cp));
const fastIsDigit = precomputedCodePointPredicate(isDigit);
function splitIntoWords(s) {
    // [start, end, allUpper]
    const intervals = [];
    let intervalStart = undefined;
    const len = s.length;
    let i = 0;
    let lastLowerCaseIndex = undefined;
    function atEnd() {
        return i >= len;
    }
    function currentCodePoint() {
        return (0, Support_1.defined)(s.codePointAt(i));
    }
    function skipWhile(p) {
        while (!atEnd()) {
            const cp = currentCodePoint();
            if (!p(cp))
                break;
            if (fastIsLowerCase(cp))
                lastLowerCaseIndex = i;
            i++;
        }
    }
    function skipNonWord() {
        skipWhile(fastIsNonWordCharacter);
    }
    function skipLowerCase() {
        skipWhile(fastIsLowerCase);
    }
    function skipUpperCase() {
        skipWhile(exports.fastIsUpperCase);
    }
    function skipNonLetter() {
        skipWhile(fastNonLetter);
    }
    function skipDigits() {
        skipWhile(fastIsDigit);
    }
    function startInterval() {
        (0, Support_1.assert)(intervalStart === undefined, "Interval started before last one was committed");
        intervalStart = i;
    }
    function commitInterval() {
        if (intervalStart === undefined) {
            return (0, Support_1.panic)("Tried to commit interval without starting one");
        }
        (0, Support_1.assert)(i > intervalStart, "Interval must be non-empty");
        // FIXME: This is a hack to avoid splitting up surrogates.  We shouldn't
        // look at surrogates individually in the first place.  When we
        // encounter a high surrogate we have to combine it with the low
        // surrogate and then do the logic on the code point.  Right now we're
        // only operating on UTF16 char codes, which is wrong.
        if (!atEnd() && isLowSurrogate(currentCodePoint())) {
            i += 1;
        }
        const allUpper = lastLowerCaseIndex === undefined ||
            lastLowerCaseIndex < intervalStart;
        intervals.push([intervalStart, i, allUpper]);
        intervalStart = undefined;
    }
    function intervalLength() {
        if (intervalStart === undefined) {
            return (0, Support_1.panic)("Tried to get interval length without starting one");
        }
        return i - intervalStart;
    }
    for (;;) {
        skipNonWord();
        if (atEnd())
            break;
        startInterval();
        if (fastIsLowerCase(currentCodePoint())) {
            skipLowerCase();
            skipDigits();
            commitInterval();
        }
        else if ((0, exports.fastIsUpperCase)(currentCodePoint())) {
            skipUpperCase();
            if (atEnd()) {
                commitInterval();
            }
            else if (intervalLength() === 1) {
                skipLowerCase();
                skipDigits();
                commitInterval();
            }
            else if (isDigit(currentCodePoint())) {
                skipDigits();
                commitInterval();
            }
            else {
                if (fastIsWordCharacter(currentCodePoint())) {
                    i -= 1;
                }
                commitInterval();
            }
        }
        else {
            skipNonLetter();
            commitInterval();
        }
    }
    const words = [];
    for (const [start, end, allUpper] of intervals) {
        const word = s.slice(start, end);
        const isAcronym = (lastLowerCaseIndex !== undefined && allUpper) ||
            knownAcronyms.has(word.toLowerCase());
        words.push({ word, isAcronym });
    }
    return words;
}
function firstUpperWordStyle(s) {
    (0, Support_1.assert)(s.length > 0, "Cannot style an empty string");
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}
function allUpperWordStyle(s) {
    return s.toUpperCase();
}
function originalWord(s) {
    return s;
}
function allLowerWordStyle(s) {
    return s.toLowerCase();
}
function styleWord(style, word) {
    (0, Support_1.assert)(word.length > 0, "Tried to style an empty word");
    const result = style(word);
    (0, Support_1.assert)(result.length > 0, "Word style must not make word empty");
    return result;
}
function combineWords(words, removeInvalidCharacters, firstWordStyle, restWordStyle, firstWordAcronymStyle, restAcronymStyle, separator, isStartCharacter) {
    const legalizedWords = [];
    for (const w of words) {
        const word = removeInvalidCharacters(w.word);
        if (word.length === 0)
            continue;
        legalizedWords.push({ word, isAcronym: w.isAcronym });
    }
    if (legalizedWords.length === 0) {
        const validEmpty = removeInvalidCharacters("empty");
        (0, Support_1.assert)(validEmpty.length > 0, 'Word "empty" is invalid in target language');
        legalizedWords.push({ word: validEmpty, isAcronym: false });
    }
    const styledWords = [];
    const first = legalizedWords[0];
    const firstStyle = first.isAcronym ? firstWordAcronymStyle : firstWordStyle;
    const styledFirstWord = styleWord(firstStyle, first.word);
    let restWords;
    if (!isStartCharacter((0, Support_1.defined)(styledFirstWord.codePointAt(0)))) {
        const validThe = removeInvalidCharacters("the");
        (0, Support_1.assert)(validThe.length > 0, 'Word "the" is invalid in the target language');
        const styledThe = styleWord(firstWordStyle, validThe);
        (0, Support_1.assert)(isStartCharacter((0, Support_1.defined)(styledThe.codePointAt(0))), 'The first character of styling "the" is not a start character');
        styledWords.push(styledThe);
        restWords = legalizedWords;
    }
    else {
        styledWords.push(styledFirstWord);
        restWords = legalizedWords.slice(1);
    }
    for (const w of restWords) {
        const style = w.isAcronym ? restAcronymStyle : restWordStyle;
        styledWords.push(styleWord(style, w.word));
    }
    return styledWords.join(separator);
}
function addPrefixIfNecessary(prefix, name) {
    // Take care not to doubly-prefix type names
    return name.startsWith(prefix) ? name : prefix + name;
}
function makeNameStyle(namingStyle, legalizeName, prefix) {
    let separator;
    let firstWordStyle;
    let restWordStyle;
    let firstWordAcronymStyle;
    let restAcronymStyle;
    if (namingStyle === "pascal" ||
        namingStyle === "camel" ||
        namingStyle === "pascal-upper-acronyms" ||
        namingStyle === "camel-upper-acronyms") {
        separator = "";
        if (namingStyle === "pascal-upper-acronyms" ||
            namingStyle === "camel-upper-acronyms") {
            restWordStyle = firstUpperWordStyle;
            restAcronymStyle = allUpperWordStyle;
        }
        else {
            restWordStyle = restAcronymStyle = firstUpperWordStyle;
        }
    }
    else {
        separator = "_";
    }
    switch (namingStyle) {
        case "pascal":
        case "pascal-upper-acronyms":
            firstWordStyle = firstWordAcronymStyle = firstUpperWordStyle;
            break;
        case "camel":
        case "camel-upper-acronyms":
            firstWordStyle = firstWordAcronymStyle = allLowerWordStyle;
            break;
        case "underscore":
            firstWordStyle =
                restWordStyle =
                    firstWordAcronymStyle =
                        restAcronymStyle =
                            allLowerWordStyle;
            break;
        case "upper-underscore":
            firstWordStyle =
                restWordStyle =
                    firstWordAcronymStyle =
                        restAcronymStyle =
                            allUpperWordStyle;
            break;
        default:
            return (0, Support_1.assertNever)(namingStyle);
    }
    return (original) => {
        const words = splitIntoWords(original);
        const styledName = combineWords(words, legalizeName, firstWordStyle, restWordStyle, firstWordAcronymStyle, restAcronymStyle, separator, isLetterOrUnderscore);
        if (prefix !== undefined) {
            return addPrefixIfNecessary(prefix, styledName);
        }
        else {
            return styledName;
        }
    };
}
