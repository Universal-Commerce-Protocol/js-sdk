import type { RunContext } from "../Run";
import type { TargetLanguage } from "../TargetLanguage";
import type { TypeBuilder } from "../Type/TypeBuilder";
import type { LanguageName } from "../types";
import { type CompressedJSON } from "./CompressedJSON";
export interface Input<T> {
    addSource: (source: T) => Promise<void>;
    addSourceSync: (source: T) => void;
    addTypes: (ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean) => Promise<void>;
    addTypesSync: (ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean) => void;
    readonly kind: string;
    readonly needIR: boolean;
    readonly needSchemaProcessing: boolean;
    singleStringSchemaSource: () => string | undefined;
}
export interface JSONSourceData<T> {
    description?: string;
    name: string;
    samples: T[];
}
export declare class JSONInput<T> implements Input<JSONSourceData<T>> {
    private readonly _compressedJSON;
    readonly kind: string;
    readonly needIR: boolean;
    readonly needSchemaProcessing: boolean;
    private readonly _topLevels;
    constructor(_compressedJSON: CompressedJSON<T>);
    private addSample;
    private setDescription;
    private addSamples;
    addSource(source: JSONSourceData<T>): Promise<void>;
    addSourceSync(source: JSONSourceData<T>): void;
    singleStringSchemaSource(): undefined;
    addTypes(ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean): Promise<void>;
    addTypesSync(_ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean): void;
}
export declare function jsonInputForTargetLanguage(targetLanguage: LanguageName | TargetLanguage, languages?: TargetLanguage[], handleJSONRefs?: boolean): JSONInput<string>;
export declare class InputData {
    private _inputs;
    addInput<T>(input: Input<T>): void;
    private getOrAddInput;
    addSource<T>(kind: string, source: T, makeInput: () => Input<T>): Promise<void>;
    addSourceSync<T>(kind: string, source: T, makeInput: () => Input<T>): void;
    addTypes(ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean): Promise<void>;
    addTypesSync(ctx: RunContext, typeBuilder: TypeBuilder, inferMaps: boolean, inferEnums: boolean, fixedTopLevels: boolean): void;
    get needIR(): boolean;
    get needSchemaProcessing(): boolean;
    singleStringSchemaSource(): string | undefined;
}
