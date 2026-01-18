import type { DateTimeRecognizer } from "../DateTime";
import { type TransformedStringTypeKind } from "../Type";
export declare enum Tag {
    Null = 1,
    False = 2,
    True = 3,
    Integer = 4,
    Double = 5,
    InternedString = 6,
    UninternedString = 7,
    Object = 8,
    Array = 9,
    StringFormat = 10,
    TransformedString = 11
}
export type Value = number;
export declare function makeValue(t: Tag, index: number): Value;
export declare function valueTag(v: Value): Tag;
interface Context {
    currentArray: Value[] | undefined;
    currentKey: string | undefined;
    currentNumberIsDouble: boolean;
    currentObject: Value[] | undefined;
}
export declare abstract class CompressedJSON<T> {
    readonly dateTimeRecognizer: DateTimeRecognizer;
    readonly handleRefs: boolean;
    private _rootValue;
    private _ctx;
    private _contextStack;
    private _strings;
    private _stringIndexes;
    private _objects;
    private _arrays;
    constructor(dateTimeRecognizer: DateTimeRecognizer, handleRefs: boolean);
    abstract parse(input: T): Promise<Value>;
    parseSync(_input: T): Value;
    getStringForValue(v: Value): string;
    getObjectForValue: (v: Value) => Value[];
    getArrayForValue: (v: Value) => Value[];
    getStringFormatTypeKind(v: Value): TransformedStringTypeKind;
    protected get context(): Context;
    protected internString(s: string): number;
    protected makeString(s: string): Value;
    protected internObject(obj: Value[]): Value;
    protected internArray: (arr: Value[]) => Value;
    protected get isExpectingRef(): boolean;
    protected commitValue(value: Value): void;
    protected commitNull(): void;
    protected commitBoolean(v: boolean): void;
    protected commitNumber(isDouble: boolean): void;
    protected commitString(s: string): void;
    protected finish(): Value;
    protected pushContext(): void;
    protected pushObjectContext(): void;
    protected setPropertyKey(key: string): void;
    protected finishObject(): void;
    protected pushArrayContext(): void;
    protected finishArray(): void;
    protected popContext(): void;
    equals(other: CompressedJSON<unknown>): boolean;
    hashCode(): number;
}
export declare class CompressedJSONFromString extends CompressedJSON<string> {
    parse(input: string): Promise<Value>;
    parseSync(input: string): Value;
    private process;
}
export {};
