import type { RenderContext } from "../../Renderer";
import { BooleanOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { ElixirRenderer } from "./ElixirRenderer";
export declare const elixirOptions: {
    justTypes: BooleanOption<"just-types">;
    namespace: StringOption<"namespace">;
};
export declare const elixirLanguageConfig: {
    readonly displayName: "Elixir";
    readonly names: readonly ["elixir"];
    readonly extension: "ex";
};
export declare class ElixirTargetLanguage extends TargetLanguage<typeof elixirLanguageConfig> {
    constructor();
    getOptions(): typeof elixirOptions;
    get supportsOptionalClassProperties(): boolean;
    protected get defaultIndentation(): string;
    protected makeRenderer<Lang extends LanguageName = "elixir">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ElixirRenderer;
}
