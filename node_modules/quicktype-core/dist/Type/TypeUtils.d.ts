import { type StringTypes } from "../attributes/StringTypes";
import { type CombinationKind, type TypeAttributes } from "../attributes/TypeAttributes";
import { ArrayType, type ClassProperty, ClassType, EnumType, MapType, ObjectType, type PrimitiveType, type SetOperationType, type Type, UnionType } from "./Type";
export declare function assertIsObject(t: Type): ObjectType;
export declare function assertIsClass(t: Type): ClassType;
export declare function setOperationMembersRecursively<T extends SetOperationType>(setOperations: T | T[], combinationKind: CombinationKind | undefined): [ReadonlySet<Type>, TypeAttributes];
export declare function makeGroupsToFlatten<T extends SetOperationType>(setOperations: Iterable<T>, include: ((members: ReadonlySet<Type>) => boolean) | undefined): Type[][];
export declare function combineTypeAttributesOfTypes(combinationKind: CombinationKind, types: Iterable<Type>): TypeAttributes;
export declare function isAnyOrNull(t: Type): boolean;
export declare function removeNullFromUnion(t: UnionType, sortBy?: boolean | ((t: Type) => string | number)): [PrimitiveType | null, ReadonlySet<Type>];
export declare function removeNullFromType(t: Type): [PrimitiveType | null, ReadonlySet<Type>];
export declare function nullableFromUnion(t: UnionType): Type | null;
export declare function nonNullTypeCases(t: Type): ReadonlySet<Type>;
export declare function getNullAsOptional(cp: ClassProperty): [boolean, ReadonlySet<Type>];
export declare function isNamedType(t: Type): boolean;
export interface SeparatedNamedTypes {
    enums: ReadonlySet<EnumType>;
    objects: ReadonlySet<ObjectType>;
    unions: ReadonlySet<UnionType>;
}
export declare function separateNamedTypes(types: Iterable<Type>): SeparatedNamedTypes;
export declare function directlyReachableTypes<T>(t: Type, setForType: (t: Type) => ReadonlySet<T> | null): ReadonlySet<T>;
export declare function directlyReachableSingleNamedType(type: Type): Type | undefined;
export declare function stringTypesForType(t: PrimitiveType): StringTypes;
export interface StringTypeMatchers<U> {
    dateTimeType?: (dateTimeType: PrimitiveType) => U;
    dateType?: (dateType: PrimitiveType) => U;
    timeType?: (timeType: PrimitiveType) => U;
}
export declare function matchTypeExhaustive<U>(t: Type, noneType: (noneType: PrimitiveType) => U, anyType: (anyType: PrimitiveType) => U, nullType: (nullType: PrimitiveType) => U, boolType: (boolType: PrimitiveType) => U, integerType: (integerType: PrimitiveType) => U, doubleType: (doubleType: PrimitiveType) => U, stringType: (stringType: PrimitiveType) => U, arrayType: (arrayType: ArrayType) => U, classType: (classType: ClassType) => U, mapType: (mapType: MapType) => U, objectType: (objectType: ObjectType) => U, enumType: (enumType: EnumType) => U, unionType: (unionType: UnionType) => U, transformedStringType: (transformedStringType: PrimitiveType) => U): U;
export declare function matchType<U>(type: Type, anyType: (anyType: PrimitiveType) => U, nullType: (nullType: PrimitiveType) => U, boolType: (boolType: PrimitiveType) => U, integerType: (integerType: PrimitiveType) => U, doubleType: (doubleType: PrimitiveType) => U, stringType: (stringType: PrimitiveType) => U, arrayType: (arrayType: ArrayType) => U, classType: (classType: ClassType) => U, mapType: (mapType: MapType) => U, enumType: (enumType: EnumType) => U, unionType: (unionType: UnionType) => U, transformedStringType?: (transformedStringType: PrimitiveType) => U): U;
export declare function matchCompoundType(t: Type, arrayType: (arrayType: ArrayType) => void, classType: (classType: ClassType) => void, mapType: (mapType: MapType) => void, objectType: (objectType: ObjectType) => void, unionType: (unionType: UnionType) => void): void;
