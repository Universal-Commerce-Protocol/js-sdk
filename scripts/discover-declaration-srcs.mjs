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

// Discover capability DECLARATION schemas and print one quicktype `--src`
// fragment per capability and role, relative to the schema root.
//
// A capability may redeclare the platform_schema / business_schema /
// response_schema roles that capability.json defines, under a `$defs` key equal
// to the reverse domain name the capability itself declares. Nothing in the
// hand written `--src` list in generate_models.sh reaches those declarations,
// and handing the whole file to quicktype yields nothing for them either:
// quicktype generates only what the ROOT schema references, and these files are
// bare `$defs` containers with no root `type`, `properties` or `$ref`. It drops
// the unreferenced `$defs` silently and exits 0, so the omission is invisible.
//
// Discovery is keyed on that SHAPE, never on file names, so a capability added
// later is picked up without editing this script.
//
// Usage: node scripts/discover-declaration-srcs.mjs <schema_root>

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// The roles capability.json defines. A `$defs` entry holding at least one of
// these, under a reverse domain name key, is a declaration.
const DECLARATION_ROLES = [
  "business_schema",
  "platform_schema",
  "response_schema",
];

// Mirrors common/types/reverse_domain_name.json. A capability name always has
// at least one dot, which is what separates it from an ordinary `$defs` key
// such as `checkout`.
const REVERSE_DOMAIN_NAME =
  /^[a-z](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9_-]*[a-z0-9_])?)+$/;

// The suffixes the projector appends when it splits one authored file into
// request and response variants.
const VARIANT_SUFFIXES = [".create_req", ".update_req", "_resp"];

function walkJsonFiles(root) {
  const found = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(abs);
      else if (entry.isFile() && entry.name.endsWith(".json")) found.push(abs);
    }
  };
  if (fs.existsSync(root)) visit(root);
  return found.sort();
}

// Structural identity, ignoring annotation-only keywords. The projector gives
// each variant a distinct title suffix, so titles would defeat deduplication
// even when the three copies of a declaration are the same schema; and
// quicktype unifies schemas that differ only in annotations, so the alias
// step downstream needs two such declarations to share ONE hash (e.g.
// identity_linking's and permalink's platform_schema differ only in title and
// description). Constraint keywords are never stripped at schema positions.
// The strip is key-name based, so a PROPERTY literally named title or
// description is stripped too. That is harmless here: the hash only ever
// groups declarations of the same capability and role, and a false pairing
// would still have to get past the completeness gate.
const ANNOTATION_KEYS = new Set(["title", "description", "$comment", "examples"]);

function structureHash(node) {
  const strip = (value) => {
    if (Array.isArray(value)) return value.map(strip);
    if (value && typeof value === "object") {
      const out = {};
      for (const key of Object.keys(value).sort()) {
        if (ANNOTATION_KEYS.has(key)) continue;
        out[key] = strip(value[key]);
      }
      return out;
    }
    return value;
  };
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(strip(node)))
    .digest("hex");
}

// Prefer a file the projector did not split, then the response variant, then
// the lexicographically first path. Deterministic in every case, so the
// generated output does not depend on directory iteration order.
function preferredSource(relPaths) {
  const unsplit = relPaths.filter(
    (rel) => !VARIANT_SUFFIXES.some((suffix) => rel.includes(suffix))
  );
  if (unsplit.length) return unsplit.sort()[0];
  const response = relPaths.filter((rel) => rel.includes("_resp"));
  if (response.length) return response.sort()[0];
  return [...relPaths].sort()[0];
}

function discover(schemaRoot) {
  // key: `${capability} ${role} ${structureHash}` -> { relPaths, titles }
  const groups = new Map();

  for (const abs of walkJsonFiles(schemaRoot)) {
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(abs, "utf8"));
    } catch {
      continue; // a file that is not JSON is not a schema; nothing to discover
    }
    const defs = doc && typeof doc === "object" ? doc.$defs : null;
    if (!defs || typeof defs !== "object") continue;

    for (const [capability, node] of Object.entries(defs)) {
      if (!REVERSE_DOMAIN_NAME.test(capability)) continue;
      if (!node || typeof node !== "object") continue;
      for (const role of DECLARATION_ROLES) {
        const roleNode = node[role];
        if (!roleNode || typeof roleNode !== "object") continue;
        const rel = path.relative(schemaRoot, abs).split(path.sep).join("/");
        const key = `${capability} ${role} ${structureHash(roleNode)}`;
        if (!groups.has(key)) {
          groups.set(key, { relPaths: [], titles: new Map() });
        }
        const group = groups.get(key);
        group.relPaths.push(rel);
        if (typeof roleNode.title === "string") {
          group.titles.set(rel, roleNode.title);
        }
      }
    }
  }

  const entries = [];
  for (const [key, { relPaths, titles }] of groups) {
    const [capability, role, hash] = key.split(" ");
    const source = preferredSource(relPaths);
    entries.push({
      src: `${source}#/$defs/${capability}/${role}`,
      capability,
      role,
      title: titles.get(source),
      structureHash: hash,
    });
  }
  // Sorting keeps the quicktype argument list stable, which keeps the
  // generated file stable and the drift check meaningful.
  return entries.sort((a, b) => a.src.localeCompare(b.src));
}

const args = process.argv.slice(2);
let manifestPath = null;
const manifestFlag = args.indexOf("--manifest");
if (manifestFlag !== -1) {
  manifestPath = args[manifestFlag + 1];
  args.splice(manifestFlag, 2);
}
const schemaRoot = args[0];
if (!schemaRoot || (manifestFlag !== -1 && !manifestPath)) {
  console.error(
    "Usage: node scripts/discover-declaration-srcs.mjs [--manifest <out.json>] <schema_root>"
  );
  process.exit(1);
}
const entries = discover(schemaRoot);
if (manifestPath) {
  fs.writeFileSync(manifestPath, `${JSON.stringify(entries, null, 2)}\n`);
}
for (const entry of entries) {
  console.log(entry.src);
}
