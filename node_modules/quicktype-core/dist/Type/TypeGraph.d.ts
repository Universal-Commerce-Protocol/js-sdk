import { type TypeAttributeKind, type TypeAttributes } from "../attributes/TypeAttributes";
import { Graph } from "../Graph";
import { GraphRewriteBuilder } from "../GraphRewriting";
import type { Type } from "./Type";
import type { TypeBuilder } from "./TypeBuilder";
import { type StringTypeMapping } from "./TypeBuilderUtils";
import { type TypeRef } from "./TypeRef";
import { type SeparatedNamedTypes } from "./TypeUtils";
export declare class TypeAttributeStore {
    private readonly _typeGraph;
    private _values;
    private readonly _topLevelValues;
    constructor(_typeGraph: TypeGraph, _values: Array<TypeAttributes | undefined>);
    private getTypeIndex;
    attributesForType(t: Type): TypeAttributes;
    attributesForTopLevel(name: string): TypeAttributes;
    setInMap<T>(attributes: TypeAttributes, kind: TypeAttributeKind<T>, value: T): TypeAttributes;
    set<T>(kind: TypeAttributeKind<T>, t: Type, value: T): void;
    setForTopLevel<T>(kind: TypeAttributeKind<T>, topLevelName: string, value: T): void;
    tryGetInMap<T>(attributes: TypeAttributes, kind: TypeAttributeKind<T>): T | undefined;
    tryGet<T>(kind: TypeAttributeKind<T>, t: Type): T | undefined;
    tryGetForTopLevel<T>(kind: TypeAttributeKind<T>, topLevelName: string): T | undefined;
}
export declare class TypeAttributeStoreView<T> {
    private readonly _attributeStore;
    private readonly _definition;
    constructor(_attributeStore: TypeAttributeStore, _definition: TypeAttributeKind<T>);
    set(t: Type, value: T): void;
    setForTopLevel(name: string, value: T): void;
    tryGet(t: Type): T | undefined;
    get(t: Type): T;
    tryGetForTopLevel(name: string): T | undefined;
    getForTopLevel(name: string): T;
}
export declare class TypeGraph {
    readonly serial: number;
    private readonly _haveProvenanceAttributes;
    private _typeBuilder?;
    private _attributeStore;
    private _topLevels;
    private _types?;
    private _parents;
    private _printOnRewrite;
    constructor(typeBuilder: TypeBuilder, serial: number, _haveProvenanceAttributes: boolean);
    private get isFrozen();
    get attributeStore(): TypeAttributeStore;
    freeze(topLevels: ReadonlyMap<string, TypeRef>, types: Type[], typeAttributes: Array<TypeAttributes | undefined>): void;
    get topLevels(): ReadonlyMap<string, Type>;
    typeAtIndex(index: number): Type;
    atIndex(index: number): [Type, TypeAttributes];
    private filterTypes;
    allNamedTypes(): ReadonlySet<Type>;
    allNamedTypesSeparated(): SeparatedNamedTypes;
    private allProvenance;
    setPrintOnRewrite(): void;
    private checkLostTypeAttributes;
    private printRewrite;
    rewrite<T extends Type>(title: string, stringTypeMapping: StringTypeMapping, alphabetizeProperties: boolean, replacementGroups: T[][], debugPrintReconstitution: boolean, replacer: (typesToReplace: ReadonlySet<T>, builder: GraphRewriteBuilder<T>, forwardingRef: TypeRef) => TypeRef, force?: boolean): TypeGraph;
    remap(title: string, stringTypeMapping: StringTypeMapping, alphabetizeProperties: boolean, map: ReadonlyMap<Type, Type>, debugPrintRemapping: boolean, force?: boolean): TypeGraph;
    garbageCollect(alphabetizeProperties: boolean, debugPrintReconstitution: boolean): TypeGraph;
    rewriteFixedPoint(alphabetizeProperties: boolean, debugPrintReconstitution: boolean): TypeGraph;
    allTypesUnordered(): ReadonlySet<Type>;
    makeGraph(invertDirection: boolean, childrenOfType: (t: Type) => ReadonlySet<Type>): Graph<Type>;
    getParentsOfType(t: Type): Set<Type>;
    printGraph(): void;
}
