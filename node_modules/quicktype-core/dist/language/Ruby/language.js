"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RubyTargetLanguage = exports.rubyLanguageConfig = exports.rubyOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const RubyRenderer_1 = require("./RubyRenderer");
const utils_1 = require("./utils");
exports.rubyOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    strictness: new RendererOptions_1.EnumOption("strictness", "Type strictness", {
        strict: utils_1.Strictness.Strict,
        coercible: utils_1.Strictness.Coercible,
        none: utils_1.Strictness.None,
    }, "strict"),
    namespace: new RendererOptions_1.StringOption("namespace", "Specify a wrapping Namespace", "NAME", "", "secondary"),
};
exports.rubyLanguageConfig = {
    displayName: "Ruby",
    names: ["ruby"],
    extension: "rb",
};
class RubyTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.rubyLanguageConfig);
    }
    getOptions() {
        return exports.rubyOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get defaultIndentation() {
        return "  ";
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new RubyRenderer_1.RubyRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.rubyOptions, untypedOptionValues));
    }
}
exports.RubyTargetLanguage = RubyTargetLanguage;
