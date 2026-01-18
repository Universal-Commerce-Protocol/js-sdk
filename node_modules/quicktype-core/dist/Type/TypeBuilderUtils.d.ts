import { type PrimitiveStringTypeKind, type TransformedStringTypeKind } from "./TransformedStringType";
export type StringTypeMapping = ReadonlyMap<TransformedStringTypeKind, PrimitiveStringTypeKind>;
export declare function stringTypeMappingGet(stm: StringTypeMapping, kind: TransformedStringTypeKind): PrimitiveStringTypeKind;
export declare function getNoStringTypeMapping(): StringTypeMapping;
