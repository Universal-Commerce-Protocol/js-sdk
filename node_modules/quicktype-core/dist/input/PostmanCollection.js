"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourcesFromPostmanCollection = sourcesFromPostmanCollection;
const Support_1 = require("../support/Support");
function isValidJSON(s) {
    try {
        JSON.parse(s);
        return true;
    }
    catch (error) {
        return false;
    }
}
function sourcesFromPostmanCollection(collectionJSON, collectionJSONAddress) {
    const sources = [];
    const descriptions = [];
    function processCollection(c) {
        var _a;
        if (typeof c !== "object") {
            return;
        }
        if (Array.isArray(c.item)) {
            for (const item of c.item) {
                processCollection(item);
            }
            if (c.info &&
                typeof c.info === "object" &&
                "description" in c.info &&
                typeof ((_a = c.info) === null || _a === void 0 ? void 0 : _a.description) === "string") {
                descriptions.push(c.info.description);
            }
        }
        if (typeof c.name === "string" && Array.isArray(c.response)) {
            const samples = [];
            for (const r of c.response) {
                if (typeof r === "object" &&
                    typeof r.body === "string" &&
                    isValidJSON(r.body)) {
                    samples.push(r.body);
                }
            }
            if (samples.length > 0) {
                const source = {
                    name: c.name,
                    samples,
                };
                const sourceDescription = [c.name];
                if (c.request && typeof c.request === "object") {
                    const { method, url } = c.request;
                    if (method !== undefined &&
                        typeof url === "object" &&
                        "raw" in url &&
                        url.raw !== undefined) {
                        sourceDescription.push(`${method} ${url.raw}`);
                    }
                }
                if (c.request &&
                    typeof c.request === "object" &&
                    "description" in c.request &&
                    typeof c.request.description === "string") {
                    sourceDescription.push(c.request.description);
                }
                source.description =
                    sourceDescription.length === 0
                        ? undefined
                        : sourceDescription.join("\n\n");
                sources.push(source);
            }
        }
    }
    processCollection((0, Support_1.parseJSON)(collectionJSON, "Postman collection", collectionJSONAddress));
    const joinedDescription = descriptions.join("\n\n").trim();
    let description = undefined;
    if (joinedDescription !== "") {
        description = joinedDescription;
    }
    return { sources, description };
}
