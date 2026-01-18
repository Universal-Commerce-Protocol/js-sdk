import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { ObjectiveCRenderer } from "./ObjectiveCRenderer";
export declare const objectiveCOptions: {
    features: EnumOption<"features", {
        readonly all: {
            readonly interface: true;
            readonly implementation: true;
        };
        readonly interface: {
            readonly interface: true;
            readonly implementation: false;
        };
        readonly implementation: {
            readonly interface: false;
            readonly implementation: true;
        };
    }, "all" | "interface" | "implementation">;
    justTypes: BooleanOption<"just-types">;
    marshallingFunctions: BooleanOption<"functions">;
    classPrefix: StringOption<"class-prefix">;
    extraComments: BooleanOption<"extra-comments">;
};
export declare const objectiveCLanguageConfig: {
    readonly displayName: "Objective-C";
    readonly names: readonly ["objc", "objective-c", "objectivec"];
    readonly extension: "m";
};
export declare class ObjectiveCTargetLanguage extends TargetLanguage<typeof objectiveCLanguageConfig> {
    constructor();
    getOptions(): typeof objectiveCOptions;
    protected makeRenderer<Lang extends LanguageName = "objective-c">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ObjectiveCRenderer;
}
