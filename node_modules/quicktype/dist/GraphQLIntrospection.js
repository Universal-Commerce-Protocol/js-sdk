"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.introspectServer = introspectServer;
const ts_necessities_1 = require("@glideapps/ts-necessities");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const graphql_1 = require("graphql");
const quicktype_core_1 = require("quicktype-core");
// https://github.com/apollographql/apollo-codegen/blob/master/src/downloadSchema.ts
const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
};
const headerRegExp = /^([^:]+):\s*(.*)$/;
async function introspectServer(url, method, headerStrings) {
    const headers = {};
    for (const name of Object.getOwnPropertyNames(defaultHeaders)) {
        headers[name] = defaultHeaders[name];
    }
    for (const str of headerStrings) {
        const matches = headerRegExp.exec(str);
        if (matches === null) {
            return (0, quicktype_core_1.panic)(`Not a valid HTTP header: "${str}"`);
        }
        headers[matches[1]] = matches[2];
    }
    let result;
    try {
        const response = await (0, cross_fetch_1.default)(url, {
            method,
            headers: headers,
            body: JSON.stringify({ query: graphql_1.introspectionQuery }),
        });
        result = await response.json();
    }
    catch (error) {
        return (0, quicktype_core_1.panic)(`Error while fetching introspection query result: ${(0, ts_necessities_1.exceptionToString)(error)}`);
    }
    if (result.errors) {
        return (0, quicktype_core_1.panic)(`Errors in introspection query result: ${JSON.stringify(result.errors)}`);
    }
    const schemaData = result;
    if (!schemaData.data) {
        return (0, quicktype_core_1.panic)(`No introspection query result data found, server responded with: ${JSON.stringify(result)}`);
    }
    return JSON.stringify(schemaData, null, 2);
}
