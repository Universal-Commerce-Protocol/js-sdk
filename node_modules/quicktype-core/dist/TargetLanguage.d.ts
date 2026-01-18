import { type DateTimeRecognizer } from "./DateTime";
import type { RenderContext, Renderer } from "./Renderer";
import type { Option, OptionDefinition } from "./RendererOptions";
import { type SerializedRenderResult } from "./Source";
import type { Comment } from "./support/Comments";
import type { Type } from "./Type/Type";
import type { StringTypeMapping } from "./Type/TypeBuilderUtils";
import type { TypeGraph } from "./Type/TypeGraph";
import type { LanguageName, RendererOptions } from "./types";
export type MultiFileRenderResult = ReadonlyMap<string, SerializedRenderResult>;
export interface LanguageConfig {
    readonly displayName: string;
    readonly extension: string;
    readonly names: readonly string[];
}
export declare abstract class TargetLanguage<Config extends LanguageConfig = LanguageConfig> {
    readonly displayName: Config["displayName"];
    readonly names: Config["names"];
    readonly extension: Config["extension"];
    constructor({ displayName, names, extension }: Config);
    protected abstract getOptions(): Record<string, Option<string, unknown>>;
    get optionDefinitions(): Array<OptionDefinition<string, unknown>>;
    get cliOptionDefinitions(): {
        actual: Array<OptionDefinition<string, unknown>>;
        display: Array<OptionDefinition<string, unknown>>;
    };
    get name(): (typeof this.names)[0];
    protected abstract makeRenderer<Lang extends LanguageName>(renderContext: RenderContext, optionValues: RendererOptions<Lang>): Renderer;
    renderGraphAndSerialize<Lang extends LanguageName>(typeGraph: TypeGraph, givenOutputFilename: string, alphabetizeProperties: boolean, leadingComments: Comment[] | undefined, rendererOptions: RendererOptions<Lang>, indentation?: string): MultiFileRenderResult;
    protected get defaultIndentation(): string;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get supportsFullObjectType(): boolean;
    needsTransformerForType(_t: Type): boolean;
    get dateTimeRecognizer(): DateTimeRecognizer;
}
