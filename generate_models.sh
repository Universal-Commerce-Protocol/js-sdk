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
  echo "Error: schema directory path or UCP release version is required."
  echo "Usage: $0 <spec_dir_or_ucp_repo_root_or_version>"
  echo "Examples:"
  echo "  ./generate_models.sh /path/to/ucp"
  echo "  ./generate_models.sh 2026-08-25"
  exit 1
fi

INPUT_ARG="${1%/}"
CLONED_DIR=""

if [[ -d "$INPUT_ARG" ]]; then
  INPUT_DIR="$INPUT_ARG"
else
  VERSION="$INPUT_ARG"
  BRANCH="$VERSION"
  if [[ "$VERSION" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    BRANCH="release/$VERSION"
  fi
  echo "Cloning UCP version $VERSION (branch: $BRANCH)..."
  CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
  git clone --depth 1 --branch "$BRANCH" https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
  INPUT_DIR="$CLONED_DIR"
fi

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

TMP_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/ucp-spec-generated.XXXXXX.ts")"
TMP_DECLARATIONS="$(mktemp "${TMPDIR:-/tmp}/ucp-declarations-generated.XXXXXX.ts")"
DECLARATION_MANIFEST="$(mktemp "${TMPDIR:-/tmp}/ucp-declarations-manifest.XXXXXX.json")"
PROJECTED_SPEC_DIR=""
cleanup() {
  rm -f "$TMP_OUTPUT" "$TMP_DECLARATIONS" "$DECLARATION_MANIFEST"
  if [[ -n "$PROJECTED_SPEC_DIR" ]]; then
    rm -rf "$PROJECTED_SPEC_DIR"
  fi
  if [[ -n "$CLONED_DIR" ]]; then
    rm -rf "$CLONED_DIR"
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
  --src "$SPEC_DIR"/discovery/*.json
  --src "$SPEC_DIR/schemas/shopping/checkout.create_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout.update_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout.complete_req.json"
  --src "$SPEC_DIR/schemas/shopping/checkout_resp.json"
  --src "$SPEC_DIR/schemas/shopping/order.json"
  --src "$SPEC_DIR/schemas/shopping/payment_data.json"
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

if [[ -f "$SPEC_DIR/schemas/shopping/payment.create_req.json" ]]; then
  QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/shopping/payment.create_req.json"
    --src "$SPEC_DIR/schemas/shopping/payment.update_req.json"
    --src "$SPEC_DIR/schemas/shopping/payment.complete_req.json"
    --src "$SPEC_DIR/schemas/shopping/payment_resp.json"
  )
fi

if [[ -f "$SPEC_DIR/schemas/shopping/permalink.json" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR/schemas/shopping/permalink.json")
fi

if [[ -f "$SPEC_DIR/schemas/shopping/ap2_mandate.json" ]]; then
  QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/complete_request_with_ap2"
    --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/checkout_response_with_ap2"
  )
fi

if [[ -d "$SPEC_DIR/schemas/common" ]]; then
  [[ -f "$SPEC_DIR/schemas/common/location_lookup.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/location_lookup.json#/\$defs/location_lookup_request"
    --src "$SPEC_DIR/schemas/common/location_lookup.json#/\$defs/location_lookup_response"
  )
  [[ -f "$SPEC_DIR/schemas/common/location_search.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/location_search.json#/\$defs/location_search_request"
    --src "$SPEC_DIR/schemas/common/location_search.json#/\$defs/location_search_response"
  )
  [[ -f "$SPEC_DIR/schemas/common/identity_linking.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/identity_linking.json#/\$defs/provider"
    --src "$SPEC_DIR/schemas/common/identity_linking.json#/\$defs/scope_policy"
  )
  [[ -f "$SPEC_DIR/schemas/common/loyalty.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/loyalty_membership"
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/membership_tier"
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/membership_reward"
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/earning_forecast"
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/reward_currency"
    --src "$SPEC_DIR/schemas/common/loyalty.json#/\$defs/checkout"
  )
  [[ -f "$SPEC_DIR/schemas/common/payment_terms.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/payment_terms.json#/\$defs/payment"
    --src "$SPEC_DIR/schemas/common/payment_terms.json#/\$defs/order_payment"
    --src "$SPEC_DIR/schemas/common/payment_terms.json#/\$defs/payment_term"
    --src "$SPEC_DIR/schemas/common/payment_terms.json#/\$defs/checkout"
  )
  [[ -f "$SPEC_DIR/schemas/common/payment_split_payments.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/payment_split_payments.json#/\$defs/instrument_group"
    --src "$SPEC_DIR/schemas/common/payment_split_payments.json#/\$defs/payment_instrument"
    --src "$SPEC_DIR/schemas/common/payment_split_payments.json#/\$defs/checkout"
  )
  [[ -f "$SPEC_DIR/schemas/common/payment_ap2_mandate.json" ]] && QUICKTYPE_ARGS+=(
    --src "$SPEC_DIR/schemas/common/payment_ap2_mandate.json#/\$defs/merchant_authorization"
    --src "$SPEC_DIR/schemas/common/payment_ap2_mandate.json#/\$defs/checkout_mandate"
    --src "$SPEC_DIR/schemas/common/payment_ap2_mandate.json#/\$defs/error_code"
  )
fi

if [[ -d "$SPEC_DIR/schemas/transports" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR"/schemas/transports/*.json)
fi

if [[ -f "$SPEC_DIR/schemas/profile.json" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR/schemas/profile.json")
fi

if [[ -d "$SPEC_DIR/schemas/shopping/types" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR"/schemas/shopping/types/*.json)
fi

if [[ -d "$SPEC_DIR/schemas/common/types" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR"/schemas/common/types/*.json)
fi

QUICKTYPE_ARGS+=(-o "$TMP_OUTPUT")

run_quicktype() {
  if [[ -x "./node_modules/.bin/quicktype" ]]; then
    ./node_modules/.bin/quicktype "$@"
  else
    npx quicktype "$@"
  fi
}

run_quicktype "${QUICKTYPE_ARGS[@]}"

# Capability DECLARATION schemas. A capability may redeclare the
# platform_schema / business_schema / response_schema roles that capability.json
# defines, under a $defs key equal to its own reverse domain name. Those
# declarations are not reachable from any root schema, so handing the file to
# quicktype whole generates nothing for them and exits 0 -- the omission is
# silent. Discovered by shape (scripts/discover-declaration-srcs.mjs), so a
# capability added to the spec later generates with no edit here.
#
# They are generated in their OWN quicktype invocation and merged in, never
# added to the shared invocation above: quicktype assigns names globally across
# one invocation, so new sources in the shared pool re-pick disambiguating
# names for unrelated existing types -- a breaking public API change. The
# merge appends only new declarations, proves colliding names identical, and
# fails loudly otherwise (scripts/merge-generated-fragment.mjs).
#
# Read from the RAW tree for the same reason the constraint injector does: the
# projection prunes `$defs` that nothing reachable references, so the projected
# copies of these declarations point at a `capability.json` that is not emitted
# and at `ucp.json#/$defs/entity` which the projection drops. The authored tree
# still has both, so the declaration refs resolve there.
DECLARATION_ARGS=()
if [[ -d "$RAW_CONSTRAINT_SCHEMA_DIR" ]]; then
  while IFS= read -r declaration_src; do
    [[ -n "$declaration_src" ]] || continue
    DECLARATION_ARGS+=(--src "$RAW_CONSTRAINT_SCHEMA_DIR/$declaration_src")
  done < <(node scripts/discover-declaration-srcs.mjs --manifest "$DECLARATION_MANIFEST" "$RAW_CONSTRAINT_SCHEMA_DIR")
fi

if (( ${#DECLARATION_ARGS[@]} )); then
  run_quicktype --lang typescript-zod --src-lang schema "${DECLARATION_ARGS[@]}" -o "$TMP_DECLARATIONS"
  node scripts/merge-generated-fragment.mjs "$TMP_OUTPUT" "$TMP_DECLARATIONS"
fi

node scripts/normalize-generated-schemas.mjs "$TMP_OUTPUT" src/spec_generated.ts

# quicktype structurally unifies declarations that are identical modulo
# annotations, keeping one title's name, and exits 0 when it drops a schema.
# Guarantee every discovered declaration stays addressable: alias unified-away
# names to their surviving structural sibling, and fail the build if any
# declaration produced nothing (scripts/ensure-declaration-exports.mjs).
# Runs UNCONDITIONALLY, and is given the schema root so it can re-derive the
# declaration set independently of discovery. Guarding this on "did discovery
# find anything" would make it blind to discovery finding nothing, which is the
# precise failure quicktype's exit 0 produces.
node scripts/ensure-declaration-exports.mjs \
  "$DECLARATION_MANIFEST" src/spec_generated.ts "$RAW_CONSTRAINT_SCHEMA_DIR"

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
