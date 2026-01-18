import type { RenderContext } from "../../Renderer";
import { TargetLanguage } from "../../TargetLanguage";
import { type StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { JSONSchemaRenderer } from "./JSONSchemaRenderer";
export declare const JSONSchemaLanguageConfig: {
    readonly displayName: "JSON Schema";
    readonly names: readonly ["schema", "json-schema"];
    readonly extension: "schema";
};
export declare class JSONSchemaTargetLanguage extends TargetLanguage<typeof JSONSchemaLanguageConfig> {
    constructor();
    getOptions(): {};
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsFullObjectType(): boolean;
    protected makeRenderer<Lang extends LanguageName = "json-schema">(renderContext: RenderContext, _untypedOptionValues: RendererOptions<Lang>): JSONSchemaRenderer;
}
