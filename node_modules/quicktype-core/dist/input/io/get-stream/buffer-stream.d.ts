import { PassThrough } from "readable-stream";
import type { Options } from "./index";
export interface BufferedPassThrough extends PassThrough {
    getBufferedValue: () => any;
    getBufferedLength: () => number;
    readonly writableObjectMode: never;
}
export default function bufferStream(opts: Options): BufferedPassThrough;
