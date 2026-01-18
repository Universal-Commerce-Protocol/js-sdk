import { type Name, type Namer } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import { type MultiWord, type Sourcelike } from "../../Source";
import type { TargetLanguage } from "../../TargetLanguage";
import { type ClassType, EnumType, type Type, UnionType } from "../../Type";
import { JavaScriptRenderer, type JavaScriptTypeAnnotations } from "../JavaScript";
import type { tsFlowOptions } from "./language";
export declare abstract class TypeScriptFlowBaseRenderer extends JavaScriptRenderer {
    protected readonly _tsFlowOptions: OptionValues<typeof tsFlowOptions>;
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _tsFlowOptions: OptionValues<typeof tsFlowOptions>);
    protected namerForObjectProperty(): Namer;
    protected sourceFor(t: Type): MultiWord;
    protected abstract emitEnum(e: EnumType, enumName: Name): void;
    protected abstract emitClassBlock(c: ClassType, className: Name): void;
    protected emitClassBlockBody(c: ClassType): void;
    private emitClass;
    protected emitUnion(u: UnionType, unionName: Name): void;
    protected emitTypes(): void;
    protected emitUsageComments(): void;
    protected deserializerFunctionLine(t: Type, name: Name): Sourcelike;
    protected serializerFunctionLine(t: Type, name: Name): Sourcelike;
    protected get moduleLine(): string | undefined;
    protected get castFunctionLines(): [string, string];
    protected get typeAnnotations(): JavaScriptTypeAnnotations;
    protected emitConvertModule(): void;
    protected emitConvertModuleHelpers(): void;
    protected emitModuleExports(): void;
}
