import type { StringTypeMapping } from "../Type/TypeBuilderUtils";
import type { TypeGraph } from "../Type/TypeGraph";
export declare function inferMaps(graph: TypeGraph, stringTypeMapping: StringTypeMapping, conflateNumbers: boolean, debugPrintReconstitution: boolean): TypeGraph;
