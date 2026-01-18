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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringMap = isStringMap;
exports.checkString = checkString;
exports.checkStringMap = checkStringMap;
exports.checkArray = checkArray;
exports.defined = defined;
exports.nonNull = nonNull;
exports.assertNever = assertNever;
exports.assert = assert;
exports.panic = panic;
exports.mustNotHappen = mustNotHappen;
exports.repeated = repeated;
exports.repeatedCall = repeatedCall;
exports.errorMessage = errorMessage;
exports.inflateBase64 = inflateBase64;
exports.parseJSON = parseJSON;
exports.indentationString = indentationString;
exports.numberEnumValues = numberEnumValues;
const js_base64_1 = require("js-base64");
const pako = __importStar(require("pako"));
const YAML = __importStar(require("yaml"));
const Messages_1 = require("../Messages");
function isStringMap(x, checkValue) {
    if (typeof x !== "object" || Array.isArray(x) || x === null) {
        return false;
    }
    if (checkValue !== undefined) {
        for (const k of Object.getOwnPropertyNames(x)) {
            const v = x[k];
            if (!checkValue(v)) {
                return false;
            }
        }
    }
    return true;
}
function checkString(x) {
    return typeof x === "string";
}
function checkStringMap(x, checkValue) {
    if (checkValue && isStringMap(x, checkValue)) {
        return x;
    }
    if (isStringMap(x)) {
        return x;
    }
    return panic(`Value must be an object, but is ${x}`);
}
function checkArray(x, checkItem) {
    if (!Array.isArray(x)) {
        return panic(`Value must be an array, but is ${x}`);
    }
    if (checkItem !== undefined) {
        for (const v of x) {
            if (!checkItem(v)) {
                return panic(`Array item does not satisfy constraint: ${v}`);
            }
        }
    }
    return x;
}
function defined(x) {
    if (x !== undefined)
        return x;
    return panic("Defined value expected, but got undefined");
}
function nonNull(x) {
    if (x !== null)
        return x;
    return panic("Non-null value expected, but got null");
}
function assertNever(x) {
    return (0, Messages_1.messageError)("InternalError", { message: `Unexpected object ${x}` });
}
function assert(condition, message = "Assertion failed") {
    if (!condition) {
        return (0, Messages_1.messageError)("InternalError", { message });
    }
}
function panic(message) {
    return (0, Messages_1.messageError)("InternalError", { message });
}
function mustNotHappen() {
    return panic("This must not happen");
}
function repeated(n, value) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(value);
    }
    return arr;
}
function repeatedCall(n, producer) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(producer());
    }
    return arr;
}
function errorMessage(e) {
    if (e instanceof Error) {
        return e.message;
    }
    return e.toString();
}
function inflateBase64(encoded) {
    const bytes = js_base64_1.Base64.atob(encoded);
    return pako.inflate(bytes, { to: "string" });
}
function parseJSON(text, description, address = "<unknown>") {
    try {
        // https://gist.github.com/pbakondy/f5045eff725193dad9c7
        if (text.charCodeAt(0) === 0xfeff) {
            text = text.slice(1);
        }
        return YAML.parse(text);
    }
    catch (e) {
        let message;
        if (e instanceof SyntaxError) {
            message = e.message;
        }
        else {
            message = `Unknown exception ${e}`;
        }
        return (0, Messages_1.messageError)("MiscJSONParseError", {
            description,
            address,
            message,
        });
    }
}
function indentationString(level) {
    return "  ".repeat(level);
}
// FIXME: fix this enum iteration
function numberEnumValues(e) {
    const result = [];
    for (const k of Object.keys(e)) {
        const v = e[k];
        if (typeof v === "number") {
            result.push(v);
        }
    }
    return result;
}
