import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { JavaRenderer } from "./JavaRenderer";
export declare const javaOptions: {
    useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    justTypes: BooleanOption<"just-types">;
    dateTimeProvider: EnumOption<"datetime-provider", {
        readonly java8: "java8";
        readonly legacy: "legacy";
    }, "java8" | "legacy">;
    acronymStyle: EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
    packageName: StringOption<"package">;
    lombok: BooleanOption<"lombok">;
    lombokCopyAnnotations: BooleanOption<"lombok-copy-annotations">;
};
export declare const javaLanguageConfig: {
    readonly displayName: "Java";
    readonly names: readonly ["java"];
    readonly extension: "java";
};
export declare class JavaTargetLanguage extends TargetLanguage<typeof javaLanguageConfig> {
    constructor();
    getOptions(): typeof javaOptions;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "java">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): JavaRenderer;
    get stringTypeMapping(): StringTypeMapping;
}
