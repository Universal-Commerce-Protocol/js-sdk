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
import type { RenderContext } from "../../Renderer";
import { EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { CJSONRenderer } from "./CJSONRenderer";
export declare const cJSONOptions: {
    typeSourceStyle: EnumOption<"source-style", {
        readonly "single-source": true;
        readonly "multi-source": false;
    }, "single-source" | "multi-source">;
    typeIntegerSize: EnumOption<"integer-size", {
        readonly int8_t: "int8_t";
        readonly int16_t: "int16_t";
        readonly int32_t: "int32_t";
        readonly int64_t: "int64_t";
    }, "int8_t" | "int16_t" | "int32_t" | "int64_t">;
    hashtableSize: StringOption<"hashtable-size">;
    addTypedefAlias: EnumOption<"typedef-alias", {
        readonly "no-typedef": false;
        readonly "add-typedef": true;
    }, "no-typedef" | "add-typedef">;
    printStyle: EnumOption<"print-style", {
        readonly "print-formatted": false;
        readonly "print-unformatted": true;
    }, "print-formatted" | "print-unformatted">;
    typeNamingStyle: EnumOption<"type-style", {
        readonly "pascal-case": "pascal";
        readonly "underscore-case": "underscore";
        readonly "camel-case": "camel";
        readonly "upper-underscore-case": "upper-underscore";
        readonly "pascal-case-upper-acronyms": "pascal-upper-acronyms";
        readonly "camel-case-upper-acronyms": "camel-upper-acronyms";
    }, "pascal-case" | "underscore-case" | "camel-case" | "upper-underscore-case" | "pascal-case-upper-acronyms" | "camel-case-upper-acronyms">;
    memberNamingStyle: EnumOption<"member-style", {
        readonly "pascal-case": "pascal";
        readonly "underscore-case": "underscore";
        readonly "camel-case": "camel";
        readonly "upper-underscore-case": "upper-underscore";
        readonly "pascal-case-upper-acronyms": "pascal-upper-acronyms";
        readonly "camel-case-upper-acronyms": "camel-upper-acronyms";
    }, "pascal-case" | "underscore-case" | "camel-case" | "upper-underscore-case" | "pascal-case-upper-acronyms" | "camel-case-upper-acronyms">;
    enumeratorNamingStyle: EnumOption<"enumerator-style", {
        readonly "pascal-case": "pascal";
        readonly "underscore-case": "underscore";
        readonly "camel-case": "camel";
        readonly "upper-underscore-case": "upper-underscore";
        readonly "pascal-case-upper-acronyms": "pascal-upper-acronyms";
        readonly "camel-case-upper-acronyms": "camel-upper-acronyms";
    }, "pascal-case" | "underscore-case" | "camel-case" | "upper-underscore-case" | "pascal-case-upper-acronyms" | "camel-case-upper-acronyms">;
};
export declare const cJSONLanguageConfig: {
    readonly displayName: "C (cJSON)";
    readonly names: readonly ["cjson", "cJSON"];
    readonly extension: "h";
};
export declare class CJSONTargetLanguage extends TargetLanguage<typeof cJSONLanguageConfig> {
    constructor();
    /**
     * Return cJSON generator options
     * @return cJSON generator options array
     */
    getOptions(): typeof cJSONOptions;
    /**
     * Indicate if language support union with both number types
     * @return true
     */
    get supportsUnionsWithBothNumberTypes(): boolean;
    /**
     * Indicate if language support optional class properties
     * @return true
     */
    get supportsOptionalClassProperties(): boolean;
    /**
     * Create renderer
     * @param renderContext: render context
     * @param untypedOptionValues
     * @return cJSON renderer
     */
    protected makeRenderer<Lang extends LanguageName = "cjson">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): CJSONRenderer;
}
