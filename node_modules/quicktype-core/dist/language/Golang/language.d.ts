import type { RenderContext } from "../../Renderer";
import { BooleanOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { GoRenderer } from "./GolangRenderer";
export declare const goOptions: {
    justTypes: BooleanOption<"just-types">;
    justTypesAndPackage: BooleanOption<"just-types-and-package">;
    packageName: StringOption<"package">;
    multiFileOutput: BooleanOption<"multi-file-output">;
    fieldTags: StringOption<"field-tags">;
    omitEmpty: BooleanOption<"omit-empty">;
};
declare const golangLanguageConfig: {
    readonly displayName: "Go";
    readonly names: readonly ["go", "golang"];
    readonly extension: "go";
};
export declare class GoTargetLanguage extends TargetLanguage<typeof golangLanguageConfig> {
    constructor();
    getOptions(): typeof goOptions;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    protected makeRenderer<Lang extends LanguageName = "go">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): GoRenderer;
    protected get defaultIndentation(): string;
}
export {};
