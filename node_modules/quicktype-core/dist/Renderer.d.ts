import { type AnnotationData } from "./Annotation";
import { type Name, type Namespace } from "./Naming";
import { type Source, type Sourcelike } from "./Source";
import type { Comment } from "./support/Comments";
import type { TargetLanguage } from "./TargetLanguage";
import type { TypeGraph } from "./Type/TypeGraph";
export interface RenderResult {
    names: ReadonlyMap<Name, string>;
    sources: ReadonlyMap<string, Source>;
}
export type BlankLinePosition = "none" | "interposing" | "leading" | "leading-and-interposing";
export type BlankLineConfig = BlankLinePosition | [BlankLinePosition, number];
export interface RenderContext {
    leadingComments?: Comment[];
    typeGraph: TypeGraph;
}
export type ForEachPosition = "first" | "last" | "middle" | "only";
export declare abstract class Renderer {
    protected readonly targetLanguage: TargetLanguage;
    protected readonly typeGraph: TypeGraph;
    protected readonly leadingComments: Comment[] | undefined;
    private _names;
    private readonly _finishedFiles;
    private readonly _finishedEmitContexts;
    private _emitContext;
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext);
    ensureBlankLine(numBlankLines?: number): void;
    protected preventBlankLine(): void;
    protected emitItem(item: Sourcelike): void;
    protected emitItemOnce(item: Sourcelike): boolean;
    protected emitLineOnce(...lineParts: Sourcelike[]): void;
    emitLine(...lineParts: Sourcelike[]): void;
    protected emitMultiline(linesString: string): void;
    protected gatherSource(emitter: () => void): Sourcelike[];
    protected emitGatheredSource(items: Sourcelike[]): void;
    protected emitAnnotated(annotation: AnnotationData, emitter: () => void): void;
    protected emitIssue(message: string, emitter: () => void): void;
    protected emitTable: (tableArray: Sourcelike[][]) => void;
    protected changeIndent(offset: number): void;
    protected iterableForEach<T>(iterable: Iterable<T>, emitter: (v: T, position: ForEachPosition) => void): void;
    protected forEach<K, V>(iterable: Iterable<[K, V]>, interposedBlankLines: number, leadingBlankLines: number, emitter: (v: V, k: K, position: ForEachPosition) => void): boolean;
    protected forEachWithBlankLines<K, V>(iterable: Iterable<[K, V]>, blankLineConfig: BlankLineConfig, emitter: (v: V, k: K, position: ForEachPosition) => void): boolean;
    indent(fn: () => void): void;
    protected abstract setUpNaming(): Iterable<Namespace>;
    protected abstract emitSource(givenOutputFilename: string): void;
    protected assignNames(): ReadonlyMap<Name, string>;
    protected initializeEmitContextForFilename(filename: string): void;
    protected finishFile(filename: string): void;
    render(givenOutputFilename: string): RenderResult;
    get names(): ReadonlyMap<Name, string>;
}
