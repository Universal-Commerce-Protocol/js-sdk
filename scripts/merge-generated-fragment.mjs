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

// Folds a separately generated quicktype fragment into the raw main output.
//
// Why a separate invocation at all: quicktype assigns names GLOBALLY across
// one invocation. Adding new sources to the shared invocation changes the
// name pool and re-picks disambiguating names for UNRELATED existing types --
// a breaking public API change. Generating the new sources in their own
// invocation leaves the main invocation's bytes untouched by construction.
//
// Merge contract (each "chunk" is a blank-line separated declaration group in
// quicktype's raw typescript-zod output, normally one `export const ...Schema`
// plus its `export type ...` pair):
//   - all exported names NEW      -> appended verbatim;
//   - all exported names EXISTING -> the fragment chunk must be EQUIVALENT to
//     the main file's declarations for those names; then skipped. Equivalent
//     means equal modulo whitespace and modulo a consistent renaming of
//     referenced schema identifiers, each renamed pair proven equivalent
//     recursively (the two invocations legitimately pick different names for
//     the same underlying schema, e.g. AllowedCombinationElement vs
//     InstrumentGroup for one instrument_group definition). A real shape
//     mismatch is a HARD ERROR: silently skipping would bind every fragment
//     reference to a same-named but differently-shaped main type -- silent
//     wrong output, the class of failure this pipeline exists to kill;
//   - names MIXED new/existing    -> hard error (partial merge is ambiguous);
//   - fragment with NO exports    -> hard error. quicktype exits 0 while
//     silently dropping unreferenced schemas; an empty fragment means the
//     drop happened and must never pass unnoticed again.

import fs from "node:fs";

const [, , mainPath, fragmentPath] = process.argv;

if (!mainPath || !fragmentPath) {
  console.error(
    "Usage: node scripts/merge-generated-fragment.mjs <main.ts> <fragment.ts>"
  );
  process.exit(1);
}

const EXPORT_NAME_RE = /^export (?:const|type) (\w+)/;

