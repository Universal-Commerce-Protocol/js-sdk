import type { StringTypeMapping } from "../Type/TypeBuilderUtils";
import type { TypeGraph } from "../Type/TypeGraph";
export declare function resolveIntersections(graph: TypeGraph, stringTypeMapping: StringTypeMapping, debugPrintReconstitution: boolean): [TypeGraph, boolean];
