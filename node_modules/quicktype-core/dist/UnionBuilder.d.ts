import { StringTypes } from "./attributes/StringTypes";
import { type TypeAttributes } from "./attributes/TypeAttributes";
import { type PrimitiveStringTypeKind, type PrimitiveTypeKind, type Type, type TypeKind } from "./Type";
import type { TypeBuilder } from "./Type/TypeBuilder";
import type { TypeRef } from "./Type/TypeRef";
export interface UnionTypeProvider<TArrayData, TObjectData> {
    readonly arrayData: TArrayData;
    readonly enumCases: ReadonlySet<string>;
    getMemberKinds: () => TypeAttributeMap<TypeKind>;
    readonly lostTypeAttributes: boolean;
    readonly objectData: TObjectData;
}
export type TypeAttributeMap<T extends TypeKind> = Map<T, TypeAttributes>;
export declare class UnionAccumulator<TArray, TObject> implements UnionTypeProvider<TArray[], TObject[]> {
    private readonly _conflateNumbers;
    private readonly _nonStringTypeAttributes;
    private readonly _stringTypeAttributes;
    readonly arrayData: TArray[];
    readonly objectData: TObject[];
    private readonly _enumCases;
    private _lostTypeAttributes;
    constructor(_conflateNumbers: boolean);
    private have;
    addNone(_attributes: TypeAttributes): void;
    addAny(attributes: TypeAttributes): void;
    addPrimitive(kind: PrimitiveTypeKind, attributes: TypeAttributes): void;
    protected addFullStringType(attributes: TypeAttributes, stringTypes: StringTypes | undefined): void;
    addStringType(kind: PrimitiveStringTypeKind, attributes: TypeAttributes, stringTypes?: StringTypes): void;
    addArray(t: TArray, attributes: TypeAttributes): void;
    addObject(t: TObject, attributes: TypeAttributes): void;
    addEnum(cases: ReadonlySet<string>, attributes: TypeAttributes): void;
    addStringCases(cases: string[], attributes: TypeAttributes): void;
    addStringCase(s: string, count: number, attributes: TypeAttributes): void;
    get enumCases(): ReadonlySet<string>;
    getMemberKinds(): TypeAttributeMap<TypeKind>;
    get lostTypeAttributes(): boolean;
}
export declare class TypeRefUnionAccumulator extends UnionAccumulator<TypeRef, TypeRef> {
    private addType;
    addTypes(types: Iterable<Type>): TypeAttributes;
}
export declare abstract class UnionBuilder<TBuilder extends TypeBuilder, TArrayData, TObjectData> {
    protected readonly typeBuilder: TBuilder;
    constructor(typeBuilder: TBuilder);
    protected abstract makeObject(objects: TObjectData, typeAttributes: TypeAttributes, forwardingRef: TypeRef | undefined): TypeRef;
    protected abstract makeArray(arrays: TArrayData, typeAttributes: TypeAttributes, forwardingRef: TypeRef | undefined): TypeRef;
    private makeTypeOfKind;
    buildUnion(typeProvider: UnionTypeProvider<TArrayData, TObjectData>, unique: boolean, typeAttributes: TypeAttributes, forwardingRef?: TypeRef): TypeRef;
}
