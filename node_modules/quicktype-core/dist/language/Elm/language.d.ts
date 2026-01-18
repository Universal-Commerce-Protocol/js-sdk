import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { ElmRenderer } from "./ElmRenderer";
export declare const elmOptions: {
    justTypes: BooleanOption<"just-types">;
    useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    moduleName: StringOption<"module">;
};
export declare const elmLanguageConfig: {
    readonly displayName: "Elm";
    readonly names: readonly ["elm"];
    readonly extension: "elm";
};
export declare class ElmTargetLanguage extends TargetLanguage<typeof elmLanguageConfig> {
    constructor();
    getOptions(): typeof elmOptions;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "elm">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ElmRenderer;
}
