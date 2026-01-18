import type { RenderContext } from "../../Renderer";
import { BooleanOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { LanguageName, RendererOptions } from "../../types";
import { TypeScriptEffectSchemaRenderer } from "./TypeScriptEffectSchemaRenderer";
export declare const typeScriptEffectSchemaOptions: {
    justSchema: BooleanOption<"just-schema">;
};
export declare const typeScriptEffectSchemaLanguageConfig: {
    readonly displayName: "TypeScript Effect Schema";
    readonly names: readonly ["typescript-effect-schema"];
    readonly extension: "ts";
};
export declare class TypeScriptEffectSchemaTargetLanguage extends TargetLanguage<typeof typeScriptEffectSchemaLanguageConfig> {
    constructor();
    getOptions(): {};
    protected makeRenderer<Lang extends LanguageName = "typescript-effect-schema">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): TypeScriptEffectSchemaRenderer;
}
