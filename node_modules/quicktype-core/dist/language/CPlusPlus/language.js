"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPlusPlusTargetLanguage = exports.cPlusPlusLanguageConfig = exports.cPlusPlusOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const CPlusPlusRenderer_1 = require("./CPlusPlusRenderer");
// FIXME: share with CJSON
const namingStyles = {
    "pascal-case": "pascal",
    "underscore-case": "underscore",
    "camel-case": "camel",
    "upper-underscore-case": "upper-underscore",
    "pascal-case-upper-acronyms": "pascal-upper-acronyms",
    "camel-case-upper-acronyms": "camel-upper-acronyms",
};
exports.cPlusPlusOptions = {
    typeSourceStyle: new RendererOptions_1.EnumOption("source-style", "Source code generation type,  whether to generate single or multiple source files", {
        "single-source": true,
        "multi-source": false,
    }, "single-source", "secondary"),
    includeLocation: new RendererOptions_1.EnumOption("include-location", "Whether json.hpp is to be located globally or locally", {
        "local-include": true,
        "global-include": false,
    }, "local-include", "secondary"),
    codeFormat: new RendererOptions_1.EnumOption("code-format", "Generate classes with getters/setters, instead of structs", {
        "with-struct": false,
        "with-getter-setter": true,
    }, "with-getter-setter"),
    wstring: new RendererOptions_1.EnumOption("wstring", "Store strings using Utf-16 std::wstring, rather than Utf-8 std::string", {
        "use-string": false,
        "use-wstring": true,
    }, "use-string"),
    westConst: new RendererOptions_1.EnumOption("const-style", "Put const to the left/west (const T) or right/east (T const)", {
        "west-const": true,
        "east-const": false,
    }, "west-const"),
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    namespace: new RendererOptions_1.StringOption("namespace", "Name of the generated namespace(s)", "NAME", "quicktype"),
    enumType: new RendererOptions_1.StringOption("enum-type", "Type of enum class", "NAME", "int", "secondary"),
    typeNamingStyle: new RendererOptions_1.EnumOption("type-style", "Naming style for types", namingStyles, "pascal-case"),
    memberNamingStyle: new RendererOptions_1.EnumOption("member-style", "Naming style for members", namingStyles, "underscore-case"),
    enumeratorNamingStyle: new RendererOptions_1.EnumOption("enumerator-style", "Naming style for enumerators", namingStyles, "upper-underscore-case"),
    boost: new RendererOptions_1.BooleanOption("boost", "Require a dependency on boost. Without boost, C++17 is required", true),
    hideNullOptional: new RendererOptions_1.BooleanOption("hide-null-optional", "Hide null value for optional field", false),
};
exports.cPlusPlusLanguageConfig = {
    displayName: "C++",
    names: ["c++", "cpp", "cplusplus"],
    extension: "cpp",
};
class CPlusPlusTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.cPlusPlusLanguageConfig);
    }
    getOptions() {
        return exports.cPlusPlusOptions;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new CPlusPlusRenderer_1.CPlusPlusRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.cPlusPlusOptions, untypedOptionValues));
    }
}
exports.CPlusPlusTargetLanguage = CPlusPlusTargetLanguage;
