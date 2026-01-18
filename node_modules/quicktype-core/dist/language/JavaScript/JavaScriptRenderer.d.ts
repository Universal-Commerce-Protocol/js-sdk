import { ConvenienceRenderer } from "../../ConvenienceRenderer";
import { type Name, type Namer } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import { type Sourcelike } from "../../Source";
import type { TargetLanguage } from "../../TargetLanguage";
import type { ClassProperty, ClassType, Type } from "../../Type";
import type { javaScriptOptions } from "./language";
export interface JavaScriptTypeAnnotations {
    any: string;
    anyArray: string;
    anyMap: string;
    boolean: string;
    never: string;
    string: string;
    stringArray: string;
}
export declare class JavaScriptRenderer extends ConvenienceRenderer {
    private readonly _jsOptions;
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _jsOptions: OptionValues<typeof javaScriptOptions>);
    protected nameStyle(original: string, upper: boolean): string;
    protected makeNamedTypeNamer(): Namer;
    protected namerForObjectProperty(): Namer;
    protected makeUnionMemberNamer(): null;
    protected makeEnumCaseNamer(): Namer;
    protected namedTypeToNameForTopLevel(type: Type): Type | undefined;
    protected makeNameForProperty(c: ClassType, className: Name, p: ClassProperty, jsonName: string, _assignedName: string | undefined): Name | undefined;
    protected emitDescriptionBlock(lines: Sourcelike[]): void;
    private typeMapTypeFor;
    private typeMapTypeForProperty;
    protected emitBlock(source: Sourcelike, end: Sourcelike, emit: () => void): void;
    private emitTypeMap;
    protected deserializerFunctionName(name: Name): Sourcelike;
    protected deserializerFunctionLine(_t: Type, name: Name): Sourcelike;
    protected serializerFunctionName(name: Name): Sourcelike;
    protected serializerFunctionLine(_t: Type, name: Name): Sourcelike;
    protected get moduleLine(): string | undefined;
    protected get castFunctionLines(): [string, string];
    protected get typeAnnotations(): JavaScriptTypeAnnotations;
    protected emitConvertModuleBody(): void;
    protected emitConvertModuleHelpers(): void;
    protected emitConvertModule(): void;
    protected emitTypes(): void;
    protected emitUsageImportComment(): void;
    protected emitUsageComments(): void;
    protected emitModuleExports(): void;
    protected emitSourceStructure(): void;
}
