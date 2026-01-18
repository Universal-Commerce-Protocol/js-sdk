"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElixirTargetLanguage = exports.elixirLanguageConfig = exports.elixirOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const ElixirRenderer_1 = require("./ElixirRenderer");
exports.elixirOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    namespace: new RendererOptions_1.StringOption("namespace", "Specify a module namespace", "NAME", ""),
};
exports.elixirLanguageConfig = {
    displayName: "Elixir",
    names: ["elixir"],
    extension: "ex",
};
class ElixirTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.elixirLanguageConfig);
    }
    getOptions() {
        return exports.elixirOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get defaultIndentation() {
        return "  ";
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new ElixirRenderer_1.ElixirRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.elixirOptions, untypedOptionValues));
    }
}
exports.ElixirTargetLanguage = ElixirTargetLanguage;
