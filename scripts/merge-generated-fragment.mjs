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

// Appends the NEW declarations from a separately-generated quicktype
// fragment into the main generated file, skipping anything the main file
// already declares.
//
// Why this exists: quicktype's typescript-zod output has an internal
// type-ordering pass with a fixed iteration budget ("Exceeded maximum
// number of passes when determining output order"). Handing it the full
// combined 2026-08-25 schema graph in ONE invocation (the base nine pinned
// resources plus every newly-discovered capability and transport) exceeds
// that budget and silently drops several types rather than failing loudly.
// Generating each newly-discovered family in its OWN small quicktype
// invocation (already proven to stay well under the budget -- see the
// per-capability probe in generate_models.sh) and merging the result here
// keeps every invocation small while still producing one combined file.
//
// Declarations are split on blank lines, which is how quicktype's raw
// (pre-prettier) typescript-zod output separates each `export const ... /
// export type ...` pair. A chunk is skipped if ANY name it exports already
// exists in the main file -- both because the shared discovery/*.json
// types (CapabilityDiscoverySchema, UcpServiceSchema, ...) are included in
// every fragment invocation on purpose (they are what let quicktype resolve
// $refs into the fragment's own file) and are expected to duplicate the
// main file's copies exactly, and as a safety net against ever silently
// shadowing an existing export with a same-named but differently-shaped one.

import fs from "node:fs";

const [, , mainPath, fragmentPath] = process.argv;

if (!mainPath || !fragmentPath) {
  console.error(
    "Usage: node scripts/merge-generated-fragment.mjs <main.ts> <fragment.ts>"
  );
  process.exit(1);
}

const EXPORT_NAME_RE = /^export (?:const|type) (\w+)/;

function exportedNames(chunk) {
  const names = [];
  for (const line of chunk.split("\n")) {
    const match = line.match(EXPORT_NAME_RE);
    if (match) {
      names.push(match[1]);
    }
  }
  return names;
}

const mainContent = fs.readFileSync(mainPath, "utf8");
const mainNames = new Set(exportedNames(mainContent));

const fragmentContent = fs.readFileSync(fragmentPath, "utf8");
const chunks = fragmentContent.split(/\n{2,}/).map((chunk) => chunk.trim());

const newChunks = [];
let skipped = 0;
for (const chunk of chunks) {
  const names = exportedNames(chunk);
  if (names.length === 0) {
    // Not a declaration (e.g. a leading comment banner) -- drop it; the
    // main file already carries any header it needs.
    continue;
  }
  if (names.some((name) => mainNames.has(name))) {
    skipped++;
    continue;
  }
  newChunks.push(chunk);
  for (const name of names) {
    mainNames.add(name);
  }
}

if (newChunks.length > 0) {
  fs.writeFileSync(
    mainPath,
    `${mainContent.replace(/\s*$/, "")}\n\n${newChunks.join("\n\n")}\n`
  );
}

console.error(
  `merge-generated-fragment: ${fragmentPath}: ${newChunks.length} new declaration(s) merged, ${skipped} already present (skipped).`
);
