"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoTargetLanguage = exports.goOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const GolangRenderer_1 = require("./GolangRenderer");
exports.goOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    justTypesAndPackage: new RendererOptions_1.BooleanOption("just-types-and-package", "Plain types with package only", false),
    packageName: new RendererOptions_1.StringOption("package", "Generated package name", "NAME", "main"),
    multiFileOutput: new RendererOptions_1.BooleanOption("multi-file-output", "Renders each top-level object in its own Go file", false),
    fieldTags: new RendererOptions_1.StringOption("field-tags", "list of tags which should be generated for fields", "TAGS", "json"),
    omitEmpty: new RendererOptions_1.BooleanOption("omit-empty", 'If set, all non-required objects will be tagged with ",omitempty"', false),
};
const golangLanguageConfig = {
    displayName: "Go",
    names: ["go", "golang"],
    extension: "go",
};
class GoTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(golangLanguageConfig);
    }
    getOptions() {
        return exports.goOptions;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date-time", "date-time");
        return mapping;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new GolangRenderer_1.GoRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.goOptions, untypedOptionValues));
    }
    get defaultIndentation() {
        return "\t";
    }
}
exports.GoTargetLanguage = GoTargetLanguage;
