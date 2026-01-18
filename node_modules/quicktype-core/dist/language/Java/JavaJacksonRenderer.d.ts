import type { Name } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import type { TargetLanguage } from "../../TargetLanguage";
import { type ClassProperty, ClassType, EnumType, UnionType } from "../../Type";
import { JavaRenderer } from "./JavaRenderer";
import type { javaOptions } from "./language";
export declare class JacksonRenderer extends JavaRenderer {
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, options: OptionValues<typeof javaOptions>);
    protected readonly _converterKeywords: string[];
    protected emitClassAttributes(c: ClassType, _className: Name): void;
    protected annotationsForAccessor(_c: ClassType, _className: Name, _propertyName: Name, jsonName: string, p: ClassProperty, _isSetter: boolean): string[];
    protected importsForType(t: ClassType | UnionType | EnumType): string[];
    protected emitUnionAttributes(_u: UnionType, unionName: Name): void;
    protected emitUnionSerializer(u: UnionType, unionName: Name): void;
    protected emitEnumSerializationAttributes(_e: EnumType): void;
    protected emitEnumDeserializationAttributes(_e: EnumType): void;
    protected emitOffsetDateTimeConverterModule(): void;
    protected emitConverterClass(): void;
    protected emitSourceStructure(): void;
}
