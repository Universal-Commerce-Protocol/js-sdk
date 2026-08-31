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

// Decides whether a set of discovered-family quicktype failures should fail
// the whole generate_models.sh run, or be waved through as already-reviewed.
//
// Why this is its own script rather than inline bash: generate_models.sh's
// per-family isolation loop (see the comment there) generates each newly-
// discovered capability in its own quicktype invocation so ONE unrepresentable
// shape cannot abort generation for every other family and the pinned
// resources. That isolation was itself found to be a fail-open: a failing
// family was logged and skipped, but the script still exited 0, so a NEW,
// unreviewed failure (a mechanism regression, or a genuinely fixable schema
// issue) could silently ship an incomplete src/spec_generated.ts. The fix is
// this gate: every family that fails must be on KNOWN_UNREPRESENTABLE_FAMILIES
// below (WARNING, continue) or the run FAILS (ERROR, exit 1). Isolating the
// decision here -- pure string-list logic, no shell quoting, no quicktype,
// no fixture spec tree -- makes it directly unit-testable
// (tests/check-generation-completeness.test.js) independent of whether the
// full pipeline can run end to end against any given spec tree.
//
// Usage: node scripts/check-generation-completeness.mjs <failedFamily> ...
// Exits 0 if every failed family is reviewed (or there are none), 1 otherwise.

// Reviewed, justified exclusions only -- each entry here must cite the exact
// quicktype failure and why it is a genuine tool limitation, not a mechanism
// bug this script could instead fix. Keep this list and generate_models.sh's
// own copy of the reasoning in sync; this file is the single source of truth
// for WHICH families are excluded, generate_models.sh's comment carries the
// full WHY.
export const KNOWN_UNREPRESENTABLE_FAMILIES = [
  // common/payment_authentication -- its "actions" attachment redeclares
  // checkout's "actions" property with BOTH fixed named keys (the new Action
  // types) AND an inherited open catch-all (checkout's own actions.json is a
  // schema-typed additionalProperties map). Verified by direct, minimal
  // reproduction (a single top-level { properties: {...}, additionalProperties:
  // <schema> } object, no allOf, no cross-file $refs) that quicktype's
  // typescript-zod target cannot represent "named keys plus a schema-typed
  // catch-all on the same object" AT ALL -- "Internal error: ." with zero
  // further detail, independent of the allOf-merge machinery in this repo.
  "common/payment_authentication",
];

export function checkCompleteness(failedFamilies) {
  const unjustified = failedFamilies.filter(
    (family) => !KNOWN_UNREPRESENTABLE_FAMILIES.includes(family)
  );
  const reviewed = failedFamilies.filter((family) =>
    KNOWN_UNREPRESENTABLE_FAMILIES.includes(family)
  );
  return { unjustified, reviewed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failedFamilies = process.argv.slice(2);
  const { unjustified, reviewed } = checkCompleteness(failedFamilies);

  for (const family of reviewed) {
    console.error(
      `generate_models.sh: WARNING -- excluding "${family}" (reviewed, see KNOWN_UNREPRESENTABLE_FAMILIES in scripts/check-generation-completeness.mjs) -- left out of this regeneration; still recorded in generated-src-manifest.json for follow-up.`
    );
  }

  if (unjustified.length > 0) {
    console.error(
      `generate_models.sh: FAILED -- ${unjustified.length} newly-discovered capability(ies) could not be generated and are not on the reviewed exclusion list: ${unjustified.join(", ")}`
    );
    console.error(
      "  A silent skip here is exactly the fail-open this check exists to prevent. Either fix the underlying schema shape/mechanism, or (only after confirming quicktype genuinely cannot represent it) add the family to KNOWN_UNREPRESENTABLE_FAMILIES in scripts/check-generation-completeness.mjs with a comment citing the exact failure."
    );
    process.exit(1);
  }
}
