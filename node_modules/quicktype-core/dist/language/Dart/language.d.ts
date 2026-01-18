import type { RenderContext } from "../../Renderer";
import { BooleanOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { DartRenderer } from "./DartRenderer";
export declare const dartOptions: {
    nullSafety: BooleanOption<"null-safety">;
    justTypes: BooleanOption<"just-types">;
    codersInClass: BooleanOption<"coders-in-class">;
    methodNamesWithMap: BooleanOption<"from-map">;
    requiredProperties: BooleanOption<"required-props">;
    finalProperties: BooleanOption<"final-props">;
    generateCopyWith: BooleanOption<"copy-with">;
    useFreezed: BooleanOption<"use-freezed">;
    useHive: BooleanOption<"use-hive">;
    useJsonAnnotation: BooleanOption<"use-json-annotation">;
    partName: StringOption<"part-name">;
};
export declare const dartLanguageConfig: {
    readonly displayName: "Dart";
    readonly names: readonly ["dart"];
    readonly extension: "dart";
};
export declare class DartTargetLanguage extends TargetLanguage<typeof dartLanguageConfig> {
    constructor();
    getOptions(): typeof dartOptions;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get stringTypeMapping(): StringTypeMapping;
    protected makeRenderer<Lang extends LanguageName = "dart">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): DartRenderer;
}
