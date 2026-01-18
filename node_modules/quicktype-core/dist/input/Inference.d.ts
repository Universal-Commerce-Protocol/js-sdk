import { type TypeAttributes } from "../attributes/TypeAttributes";
import type { TypeBuilder } from "../Type/TypeBuilder";
import { type TypeRef } from "../Type/TypeRef";
import { UnionAccumulator } from "../UnionBuilder";
import { type CompressedJSON } from "./CompressedJSON";
export type NestedValueArray = any;
export type Accumulator = UnionAccumulator<NestedValueArray, NestedValueArray>;
export declare class TypeInference {
    private readonly _cjson;
    private readonly _typeBuilder;
    private readonly _inferMaps;
    private readonly _inferEnums;
    private _refIntersections;
    constructor(_cjson: CompressedJSON<unknown>, _typeBuilder: TypeBuilder, _inferMaps: boolean, _inferEnums: boolean);
    private addValuesToAccumulator;
    inferType(typeAttributes: TypeAttributes, valueArray: NestedValueArray, fixed: boolean, forwardingRef?: TypeRef): TypeRef;
    private resolveRef;
    inferTopLevelType(typeAttributes: TypeAttributes, valueArray: NestedValueArray, fixed: boolean): TypeRef;
    private accumulatorForArray;
    private makeTypeFromAccumulator;
    inferClassType(typeAttributes: TypeAttributes, objects: NestedValueArray, fixed: boolean, forwardingRef?: TypeRef): TypeRef;
}
