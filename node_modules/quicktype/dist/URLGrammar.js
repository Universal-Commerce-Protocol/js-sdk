"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlsFromURLGrammar = urlsFromURLGrammar;
const quicktype_core_1 = require("quicktype-core");
function expand(json) {
    if (typeof json === "string") {
        return [json];
    }
    if (Array.isArray(json)) {
        let result = [""];
        for (const j of json) {
            const expanded = expand(j);
            const appended = [];
            for (const a of result) {
                for (const b of expanded) {
                    appended.push(a + b);
                }
            }
            result = appended;
        }
        return result;
    }
    if (typeof json === "object" && json && "oneOf" in json) {
        const options = (0, quicktype_core_1.checkArray)(json.oneOf);
        const result = [];
        for (const j of options) {
            for (const x of expand(j)) {
                result.push(x);
            }
        }
        return result;
    }
    return (0, quicktype_core_1.panic)(`Value is not a valid URL grammar: ${json}`);
}
function urlsFromURLGrammar(json) {
    const topLevelMap = (0, quicktype_core_1.checkStringMap)(json);
    const results = {};
    for (const name of Object.getOwnPropertyNames(topLevelMap)) {
        results[name] = expand(topLevelMap[name]);
    }
    return results;
}