function chunksOf(text) {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

function exportedNames(chunk) {
  const names = [];
  for (const line of chunk.split("\n")) {
    const match = line.match(EXPORT_NAME_RE);
    if (match && !names.includes(match[1])) {
      names.push(match[1]);
    }
  }
  return names;
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

const mainContent = fs.readFileSync(mainPath, "utf8");

// Index the main file's declaration text by exported name so a colliding
// fragment chunk can be compared against what the name already means.
const mainChunkByName = new Map();
for (const chunk of chunksOf(mainContent)) {
  for (const name of exportedNames(chunk)) {
    mainChunkByName.set(name, chunk);
  }
}

const fragmentContent = fs.readFileSync(fragmentPath, "utf8");

const fragmentChunkByName = new Map();
for (const chunk of chunksOf(fragmentContent)) {
  for (const name of exportedNames(chunk)) {
    fragmentChunkByName.set(name, chunk);
  }
}

const IDENTIFIER_RE = /\b[A-Za-z_$][A-Za-z0-9_$]*\b/g;

// String and regex literals, whose CONTENTS are never renameable identifiers.
const LITERAL_RE =
  /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/(?:[^/\\\n[]|\\.|\[(?:[^\]\\]|\\.)*\])+\/[gimsuy]*/g;

// Replace every literal with a fixed placeholder and return the literals in
// order. The placeholder deliberately contains no identifier characters, so the
// identifier walk cannot see inside a literal.
function maskLiterals(text) {
  const literals = [];
  const masked = text.replace(LITERAL_RE, (match) => {
    literals.push(match);
    return "";
  });
  return { masked, literals };
}

// True when the main file's declaration of `mainName` and the fragment's
// declaration of `fragmentName` are the same schema up to whitespace and a
// consistent renaming of referenced schema identifiers, with every renamed
// pair proven equivalent the same way. Cycles assume equivalence on revisit
// (coinductive), which is sound for the equality this guards.
function equivalentChunks(mainName, fragmentName, visited) {
  const pairKey = `${mainName}\u0000${fragmentName}`;
  if (visited.has(pairKey)) {
    return true;
  }
  visited.add(pairKey);

  const mainChunk = mainChunkByName.get(mainName);
  const fragmentChunk = fragmentChunkByName.get(fragmentName);
  if (!mainChunk || !fragmentChunk) {
    return false;
  }

  const strip = (text, name) =>
    normalizeWhitespace(text).replaceAll(name, "");
  const mainMasked = maskLiterals(strip(mainChunk, mainName));
  const fragmentMasked = maskLiterals(strip(fragmentChunk, fragmentName));

  // Literal contents must be byte equal. `z.enum(["Card"])` and
  // `z.enum(["Voucher"])` are different schemas even when Card and Voucher
  // happen to name equivalent ones; without this the identifier walk below
  // pairs them, calls the chunks identical, and silently drops the fragment
  // version, which is the silent wrong output this pipeline exists to kill.
  if (
    mainMasked.literals.length !== fragmentMasked.literals.length ||
    mainMasked.literals.some(
      (literal, index) => literal !== fragmentMasked.literals[index]
    )
  ) {
    return false;
  }

  const mainText = mainMasked.masked;
  const fragmentText = fragmentMasked.masked;

  const mainIds = mainText.match(IDENTIFIER_RE) ?? [];
  const fragmentIds = fragmentText.match(IDENTIFIER_RE) ?? [];
  if (
    mainText.replace(IDENTIFIER_RE, "") !==
      fragmentText.replace(IDENTIFIER_RE, "") ||
    mainIds.length !== fragmentIds.length
  ) {
    return false;
  }

  for (let i = 0; i < mainIds.length; i += 1) {
    const a = mainIds[i];
    const b = fragmentIds[i];
    if (a === b) {
      continue;
    }
    // Only schema identifier pairs may differ, and only if the schemas they
    // name are themselves equivalent. Bare type names ride along with their
    // Schema constants.
    const aSchema = a.endsWith("Schema") ? a : `${a}Schema`;
    const bSchema = b.endsWith("Schema") ? b : `${b}Schema`;
    const aName = aSchema.slice(0, -6);
    const bName = bSchema.slice(0, -6);
    if (!aName || !bName) {
      return false;
    }
    if (!equivalentChunks(aSchema, bSchema, visited)) {
      return false;
    }
  }
  return true;
}

const newChunks = [];
let skipped = 0;
let sawExports = false;
for (const chunk of chunksOf(fragmentContent)) {
  const names = exportedNames(chunk);
  if (names.length === 0) {
    // Not a declaration (e.g. quicktype's banner comment) -- drop it; the
    // main file already carries any header it needs.
    continue;
  }
  sawExports = true;

  const existing = names.filter((name) => mainChunkByName.has(name));
  if (existing.length === 0) {
    newChunks.push(chunk);
    for (const name of names) {
      mainChunkByName.set(name, chunk);
    }
    continue;
  }

  if (existing.length !== names.length) {
    console.error(
      `merge-generated-fragment: ${fragmentPath}: a fragment chunk mixes ` +
        `existing (${existing.join(", ")}) and new names ` +
        `(${names.filter((n) => !existing.includes(n)).join(", ")}); ` +
        `refusing to merge it partially.`
    );
    process.exit(1);
  }

  for (const name of names) {
    if (!equivalentChunks(name, name, new Set())) {
      console.error(
        `merge-generated-fragment: ${fragmentPath}: export "${name}" ` +
          `conflicts -- the fragment's declaration differs from the main ` +
          `output's declaration of the same name (beyond a consistent ` +
          `renaming of equivalent referenced schemas). Refusing to skip it ` +
          `silently, because the fragment's other types would then bind to ` +
          `a different shape than they were generated against.\n` +
          `  main:     ${normalizeWhitespace(mainChunkByName.get(name))}\n` +
          `  fragment: ${normalizeWhitespace(chunk)}`
      );
      process.exit(1);
    }
  }
  skipped += 1;
}

if (!sawExports) {
  console.error(
    `merge-generated-fragment: ${fragmentPath}: the fragment contains no ` +
      `exports. quicktype exits 0 when it silently drops unreferenced ` +
      `schemas; refusing to treat that silence as success.`
  );
  process.exit(1);
}

if (newChunks.length > 0) {
  fs.writeFileSync(
    mainPath,
    `${mainContent.replace(/\s*$/, "")}\n\n${newChunks.join("\n\n")}\n`
  );
}

console.error(
  `merge-generated-fragment: ${fragmentPath}: ${newChunks.length} new ` +
    `declaration(s) merged, ${skipped} identical already-present chunk(s) skipped.`
);
