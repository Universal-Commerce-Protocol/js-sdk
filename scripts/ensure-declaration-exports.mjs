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

// The completeness gate for capability declaration schemas.
//
// Two quicktype behaviors make generation silently incomplete:
//   1. it exits 0 when a schema yields nothing;
//   2. it structurally UNIFIES declarations that are identical modulo
//      annotations (title/description), so only one declaration's name
//      survives -- e.g. identity_linking's and permalink's platform_schema
//      are both a bare allOf over capability.json#/$defs/platform_schema,
//      and only one of the two names is emitted.
//
// This script closes both holes AFTER generation, driven purely by the
// manifest that scripts/discover-declaration-srcs.mjs derives from the spec
// (per-capability specifics are spec data, never code):
//   - a declaration whose title-derived export name is present: nothing to do;
//   - a name that is missing while a STRUCTURE-IDENTICAL sibling (same
//     structureHash) is present: append a deterministic alias pair, the same
//     shape quicktype itself emits for unified types. Every spec-declared
//     name stays addressable, and stays valid if the two schemas later fork
//     (regeneration then materializes the name as its own type);
//   - a name that is missing with NO exported sibling: HARD ERROR. This is
//     the loud replacement for the silent drop that motivated the pipeline
//     change: a capability declaration that stops generating turns the build
//     red instead of vanishing from the SDK.
//
// A declaration without a `title` has no predictable generated name and is
// exempt from the name check (the merge step still guarantees its fragment
// generated SOMETHING). Every declaration in the 2026-08-25 spec is titled.

import fs from "node:fs";

const [, , manifestPath, generatedPath, schemaRoot] = process.argv;

if (!manifestPath || !generatedPath) {
  console.error(
    "Usage: node scripts/ensure-declaration-exports.mjs <manifest.json> <generated.ts> [schema_root]"
  );
  process.exit(1);
}

// INDEPENDENT ORACLE.
//
// The manifest is produced by discover-declaration-srcs.mjs, so trusting it to
// say what the spec declares makes this gate blind to the one failure it exists
// to catch: discovery silently finding nothing. That is not hypothetical -- a
// kill test that neutralised discovery left the whole pipeline exiting 0.
//
// So when a schema root is supplied, re-derive the declaration set HERE, with a
// deliberately separate scan rather than by importing the discovery module. Two
// independent derivations must agree; if the manifest under-reports, the build
// fails. Written to be obvious rather than clever, because its only job is to
// disagree with the other implementation when that one breaks.
function declaredCapabilityRoles(root) {
  const ROLES = ["business_schema", "platform_schema", "response_schema"];
  const found = new Set();
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        visit(abs);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
      let doc;
      try {
        doc = JSON.parse(fs.readFileSync(abs, "utf8"));
      } catch {
        continue;
      }
      const defs = doc && typeof doc === "object" ? doc.$defs : null;
      if (!defs || typeof defs !== "object") continue;
      for (const [capability, node] of Object.entries(defs)) {
        if (!capability.includes(".")) continue;
        if (!node || typeof node !== "object") continue;
        for (const role of ROLES) {
          if (node[role] && typeof node[role] === "object") {
            found.add(`${capability}/${role}`);
          }
        }
      }
    }
  };
  if (fs.existsSync(root)) visit(root);
  return found;
}

// Mirrors quicktype's typescript name styling closely enough for the simple
// "Words (Qualifier)" titles capability declarations carry. If a future title
// styles differently than predicted, the result is a HARD ERROR below (never
// a silently wrong alias), fixed by retitling or extending this rule.
function pascalize(title) {
  return title
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) =>
      /^[A-Z0-9]+$/.test(word)
        ? word[0] + word.slice(1).toLowerCase()
        : word[0].toUpperCase() + word.slice(1)
    )
    .join("");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const generated = fs.readFileSync(generatedPath, "utf8");

if (schemaRoot) {
  const declared = declaredCapabilityRoles(schemaRoot);
  const reported = new Set(
    manifest.map((entry) => `${entry.capability}/${entry.role}`)
  );
  const unreported = [...declared].filter((key) => !reported.has(key)).sort();
  if (unreported.length > 0) {
    console.error(
      `ensure-declaration-exports: the schema tree declares ${declared.size} ` +
        `capability declaration role(s) but the manifest reports ` +
        `${reported.size}. Discovery missed: ${unreported.join(", ")}. ` +
        `Refusing to publish an SDK that silently lost a spec-declared schema.`
    );
    process.exit(1);
  }
}

function schemaExportPresent(text, name) {
  return new RegExp(`^export const ${name}Schema\\b`, "m").test(text);
}

const titled = manifest.filter((entry) => typeof entry.title === "string");

// Two structurally different declarations sharing one title would make the
// surviving export name silently mean only one of them.
const byExpectedName = new Map();
for (const entry of titled) {
  const expected = pascalize(entry.title);
  const seen = byExpectedName.get(expected);
  if (seen && seen.structureHash !== entry.structureHash) {
    console.error(
      `ensure-declaration-exports: ambiguous declaration name "${expected}": ` +
        `${seen.src} and ${entry.src} share the title but differ structurally.`
    );
    process.exit(1);
  }
  if (!seen) {
    byExpectedName.set(expected, entry);
  }
}

const presentByHash = new Map();
for (const entry of titled) {
  const expected = pascalize(entry.title);
  if (schemaExportPresent(generated, expected)) {
    const names = presentByHash.get(entry.structureHash) ?? [];
    names.push(expected);
    presentByHash.set(entry.structureHash, names);
  }
}

const aliases = [];
const missing = [];
for (const entry of [...titled].sort((a, b) => a.src.localeCompare(b.src))) {
  const expected = pascalize(entry.title);
  if (schemaExportPresent(generated, expected)) {
    continue;
  }
  const siblings = (presentByHash.get(entry.structureHash) ?? []).sort();
  if (siblings.length > 0) {
    aliases.push({ alias: expected, target: siblings[0] });
    continue;
  }
  missing.push({ entry, expected });
}

if (missing.length > 0) {
  for (const { entry, expected } of missing) {
    console.error(
      `ensure-declaration-exports: the declaration ${entry.capability} / ` +
        `${entry.role} (${entry.src}) produced no export: expected ` +
        `"${expected}Schema" and found neither it nor a structure-identical ` +
        `sibling. quicktype dropped or renamed it; refusing to publish an ` +
        `SDK that silently lost a spec-declared schema.`
    );
  }
  process.exit(1);
}

if (aliases.length > 0) {
  const block = aliases
    .sort((a, b) => a.alias.localeCompare(b.alias))
    .map(
      ({ alias, target }) =>
        `export const ${alias}Schema = ${target}Schema;\nexport type ${alias} = ${target};`
    )
    .join("\n\n");
  fs.writeFileSync(
    generatedPath,
    `${generated.replace(/\s*$/, "")}\n\n${block}\n`
  );
}

console.error(
  `ensure-declaration-exports: ${titled.length} titled declaration(s) checked, ` +
    `${aliases.length} unified-away name(s) re-exported as aliases.`
);
