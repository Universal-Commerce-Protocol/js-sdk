"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
let fetch;
try {
    exports.fetch = fetch = (_a = global.fetch) !== null && _a !== void 0 ? _a : require("cross-fetch").default;
}
catch (_b) {
    exports.fetch = fetch = require("cross-fetch").default;
}
