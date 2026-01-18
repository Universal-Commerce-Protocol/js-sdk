import type { Sourcelike } from "../../Source";
import type { Transformation } from "../../Transformers";
import { type PrimitiveType, type Type } from "../../Type";
export declare enum AccessModifier {
    None = "None",
    Public = "Public",
    Internal = "Internal"
}
export declare function noFollow(t: Type): Type;
export declare function needTransformerForType(t: Type): "automatic" | "manual" | "nullable" | "none";
export declare function alwaysApplyTransformation(xf: Transformation): boolean;
/**
 * The C# type for a given transformed string type.
 */
export declare function csTypeForTransformedStringType(t: PrimitiveType): Sourcelike;
export declare const namingFunction: import("../../Naming").Namer;
export declare const namingFunctionKeep: import("../../Naming").Namer;
export declare const denseJsonPropertyName = "J";
export declare const denseRequiredEnumName = "R";
export declare const denseNullValueHandlingEnumName = "N";
export declare function isStartCharacter(utf16Unit: number): boolean;
export declare function csNameStyle(original: string): string;
export declare function isValueType(t: Type): boolean;
