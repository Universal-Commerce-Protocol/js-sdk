"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmithyTargetLanguage = exports.smithyLanguageConfig = exports.smithyOptions = exports.Framework = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Support_1 = require("../../support/Support");
const TargetLanguage_1 = require("../../TargetLanguage");
const Smithy4sRenderer_1 = require("./Smithy4sRenderer");
var Framework;
(function (Framework) {
    Framework["None"] = "None";
})(Framework || (exports.Framework = Framework = {}));
exports.smithyOptions = {
    // FIXME: why does this exist
    framework: new RendererOptions_1.EnumOption("framework", "Serialization framework", { "just-types": Framework.None }, "just-types"),
    packageName: new RendererOptions_1.StringOption("package", "Package", "PACKAGE", "quicktype"),
};
exports.smithyLanguageConfig = {
    displayName: "Smithy",
    names: ["smithy4a"],
    extension: "smithy",
};
class SmithyTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.smithyLanguageConfig);
    }
    getOptions() {
        return exports.smithyOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.smithyOptions, untypedOptionValues);
        switch (options.framework) {
            case Framework.None:
                return new Smithy4sRenderer_1.Smithy4sRenderer(this, renderContext, options);
            default:
                return (0, Support_1.assertNever)(options.framework);
        }
    }
}
exports.SmithyTargetLanguage = SmithyTargetLanguage;
