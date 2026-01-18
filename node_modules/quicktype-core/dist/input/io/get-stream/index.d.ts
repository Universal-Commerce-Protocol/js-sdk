import type { Readable } from "readable-stream";
export interface Options {
    array?: boolean;
    encoding?: string;
    maxBuffer?: number;
}
export declare function getStream(inputStream: Readable, opts?: Options): Promise<any>;
export declare function buffer(stream: Readable, opts?: Options): void;
export declare function array(stream: Readable, opts?: Options): void;
