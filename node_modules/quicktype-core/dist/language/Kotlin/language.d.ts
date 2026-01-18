import type { ConvenienceRenderer } from "../../ConvenienceRenderer";
import type { RenderContext } from "../../Renderer";
import { EnumOption, StringOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
export declare const kotlinOptions: {
    framework: EnumOption<"framework", {
        readonly "just-types": "None";
        readonly jackson: "Jackson";
        readonly klaxon: "Klaxon";
        readonly kotlinx: "KotlinX";
    }, "just-types" | "jackson" | "klaxon" | "kotlinx">;
    acronymStyle: EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
    packageName: StringOption<"package">;
};
export declare const kotlinLanguageConfig: {
    readonly displayName: "Kotlin";
    readonly names: readonly ["kotlin"];
    readonly extension: "kt";
};
export declare class KotlinTargetLanguage extends TargetLanguage<typeof kotlinLanguageConfig> {
    constructor();
    getOptions(): typeof kotlinOptions;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "kotlin">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ConvenienceRenderer;
}
