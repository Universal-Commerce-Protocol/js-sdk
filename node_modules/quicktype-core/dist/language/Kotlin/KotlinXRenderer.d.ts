import type { Name } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import { type Sourcelike } from "../../Source";
import type { TargetLanguage } from "../../TargetLanguage";
import type { ArrayType, EnumType, MapType, Type } from "../../Type";
import { KotlinRenderer } from "./KotlinRenderer";
import type { kotlinOptions } from "./language";
/**
 * Currently supports simple classes, enums, and TS string unions (which are also enums).
 * TODO: Union, Any, Top Level Array, Top Level Map
 */
export declare class KotlinXRenderer extends KotlinRenderer {
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _kotlinOptions: OptionValues<typeof kotlinOptions>);
    protected anySourceType(optional: string): Sourcelike;
    protected arrayType(arrayType: ArrayType, withIssues?: boolean, noOptional?: boolean): Sourcelike;
    protected mapType(mapType: MapType, withIssues?: boolean, noOptional?: boolean): Sourcelike;
    protected emitTopLevelMap(t: MapType, name: Name): void;
    protected emitTopLevelArray(t: ArrayType, name: Name): void;
    protected emitUsageHeader(): void;
    protected emitHeader(): void;
    protected emitClassAnnotations(_c: Type, _className: Name): void;
    protected renameAttribute(name: Name, jsonName: string, _required: boolean, meta: Array<() => void>): void;
    private _rename;
    protected emitEnumDefinition(e: EnumType, enumName: Name): void;
}
