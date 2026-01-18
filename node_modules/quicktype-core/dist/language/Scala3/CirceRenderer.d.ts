import type { Name } from "../../Naming";
import type { Sourcelike } from "../../Source";
import type { ArrayType, ClassType, EnumType, MapType, Type, UnionType } from "../../Type";
import { Scala3Renderer } from "./Scala3Renderer";
export declare class CirceRenderer extends Scala3Renderer {
    private seenUnionTypes;
    protected circeEncoderForType(t: Type, __?: boolean, noOptional?: boolean, paramName?: string): Sourcelike;
    protected emitEmptyClassDefinition(c: ClassType, className: Name): void;
    protected anySourceType(optional: boolean): Sourcelike;
    protected emitClassDefinitionMethods(): void;
    protected emitEnumDefinition(e: EnumType, enumName: Name): void;
    protected emitHeader(): void;
    protected emitTopLevelArray(t: ArrayType, name: Name): void;
    protected emitTopLevelMap(t: MapType, name: Name): void;
    protected emitUnionDefinition(u: UnionType, unionName: Name): void;
}
