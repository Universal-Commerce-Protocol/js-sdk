import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { RubyRenderer } from "./RubyRenderer";
import { Strictness } from "./utils";
export declare const rubyOptions: {
    justTypes: BooleanOption<"just-types">;
    strictness: EnumOption<"strictness", {
        readonly strict: Strictness.Strict;
        readonly coercible: Strictness.Coercible;
        readonly none: Strictness.None;
    }, "none" | "strict" | "coercible">;
    namespace: StringOption<"namespace">;
};
export declare const rubyLanguageConfig: {
    readonly displayName: "Ruby";
    readonly names: readonly ["ruby"];
    readonly extension: "rb";
};
export declare class RubyTargetLanguage extends TargetLanguage<typeof rubyLanguageConfig> {
    constructor();
    getOptions(): typeof rubyOptions;
    get supportsOptionalClassProperties(): boolean;
    protected get defaultIndentation(): string;
    protected makeRenderer<Lang extends LanguageName = "ruby">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): RubyRenderer;
}
