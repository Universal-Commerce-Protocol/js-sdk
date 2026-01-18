declare const isBrowser: boolean;
declare const isNode: boolean;
declare const isWebWorker: boolean;
declare const isJsDom: boolean;
declare const isDeno: boolean;
/** @see {@link https://bun.sh/guides/util/detect-bun} */
declare const isBun: boolean;

export { isBrowser, isBun, isDeno, isJsDom, isNode, isWebWorker };
