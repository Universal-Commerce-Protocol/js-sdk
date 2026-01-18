import { ConvenienceRenderer } from "../../ConvenienceRenderer";
import { type Name, type Namer } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import type { Sourcelike } from "../../Source";
import type { TargetLanguage } from "../../TargetLanguage";
import { type ClassProperty, type EnumType, ObjectType, type Type } from "../../Type";
import type { typeScriptZodOptions } from "./language";
export declare class TypeScriptZodRenderer extends ConvenienceRenderer {
    protected readonly _options: OptionValues<typeof typeScriptZodOptions>;
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _options: OptionValues<typeof typeScriptZodOptions>);
    protected forbiddenNamesForGlobalNamespace(): string[];
    protected nameStyle(original: string, upper: boolean): string;
    protected makeNamedTypeNamer(): Namer;
    protected makeUnionMemberNamer(): Namer;
    protected namerForObjectProperty(): Namer;
    protected makeEnumCaseNamer(): Namer;
    protected importStatement(lhs: Sourcelike, moduleName: Sourcelike): Sourcelike;
    protected emitImports(): void;
    protected typeMapTypeForProperty(p: ClassProperty): Sourcelike;
    protected typeMapTypeFor(t: Type, required?: boolean): Sourcelike;
    protected emitObject(name: Name, t: ObjectType): void;
    protected emitEnum(e: EnumType, enumName: Name): void;
    /** Static function that extracts underlying type refs for types that form part of the
     * definition of the passed type - used to ensure that these appear in generated source
     * before types that reference them.
     *
     * Primitive types don't need defining and enums are output before other types, hence,
     * these are ignored.
     */
    private static extractUnderlyingTyperefs;
    protected emitSchemas(): void;
    protected emitSourceStructure(): void;
}
