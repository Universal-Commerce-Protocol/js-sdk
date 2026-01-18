"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpTargetLanguage = exports.cSharpLanguageConfig = exports.systemTextJsonCSharpOptions = exports.newtonsoftCSharpOptions = exports.cSharpOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Support_1 = require("../../support/Support");
const TargetLanguage_1 = require("../../TargetLanguage");
const NewtonSoftCSharpRenderer_1 = require("./NewtonSoftCSharpRenderer");
const SystemTextJsonCSharpRenderer_1 = require("./SystemTextJsonCSharpRenderer");
const utils_1 = require("./utils");
exports.cSharpOptions = {
    framework: new RendererOptions_1.EnumOption("framework", "Serialization framework", {
        NewtonSoft: "NewtonSoft",
        SystemTextJson: "SystemTextJson",
    }, "NewtonSoft"),
    useList: new RendererOptions_1.EnumOption("array-type", "Use T[] or List<T>", {
        array: false,
        list: true,
    }, "array"),
    dense: new RendererOptions_1.EnumOption("density", "Property density", {
        normal: false,
        dense: true,
    }, "normal", "secondary"),
    // FIXME: Do this via a configurable named eventually.
    namespace: new RendererOptions_1.StringOption("namespace", "Generated namespace", "NAME", "QuickType"),
    version: new RendererOptions_1.EnumOption("csharp-version", "C# version", {
        "5": 5,
        "6": 6,
    }, "6", "secondary"),
    virtual: new RendererOptions_1.BooleanOption("virtual", "Generate virtual properties", false),
    typeForAny: new RendererOptions_1.EnumOption("any-type", 'Type to use for "any"', {
        object: "object",
        dynamic: "dynamic",
    }, "object", "secondary"),
    useDecimal: new RendererOptions_1.EnumOption("number-type", "Type to use for numbers", {
        double: false,
        decimal: true,
    }, "double", "secondary"),
    features: new RendererOptions_1.EnumOption("features", "Output features", {
        complete: { namespaces: true, helpers: true, attributes: true },
        "attributes-only": {
            namespaces: true,
            helpers: false,
            attributes: true,
        },
        "just-types-and-namespace": {
            namespaces: true,
            helpers: false,
            attributes: false,
        },
        "just-types": {
            namespaces: true,
            helpers: false,
            attributes: false,
        },
    }, "complete"),
    baseclass: new RendererOptions_1.EnumOption("base-class", "Base class", {
        EntityData: "EntityData",
        Object: undefined,
    }, "Object", "secondary"),
    checkRequired: new RendererOptions_1.BooleanOption("check-required", "Fail if required properties are missing", false),
    keepPropertyName: new RendererOptions_1.BooleanOption("keep-property-name", "Keep original field name generate", false),
};
exports.newtonsoftCSharpOptions = Object.assign({}, exports.cSharpOptions, {});
exports.systemTextJsonCSharpOptions = Object.assign({}, exports.cSharpOptions, {});
exports.cSharpLanguageConfig = {
    displayName: "C#",
    names: ["cs", "csharp"],
    extension: "cs",
};
class CSharpTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.cSharpLanguageConfig);
    }
    getOptions() {
        return exports.cSharpOptions;
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date", "date-time");
        mapping.set("time", "date-time");
        mapping.set("date-time", "date-time");
        mapping.set("uuid", "uuid");
        mapping.set("uri", "uri");
        mapping.set("integer-string", "integer-string");
        mapping.set("bool-string", "bool-string");
        return mapping;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    needsTransformerForType(t) {
        const need = (0, utils_1.needTransformerForType)(t);
        return need !== "none" && need !== "nullable";
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.cSharpOptions, untypedOptionValues);
        switch (options.framework) {
            case "NewtonSoft":
                return new NewtonSoftCSharpRenderer_1.NewtonsoftCSharpRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.newtonsoftCSharpOptions, untypedOptionValues));
            case "SystemTextJson":
                return new SystemTextJsonCSharpRenderer_1.SystemTextJsonCSharpRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.systemTextJsonCSharpOptions, untypedOptionValues));
            default:
                return (0, Support_1.assertNever)(options.framework);
        }
    }
}
exports.CSharpTargetLanguage = CSharpTargetLanguage;
