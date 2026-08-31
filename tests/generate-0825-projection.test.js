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

// Regression coverage for the generation pipeline being broken at the root
// against a reorganized spec tree (the 2026-08-25 release moved ~work
// schemas from schemas/shopping/ to a new schemas/common/ tree, renamed the
// AP2 mandate extension, and published a canonical `keys` profile document
// where none existed before). tests/fixtures/reorg-spec is a small synthetic
// tree reproducing that shape (NOT the full real spec) so this test is fast,
// deterministic, and does not depend on network access or a real UCP
// checkout.
//
// Before the fix in scripts/project-current-ucp-schemas.mjs, running this
// against the fixture crashed:
//   SyntaxError: "undefined" is not valid JSON
//     at clone (scripts/project-current-ucp-schemas.mjs:176)
//     at renameExtensionCheckoutDef (...:998)
//     at writeCompatibilityAp2Schema (...:1076)
// because writeCompatibilityAp2Schema hardcoded the AP2 extension's
// pre-reorg path (shopping/ap2_mandate.json), and loadSchemaCache never
// walked schemas/common/ root files at all, so the schema was never found
// even by accident.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");
const FIXTURE_SOURCE = path.join(REPO_ROOT, "tests/fixtures/reorg-spec/source");
const PROJECTOR_SCRIPT = path.join(
  REPO_ROOT,
  "scripts/project-current-ucp-schemas.mjs"
);

function runProjector() {
  const outDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "ucp-js-sdk-reorg-fixture-")
  );
  execFileSync("node", [PROJECTOR_SCRIPT, FIXTURE_SOURCE, outDir], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  return outDir;
}

function readJson(...segments) {
  return JSON.parse(fs.readFileSync(path.join(...segments), "utf8"));
}

test("projects a reorganized (2026-08-25-shaped) spec tree without crashing", () => {
  // The crash reproduction itself: before the fix this throws
  // (execFileSync surfaces the child's non-zero exit as a thrown error).
  assert.doesNotThrow(() => runProjector());
});

test("resolves the AP2 extension after it moved AND was renamed", () => {
  const outDir = runProjector();
  const ap2 = readJson(outDir, "schemas/shopping/ap2_mandate.json");
  assert.ok(
    ap2.$defs.complete_request_with_ap2,
    "expected the synthesized complete_request_with_ap2 def"
  );
  assert.ok(
    ap2.$defs.checkout_response_with_ap2,
    "expected the synthesized checkout_response_with_ap2 def"
  );
  // The source's own dev.ucp.shopping.checkout attachment def must have been
  // found and folded in -- not the empty-fallback shape writeCompatibilityAp2Schema
  // uses when the source schema cannot be resolved at all.
  assert.deepEqual(ap2.$defs.checkout_response_with_ap2.properties.ap2, {
    type: "object",
  });
});

test("resolves payment.json's relocation from shopping/ to common/types/", () => {
  const outDir = runProjector();
  const paymentData = readJson(outDir, "schemas/shopping/payment_data.json");
  assert.equal(
    paymentData.properties.payment_data.$ref,
    "../common/types/payment_instrument.json",
    "the $ref must point at payment_instrument.json's ACTUAL (relocated) output path"
  );
});

test("discovers a new common/ lookup capability without a hand list", () => {
  const outDir = runProjector();
  const manifest = readJson(outDir, "generated-src-manifest.json");
  assert.ok(
    manifest.capabilities.includes(
      "common/location_lookup.json#/$defs/lookup_request"
    )
  );
  assert.ok(
    manifest.capabilities.includes(
      "common/location_lookup.json#/$defs/lookup_response"
    )
  );
  assert.ok(
    fs.existsSync(path.join(outDir, "schemas/common/location_lookup.json"))
  );
});

