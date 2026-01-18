"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectiveCTargetLanguage = exports.objectiveCLanguageConfig = exports.objectiveCOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const ObjectiveCRenderer_1 = require("./ObjectiveCRenderer");
const utils_1 = require("./utils");
exports.objectiveCOptions = {
    features: new RendererOptions_1.EnumOption("features", "Interface and implementation", {
        all: { interface: true, implementation: true },
        interface: { interface: true, implementation: false },
        implementation: { interface: false, implementation: true },
    }, "all"),
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    marshallingFunctions: new RendererOptions_1.BooleanOption("functions", "C-style functions", false),
    classPrefix: new RendererOptions_1.StringOption("class-prefix", "Class prefix", "PREFIX", utils_1.DEFAULT_CLASS_PREFIX),
    extraComments: new RendererOptions_1.BooleanOption("extra-comments", "Extra comments", false),
};
exports.objectiveCLanguageConfig = {
    displayName: "Objective-C",
    names: ["objc", "objective-c", "objectivec"],
    extension: "m",
};
class ObjectiveCTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.objectiveCLanguageConfig);
    }
    getOptions() {
        return exports.objectiveCOptions;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new ObjectiveCRenderer_1.ObjectiveCRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.objectiveCOptions, untypedOptionValues));
    }
}
exports.ObjectiveCTargetLanguage = ObjectiveCTargetLanguage;
