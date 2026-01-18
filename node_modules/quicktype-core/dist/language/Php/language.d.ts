import type { RenderContext } from "../../Renderer";
import { BooleanOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { PhpRenderer } from "./PhpRenderer";
export declare const phpOptions: {
    withGet: BooleanOption<"with-get">;
    fastGet: BooleanOption<"fast-get">;
    withSet: BooleanOption<"with-set">;
    withClosing: BooleanOption<"with-closing">;
    acronymStyle: import("../../RendererOptions").EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
};
export declare const phpLanguageConfig: {
    readonly displayName: "PHP";
    readonly names: readonly ["php"];
    readonly extension: "php";
};
export declare class PhpTargetLanguage extends TargetLanguage<typeof phpLanguageConfig> {
    constructor();
    getOptions(): typeof phpOptions;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "php">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): PhpRenderer;
    get stringTypeMapping(): StringTypeMapping;
}
