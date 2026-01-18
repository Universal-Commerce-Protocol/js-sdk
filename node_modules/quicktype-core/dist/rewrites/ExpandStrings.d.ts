import type { RunContext } from "../Run";
import type { TypeGraph } from "../Type/TypeGraph";
export type EnumInference = "none" | "all" | "infer";
export declare function expandStrings(ctx: RunContext, graph: TypeGraph, inference: EnumInference): TypeGraph;