test("discovers a new common/ extension capability attaching to BOTH checkout and order", () => {
  const outDir = runProjector();
  const manifest = readJson(outDir, "generated-src-manifest.json");
  for (const target of ["checkout", "order"]) {
    for (const suffix of [
      "payment_terms.create_req.json",
      "payment_terms.update_req.json",
      "payment_terms_resp.json",
    ]) {
      assert.ok(
        manifest.capabilities.includes(`common/${suffix}#/$defs/${target}`),
        `expected common/${suffix}#/$defs/${target} in the manifest`
      );
    }
  }

  const createReq = readJson(
    outDir,
    "schemas/common/payment_terms.create_req.json"
  );
  assert.ok(
    createReq.$defs.checkout,
    "checkout attachment def must be renamed to the bare name"
  );
  assert.ok(
    createReq.$defs.order,
    "order attachment def must be renamed to the bare name"
  );
});

test("does not model a pre-existing capability that matches no known shape (identity_linking is out of scope here)", () => {
  // Not present in this fixture at all -- this documents the boundary: only
  // lookup/search/extension-shaped capabilities are auto-discovered, so a
  // capability like identity_linking (own config shape, no attachment def,
  // no lookup/search pair) is correctly left as a residual rather than
  // silently swept in. See discoverAdditionalCapabilities's module comment.
  const outDir = runProjector();
  const manifest = readJson(outDir, "generated-src-manifest.json");
  assert.ok(
    !manifest.capabilities.some((entry) => entry.includes("identity_linking"))
  );
});

test("models only transport ENVELOPES (oneOf), not the pre-existing config schema", () => {
  const outDir = runProjector();
  const manifest = readJson(outDir, "generated-src-manifest.json");
  assert.deepEqual(manifest.transports, ["transports/mcp_tool_call.json"]);
  assert.ok(
    fs.existsSync(path.join(outDir, "schemas/transports/mcp_tool_call.json"))
  );
  assert.ok(
    !fs.existsSync(
      path.join(outDir, "schemas/transports/embedded_config.json")
    ),
    "embedded_config.json must not be copied/modeled -- it is a pre-existing, deliberate scope exclusion"
  );
});

test("derives the discovery profile's `keys` field from profile.json when it exists", () => {
  const outDir = runProjector();
  const profile = readJson(outDir, "discovery/ucp_discovery_profile.json");
  assert.ok(profile.properties.keys, 'expected a "keys" property');
  assert.ok(
    !profile.properties.signing_keys,
    'the hand-authored "signing_keys" guess must not survive once profile.json publishes the canonical field'
  );
  assert.equal(profile.properties.keys.items.$ref, "jwk_public_key.json");

  const jwk = readJson(outDir, "discovery/jwk_public_key.json");
  assert.ok(
    Array.isArray(jwk.allOf) && jwk.allOf.length > 0,
    "the derived key schema must carry profile.json's EC/OKP conditional rules, not the flat hand-authored shape"
  );
});

test("a discovered lookup capability does not collide with catalog_lookup's identically-named fragment", () => {
  // Reproduces a regression found while building this fix: catalog_lookup.json
  // and a newly-discovered lookup-shaped capability (location_lookup.json)
  // both define $defs.lookup_request/lookup_response with NO title. quicktype
  // names an untitled schema-mode fragment from the $ref fragment name alone,
  // so both compiled to the same "LookupRequestSchema" and one shape's fields
  // silently vanished (observed against the real spec: catalog's `attribution`
  // field was dropped, replaced by location's `distance`/`serves`). This runs
  // the actual quicktype step (not just the projector) to prove the fix
  // (title the newly-discovered capability's copy) keeps both intact.
  const outDir = runProjector();
  const manifest = readJson(outDir, "generated-src-manifest.json");
  const locationFragments = manifest.capabilities.filter((entry) =>
    entry.startsWith("common/location_lookup.json#")
  );
  assert.ok(
    locationFragments.length > 0,
    "expected location_lookup fragments in the manifest"
  );

  const outputTs = path.join(outDir, "combined.ts");
  execFileSync(
    "npx",
    [
      "quicktype",
      "--lang",
      "typescript-zod",
      "--src-lang",
      "schema",
      "--src",
      path.join(
        outDir,
        "schemas/shopping/catalog_lookup.json#/$defs/lookup_request"
      ),
      "--src",
      path.join(
        outDir,
        "schemas/shopping/catalog_lookup.json#/$defs/lookup_response"
      ),
      ...locationFragments.flatMap((entry) => [
        "--src",
        path.join(outDir, "schemas", entry),
      ]),
      "-o",
      outputTs,
    ],
    { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "pipe"] }
  );

  const generated = fs.readFileSync(outputTs, "utf8");
  assert.match(
    generated,
    /catalog_handle_marker/,
    "catalog_lookup's own field must survive -- it must not be silently replaced by the colliding capability's shape"
  );
  assert.match(
    generated,
    /location_radius_marker/,
    "the newly-discovered capability's field must also be present, under its own (titled, non-colliding) type"
  );
  // Exactly one exported const is literally named LookupRequestSchema
  // (catalog's, untouched); location's must have been disambiguated.
  const lookupRequestExports =
    generated.match(/^export const \w*LookupRequestSchema/gm) ?? [];
  assert.ok(
    lookupRequestExports.length >= 2,
    "expected two distinct *LookupRequestSchema exports, not a collision"
  );
  assert.ok(
    lookupRequestExports.includes("export const LookupRequestSchema"),
    "catalog_lookup's untitled, pre-existing name must be unaffected"
  );
});

