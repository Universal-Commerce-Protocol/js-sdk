import type { Name } from "../../Naming";
import { type Sourcelike } from "../../Source";
import type { ClassType, EnumType, Type } from "../../Type";
import type { JavaScriptTypeAnnotations } from "../JavaScript";
import { TypeScriptFlowBaseRenderer } from "./TypeScriptFlowBaseRenderer";
export declare class TypeScriptRenderer extends TypeScriptFlowBaseRenderer {
    protected forbiddenNamesForGlobalNamespace(): string[];
    protected deserializerFunctionLine(t: Type, name: Name): Sourcelike;
    protected serializerFunctionLine(t: Type, name: Name): Sourcelike;
    protected get moduleLine(): string | undefined;
    protected get typeAnnotations(): JavaScriptTypeAnnotations;
    protected emitModuleExports(): void;
    protected emitUsageImportComment(): void;
    protected emitEnum(e: EnumType, enumName: Name): void;
    protected emitClassBlock(c: ClassType, className: Name): void;
}
