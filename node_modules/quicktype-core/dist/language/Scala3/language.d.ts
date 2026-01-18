import type { ConvenienceRenderer } from "../../ConvenienceRenderer";
import type { RenderContext } from "../../Renderer";
import { EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
export declare const scala3Options: {
    framework: EnumOption<"framework", {
        readonly "just-types": "None";
        readonly circe: "Circe";
        readonly upickle: "Upickle";
    }, "just-types" | "circe" | "upickle">;
    packageName: StringOption<"package">;
};
export declare const scala3LanguageConfig: {
    readonly displayName: "Scala3";
    readonly names: readonly ["scala3"];
    readonly extension: "scala";
};
export declare class Scala3TargetLanguage extends TargetLanguage<typeof scala3LanguageConfig> {
    constructor();
    getOptions(): typeof scala3Options;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "scala3">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ConvenienceRenderer;
}
