"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartTargetLanguage = exports.dartLanguageConfig = exports.dartOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const DartRenderer_1 = require("./DartRenderer");
exports.dartOptions = {
    nullSafety: new RendererOptions_1.BooleanOption("null-safety", "Null Safety", true),
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Types only", false),
    codersInClass: new RendererOptions_1.BooleanOption("coders-in-class", "Put encoder & decoder in Class", false),
    methodNamesWithMap: new RendererOptions_1.BooleanOption("from-map", "Use method names fromMap() & toMap()", false, "secondary"),
    requiredProperties: new RendererOptions_1.BooleanOption("required-props", "Make all properties required", false),
    finalProperties: new RendererOptions_1.BooleanOption("final-props", "Make all properties final", false),
    generateCopyWith: new RendererOptions_1.BooleanOption("copy-with", "Generate CopyWith method", false),
    useFreezed: new RendererOptions_1.BooleanOption("use-freezed", "Generate class definitions with @freezed compatibility", false, "secondary"),
    useHive: new RendererOptions_1.BooleanOption("use-hive", "Generate annotations for Hive type adapters", false, "secondary"),
    useJsonAnnotation: new RendererOptions_1.BooleanOption("use-json-annotation", "Generate annotations for json_serializable", false, "secondary"),
    partName: new RendererOptions_1.StringOption("part-name", "Use this name in `part` directive", "NAME", "", "secondary"),
};
exports.dartLanguageConfig = {
    displayName: "Dart",
    names: ["dart"],
    extension: "dart",
};
class DartTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.dartLanguageConfig);
    }
    getOptions() {
        return exports.dartOptions;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date", "date");
        mapping.set("date-time", "date-time");
        return mapping;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.dartOptions, untypedOptionValues);
        return new DartRenderer_1.DartRenderer(this, renderContext, options);
    }
}
exports.DartTargetLanguage = DartTargetLanguage;
