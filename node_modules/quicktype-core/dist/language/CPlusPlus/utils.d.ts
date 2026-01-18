import { type MinMaxConstraint } from "../../attributes/Constraints";
import type { Name } from "../../Naming";
import type { Sourcelike } from "../../Source";
import type { Type, TypeKind } from "../../Type";
export declare function constraintsForType(t: Type): {
    minMax?: MinMaxConstraint;
    minMaxLength?: MinMaxConstraint;
    pattern?: string;
} | undefined;
export declare const legalizeName: (s: string) => string;
export declare const optionalAsSharedType = "std::shared_ptr";
export declare const optionalFactoryAsSharedType = "std::make_shared";
/**
 * To be able to support circles in multiple files -
 * e.g. class#A using class#B using class#A (obviously not directly,
 * but in vector or in variant) we can forward declare them;
 */
export declare enum IncludeKind {
    ForwardDeclare = "ForwardDeclare",
    Include = "Include"
}
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
export declare enum MemberNames {
    MinIntValue = 1,
    GetMinIntValue = 2,
    SetMinIntValue = 3,
    MaxIntValue = 4,
    GetMaxIntValue = 5,
    SetMaxIntValue = 6,
    MinDoubleValue = 7,
    GetMinDoubleValue = 8,
    SetMinDoubleValue = 9,
    MaxDoubleValue = 10,
    GetMaxDoubleValue = 11,
    SetMaxDoubleValue = 12,
    MinLength = 13,
    GetMinLength = 14,
    SetMinLength = 15,
    MaxLength = 16,
    GetMaxLength = 17,
    SetMaxLength = 18,
    Pattern = 19,
    GetPattern = 20,
    SetPattern = 21
}
export interface ConstraintMember {
    cppConstType?: string;
    cppType: string;
    getter: MemberNames;
    name: MemberNames;
    setter: MemberNames;
}
export interface IncludeRecord {
    kind: IncludeKind | undefined /** How to include that */;
    typeKind: TypeKind | undefined /** What exactly to include */;
}
export interface TypeRecord {
    forceInclude: boolean;
    level: number;
    name: Name;
    type: Type;
    variant: boolean;
}
/**
 * We map each and every unique type to a include kind, e.g. how
 * to include the given type
 */
export type IncludeMap = Map<string, IncludeRecord>;
export interface TypeContext {
    inJsonNamespace: boolean;
    needsForwardIndirection: boolean;
    needsOptionalIndirection: boolean;
}
export interface StringType {
    createStringLiteral: (inner: Sourcelike) => Sourcelike;
    emitHelperFunctions: () => void;
    getConstType: () => string;
    getRegex: () => string;
    getSMatch: () => string;
    getType: () => string;
    wrapEncodingChange: (qualifier: Sourcelike[], fromType: Sourcelike, toType: Sourcelike, inner: Sourcelike) => Sourcelike;
    wrapToString: (inner: Sourcelike) => Sourcelike;
}
export declare function addQualifier(qualifier: Sourcelike, qualified: Sourcelike[]): Sourcelike[];
export declare class WrappingCode {
    private readonly start;
    private readonly end;
    constructor(start: Sourcelike[], end: Sourcelike[]);
    wrap(qualifier: Sourcelike, inner: Sourcelike): Sourcelike;
}
export declare class BaseString {
    _stringType: string;
    _constStringType: string;
    _smatch: string;
    _regex: string;
    _stringLiteralPrefix: string;
    _toString: WrappingCode;
    _encodingClass: Sourcelike;
    _encodingFunction: Sourcelike;
    constructor(stringType: string, constStringType: string, smatch: string, regex: string, stringLiteralPrefix: string, toString: WrappingCode, encodingClass: string, encodingFunction: string);
    getType(): string;
    getConstType(): string;
    getSMatch(): string;
    getRegex(): string;
    createStringLiteral(inner: Sourcelike): Sourcelike;
    wrapToString(inner: Sourcelike): Sourcelike;
}
