import type { StringTypeMapping } from "../Type/TypeBuilderUtils";
import type { TypeGraph } from "../Type/TypeGraph";
export declare function replaceObjectType(graph: TypeGraph, stringTypeMapping: StringTypeMapping, _conflateNumbers: boolean, leaveFullObjects: boolean, debugPrintReconstitution: boolean): TypeGraph;
