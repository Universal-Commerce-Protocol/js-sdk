import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { RustRenderer } from "./RustRenderer";
import { Density, Visibility } from "./utils";
export declare const rustOptions: {
    readonly density: EnumOption<"density", {
        readonly normal: Density.Normal;
        readonly dense: Density.Dense;
    }, "normal" | "dense">;
    readonly visibility: EnumOption<"visibility", {
        readonly private: Visibility.Private;
        readonly crate: Visibility.Crate;
        readonly public: Visibility.Public;
    }, "private" | "public" | "crate">;
    readonly deriveDebug: BooleanOption<"derive-debug">;
    readonly deriveClone: BooleanOption<"derive-clone">;
    readonly derivePartialEq: BooleanOption<"derive-partial-eq">;
    readonly skipSerializingNone: BooleanOption<"skip-serializing-none">;
    readonly edition2018: BooleanOption<"edition-2018">;
    readonly leadingComments: BooleanOption<"leading-comments">;
};
export declare const rustLanguageConfig: {
    readonly displayName: "Rust";
    readonly names: readonly ["rust", "rs", "rustlang"];
    readonly extension: "rs";
};
export declare class RustTargetLanguage extends TargetLanguage<typeof rustLanguageConfig> {
    constructor();
    getOptions(): typeof rustOptions;
    protected makeRenderer<Lang extends LanguageName = "rust">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): RustRenderer;
}
