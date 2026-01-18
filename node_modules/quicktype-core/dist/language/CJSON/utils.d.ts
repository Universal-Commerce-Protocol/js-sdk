import type { Name } from "../../Naming";
import type { Sourcelike } from "../../Source";
import type { Type, TypeKind } from "../../Type";
export declare const legalizeName: (s: string) => string;
export declare enum GlobalNames {
    ClassMemberConstraints = 1,
    ClassMemberConstraintException = 2,
    ValueTooLowException = 3,
    ValueTooHighException = 4,
    ValueTooShortException = 5,
    ValueTooLongException = 6,
    InvalidPatternException = 7,
    CheckConstraint = 8
}
export declare enum IncludeKind {
    ForwardDeclare = "ForwardDeclare",
    Include = "Include"
}
export interface IncludeRecord {
    kind: IncludeKind | undefined;
    typeKind: TypeKind | undefined;
}
export interface TypeRecord {
    forceInclude: boolean;
    level: number;
    name: Name;
    type: Type;
    variant: boolean;
}
export type IncludeMap = Map<string, IncludeRecord>;
export interface TypeCJSON {
    addToObject: Sourcelike;
    cType: Sourcelike;
    cjsonType: string;
    createObject: Sourcelike;
    deleteType: Sourcelike;
    getValue: Sourcelike;
    isNullable: boolean;
    isType: Sourcelike;
    items: TypeCJSON | undefined;
    optionalQualifier: string;
}
