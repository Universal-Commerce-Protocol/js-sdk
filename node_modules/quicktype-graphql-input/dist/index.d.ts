import { type Input, type RunContext, type TypeBuilder } from "quicktype-core";
export interface GraphQLSourceData {
    name: string;
    query: string;
    schema: any;
}
export declare class GraphQLInput implements Input<GraphQLSourceData> {
    readonly kind: string;
    readonly needIR: boolean;
    readonly needSchemaProcessing: boolean;
    private readonly _topLevels;
    addSource(source: GraphQLSourceData): Promise<void>;
    addSourceSync(source: GraphQLSourceData): void;
    singleStringSchemaSource(): undefined;
    addTypes(ctx: RunContext, typeBuilder: TypeBuilder): Promise<void>;
    addTypesSync(_ctx: RunContext, typeBuilder: TypeBuilder): void;
}
