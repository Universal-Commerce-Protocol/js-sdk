import { ConvenienceRenderer } from "../../ConvenienceRenderer";
import { type Name, type Namer } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import type { TargetLanguage } from "../../TargetLanguage";
import { type ObjectType } from "../../Type";
import type { typeScriptEffectSchemaOptions } from "./language";
export declare class TypeScriptEffectSchemaRenderer extends ConvenienceRenderer {
    private readonly _options;
    private emittedObjects;
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _options: OptionValues<typeof typeScriptEffectSchemaOptions>);
    protected forbiddenNamesForGlobalNamespace(): string[];
    protected nameStyle(original: string, upper: boolean): string;
    protected makeNamedTypeNamer(): Namer;
    protected makeUnionMemberNamer(): Namer;
    protected namerForObjectProperty(): Namer;
    protected makeEnumCaseNamer(): Namer;
    private importStatement;
    protected emitImports(): void;
    private typeMapTypeForProperty;
    private typeMapTypeFor;
    private emitObject;
    private emitEnum;
    protected walkObjectNames(objectType: ObjectType): Name[];
    protected emitSchemas(): void;
    protected emitSourceStructure(): void;
}
