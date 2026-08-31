#!/bin/bash
# Copyright 2026 UCP Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "Error: schema directory path is required."
  echo "Usage: $0 <spec_dir_or_ucp_repo_root>"
  echo "Examples:"
  echo "  npm run generate -- /path/to/legacy-ucp/spec"
  echo "  npm run generate -- /path/to/legacy-ucp"
  exit 1
fi

INPUT_DIR="${1%/}"

if [[ -d "$INPUT_DIR/schemas/shopping" ]]; then
  SPEC_DIR="$INPUT_DIR"
  SCHEMA_LAYOUT="legacy"
elif [[ -d "$INPUT_DIR/spec/schemas/shopping" ]]; then
  SPEC_DIR="$INPUT_DIR/spec"
  SCHEMA_LAYOUT="legacy"
elif [[ -d "$INPUT_DIR/source/schemas/shopping" ]]; then
  SPEC_DIR="$INPUT_DIR/source"
  SCHEMA_LAYOUT="source"
else
  echo "Error: could not find a supported UCP schema directory."
  echo "Expected one of:"
  echo "  <input>/schemas/shopping"
  echo "  <input>/spec/schemas/shopping"
  echo "  <input>/source/schemas/shopping"
  exit 1
fi

# Raw schema tree (with intact authored $refs) used to recover the value
# constraints quicktype's typescript-zod target drops.
RAW_CONSTRAINT_SCHEMA_DIR="$SPEC_DIR/schemas"
PROJECTED_CONSTRAINT_SCHEMA_DIR=""

# No suffix after the X's: BSD/macOS mktemp (unlike GNU mktemp) only
# randomizes a TRAILING run of X's, so a template ending in a literal
# suffix ("...XXXXXX.ts") is used completely unsubstituted, and every call
# with this exact template returns the identical path. Harmless for a
# single quicktype invocation per run (the previous, and only, use of this
# file), but the discovery-last retry below now writes to this SAME path a
# second time in the same run: on a real regeneration, the retry silently
# reused the first (failed/incomplete) attempt's own output as its starting
# point instead of a clean file, corrupting the result in a way that
# depended on which mktemp implementation the machine runs (invisible on
# GNU/Linux CI, reproducible every time on macOS). No suffix keeps both
# platforms honest.
TMP_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/ucp-spec-generated.XXXXXX")"
PROJECTED_SPEC_DIR=""
FRAGMENT_FILES=()
cleanup() {
  rm -f "$TMP_OUTPUT"
  rm -f "${FRAGMENT_FILES[@]+"${FRAGMENT_FILES[@]}"}"
  if [[ -n "$PROJECTED_SPEC_DIR" ]]; then
    rm -rf "$PROJECTED_SPEC_DIR"
  fi
}
trap cleanup EXIT

if [[ "$SCHEMA_LAYOUT" == "source" ]]; then
  PROJECTED_SPEC_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-js-sdk-projected.XXXXXX")"
  node scripts/project-current-ucp-schemas.mjs "$SPEC_DIR" "$PROJECTED_SPEC_DIR"
  SPEC_DIR="$PROJECTED_SPEC_DIR"
  PROJECTED_CONSTRAINT_SCHEMA_DIR="$SPEC_DIR/schemas"
fi

