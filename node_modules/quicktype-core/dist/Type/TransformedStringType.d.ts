import type { TypeAttributes } from "../attributes/TypeAttributes";
import { uriInferenceAttributesProducer } from "../attributes/URIAttributes";
import type { Type } from "./Type";
/**
 * `jsonSchema` is the `format` to be used to represent this string type in
 * JSON Schema.  It's ok to "invent" a new one if the JSON Schema standard doesn't
 * have that particular type yet.
 *
 * For transformed type kinds that map to an existing primitive type, `primitive`
 * must specify that type kind.
 */
export interface TransformedStringTypeTargets {
    attributesProducer?: (s: string) => TypeAttributes;
    jsonSchema: string;
    primitive: PrimitiveNonStringTypeKind | undefined;
}
/**
 * All the transformed string type kinds and the JSON Schema formats and
 * primitive type kinds they map to.  Not all transformed string types map to
 * primitive types.  Date-time types, for example, stand on their own, but
 * stringified integers map to integers.
 */
declare const transformedStringTypeTargetTypeKinds: {
    date: {
        jsonSchema: string;
        primitive: undefined;
    };
    time: {
        jsonSchema: string;
        primitive: undefined;
    };
    "date-time": {
        jsonSchema: string;
        primitive: undefined;
    };
    uuid: {
        jsonSchema: string;
        primitive: undefined;
    };
    uri: {
        jsonSchema: string;
        primitive: undefined;
        attributesProducer: typeof uriInferenceAttributesProducer;
    };
    "integer-string": TransformedStringTypeTargets;
    "bool-string": TransformedStringTypeTargets;
};
export declare const transformedStringTypeTargetTypeKindsMap: Map<string, TransformedStringTypeTargets>;
export type TransformedStringTypeKind = keyof typeof transformedStringTypeTargetTypeKinds;
export type PrimitiveStringTypeKind = "string" | TransformedStringTypeKind;
export type PrimitiveNonStringTypeKind = "none" | "any" | "null" | "bool" | "integer" | "double";
export type PrimitiveTypeKind = PrimitiveNonStringTypeKind | PrimitiveStringTypeKind;
export type NamedTypeKind = "class" | "enum" | "union";
export type TypeKind = PrimitiveTypeKind | NamedTypeKind | "array" | "object" | "map" | "intersection";
export type ObjectTypeKind = "object" | "map" | "class";
export declare const transformedStringTypeKinds: ReadonlySet<TransformedStringTypeKind>;
export declare function isPrimitiveStringTypeKind(kind: string): kind is PrimitiveStringTypeKind;
export declare function targetTypeKindForTransformedStringTypeKind(kind: PrimitiveStringTypeKind): PrimitiveNonStringTypeKind | undefined;
export declare function isNumberTypeKind(kind: TypeKind): kind is "integer" | "double";
export declare function isPrimitiveTypeKind(kind: TypeKind): kind is PrimitiveTypeKind;
export declare function triviallyStructurallyCompatible(x: Type, y: Type): boolean;
export {};
