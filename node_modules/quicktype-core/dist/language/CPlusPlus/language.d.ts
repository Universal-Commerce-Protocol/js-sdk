import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { CPlusPlusRenderer } from "./CPlusPlusRenderer";
export declare const cPlusPlusOptions: {
    typeSourceStyle: EnumOption<"source-style", {
        readonly "single-source": true;
        readonly "multi-source": false;
    }, "single-source" | "multi-source">;
    includeLocation: EnumOption<"include-location", {
        readonly "local-include": true;
        readonly "global-include": false;
    }, "local-include" | "global-include">;
    codeFormat: EnumOption<"code-format", {
        readonly "with-struct": false;
        readonly "with-getter-setter": true;
    }, "with-struct" | "with-getter-setter">;
    wstring: EnumOption<"wstring", {
        readonly "use-string": false;
        readonly "use-wstring": true;
    }, "use-string" | "use-wstring">;
    westConst: EnumOption<"const-style", {
        readonly "west-const": true;
        readonly "east-const": false;
    }, "west-const" | "east-const">;
    justTypes: BooleanOption<"just-types">;
    namespace: StringOption<"namespace">;
    enumType: StringOption<"enum-type">;
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
    boost: BooleanOption<"boost">;
    hideNullOptional: BooleanOption<"hide-null-optional">;
};
export declare const cPlusPlusLanguageConfig: {
    readonly displayName: "C++";
    readonly names: readonly ["c++", "cpp", "cplusplus"];
    readonly extension: "cpp";
};
export declare class CPlusPlusTargetLanguage extends TargetLanguage<typeof cPlusPlusLanguageConfig> {
    constructor();
    getOptions(): typeof cPlusPlusOptions;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get supportsOptionalClassProperties(): boolean;
    protected makeRenderer<Lang extends LanguageName = "c++">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): CPlusPlusRenderer;
}
