// src/index.ts
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isNode = (
  // @ts-expect-error
  typeof process !== "undefined" && // @ts-expect-error
  process.versions != null && // @ts-expect-error
  process.versions.node != null
);
var isWebWorker = typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
var isJsDom = typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && "userAgent" in navigator && typeof navigator.userAgent === "string" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
var isDeno = (
  // @ts-expect-error
  typeof Deno !== "undefined" && // @ts-expect-error
  typeof Deno.version !== "undefined" && // @ts-expect-error
  typeof Deno.version.deno !== "undefined"
);
var isBun = typeof process !== "undefined" && process.versions != null && process.versions.bun != null;
export {
  isBrowser,
  isBun,
  isDeno,
  isJsDom,
  isNode,
  isWebWorker
};
