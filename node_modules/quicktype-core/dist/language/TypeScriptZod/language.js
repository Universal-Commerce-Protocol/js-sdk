"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptZodTargetLanguage = exports.typeScriptZodLanguageConfig = exports.typeScriptZodOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const TypeScriptZodRenderer_1 = require("./TypeScriptZodRenderer");
exports.typeScriptZodOptions = {
    justSchema: new RendererOptions_1.BooleanOption("just-schema", "Schema only", false),
};
exports.typeScriptZodLanguageConfig = {
    displayName: "TypeScript Zod",
    names: ["typescript-zod"],
    extension: "ts",
};
class TypeScriptZodTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.typeScriptZodLanguageConfig);
    }
    getOptions() {
        return {};
    }
    get stringTypeMapping() {
        const mapping = new Map();
        const dateTimeType = "date-time";
        mapping.set("date-time", dateTimeType);
        return mapping;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new TypeScriptZodRenderer_1.TypeScriptZodRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.typeScriptZodOptions, untypedOptionValues));
    }
}
exports.TypeScriptZodTargetLanguage = TypeScriptZodTargetLanguage;
