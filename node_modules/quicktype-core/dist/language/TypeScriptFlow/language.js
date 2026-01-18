"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowTargetLanguage = exports.flowLanguageConfig = exports.TypeScriptTargetLanguage = exports.typeScriptLanguageConfig = exports.tsFlowOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const JavaScript_1 = require("../JavaScript");
const FlowRenderer_1 = require("./FlowRenderer");
const TypeScriptRenderer_1 = require("./TypeScriptRenderer");
exports.tsFlowOptions = Object.assign({}, JavaScript_1.javaScriptOptions, {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Interfaces only", false),
    nicePropertyNames: new RendererOptions_1.BooleanOption("nice-property-names", "Transform property names to be JavaScripty", false),
    declareUnions: new RendererOptions_1.BooleanOption("explicit-unions", "Explicitly name unions", false),
    preferUnions: new RendererOptions_1.BooleanOption("prefer-unions", "Use union type instead of enum", false),
    preferTypes: new RendererOptions_1.BooleanOption("prefer-types", "Use types instead of interfaces", false),
    preferConstValues: new RendererOptions_1.BooleanOption("prefer-const-values", "Use string instead of enum for string enums with single value", false),
    readonly: new RendererOptions_1.BooleanOption("readonly", "Use readonly type members", false),
});
exports.typeScriptLanguageConfig = {
    displayName: "TypeScript",
    names: ["typescript", "ts", "tsx"],
    extension: "ts",
};
class TypeScriptTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.typeScriptLanguageConfig);
    }
    getOptions() {
        return exports.tsFlowOptions;
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
        return new TypeScriptRenderer_1.TypeScriptRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.tsFlowOptions, untypedOptionValues));
    }
}
exports.TypeScriptTargetLanguage = TypeScriptTargetLanguage;
exports.flowLanguageConfig = {
    displayName: "Flow",
    names: ["flow"],
    extension: "js",
};
class FlowTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.flowLanguageConfig);
    }
    getOptions() {
        return exports.tsFlowOptions;
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
        return new FlowRenderer_1.FlowRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.tsFlowOptions, untypedOptionValues));
    }
}
exports.FlowTargetLanguage = FlowTargetLanguage;
