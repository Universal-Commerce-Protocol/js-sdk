import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { JavaScriptRenderer } from "./JavaScriptRenderer";
export declare const javaScriptOptions: {
    acronymStyle: EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
    runtimeTypecheck: BooleanOption<"runtime-typecheck">;
    runtimeTypecheckIgnoreUnknownProperties: BooleanOption<"runtime-typecheck-ignore-unknown-properties">;
    converters: EnumOption<"converters", {
        readonly "top-level": import("../../support/Converters").ConvertersOptions.TopLevel;
        readonly "all-objects": import("../../support/Converters").ConvertersOptions.AllObjects;
    }, import("../../support/Converters").ConvertersOptions>;
    rawType: EnumOption<"raw-type", {
        readonly json: "json";
        readonly any: "any";
    }, "json" | "any">;
};
export declare const javaScriptLanguageConfig: {
    readonly displayName: "JavaScript";
    readonly names: readonly ["javascript", "js", "jsx"];
    readonly extension: "js";
};
export declare class JavaScriptTargetLanguage extends TargetLanguage<typeof javaScriptLanguageConfig> {
    constructor();
    getOptions(): typeof javaScriptOptions;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsFullObjectType(): boolean;
    protected makeRenderer<Lang extends LanguageName = "javascript">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): JavaScriptRenderer;
}
