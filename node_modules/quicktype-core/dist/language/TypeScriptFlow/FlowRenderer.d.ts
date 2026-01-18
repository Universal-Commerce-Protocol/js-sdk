import type { Name } from "../../Naming";
import type { ClassType, EnumType } from "../../Type";
import type { JavaScriptTypeAnnotations } from "../JavaScript";
import { TypeScriptFlowBaseRenderer } from "./TypeScriptFlowBaseRenderer";
export declare class FlowRenderer extends TypeScriptFlowBaseRenderer {
    protected forbiddenNamesForGlobalNamespace(): string[];
    protected get typeAnnotations(): JavaScriptTypeAnnotations;
    protected emitEnum(e: EnumType, enumName: Name): void;
    protected emitClassBlock(c: ClassType, className: Name): void;
    protected emitSourceStructure(): void;
}
