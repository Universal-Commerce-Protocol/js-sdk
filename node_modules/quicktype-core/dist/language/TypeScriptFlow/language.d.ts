import type { RenderContext } from "../../Renderer";
import { BooleanOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { FlowRenderer } from "./FlowRenderer";
import { TypeScriptRenderer } from "./TypeScriptRenderer";
export declare const tsFlowOptions: {
    acronymStyle: import("../../RendererOptions").EnumOption<"acronym-style", {
        readonly original: import("../../support/Acronyms").AcronymStyleOptions.Original;
        readonly pascal: import("../../support/Acronyms").AcronymStyleOptions.Pascal;
        readonly camel: import("../../support/Acronyms").AcronymStyleOptions.Camel;
        readonly lowerCase: import("../../support/Acronyms").AcronymStyleOptions.Lower;
    }, import("../../support/Acronyms").AcronymStyleOptions>;
    runtimeTypecheck: BooleanOption<"runtime-typecheck">;
    runtimeTypecheckIgnoreUnknownProperties: BooleanOption<"runtime-typecheck-ignore-unknown-properties">;
    converters: import("../../RendererOptions").EnumOption<"converters", {
        readonly "top-level": import("../../support/Converters").ConvertersOptions.TopLevel;
        readonly "all-objects": import("../../support/Converters").ConvertersOptions.AllObjects;
    }, import("../../support/Converters").ConvertersOptions>;
    rawType: import("../../RendererOptions").EnumOption<"raw-type", {
        readonly json: "json";
        readonly any: "any";
    }, "json" | "any">;
} & {
    justTypes: BooleanOption<"just-types">;
    nicePropertyNames: BooleanOption<"nice-property-names">;
    declareUnions: BooleanOption<"explicit-unions">;
    preferUnions: BooleanOption<"prefer-unions">;
    preferTypes: BooleanOption<"prefer-types">;
    preferConstValues: BooleanOption<"prefer-const-values">;
    readonly: BooleanOption<"readonly">;
};
export declare const typeScriptLanguageConfig: {
    readonly displayName: "TypeScript";
    readonly names: readonly ["typescript", "ts", "tsx"];
    readonly extension: "ts";
};
export declare class TypeScriptTargetLanguage extends TargetLanguage<typeof typeScriptLanguageConfig> {
    constructor();
    getOptions(): typeof tsFlowOptions;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsFullObjectType(): boolean;
    protected makeRenderer<Lang extends LanguageName = "typescript">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): TypeScriptRenderer;
}
export declare const flowLanguageConfig: {
    readonly displayName: "Flow";
    readonly names: readonly ["flow"];
    readonly extension: "js";
};
export declare class FlowTargetLanguage extends TargetLanguage<typeof flowLanguageConfig> {
    constructor();
    getOptions(): typeof tsFlowOptions;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsFullObjectType(): boolean;
    protected makeRenderer<Lang extends LanguageName = "flow">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): FlowRenderer;
}
