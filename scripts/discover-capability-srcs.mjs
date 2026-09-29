// Copyright 2026 UCP Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Discover capability-owned schema fragments by shape. When --generated is
// given, generate every source absent from the shared quicktype invocation in
// isolation and merge it. Isolation keeps a new source from renaming existing
// public types or making quicktype silently drop unrelated models.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const options = new Map();
for (const flag of [
  "--shared",
  "--manifest",
  "--generated",
  "--exclusions",
  "--quicktype",
]) {
  const i = args.indexOf(flag);
  if (i < 0) continue;
  options.set(flag, args[i + 1]);
  args.splice(i, 2);
}
const root = args[0];
if (!root) {
  console.error("Usage: discover-capability-srcs.mjs [options] <schema_root>");
  process.exit(1);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = path.join(dir, entry.name);
    return entry.isDirectory()
      ? walk(abs)
      : entry.name.endsWith(".json")
        ? [abs]
        : [];
  });
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const pascal = (text) =>
  text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
const variantSuffixes = [
  ".create_req",
  ".update_req",
  ".complete_req",
  "_resp",
];
const stem = (src) => {
  let value = src
    .split("#")[0]
    .replace(/^.*?schemas\//, "")
    .replace(/\.json$/, "");
  for (const suffix of variantSuffixes) {
    if (value.endsWith(suffix)) value = value.slice(0, -suffix.length);
  }
  return value;
};
const capabilityName = /^dev\.ucp(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/;
const isRef = (node) =>
  node && typeof node === "object" && typeof node.$ref === "string";
const isPayload = (node) =>
  node &&
  typeof node === "object" &&
  !isRef(node) &&
  node.properties &&
  typeof node.properties === "object";

function topLevel(rel, key, kind) {
  const file = pascal(path.posix.basename(rel, ".json"));
  if (kind === "operation") {
    const name = pascal(key);
    return name.startsWith(file) ? name : `${file}${name}`;
  }
  const labels = key.split(".");
  const owner =
    labels.slice(0, 2).join(".") === "dev.ucp" ? labels.slice(3) : labels;
  const name = `${file}${pascal(owner.join("_"))}`;
  return kind === "payload" ? `${name}Payload` : name;
}

function fragments(rel, doc) {
  const found = [];
  for (const [key, node] of Object.entries(doc.$defs ?? {})) {
    if (/(?:_request|_response)$/.test(key)) {
      found.push({
        src: `${rel}#/$defs/${key}`,
        kind: "operation",
        topLevel: topLevel(rel, key, "operation"),
      });
      continue;
    }
    if (
      !capabilityName.test(key) ||
      !Array.isArray(node?.allOf) ||
      !node.allOf.some(isRef) ||
      !node.allOf.some(isPayload)
    ) {
      continue;
    }
    found.push({
      src: `${rel}#/$defs/${key}`,
      kind: "extended",
      topLevel: topLevel(rel, key, "extended"),
    });
    node.allOf.forEach((branch, i) => {
      if (isPayload(branch))
        found.push({
          src: `${rel}#/$defs/${key}/allOf/${i}`,
          kind: "payload",
          topLevel: topLevel(rel, key, "payload"),
        });
    });
  }
  return found;
}

const shared = options.has("--shared")
  ? fs.readFileSync(options.get("--shared"), "utf8").split("\n").filter(Boolean)
  : [];
const documents = walk(root)
  .map((abs) => ({
    abs,
    rel: path.relative(root, abs).split(path.sep).join("/"),
    doc: read(abs),
  }))
  .filter(({ doc }) => capabilityName.test(doc.name ?? ""));
const manifest = documents
  .map(({ rel, doc }) => ({
    source: rel,
    modeled: shared.some((src) => stem(src) === stem(rel)),
    fragments: fragments(rel, doc),
  }))
  .filter((entry) => entry.fragments.length > 0)
  .sort((a, b) => a.source.localeCompare(b.source));

if (options.has("--manifest"))
  fs.writeFileSync(
    options.get("--manifest"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

const pending = manifest.filter((entry) => !entry.modeled);
for (const entry of pending)
  console.error(
    `discover-capability-srcs: ${entry.source} has no shared source`
  );
const pendingFragments = pending.reduce(
  (count, entry) => count + entry.fragments.length,
  0
);
console.error(
  `discover-capability-srcs: ${manifest.length} capability source(s), ${pending.length} unmodeled, ` +
    `${pendingFragments} fragment(s) queued.`
);
if (!options.has("--generated")) process.exit(0);

const exclusionsPath =
  options.get("--exclusions") ??
  path.join(repo, "scripts", "capability-src-exclusions.json");
const exclusions = new Map(
  (read(exclusionsPath).exclusions ?? []).map(({ src, reason }) => {
    if (!src || !String(reason ?? "").trim())
      throw new Error("Every exclusion needs src and reason");
    return [src, reason];
  })
);
const discovered = new Set(
  manifest.flatMap((entry) => entry.fragments.map(({ src }) => src))
);
const stale = [...exclusions.keys()].filter((src) => !discovered.has(src));
if (stale.length) {
  console.error(
    `discover-capability-srcs: exclusions no longer discovered: ${stale.join(", ")}`
  );
  process.exit(1);
}

const quicktype = (
  options.get("--quicktype") ?? path.join(repo, "node_modules/.bin/quicktype")
).split(/\s+/);
const generated = options.get("--generated");
const merge = path.join(repo, "scripts", "merge-generated-fragment.mjs");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-capability-srcs."));
let merged = 0;
try {
  for (const source of pending) {
    let sourceExports = 0;
    for (const [i, fragment] of source.fragments.entries()) {
      const output = path.join(temp, `${merged}-${i}.ts`);
      const result = spawnSync(
        quicktype[0],
        [
          ...quicktype.slice(1),
          "--lang",
          "typescript-zod",
          "--src-lang",
          "schema",
          "--top-level",
          fragment.topLevel,
          "--src",
          `${root}/${fragment.src}`,
          "-o",
          output,
        ],
        { encoding: "utf8" }
      );
      if (result.status !== 0) {
        if (exclusions.has(fragment.src)) continue;
        console.error(
          `discover-capability-srcs: ${fragment.src} failed generation without a reviewed exclusion`
        );
        process.exit(1);
      }
      const count = fs.existsSync(output)
        ? (
            fs
              .readFileSync(output, "utf8")
              .match(/^export const \w+Schema\b/gm) ?? []
          ).length
        : 0;
      if (exclusions.has(fragment.src)) {
        console.error(
          `discover-capability-srcs: excluded ${fragment.src} now generates; remove the stale exclusion`
        );
        process.exit(1);
      }
      if (!count) {
        console.error(
          `discover-capability-srcs: ${fragment.src} generated no schema exports`
        );
        process.exit(1);
      }
      const folded = spawnSync("node", [merge, generated, output], {
        encoding: "utf8",
      });
      if (folded.status !== 0) {
        process.stderr.write(folded.stderr ?? "");
        process.exit(folded.status ?? 1);
      }
      sourceExports += count;
    }
    if (!sourceExports) {
      console.error(
        `discover-capability-srcs: ${source.source} produced no exports`
      );
      process.exit(1);
    }
    merged += 1;
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
console.error(
  `discover-capability-srcs: generated ${merged} previously unmodeled capability source(s).`
);
