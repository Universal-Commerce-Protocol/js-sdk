import { type TypeAttributes } from "./attributes/TypeAttributes";
import type { BaseGraphRewriteBuilder, GraphRewriteBuilder, TypeLookerUp } from "./GraphRewriting";
import { type Type } from "./Type/Type";
import type { TypeBuilder } from "./Type/TypeBuilder";
import { type TypeRef } from "./Type/TypeRef";
import { UnionBuilder } from "./UnionBuilder";
export declare class UnifyUnionBuilder extends UnionBuilder<BaseGraphRewriteBuilder, TypeRef[], TypeRef[]> {
    private readonly _makeObjectTypes;
    private readonly _makeClassesFixed;
    private readonly _unifyTypes;
    constructor(typeBuilder: BaseGraphRewriteBuilder, _makeObjectTypes: boolean, _makeClassesFixed: boolean, _unifyTypes: (typesToUnify: TypeRef[]) => TypeRef);
    protected makeObject(objectRefs: TypeRef[], typeAttributes: TypeAttributes, forwardingRef: TypeRef | undefined): TypeRef;
    protected makeArray(arrays: TypeRef[], typeAttributes: TypeAttributes, forwardingRef: TypeRef | undefined): TypeRef;
}
export declare function unionBuilderForUnification<T extends Type>(typeBuilder: GraphRewriteBuilder<T>, makeObjectTypes: boolean, makeClassesFixed: boolean, conflateNumbers: boolean): UnionBuilder<TypeBuilder & TypeLookerUp, TypeRef[], TypeRef[]>;
export declare function unifyTypes<T extends Type>(types: ReadonlySet<Type>, typeAttributes: TypeAttributes, typeBuilder: GraphRewriteBuilder<T>, unionBuilder: UnionBuilder<TypeBuilder & TypeLookerUp, TypeRef[], TypeRef[]>, conflateNumbers: boolean, maybeForwardingRef?: TypeRef): TypeRef;
