"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scala3TargetLanguage = exports.scala3LanguageConfig = exports.scala3Options = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Support_1 = require("../../support/Support");
const TargetLanguage_1 = require("../../TargetLanguage");
const CirceRenderer_1 = require("./CirceRenderer");
const Scala3Renderer_1 = require("./Scala3Renderer");
const UpickleRenderer_1 = require("./UpickleRenderer");
exports.scala3Options = {
    framework: new RendererOptions_1.EnumOption("framework", "Serialization framework", {
        "just-types": "None",
        circe: "Circe",
        upickle: "Upickle",
    }, "just-types"),
    packageName: new RendererOptions_1.StringOption("package", "Package", "PACKAGE", "quicktype"),
};
exports.scala3LanguageConfig = {
    displayName: "Scala3",
    names: ["scala3"],
    extension: "scala",
};
class Scala3TargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.scala3LanguageConfig);
    }
    getOptions() {
        return exports.scala3Options;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.scala3Options, untypedOptionValues);
        switch (options.framework) {
            case "None":
                return new Scala3Renderer_1.Scala3Renderer(this, renderContext, options);
            case "Upickle":
                return new UpickleRenderer_1.UpickleRenderer(this, renderContext, options);
            case "Circe":
                return new CirceRenderer_1.CirceRenderer(this, renderContext, options);
            default:
                return (0, Support_1.assertNever)(options.framework);
        }
    }
}
exports.Scala3TargetLanguage = Scala3TargetLanguage;
