"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaTargetLanguage = exports.javaLanguageConfig = exports.javaOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const TargetLanguage_1 = require("../../TargetLanguage");
const JavaJacksonRenderer_1 = require("./JavaJacksonRenderer");
const JavaRenderer_1 = require("./JavaRenderer");
exports.javaOptions = {
    useList: new RendererOptions_1.EnumOption("array-type", "Use T[] or List<T>", { array: false, list: true }, "array"),
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    dateTimeProvider: new RendererOptions_1.EnumOption("datetime-provider", "Date time provider type", { java8: "java8", legacy: "legacy" }, "java8"),
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
    // FIXME: Do this via a configurable named eventually.
    packageName: new RendererOptions_1.StringOption("package", "Generated package name", "NAME", "io.quicktype"),
    lombok: new RendererOptions_1.BooleanOption("lombok", "Use lombok", false, "primary"),
    lombokCopyAnnotations: new RendererOptions_1.BooleanOption("lombok-copy-annotations", "Copy accessor annotations", true, "secondary"),
};
exports.javaLanguageConfig = {
    displayName: "Java",
    names: ["java"],
    extension: "java",
};
class JavaTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.javaLanguageConfig);
    }
    getOptions() {
        return exports.javaOptions;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.javaOptions, untypedOptionValues);
        if (options.justTypes) {
            return new JavaRenderer_1.JavaRenderer(this, renderContext, options);
        }
        return new JavaJacksonRenderer_1.JacksonRenderer(this, renderContext, options);
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date", "date");
        mapping.set("time", "time");
        mapping.set("date-time", "date-time");
        mapping.set("uuid", "uuid");
        return mapping;
    }
}
exports.JavaTargetLanguage = JavaTargetLanguage;
