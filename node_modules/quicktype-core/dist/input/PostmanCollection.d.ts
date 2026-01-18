import type { JSONSourceData } from "./Inputs";
export declare function sourcesFromPostmanCollection(collectionJSON: string, collectionJSONAddress?: string): {
    description: string | undefined;
    sources: Array<JSONSourceData<string>>;
};
