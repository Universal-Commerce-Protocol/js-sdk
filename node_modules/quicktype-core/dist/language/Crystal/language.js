"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalTargetLanguage = exports.crystalLanguageConfig = void 0;
const TargetLanguage_1 = require("../../TargetLanguage");
const CrystalRenderer_1 = require("./CrystalRenderer");
exports.crystalLanguageConfig = {
    displayName: "Crystal",
    names: ["crystal", "cr", "crystallang"],
    extension: "cr",
};
class CrystalTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.crystalLanguageConfig);
    }
    makeRenderer(renderContext) {
        return new CrystalRenderer_1.CrystalRenderer(this, renderContext);
    }
    get defaultIndentation() {
        return "  ";
    }
    getOptions() {
        return {};
    }
}
exports.CrystalTargetLanguage = CrystalTargetLanguage;
