import type { ConvenienceRenderer } from "../../ConvenienceRenderer";
import type { RenderContext } from "../../Renderer";
import { EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
export declare enum Framework {
    None = "None"
}
export declare const smithyOptions: {
    framework: EnumOption<"framework", {
        readonly "just-types": Framework;
    }, "just-types">;
    packageName: StringOption<"package">;
};
export declare const smithyLanguageConfig: {
    readonly displayName: "Smithy";
    readonly names: readonly ["smithy4a"];
    readonly extension: "smithy";
};
export declare class SmithyTargetLanguage extends TargetLanguage<typeof smithyLanguageConfig> {
    constructor();
    getOptions(): typeof smithyOptions;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "smithy4a">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ConvenienceRenderer;
}
