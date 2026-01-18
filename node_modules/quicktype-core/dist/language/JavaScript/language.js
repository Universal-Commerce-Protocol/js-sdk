"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptTargetLanguage = exports.javaScriptLanguageConfig = exports.javaScriptOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const Converters_1 = require("../../support/Converters");
const TargetLanguage_1 = require("../../TargetLanguage");
const JavaScriptRenderer_1 = require("./JavaScriptRenderer");
exports.javaScriptOptions = {
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
    runtimeTypecheck: new RendererOptions_1.BooleanOption("runtime-typecheck", "Verify JSON.parse results at runtime", true),
    runtimeTypecheckIgnoreUnknownProperties: new RendererOptions_1.BooleanOption("runtime-typecheck-ignore-unknown-properties", "Ignore unknown properties when verifying at runtime", false, "secondary"),
    converters: (0, Converters_1.convertersOption)(),
    rawType: new RendererOptions_1.EnumOption("raw-type", "Type of raw input (json by default)", {
        json: "json",
        any: "any",
    }, "json", "secondary"),
};
exports.javaScriptLanguageConfig = {
    displayName: "JavaScript",
    names: ["javascript", "js", "jsx"],
    extension: "js",
};
class JavaScriptTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.javaScriptLanguageConfig);
    }
    getOptions() {
        return exports.javaScriptOptions;
    }
    get stringTypeMapping() {
        const mapping = new Map();
        const dateTimeType = "date-time";
        mapping.set("date", dateTimeType);
        mapping.set("date-time", dateTimeType);
        return mapping;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsFullObjectType() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new JavaScriptRenderer_1.JavaScriptRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.javaScriptOptions, untypedOptionValues));
    }
}
exports.JavaScriptTargetLanguage = JavaScriptTargetLanguage;
