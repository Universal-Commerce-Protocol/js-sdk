import type { StringTypeMapping } from "./TypeBuilderUtils";
import type { TypeGraph } from "./TypeGraph";
export declare function noneToAny(graph: TypeGraph, stringTypeMapping: StringTypeMapping, debugPrintReconstitution: boolean): TypeGraph;
export declare function optionalToNullable(graph: TypeGraph, stringTypeMapping: StringTypeMapping, debugPrintReconstitution: boolean): TypeGraph;
export declare function removeIndirectionIntersections(graph: TypeGraph, stringTypeMapping: StringTypeMapping, debugPrintRemapping: boolean): TypeGraph;
