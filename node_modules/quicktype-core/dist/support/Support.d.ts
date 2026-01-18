import type { JSONSchema } from "../input/JSONSchemaStore";
export interface StringMap {
    [name: string]: any;
}
export declare function isStringMap(x: unknown): x is StringMap;
export declare function isStringMap<T>(x: unknown, checkValue: (v: unknown) => v is T): x is {
    [name: string]: T;
};
export declare function checkString(x: unknown): x is string;
export declare function checkStringMap(x: unknown): StringMap;
export declare function checkStringMap<T>(x: unknown, checkValue: (v: unknown) => v is T): {
    [name: string]: T;
};
export declare function checkArray(x: unknown): unknown[];
export declare function checkArray<T>(x: unknown, checkItem: (v: unknown) => v is T): T[];
export declare function defined<T>(x: T | undefined): T;
export declare function nonNull<T>(x: T | null): T;
export declare function assertNever(x: never): never;
export declare function assert(condition: boolean, message?: string): void;
export declare function panic(message: string): never;
export declare function mustNotHappen(): never;
export declare function repeated<T>(n: number, value: T): T[];
export declare function repeatedCall<T>(n: number, producer: () => T): T[];
export declare function errorMessage(e: unknown): string;
export declare function inflateBase64(encoded: string): string;
export declare function parseJSON(text: string, description: string, address?: string): JSONSchema | undefined;
export declare function indentationString(level: number): string;
export declare function numberEnumValues(e: Record<string | number, string | number>): number[];
