"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressedJSONFromStream = void 0;
const stream_json_1 = require("stream-json");
const quicktype_core_1 = require("quicktype-core");
const methodMap = {
    startObject: "pushObjectContext",
    endObject: "finishObject",
    startArray: "pushArrayContext",
    endArray: "finishArray",
    startNumber: "handleStartNumber",
    numberChunk: "handleNumberChunk",
    endNumber: "handleEndNumber",
    keyValue: "setPropertyKey",
    stringValue: "commitString",
    nullValue: "commitNull",
    trueValue: "handleTrueValue",
    falseValue: "handleFalseValue",
};
class CompressedJSONFromStream extends quicktype_core_1.CompressedJSON {
    async parse(readStream) {
        const combo = new stream_json_1.Parser({ packKeys: true, packStrings: true });
        combo.on("data", (item) => {
            if (typeof methodMap[item.name] === "string") {
                // @ts-expect-error FIXME: strongly type this
                this[methodMap[item.name]](item.value);
            }
        });
        const promise = new Promise((resolve, reject) => {
            combo.on("end", () => {
                resolve(this.finish());
            });
            combo.on("error", (err) => {
                reject(err);
            });
        });
        readStream.setEncoding("utf8");
        readStream.pipe(combo);
        readStream.resume();
        return await promise;
    }
    handleStartNumber = () => {
        this.pushContext();
        this.context.currentNumberIsDouble = false;
    };
    handleNumberChunk = (s) => {
        const ctx = this.context;
        if (!ctx.currentNumberIsDouble && /[.e]/i.test(s)) {
            ctx.currentNumberIsDouble = true;
        }
    };
    handleEndNumber() {
        const isDouble = this.context.currentNumberIsDouble;
        this.popContext();
        this.commitNumber(isDouble);
    }
    handleTrueValue() {
        this.commitBoolean(true);
    }
    handleFalseValue() {
        this.commitBoolean(false);
    }
}
exports.CompressedJSONFromStream = CompressedJSONFromStream;
