export type SubTrie = number | null | Trie;
export interface Trie {
    arr: SubTrie[];
    count: number;
}
export interface MarkovChain {
    depth: number;
    trie: Trie;
}
export declare function train(lines: string[], depth: number): MarkovChain;
export declare function load(): MarkovChain;
export declare function evaluateFull(mc: MarkovChain, word: string): [number, number[]];
export declare function evaluate(mc: MarkovChain, word: string): number;
export declare function generate(mc: MarkovChain, state: string, unseenWeight: number): string;
export declare function test(): void;
