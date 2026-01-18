import type { Name } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import type { TargetLanguage } from "../../TargetLanguage";
import { type ArrayType, ClassType, type EnumType, type MapType, type PrimitiveType, type Type, UnionType } from "../../Type";
import { KotlinRenderer } from "./KotlinRenderer";
import type { kotlinOptions } from "./language";
export declare class KotlinJacksonRenderer extends KotlinRenderer {
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _kotlinOptions: OptionValues<typeof kotlinOptions>);
    private unionMemberJsonValueGuard;
    protected emitUsageHeader(): void;
    protected emitHeader(): void;
    protected emitTopLevelArray(t: ArrayType, name: Name): void;
    protected emitTopLevelMap(t: MapType, name: Name): void;
    private jacksonRenameAttribute;
    protected emitEmptyClassDefinition(c: ClassType, className: Name): void;
    protected emitClassDefinitionMethods(c: ClassType, className: Name): void;
    protected renameAttribute(name: Name, jsonName: string, required: boolean, meta: Array<() => void>): void;
    protected emitEnumDefinition(e: EnumType, enumName: Name): void;
    private emitGenericConverter;
    protected emitUnionDefinitionMethods(u: UnionType, nonNulls: ReadonlySet<Type>, maybeNull: PrimitiveType | null, unionName: Name): void;
}
