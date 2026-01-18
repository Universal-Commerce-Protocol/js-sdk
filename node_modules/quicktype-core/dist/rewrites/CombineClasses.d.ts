import type { RunContext } from "../Run";
import type { TypeGraph } from "../Type/TypeGraph";
export declare function combineClasses(ctx: RunContext, graph: TypeGraph, alphabetizeProperties: boolean, conflateNumbers: boolean, onlyWithSameProperties: boolean, debugPrintReconstitution: boolean): TypeGraph;