QUICKTYPE_ARGS=(
  --lang typescript-zod
  --src-lang schema
  --src "$SPEC_DIR/schemas/shopping/checkout.create_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout.update_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout.complete_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout_resp.json"
  --src "$SPEC_DIR/schemas/shopping/order.json"
  --src "$SPEC_DIR/schemas/shopping/payment.create_req.json"
  --src "$SPEC_DIR/schemas/shopping/payment.update_req.json"
  --src "$SPEC_DIR/schemas/shopping/payment.complete_req.json"
  --src "$SPEC_DIR/schemas/shopping/payment_data.json"
  --src "$SPEC_DIR/schemas/shopping/payment_resp.json"
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/complete_request_with_ap2"
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/checkout_response_with_ap2"
  --src "$SPEC_DIR/schemas/shopping/buyer_consent.create_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/buyer_consent.update_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/buyer_consent_resp.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/discount.create_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/discount.update_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/discount_resp.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/fulfillment.create_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/fulfillment.update_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/fulfillment_resp.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/cart.create_req.json"
  --src "$SPEC_DIR/schemas/shopping/cart.update_req.json"
  --src "$SPEC_DIR/schemas/shopping/cart_resp.json"
  --src "$SPEC_DIR/schemas/shopping/cart.create_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/cart.update_req.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/cart_resp.json#/\$defs/checkout"
  --src "$SPEC_DIR/schemas/shopping/catalog_lookup.json#/\$defs/lookup_request"
  --src "$SPEC_DIR/schemas/shopping/catalog_lookup.json#/\$defs/lookup_response"
  --src "$SPEC_DIR/schemas/shopping/catalog_lookup.json#/\$defs/get_product_request"
  --src "$SPEC_DIR/schemas/shopping/catalog_lookup.json#/\$defs/get_product_response"
  --src "$SPEC_DIR/schemas/shopping/catalog_search.json#/\$defs/search_request"
  --src "$SPEC_DIR/schemas/shopping/catalog_search.json#/\$defs/search_response"
)

