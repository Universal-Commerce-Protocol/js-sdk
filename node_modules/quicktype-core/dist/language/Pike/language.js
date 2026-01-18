"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PikeTargetLanguage = exports.pikeLanguageConfig = exports.pikeOptions = void 0;
const TargetLanguage_1 = require("../../TargetLanguage");
const PikeRenderer_1 = require("./PikeRenderer");
exports.pikeOptions = {};
exports.pikeLanguageConfig = {
    displayName: "Pike",
    names: ["pike", "pikelang"],
    extension: "pmod",
};
class PikeTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.pikeLanguageConfig);
    }
    getOptions() {
        return {};
    }
    makeRenderer(renderContext) {
        return new PikeRenderer_1.PikeRenderer(this, renderContext);
    }
}
exports.PikeTargetLanguage = PikeTargetLanguage;
