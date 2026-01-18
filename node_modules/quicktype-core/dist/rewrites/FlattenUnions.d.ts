import type { StringTypeMapping } from "../Type/TypeBuilderUtils";
import type { TypeGraph } from "../Type/TypeGraph";
export declare function flattenUnions(graph: TypeGraph, stringTypeMapping: StringTypeMapping, conflateNumbers: boolean, makeObjectTypes: boolean, debugPrintReconstitution: boolean): [TypeGraph, boolean];
