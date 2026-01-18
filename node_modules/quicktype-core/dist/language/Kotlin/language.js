"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinTargetLanguage = exports.kotlinLanguageConfig = exports.kotlinOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const Support_1 = require("../../support/Support");
const TargetLanguage_1 = require("../../TargetLanguage");
const KotlinJacksonRenderer_1 = require("./KotlinJacksonRenderer");
const KotlinKlaxonRenderer_1 = require("./KotlinKlaxonRenderer");
const KotlinRenderer_1 = require("./KotlinRenderer");
const KotlinXRenderer_1 = require("./KotlinXRenderer");
exports.kotlinOptions = {
    framework: new RendererOptions_1.EnumOption("framework", "Serialization framework", {
        "just-types": "None",
        jackson: "Jackson",
        klaxon: "Klaxon",
        kotlinx: "KotlinX",
    }, "klaxon"),
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
    packageName: new RendererOptions_1.StringOption("package", "Package", "PACKAGE", "quicktype"),
};
exports.kotlinLanguageConfig = {
    displayName: "Kotlin",
    names: ["kotlin"],
    extension: "kt",
};
class KotlinTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.kotlinLanguageConfig);
    }
    getOptions() {
        return exports.kotlinOptions;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.kotlinOptions, untypedOptionValues);
        switch (options.framework) {
            case "None":
                return new KotlinRenderer_1.KotlinRenderer(this, renderContext, options);
            case "Jackson":
                return new KotlinJacksonRenderer_1.KotlinJacksonRenderer(this, renderContext, options);
            case "Klaxon":
                return new KotlinKlaxonRenderer_1.KotlinKlaxonRenderer(this, renderContext, options);
            case "KotlinX":
                return new KotlinXRenderer_1.KotlinXRenderer(this, renderContext, options);
            default:
                return (0, Support_1.assertNever)(options.framework);
        }
    }
}
exports.KotlinTargetLanguage = KotlinTargetLanguage;
