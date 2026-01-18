import type { AnnotationData } from "./Annotation";
import { Name } from "./Naming";
export type Source = TextSource | NewlineSource | SequenceSource | TableSource | AnnotatedSource | NameSource | ModifiedSource;
export interface TextSource {
    kind: "text";
    text: string;
}
export interface NewlineSource {
    indentationChange: number;
    kind: "newline";
}
export interface SequenceSource {
    kind: "sequence";
    sequence: readonly Source[];
}
export interface TableSource {
    kind: "table";
    table: ReadonlyArray<readonly Source[]>;
}
export interface AnnotatedSource {
    annotation: AnnotationData;
    kind: "annotated";
    source: Source;
}
export interface NameSource {
    kind: "name";
    named: Name;
}
export interface ModifiedSource {
    kind: "modified";
    modifier: (serialized: string) => string;
    source: Source;
}
export declare function newline(): NewlineSource;
export type Sourcelike = Source | string | Name | SourcelikeArray;
export type SourcelikeArray = Sourcelike[];
export declare function sourcelikeToSource(sl: Sourcelike): Source;
export declare function annotated(annotation: AnnotationData, sl: Sourcelike): Source;
export declare function maybeAnnotated(doAnnotate: boolean, annotation: AnnotationData, sl: Sourcelike): Sourcelike;
export declare function modifySource(modifier: (serialized: string) => string, sl: Sourcelike): Sourcelike;
export interface Location {
    column: number;
    line: number;
}
export interface Span {
    end: Location;
    start: Location;
}
export interface Annotation {
    annotation: AnnotationData;
    span: Span;
}
export interface SerializedRenderResult {
    annotations: readonly Annotation[];
    lines: string[];
}
export declare function serializeRenderResult(rootSource: Source, names: ReadonlyMap<Name, string>, indentation: string): SerializedRenderResult;
export interface MultiWord {
    needsParens: boolean;
    source: Sourcelike;
}
export declare function singleWord(...source: Sourcelike[]): MultiWord;
export declare function multiWord(separator: Sourcelike, ...words: Sourcelike[]): MultiWord;
export declare function parenIfNeeded({ source, needsParens }: MultiWord): Sourcelike;
