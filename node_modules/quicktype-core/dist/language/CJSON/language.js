"use strict";
/**
 * CJSON.ts
 * This file is used to generate cJSON code with quicktype
 * The generated code depends of https://github.com/DaveGamble/cJSON, https://github.com/joelguittet/c-list and https://github.com/joelguittet/c-hashtable
 *
 * Similarly to C++ generator, it is possible to generate a single header file or multiple header files.
 * To generate multiple header files, use the following option: --source-style multi-source
 *
 * JSON data are represented using structures, and functions in the cJSON style are created to use them.
 * To parse json data from json string use the following: struct <type> * data = cJSON_Parse<type>(<string>);
 * To get json data from cJSON object use the following: struct <type> * data = cJSON_Get<type>Value(<cjson>);
 * To get cJSON object from json data use the following: cJSON * cjson = cJSON_Create<type>(<data>);
 * To print json string from json data use the following: char * string = cJSON_Print<type>(<data>);
 * To delete json data use the following: cJSON_Delete<type>(<data>);
 *
 * TODO list for future enhancements:
 * - Management of Class, Union and TopLevel should be mutualized to reduce code size and to permit Union and TopLevel having recursive Array/Map
 * - Types check should be added to verify unwanted inputs (for example a Number passed while a String is expected, etc)
 * - Constraints should be implemented (verification of Enum values, min/max values for Numbers and min/max length for Strings, regex)
 * - Support of pure Any type for example providing a callback from the application to handle these cases dynamically
 * See test/languages.ts for the test cases which are not implmented/checked.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CJSONTargetLanguage = exports.cJSONLanguageConfig = exports.cJSONOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const CJSONRenderer_1 = require("./CJSONRenderer");
/* Naming styles */
const namingStyles = {
    "pascal-case": "pascal",
    "underscore-case": "underscore",
    "camel-case": "camel",
    "upper-underscore-case": "upper-underscore",
    "pascal-case-upper-acronyms": "pascal-upper-acronyms",
    "camel-case-upper-acronyms": "camel-upper-acronyms",
};
/* cJSON generator options */
exports.cJSONOptions = {
    typeSourceStyle: new RendererOptions_1.EnumOption("source-style", "Source code generation type, whether to generate single or multiple source files", {
        "single-source": true,
        "multi-source": false,
    }, "single-source", "secondary"),
    typeIntegerSize: new RendererOptions_1.EnumOption("integer-size", "Integer code generation type (int64_t by default)", {
        int8_t: "int8_t",
        int16_t: "int16_t",
        int32_t: "int32_t",
        int64_t: "int64_t",
    }, "int64_t", "secondary"),
    hashtableSize: new RendererOptions_1.StringOption("hashtable-size", "Hashtable size, used when maps are created (64 by default)", "SIZE", "64"),
    addTypedefAlias: new RendererOptions_1.EnumOption("typedef-alias", "Add typedef alias to unions, structs, and enums (no typedef by default)", {
        "no-typedef": false,
        "add-typedef": true,
    }, "no-typedef", "secondary"),
    printStyle: new RendererOptions_1.EnumOption("print-style", "Which cJSON print should be used (formatted by default)", {
        "print-formatted": false,
        "print-unformatted": true,
    }, "print-formatted", "secondary"),
    typeNamingStyle: new RendererOptions_1.EnumOption("type-style", "Naming style for types", namingStyles, "pascal-case"),
    memberNamingStyle: new RendererOptions_1.EnumOption("member-style", "Naming style for members", namingStyles, "underscore-case"),
    enumeratorNamingStyle: new RendererOptions_1.EnumOption("enumerator-style", "Naming style for enumerators", namingStyles, "upper-underscore-case"),
};
/* cJSON generator target language */
exports.cJSONLanguageConfig = {
    displayName: "C (cJSON)",
    names: ["cjson", "cJSON"],
    extension: "h",
};
class CJSONTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.cJSONLanguageConfig);
    }
    /**
     * Return cJSON generator options
     * @return cJSON generator options array
     */
    getOptions() {
        return exports.cJSONOptions;
    }
    /**
     * Indicate if language support union with both number types
     * @return true
     */
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    /**
     * Indicate if language support optional class properties
     * @return true
     */
    get supportsOptionalClassProperties() {
        return true;
    }
    /**
     * Create renderer
     * @param renderContext: render context
     * @param untypedOptionValues
     * @return cJSON renderer
     */
    makeRenderer(renderContext, untypedOptionValues) {
        return new CJSONRenderer_1.CJSONRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.cJSONOptions, untypedOptionValues));
    }
}
exports.CJSONTargetLanguage = CJSONTargetLanguage;
