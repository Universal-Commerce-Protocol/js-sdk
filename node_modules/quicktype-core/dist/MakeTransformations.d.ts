import type { RunContext } from "./Run";
import type { TargetLanguage } from "./TargetLanguage";
import type { TypeGraph } from "./Type/TypeGraph";
export declare function makeTransformations(ctx: RunContext, graph: TypeGraph, targetLanguage: TargetLanguage): TypeGraph;
