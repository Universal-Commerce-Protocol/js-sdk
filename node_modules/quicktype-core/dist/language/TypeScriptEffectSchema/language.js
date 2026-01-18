"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptEffectSchemaTargetLanguage = exports.typeScriptEffectSchemaLanguageConfig = exports.typeScriptEffectSchemaOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const TypeScriptEffectSchemaRenderer_1 = require("./TypeScriptEffectSchemaRenderer");
exports.typeScriptEffectSchemaOptions = {
    justSchema: new RendererOptions_1.BooleanOption("just-schema", "Schema only", false),
};
exports.typeScriptEffectSchemaLanguageConfig = {
    displayName: "TypeScript Effect Schema",
    names: ["typescript-effect-schema"],
    extension: "ts",
};
class TypeScriptEffectSchemaTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.typeScriptEffectSchemaLanguageConfig);
    }
    getOptions() {
        return {};
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new TypeScriptEffectSchemaRenderer_1.TypeScriptEffectSchemaRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.typeScriptEffectSchemaOptions, untypedOptionValues));
    }
}
exports.TypeScriptEffectSchemaTargetLanguage = TypeScriptEffectSchemaTargetLanguage;
