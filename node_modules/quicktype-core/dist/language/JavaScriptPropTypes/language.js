"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptPropTypesTargetLanguage = exports.javaScriptPropTypesLanguageConfig = exports.javaScriptPropTypesOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const Converters_1 = require("../../support/Converters");
const TargetLanguage_1 = require("../../TargetLanguage");
const JavaScriptPropTypesRenderer_1 = require("./JavaScriptPropTypesRenderer");
exports.javaScriptPropTypesOptions = {
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
    converters: (0, Converters_1.convertersOption)(),
    moduleSystem: new RendererOptions_1.EnumOption("module-system", "Which module system to use", {
        "common-js": false,
        es6: true,
    }, "es6"),
};
exports.javaScriptPropTypesLanguageConfig = {
    displayName: "JavaScript PropTypes",
    names: ["javascript-prop-types"],
    extension: "js",
};
class JavaScriptPropTypesTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.javaScriptPropTypesLanguageConfig);
    }
    getOptions() {
        return exports.javaScriptPropTypesOptions;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new JavaScriptPropTypesRenderer_1.JavaScriptPropTypesRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.javaScriptPropTypesOptions, untypedOptionValues));
    }
}
exports.JavaScriptPropTypesTargetLanguage = JavaScriptPropTypesTargetLanguage;
