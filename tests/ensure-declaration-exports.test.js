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

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

const SCRIPT = path.join(
  __dirname,
  "..",
  "scripts",
  "ensure-declaration-exports.mjs"
);

// The completeness gate for capability declaration schemas. quicktype exits 0
// when it silently drops a schema, and it structurally unifies declarations
// that are identical modulo annotations, keeping only one title's name. This
// script guarantees that every discovered declaration ends up addressable:
//   - a declaration whose title-derived name is exported: nothing to do;
//   - a declaration whose name is missing but whose structure-identical
//     sibling (same structureHash in the manifest) IS exported: a
//     deterministic alias pair is appended;
//   - a declaration with no exported name and no exported sibling: hard
//     error. This is the loud replacement for the silent drop that motivated
//     the whole pipeline change.

function withFiles(manifest, generated, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-ensure-"));
  const manifestPath = path.join(root, "manifest.json");
  const generatedPath = path.join(root, "generated.ts");
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    fs.writeFileSync(generatedPath, generated);
    return fn(manifestPath, generatedPath);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function run(manifestPath, generatedPath) {
  execFileSync("node", [SCRIPT, manifestPath, generatedPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return fs.readFileSync(generatedPath, "utf8");
}

function runExpectingFailure(manifestPath, generatedPath) {
  try {
    execFileSync("node", [SCRIPT, manifestPath, generatedPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    return { status: error.status, stderr: String(error.stderr) };
  }
  assert.fail("expected the check to exit non-zero");
}

const GENERATED = `export const PermalinkCapabilityPlatformSchema = z.object({
  name: z.string(),
});
export type PermalinkCapabilityPlatform = z.infer<
  typeof PermalinkCapabilityPlatformSchema
>;
`;

function entry(overrides) {
  return {
    src: "shopping/permalink.json#/$defs/dev.ucp.shopping.permalink/platform_schema",
    capability: "dev.ucp.shopping.permalink",
    role: "platform_schema",
    title: "Permalink Capability (Platform)",
    structureHash: "hash-a",
    ...overrides,
  };
}

test("a declaration whose title-derived export exists leaves the file unchanged", () => {
  const out = withFiles([entry({})], GENERATED, run);
  assert.equal(out, GENERATED);
});

test("a unified-away declaration gains a deterministic alias to its structural sibling", () => {
  const manifest = [
    entry({}),
    entry({
      src: "common/identity_linking.json#/$defs/dev.ucp.common.identity_linking/platform_schema",
      capability: "dev.ucp.common.identity_linking",
      title: "Identity Linking (Platform)",
      // Same structureHash: quicktype unified the two declarations and only
      // one title's name survived.
    }),
  ];
  const out = withFiles(manifest, GENERATED, run);
  assert.match(
    out,
    /export const IdentityLinkingPlatformSchema =\s*PermalinkCapabilityPlatformSchema;/
  );
  assert.match(
    out,
    /export type IdentityLinkingPlatform = PermalinkCapabilityPlatform;/
  );
  // The pre-existing content is untouched.
  assert.ok(out.startsWith(GENERATED.replace(/\s*$/, "")));
});

test("a declaration with no export and no exported sibling is a hard error", () => {
  const manifest = [
    entry({
      src: "common/ghost.json#/$defs/dev.ucp.common.ghost/business_schema",
      capability: "dev.ucp.common.ghost",
      role: "business_schema",
      title: "Ghost Capability (Business)",
      structureHash: "hash-ghost",
    }),
  ];
  const { status, stderr } = withFiles(
    manifest,
    GENERATED,
    runExpectingFailure
  );
  assert.notEqual(status, 0);
  assert.match(stderr, /dev\.ucp\.common\.ghost/);
  assert.match(stderr, /GhostCapabilityBusiness/);
});

test("a declaration without a title is exempt (its generated name is not predictable)", () => {
  const manifest = [
    entry({}),
    entry({ title: undefined, structureHash: "hash-b" }),
  ];
  const out = withFiles(manifest, GENERATED, run);
  assert.equal(out, GENERATED);
});

test("two structurally different declarations sharing one title is a hard error (ambiguous name)", () => {
  const manifest = [
    entry({}),
    entry({
      src: "common/other.json#/$defs/dev.ucp.common.other/platform_schema",
      capability: "dev.ucp.common.other",
      structureHash: "hash-c",
      // Same title as entry() but a different structure: the surviving export
      // name would silently mean only one of them.
    }),
  ];
  const { status, stderr } = withFiles(
    manifest,
    GENERATED,
    runExpectingFailure
  );
  assert.notEqual(status, 0);
  assert.match(stderr, /ambiguous/i);
});

test("alias appending is deterministic and idempotent", () => {
  const manifest = [
    entry({}),
    entry({
      src: "common/identity_linking.json#/$defs/dev.ucp.common.identity_linking/platform_schema",
      capability: "dev.ucp.common.identity_linking",
      title: "Identity Linking (Platform)",
    }),
  ];
  const once = withFiles(manifest, GENERATED, run);
  const twice = withFiles(manifest, once, run);
  assert.equal(twice, once);
});

// A gate that only runs when discovery SUCCEEDED cannot catch discovery
// silently returning nothing, which is the exact failure quicktype's exit 0
// creates. The manifest is therefore not trusted as the source of truth: the
// gate independently re-derives what the schema tree declares and fails when
// the manifest under-reports it.
test("fails when the manifest under-reports what the schema tree declares", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-gate-oracle-"));
  try {
    const schemaRoot = path.join(root, "schemas");
    fs.mkdirSync(path.join(schemaRoot, "shopping"), { recursive: true });
    fs.writeFileSync(
      path.join(schemaRoot, "shopping", "permalink.json"),
      JSON.stringify({
        $defs: {
          "dev.ucp.shopping.permalink": {
            platform_schema: { title: "Permalink Capability (Platform)" },
            business_schema: { title: "Permalink Capability (Business)" },
          },
        },
      })
    );

    // An EMPTY manifest is what a broken discovery produces.
    const manifestPath = path.join(root, "manifest.json");
    fs.writeFileSync(manifestPath, "[]");
    const generatedPath = path.join(root, "generated.ts");
    fs.writeFileSync(generatedPath, 'import * as z from "zod";\n');

    const result = spawnSync(
      "node",
      [SCRIPT, manifestPath, generatedPath, schemaRoot],
      { encoding: "utf8" }
    );

    assert.equal(
      result.status,
      1,
      `expected a loud failure, got status ${result.status}. stderr: ${result.stderr}`
    );
    assert.match(result.stderr, /declaration/i);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
