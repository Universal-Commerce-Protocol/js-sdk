"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElmTargetLanguage = exports.elmLanguageConfig = exports.elmOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const ElmRenderer_1 = require("./ElmRenderer");
exports.elmOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    useList: new RendererOptions_1.EnumOption("array-type", "Use Array or List", {
        array: false,
        list: true,
    }, "array"),
    // FIXME: Do this via a configurable named eventually.
    moduleName: new RendererOptions_1.StringOption("module", "Generated module name", "NAME", "QuickType"),
};
exports.elmLanguageConfig = {
    displayName: "Elm",
    names: ["elm"],
    extension: "elm",
};
class ElmTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.elmLanguageConfig);
    }
    getOptions() {
        return exports.elmOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new ElmRenderer_1.ElmRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.elmOptions, untypedOptionValues));
    }
}
exports.ElmTargetLanguage = ElmTargetLanguage;