if [[ "$SCHEMA_LAYOUT" == "legacy" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR"/schemas/shopping/types/*.json)
fi

# quicktype's type-ordering pass has a fixed iteration budget ("Exceeded
# maximum number of passes when determining output order"). Against
# 2026-08-25's larger combined schema graph, putting discovery/*.json (the
# response envelope family) FIRST -- the original, and only, order this
# script has ever used -- exhausts that budget before the graph is fully
# ordered and silently drops several response-envelope types
# (CheckoutResponseSchema, UcpResponseSchema, UcpCheckoutResponseSchema,
# UcpDiscoveryProfileSchema -- reproduced with only the nine pre-existing
# pinned resources, no newly-discovered capability involved: this is a
# pre-existing quicktype limitation exposed by 2026-08-25's larger content,
# not something this fix introduces). Putting discovery/*.json LAST resolves
# the same graph within budget, but also changes declaration ORDER in the
# output (not content), which would break byte-identity against the pinned
# 2026-04-08 release for no reason -- it never needs the fallback.
# So: try the original (discovery-first) order first, exactly as before.
# Only if quicktype warns it exhausted the pass budget, retry once with
# discovery-last and use that output instead. This is keyed on the observed
# quicktype WARNING, not on which spec version is running, so it stays
# correct if a future release grows the graph further (or shrinks it back).
QUICKTYPE_LOG="$(mktemp "${TMPDIR:-/tmp}/ucp-quicktype-log.XXXXXX")"
set +e
npx quicktype --src "$SPEC_DIR"/discovery/*.json "${QUICKTYPE_ARGS[@]}" -o "$TMP_OUTPUT" >"$QUICKTYPE_LOG" 2>&1
QUICKTYPE_STATUS=$?
set -e
cat "$QUICKTYPE_LOG" >&2
if [[ $QUICKTYPE_STATUS -ne 0 ]] || grep -q "maximum number of passes" "$QUICKTYPE_LOG"; then
  echo "generate_models.sh: quicktype exhausted its ordering pass budget with discovery/*.json first; retrying with it last (output order only, not content, changes)." >&2
  # Force a clean slate: quicktype's -o target being a pre-existing (here,
  # incomplete/failed) file must not influence the retry.
  rm -f "$TMP_OUTPUT"
  npx quicktype "${QUICKTYPE_ARGS[@]}" --src "$SPEC_DIR"/discovery/*.json -o "$TMP_OUTPUT"
fi
rm -f "$QUICKTYPE_LOG"

# Capabilities and transport envelopes the projector discovered by shape
# (any new lookup/search/checkout-order-cart-extension capability under
# schemas/common/, or a new transport message envelope) are not hardcoded
# below: they are read from the manifest project-current-ucp-schemas.mjs
# writes, so a spec release adding another one does not require editing this
# script. See discoverAdditionalCapabilities/discoverTransportEnvelopes.
#
# Each discovered capability is generated in its OWN small quicktype
# invocation (grouped by capability, so its create/update/response fragments
# travel together), rather than joining the main invocation's --src list.
# Two independent reasons:
#   1. quicktype's typescript-zod target cannot represent every JSON Schema
#      shape -- e.g. an allOf that re-adds named properties alongside a host
#      object whose own additionalProperties is a schema, not a boolean (hit
#      by payment_authentication's checkout attachment: it re-embeds
#      checkout.json via $ref and layers named "actions" entries on top of
#      checkout's own open action map). A newly-discovered capability hitting
#      that limitation must not abort generation for every other capability
#      and the pinned resources.
#   2. quicktype's type-ordering pass has a fixed iteration budget
#      ("Exceeded maximum number of passes when determining output order").
#      Folding every discovered family into the SAME invocation as the nine
#      pinned resources pushes the combined graph over that budget, and
#      quicktype does not fail loudly when this happens -- it silently drops
#      types instead (reproduced: CheckoutResponseSchema/
#      UcpDiscoveryProfileSchema vanished with no non-zero exit code or
#      per-type error). Keeping each family in its own bounded invocation,
#      proven to stay under budget individually, avoids the failure mode
#      entirely rather than working around its symptom.
# This runs AFTER the main invocation above, not before: quicktype's own
# ordering pass turned out to be sensitive to how many prior `npx quicktype`
# processes had already run in the same shell session (observed: the main
# invocation alone succeeds consistently; the identical invocation run after
# nine preceding quicktype calls fails consistently, on the identical input
# -- almost certainly process/resource churn in quicktype's own tooling, not
# a property of the schemas). Generating the pinned resources FIRST, while
# nothing else has run yet, keeps their generation deterministic; the
# per-family probes below going second cannot un-succeed something already
# written to disk.
# A family whose invocation fails outright is EXCLUDED from this
# regeneration -- there is no way to hand quicktype a shape it cannot
# represent -- but that exclusion must never be silent. Two outcomes,
# decided by scripts/check-generation-completeness.mjs after this loop:
#   - the family is on that script's KNOWN_UNREPRESENTABLE_FAMILIES: a human
#     has already verified quicktype cannot do this, so it is logged loudly
#     as a WARNING and the run continues.
#   - the family is NOT on that list: this is a NEW, unreviewed failure --
#     it must not be silently swallowed as "the isolation mechanism just
#     protected the rest of the run" (that fail-open is exactly how a real
#     regression -- the isolation mechanism itself breaking, or a genuinely
#     fixable schema bug -- would hide forever). Generation FAILS, forcing
#     a human to either fix the schema/mechanism or add a reviewed,
#     justified entry to KNOWN_UNREPRESENTABLE_FAMILIES.
# A family whose invocation succeeds is kept as a fragment file and merged
# into the main output (via merge-generated-fragment.mjs, below) rather than
# redeclaring the shared discovery/*.json types a second time.
#
# The reviewed-exclusion allowlist and the accept/reject decision both live
# in scripts/check-generation-completeness.mjs, not here: pure string-list
# logic with no shell quoting is easier to get right and directly unit-
# testable (tests/check-generation-completeness.test.js) independent of
# whether the full pipeline can run end to end against any given spec tree.
# This loop only collects the family names that failed; the decision (and
# the exit) happens once, after the loop, below.
FAILED_FAMILIES=()
FRAGMENT_FILES=()
MANIFEST_FILE="$SPEC_DIR/generated-src-manifest.json"
if [[ -f "$MANIFEST_FILE" ]]; then
  while IFS= read -r family; do
    [[ -n "$family" ]] || continue
    FAMILY_ARGS=()
    while IFS= read -r entry; do
      [[ -n "$entry" ]] || continue
      FAMILY_ARGS+=(--src "$SPEC_DIR/schemas/$entry")
    done < <(node -e '
      const manifest = require(process.argv[1]);
      const family = process.argv[2];
      for (const entry of [...manifest.capabilities, ...manifest.transports]) {
        if (familyKeyOf(entry) === family) {
          process.stdout.write(entry + "\n");
        }
      }
      function familyKeyOf(entry) {
        const [file] = entry.split("#");
        return file.replace(/\.(create_req|update_req)\.json$/, "").replace(/_resp\.json$/, "").replace(/\.json$/, "");
      }
    ' "$MANIFEST_FILE" "$family")

    # No suffix after the X's: BSD/macOS mktemp (unlike GNU mktemp) only
    # randomizes a trailing run of X's, so "prefix.XXXXXX.ts" is used
    # literally unchanged, and a second call in the same loop collides on
    # the identical path ("File exists"). This runs once per discovered
    # family, so it must be genuinely unique each time.
    FRAGMENT_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/ucp-fragment.XXXXXX")"
    FRAGMENT_LOG="$(mktemp "${TMPDIR:-/tmp}/ucp-fragment-log.XXXXXX")"
    if npx quicktype --lang typescript-zod --src-lang schema \
        --src "$SPEC_DIR"/discovery/*.json \
        "${FAMILY_ARGS[@]}" \
        -o "$FRAGMENT_OUTPUT" >"$FRAGMENT_LOG" 2>&1; then
      FRAGMENT_FILES+=("$FRAGMENT_OUTPUT")
    else
      echo "generate_models.sh: \"$family\" failed its quicktype invocation:" >&2
      tail -n 5 "$FRAGMENT_LOG" >&2
      FAILED_FAMILIES+=("$family")
      rm -f "$FRAGMENT_OUTPUT"
    fi
    rm -f "$FRAGMENT_LOG"
  done < <(node -e '
    const manifest = require(process.argv[1]);
    const families = new Set();
    for (const entry of [...manifest.capabilities, ...manifest.transports]) {
      const [file] = entry.split("#");
      const family = file.replace(/\.(create_req|update_req)\.json$/, "").replace(/_resp\.json$/, "").replace(/\.json$/, "");
      families.add(family);
    }
    for (const family of families) {
      process.stdout.write(family + "\n");
    }
  ' "$MANIFEST_FILE")
fi

# Never let a family failure pass silently: every name in FAILED_FAMILIES
# must be on the reviewed KNOWN_UNREPRESENTABLE_FAMILIES allowlist in
# scripts/check-generation-completeness.mjs, or this exits non-zero and
# generation FAILS. See that script for the full reasoning (and
# tests/check-generation-completeness.test.js for direct unit coverage of
# this exact decision).
node scripts/check-generation-completeness.mjs "${FAILED_FAMILIES[@]+"${FAILED_FAMILIES[@]}"}"

# Merge in each discovered family's independently-generated fragment (see
# above). Order does not matter here: each fragment only contributes
# declarations the main output does not already have.
for FRAGMENT_FILE in "${FRAGMENT_FILES[@]+"${FRAGMENT_FILES[@]}"}"; do
  node scripts/merge-generated-fragment.mjs "$TMP_OUTPUT" "$FRAGMENT_FILE"
done

node scripts/normalize-generated-schemas.mjs "$TMP_OUTPUT" src/spec_generated.ts

# Re-attach the value constraints (minimum, pattern, type: integer, ...) that
# quicktype's typescript-zod target drops. The raw schema pass preserves
# authored cross-file constraints; the projected pass then fills constraints on
# create/update schemas that only exist after request projection.
node scripts/inject-schema-constraints.mjs "$RAW_CONSTRAINT_SCHEMA_DIR" src/spec_generated.ts
if [[ -n "$PROJECTED_CONSTRAINT_SCHEMA_DIR" ]]; then
  node scripts/inject-schema-constraints.mjs "$PROJECTED_CONSTRAINT_SCHEMA_DIR" src/spec_generated.ts
fi
if [[ -d "$SPEC_DIR/discovery" ]]; then
  node scripts/inject-schema-constraints.mjs "$SPEC_DIR/discovery" src/spec_generated.ts
fi

# Format the generated output to match the repo's Prettier config (the checked-in
# file is formatted with .prettierrc; without this step regenerated output drifts
# by indentation and formatting noise).
npx prettier --write src/spec_generated.ts