test("still cross-references common/types (already-working blindness) alongside the newly-fixed common/ root", () => {
  const outDir = runProjector();
  assert.ok(
    fs.existsSync(
      path.join(outDir, "schemas/common/types/pan_credential.json")
    ),
    "common/types/* must remain reachable exactly as before this fix"
  );
});

test("drops a property that $refs a self-referential schema, loudly, without disturbing its siblings", () => {
  // Reproduces a regression found while building this fix: 2026-08-25 added
  // common/types/constraint_expression.json, a genuinely self-referential
  // schema ($ref: "#" pointing at its own whole document, letting a
  // constraint expression nest inside itself). quicktype's typescript-zod
  // target cannot place a type like this AT ALL -- verified in total
  // isolation, zero other schema content, it just exhausts its ordering-pass
  // budget and silently emits nothing. Worse, that failure was not confined
  // to the recursive type itself: it also silently deleted unrelated types
  // elsewhere in the SAME invocation (the real-world case: the whole
  // discovery-profile envelope, including the very "keys" field this lane
  // exists to fix, vanished because it shared an invocation with
  // available_payment_instrument.json's "constraints" property).
  //
  // tests/fixtures/reorg-spec/source/schemas/common/types/payment.json now
  // carries a "constraints" property $ref'ing a fixture recursive schema
  // (test_recursive_constraint.json) that mirrors this exact shape. The fix
  // (dropSelfReferentialProperties, hooked into projectSchemaNode) must
  // remove ONLY that property before quicktype ever sees it, logging the
  // omission loudly rather than letting it silently propagate into a hole
  // in some unrelated type down the pipeline.
  const { spawnSync } = require("node:child_process");
  const probeResult = spawnSync(
    "node",
    [
      PROJECTOR_SCRIPT,
      FIXTURE_SOURCE,
      fs.mkdtempSync(path.join(os.tmpdir(), "ucp-js-sdk-selfref-fixture-")),
    ],
    { encoding: "utf8" }
  );
  const output = `${probeResult.stdout}${probeResult.stderr}`;
  assert.match(
    output,
    /dropping "constraints".*payment\.json.*test_recursive_constraint\.json/s,
    "expected a loud, specific message naming the dropped property and file"
  );

  const outDir = runProjector();
  const payment = readJson(outDir, "schemas/common/types/payment.json");
  assert.ok(
    !("constraints" in payment.properties),
    "the self-referential property must be gone from the projected output"
  );
  assert.ok(
    "instruments" in payment.properties,
    "an unrelated sibling property must survive untouched"
  );

  // Prove quicktype itself now succeeds on the projected file (the actual
  // failure mode this fix targets), and that "instruments" still generates.
  const outputTs = path.join(outDir, "payment-combined.ts");
  execFileSync(
    "npx",
    [
      "quicktype",
      "--lang",
      "typescript-zod",
      "--src-lang",
      "schema",
      "--src",
      path.join(outDir, "schemas/common/types/payment.json"),
      "-o",
      outputTs,
    ],
    { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "pipe"] }
  );
  const generated = fs.readFileSync(outputTs, "utf8");
  assert.match(generated, /instruments/);
  assert.doesNotMatch(generated, /constraints/);
});
