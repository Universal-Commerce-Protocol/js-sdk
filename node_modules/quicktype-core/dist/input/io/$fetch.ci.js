"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = void 0;
console.info("=== RUNNING IN CI, USE FETCH.CI ===");
exports.fetch = require("cross-fetch").default;
