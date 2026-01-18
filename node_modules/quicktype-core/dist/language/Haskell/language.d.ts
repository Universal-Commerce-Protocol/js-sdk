import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { HaskellRenderer } from "./HaskellRenderer";
export declare const haskellOptions: {
    justTypes: BooleanOption<"just-types">;
    useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    moduleName: StringOption<"module">;
};
export declare const haskellLanguageConfig: {
    readonly displayName: "Haskell";
    readonly names: readonly ["haskell"];
    readonly extension: "haskell";
};
export declare class HaskellTargetLanguage extends TargetLanguage<typeof haskellLanguageConfig> {
    constructor();
    getOptions(): typeof haskellOptions;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "haskell">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): HaskellRenderer;
}
