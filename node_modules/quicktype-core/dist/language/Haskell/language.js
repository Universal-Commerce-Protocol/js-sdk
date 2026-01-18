"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaskellTargetLanguage = exports.haskellLanguageConfig = exports.haskellOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const HaskellRenderer_1 = require("./HaskellRenderer");
exports.haskellOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    useList: new RendererOptions_1.EnumOption("array-type", "Use Array or List", {
        array: false,
        list: true,
    }, "array"),
    moduleName: new RendererOptions_1.StringOption("module", "Generated module name", "NAME", "QuickType"),
};
exports.haskellLanguageConfig = {
    displayName: "Haskell",
    names: ["haskell"],
    extension: "haskell",
};
class HaskellTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.haskellLanguageConfig);
    }
    getOptions() {
        return exports.haskellOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new HaskellRenderer_1.HaskellRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.haskellOptions, untypedOptionValues));
    }
}
exports.HaskellTargetLanguage = HaskellTargetLanguage;
