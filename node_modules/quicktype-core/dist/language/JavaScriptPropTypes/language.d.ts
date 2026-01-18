import type { RenderContext } from "../../Renderer";
import { EnumOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { JavaScriptPropTypesRenderer } from "./JavaScriptPropTypesRenderer";
export declare const javaScriptPropTypesOptions: {
    acronymStyle: EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
    converters: EnumOption<"converters", {
        readonly "top-level": import("../../support/Converters").ConvertersOptions.TopLevel;
        readonly "all-objects": import("../../support/Converters").ConvertersOptions.AllObjects;
    }, import("../../support/Converters").ConvertersOptions>;
    moduleSystem: EnumOption<"module-system", {
        readonly "common-js": false;
        readonly es6: true;
    }, "common-js" | "es6">;
};
export declare const javaScriptPropTypesLanguageConfig: {
    readonly displayName: "JavaScript PropTypes";
    readonly names: readonly ["javascript-prop-types"];
    readonly extension: "js";
};
export declare class JavaScriptPropTypesTargetLanguage extends TargetLanguage<typeof javaScriptPropTypesLanguageConfig> {
    constructor();
    getOptions(): typeof javaScriptPropTypesOptions;
    protected makeRenderer<Lang extends LanguageName = "javascript-prop-types">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): JavaScriptPropTypesRenderer;
}
