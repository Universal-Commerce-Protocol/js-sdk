import type { TypeAttributes } from "../attributes/TypeAttributes";
import { type TypeNames } from "../attributes/TypeNames";
import type { BaseGraphRewriteBuilder, TypeReconstituter } from "../GraphRewriting";
import { type ObjectTypeKind, type PrimitiveTypeKind, type TypeKind } from "./TransformedStringType";
import type { TypeGraph } from "./TypeGraph";
import { type TypeRef } from "./TypeRef";
export declare class TypeIdentity {
    private readonly _kind;
    private readonly _components;
    private readonly _hashCode;
    constructor(_kind: TypeKind, _components: readonly unknown[]);
    equals<T extends TypeIdentity>(other: T): boolean;
    hashCode(): number;
}
export type MaybeTypeIdentity = TypeIdentity | undefined;
export declare abstract class Type {
    readonly typeRef: TypeRef;
    protected readonly graph: TypeGraph;
    abstract readonly kind: TypeKind;
    constructor(typeRef: TypeRef, graph: TypeGraph);
    get index(): number;
    abstract getNonAttributeChildren(): Set<Type>;
    getChildren(): ReadonlySet<Type>;
    getAttributes(): TypeAttributes;
    get hasNames(): boolean;
    getNames(): TypeNames;
    getCombinedName(): string;
    abstract get isNullable(): boolean;
    abstract isPrimitive(): this is PrimitiveType;
    abstract get identity(): MaybeTypeIdentity;
    abstract reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>, canonicalOrder: boolean): void;
    get debugPrintKind(): string;
    equals<T extends Type>(other: T): boolean;
    hashCode(): number;
    protected abstract structuralEqualityStep(other: Type, conflateNumbers: boolean, queue: (a: Type, b: Type) => boolean): boolean;
    structurallyCompatible(other: Type, conflateNumbers?: boolean): boolean;
    getParentTypes(): ReadonlySet<Type>;
    getAncestorsNotInSet(set: ReadonlySet<TypeRef>): ReadonlySet<Type>;
}
export declare function primitiveTypeIdentity(kind: PrimitiveTypeKind, attributes: TypeAttributes): MaybeTypeIdentity;
export declare class PrimitiveType extends Type {
    readonly kind: PrimitiveTypeKind;
    constructor(typeRef: TypeRef, graph: TypeGraph, kind: PrimitiveTypeKind);
    get isNullable(): boolean;
    isPrimitive(): this is PrimitiveType;
    getNonAttributeChildren(): Set<Type>;
    get identity(): MaybeTypeIdentity;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>): void;
    protected structuralEqualityStep(_other: Type, _conflateNumbers: boolean, _queue: (a: Type, b: Type) => boolean): boolean;
}
export declare function arrayTypeIdentity(attributes: TypeAttributes, itemsRef: TypeRef): MaybeTypeIdentity;
export declare class ArrayType extends Type {
    private _itemsRef?;
    readonly kind = "array";
    constructor(typeRef: TypeRef, graph: TypeGraph, _itemsRef?: TypeRef | undefined);
    setItems(itemsRef: TypeRef): void;
    private getItemsRef;
    get items(): Type;
    getNonAttributeChildren(): Set<Type>;
    get isNullable(): boolean;
    isPrimitive(): this is PrimitiveType;
    get identity(): MaybeTypeIdentity;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>): void;
    protected structuralEqualityStep(other: ArrayType, _conflateNumbers: boolean, queue: (a: Type, b: Type) => boolean): boolean;
}
export declare class GenericClassProperty<T> {
    readonly typeData: T;
    readonly isOptional: boolean;
    constructor(typeData: T, isOptional: boolean);
    equals(other: GenericClassProperty<unknown>): boolean;
    hashCode(): number;
}
export declare class ClassProperty extends GenericClassProperty<TypeRef> {
    readonly graph: TypeGraph;
    constructor(typeRef: TypeRef, graph: TypeGraph, isOptional: boolean);
    get typeRef(): TypeRef;
    get type(): Type;
}
export declare function classTypeIdentity(attributes: TypeAttributes, properties: ReadonlyMap<string, ClassProperty>): MaybeTypeIdentity;
export declare function mapTypeIdentify(attributes: TypeAttributes, additionalPropertiesRef: TypeRef | undefined): MaybeTypeIdentity;
export declare class ObjectType extends Type {
    readonly kind: ObjectTypeKind;
    readonly isFixed: boolean;
    private _properties;
    private _additionalPropertiesRef;
    constructor(typeRef: TypeRef, graph: TypeGraph, kind: ObjectTypeKind, isFixed: boolean, _properties: ReadonlyMap<string, ClassProperty> | undefined, _additionalPropertiesRef: TypeRef | undefined);
    setProperties(properties: ReadonlyMap<string, ClassProperty>, additionalPropertiesRef: TypeRef | undefined): void;
    getProperties(): ReadonlyMap<string, ClassProperty>;
    getSortedProperties(): ReadonlyMap<string, ClassProperty>;
    private getAdditionalPropertiesRef;
    getAdditionalProperties(): Type | undefined;
    getNonAttributeChildren(): Set<Type>;
    get isNullable(): boolean;
    isPrimitive(): this is PrimitiveType;
    get identity(): MaybeTypeIdentity;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>, canonicalOrder: boolean): void;
    protected structuralEqualityStep(other: ObjectType, _conflateNumbers: boolean, queue: (a: Type, b: Type) => boolean): boolean;
}
export declare class ClassType extends ObjectType {
    constructor(typeRef: TypeRef, graph: TypeGraph, isFixed: boolean, properties: ReadonlyMap<string, ClassProperty> | undefined);
}
export declare class MapType extends ObjectType {
    constructor(typeRef: TypeRef, graph: TypeGraph, valuesRef: TypeRef | undefined);
    get values(): Type;
}
export declare function enumTypeIdentity(attributes: TypeAttributes, cases: ReadonlySet<string>): MaybeTypeIdentity;
export declare class EnumType extends Type {
    readonly cases: ReadonlySet<string>;
    readonly kind = "enum";
    constructor(typeRef: TypeRef, graph: TypeGraph, cases: ReadonlySet<string>);
    get isNullable(): boolean;
    isPrimitive(): this is PrimitiveType;
    get identity(): MaybeTypeIdentity;
    getNonAttributeChildren(): Set<Type>;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>): void;
    protected structuralEqualityStep(other: EnumType, _conflateNumbers: boolean, _queue: (a: Type, b: Type) => void): boolean;
}
export declare function setOperationCasesEqual(typesA: Iterable<Type>, typesB: Iterable<Type>, conflateNumbers: boolean, membersEqual: (a: Type, b: Type) => boolean): boolean;
export declare function setOperationTypeIdentity(kind: TypeKind, attributes: TypeAttributes, memberRefs: ReadonlySet<TypeRef>): MaybeTypeIdentity;
export declare function unionTypeIdentity(attributes: TypeAttributes, memberRefs: ReadonlySet<TypeRef>): MaybeTypeIdentity;
export declare function intersectionTypeIdentity(attributes: TypeAttributes, memberRefs: ReadonlySet<TypeRef>): MaybeTypeIdentity;
export declare abstract class SetOperationType extends Type {
    readonly kind: TypeKind;
    private _memberRefs?;
    constructor(typeRef: TypeRef, graph: TypeGraph, kind: TypeKind, _memberRefs?: ReadonlySet<TypeRef> | undefined);
    setMembers(memberRefs: ReadonlySet<TypeRef>): void;
    protected getMemberRefs(): ReadonlySet<TypeRef>;
    get members(): ReadonlySet<Type>;
    get sortedMembers(): ReadonlySet<Type>;
    getNonAttributeChildren(): Set<Type>;
    isPrimitive(): this is PrimitiveType;
    get identity(): MaybeTypeIdentity;
    protected reconstituteSetOperation<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>, canonicalOrder: boolean, getType: (members: ReadonlySet<TypeRef> | undefined) => void): void;
    protected structuralEqualityStep(other: SetOperationType, conflateNumbers: boolean, queue: (a: Type, b: Type) => boolean): boolean;
}
export declare class IntersectionType extends SetOperationType {
    constructor(typeRef: TypeRef, graph: TypeGraph, memberRefs?: ReadonlySet<TypeRef>);
    get isNullable(): boolean;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>, canonicalOrder: boolean): void;
}
export declare class UnionType extends SetOperationType {
    constructor(typeRef: TypeRef, graph: TypeGraph, memberRefs?: ReadonlySet<TypeRef>);
    setMembers(memberRefs: ReadonlySet<TypeRef>): void;
    get stringTypeMembers(): ReadonlySet<Type>;
    findMember(kind: TypeKind): Type | undefined;
    get isNullable(): boolean;
    get isCanonical(): boolean;
    reconstitute<T extends BaseGraphRewriteBuilder>(builder: TypeReconstituter<T>, canonicalOrder: boolean): void;
}
