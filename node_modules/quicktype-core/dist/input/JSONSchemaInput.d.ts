import URI from "urijs";
import { type TypeAttributes } from "../attributes/TypeAttributes";
import type { RunContext } from "../Run";
import type { TypeBuilder } from "../Type/TypeBuilder";
import type { Input } from "./Inputs";
import { type JSONSchema, JSONSchemaStore } from "./JSONSchemaStore";
import { type PathElement } from "./PathElement";
export declare class Ref {
    readonly path: readonly PathElement[];
    static root(address: string | undefined): Ref;
    private static parsePath;
    static parseURI(uri: URI, destroyURI?: boolean): Ref;
    static parse(ref: string): Ref;
    addressURI: URI | undefined;
    constructor(addressURI: URI | undefined, path: readonly PathElement[]);
    get hasAddress(): boolean;
    get address(): string;
    get isRoot(): boolean;
    private pushElement;
    push(...keys: string[]): Ref;
    pushObject(): Ref;
    pushType(index: number): Ref;
    resolveAgainst(base: Ref | undefined): Ref;
    get name(): string;
    get definitionName(): string | undefined;
    toString(): string;
    private lookup;
    lookupRef(root: JSONSchema): JSONSchema;
    equals<R extends Ref>(other: R): boolean;
    hashCode(): number;
}
export declare const schemaTypeDict: {
    null: boolean;
    boolean: boolean;
    string: boolean;
    integer: boolean;
    number: boolean;
    array: boolean;
    object: boolean;
};
export type JSONSchemaType = keyof typeof schemaTypeDict;
export interface JSONSchemaAttributes {
    forCases?: TypeAttributes[];
    forNumber?: TypeAttributes;
    forObject?: TypeAttributes;
    forString?: TypeAttributes;
    forType?: TypeAttributes;
    forUnion?: TypeAttributes;
}
export type JSONSchemaAttributeProducer = (schema: JSONSchema, canonicalRef: Ref, types: Set<JSONSchemaType>, unionCases: JSONSchema[] | undefined) => JSONSchemaAttributes | undefined;
export interface JSONSchemaSourceData {
    isConverted?: boolean;
    name: string;
    schema?: string;
    uris?: string[];
}
export declare class JSONSchemaInput implements Input<JSONSchemaSourceData> {
    private _schemaStore;
    private readonly _additionalSchemaAddresses;
    readonly kind: string;
    readonly needSchemaProcessing: boolean;
    private readonly _attributeProducers;
    private readonly _schemaInputs;
    private _schemaSources;
    private readonly _topLevels;
    private _needIR;
    constructor(_schemaStore: JSONSchemaStore | undefined, additionalAttributeProducers?: JSONSchemaAttributeProducer[], _additionalSchemaAddresses?: readonly string[]);
    get needIR(): boolean;
    addTopLevel(name: string, ref: Ref): void;
    addTypes(ctx: RunContext, typeBuilder: TypeBuilder): Promise<void>;
    addTypesSync(): void;
    addSource(schemaSource: JSONSchemaSourceData): Promise<void>;
    addSourceSync(schemaSource: JSONSchemaSourceData): void;
    singleStringSchemaSource(): string | undefined;
}
