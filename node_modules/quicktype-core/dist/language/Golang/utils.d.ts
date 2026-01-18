import type { ClassProperty, Type, TypeKind } from "../../Type";
export declare const namingFunction: import("../../Naming").Namer;
export declare const primitiveValueTypeKinds: TypeKind[];
export declare const compoundTypeKinds: TypeKind[];
export declare function isValueType(t: Type): boolean;
export declare function canOmitEmpty(cp: ClassProperty, omitEmptyOption: boolean): boolean;
