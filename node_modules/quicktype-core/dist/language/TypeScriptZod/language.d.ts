import type { RenderContext } from "../../Renderer";
import { BooleanOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { TypeScriptZodRenderer } from "./TypeScriptZodRenderer";
export declare const typeScriptZodOptions: {
    justSchema: BooleanOption<"just-schema">;
};
export declare const typeScriptZodLanguageConfig: {
    readonly displayName: "TypeScript Zod";
    readonly names: readonly ["typescript-zod"];
    readonly extension: "ts";
};
export declare class TypeScriptZodTargetLanguage extends TargetLanguage<typeof typeScriptZodLanguageConfig> {
    constructor();
    getOptions(): {};
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    protected makeRenderer<Lang extends LanguageName = "typescript-zod">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): TypeScriptZodRenderer;
}
