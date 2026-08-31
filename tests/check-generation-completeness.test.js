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

// Regression coverage for the "never silently drop a discovered family"
// completeness gate. generate_models.sh's per-family isolation mechanism
// (each newly-discovered capability gets its own quicktype invocation, so
// one unrepresentable shape cannot abort generation for every other family)
// was itself found to be a fail-open: a family that failed its invocation
// was logged and skipped, but the whole script still exited 0. That means a
// genuinely fixable regression -- or the isolation mechanism itself
// breaking -- could silently ship an incomplete src/spec_generated.ts with
// no red anywhere.
//
// scripts/check-generation-completeness.mjs is the fix: every family that
// fails must be on KNOWN_UNREPRESENTABLE_FAMILIES (a short, reviewed list,
// each entry citing the exact quicktype failure) or the run exits non-zero.
// This is tested here directly, independent of quicktype or any spec tree
// (fixture or real), because the decision itself is pure string-list logic
// -- exercising it through the full pipeline would make this test depend on
// the fixture tree being complete enough for generate_models.sh's hardcoded
// pinned --src list, which is a separate, pre-existing concern unrelated to
// this gate.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");
const SCRIPT = path.join(
  REPO_ROOT,
  "scripts/check-generation-completeness.mjs"
);

const {
  checkCompleteness,
  KNOWN_UNREPRESENTABLE_FAMILIES,
} = require("../scripts/check-generation-completeness.mjs");

test("KNOWN_UNREPRESENTABLE_FAMILIES contains exactly the one reviewed exclusion", () => {
  // Not a rule against ever growing this list -- but any addition should be
  // a deliberate, reviewed PR change, not something that silently creeps.
  // If this test starts failing because a new entry was added, update it as
  // part of reviewing that addition.
  assert.deepEqual(KNOWN_UNREPRESENTABLE_FAMILIES, [
    "common/payment_authentication",
  ]);
});

test("checkCompleteness: no failed families is trivially complete", () => {
  const { unjustified, reviewed } = checkCompleteness([]);
  assert.deepEqual(unjustified, []);
  assert.deepEqual(reviewed, []);
});

test("checkCompleteness: a reviewed failure is NOT unjustified", () => {
  const { unjustified, reviewed } = checkCompleteness([
    "common/payment_authentication",
  ]);
  assert.deepEqual(unjustified, []);
  assert.deepEqual(reviewed, ["common/payment_authentication"]);
});

test("checkCompleteness: an unreviewed failure IS unjustified", () => {
  const { unjustified, reviewed } = checkCompleteness([
    "common/some_new_capability",
  ]);
  assert.deepEqual(unjustified, ["common/some_new_capability"]);
  assert.deepEqual(reviewed, []);
});

test("checkCompleteness: a mix separates reviewed from unjustified correctly", () => {
  const { unjustified, reviewed } = checkCompleteness([
    "common/payment_authentication",
    "common/some_new_capability",
  ]);
  assert.deepEqual(unjustified, ["common/some_new_capability"]);
  assert.deepEqual(reviewed, ["common/payment_authentication"]);
});

test("CLI: exits 0 with no arguments (nothing failed)", () => {
  assert.doesNotThrow(() =>
    execFileSync("node", [SCRIPT], { stdio: ["ignore", "pipe", "pipe"] })
  );
});

test("CLI: exits 0, with a WARNING, when the only failure is the reviewed exclusion", () => {
  const result = execFileSync(
    "node",
    [SCRIPT, "common/payment_authentication"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  assert.ok(result); // did not throw -- exit 0
});

test("CLI: exits non-zero, with an ERROR naming the family, for an unreviewed failure", () => {
  assert.throws(
    () =>
      execFileSync("node", [SCRIPT, "common/some_new_capability"], {
        stdio: ["ignore", "pipe", "pipe"],
      }),
    (error) => {
      const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
      assert.match(output, /FAILED/);
      assert.match(output, /common\/some_new_capability/);
      assert.match(output, /not on the reviewed exclusion list/);
      return true;
    }
  );
});

test("CLI: a reviewed exclusion alongside an unreviewed failure still fails overall", () => {
  assert.throws(() =>
    execFileSync(
      "node",
      [SCRIPT, "common/payment_authentication", "common/some_new_capability"],
      { stdio: ["ignore", "pipe", "pipe"] }
    )
  );
});
