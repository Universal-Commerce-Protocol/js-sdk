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

TMP_OUTPUT="$(mktemp "${TMPDIR:-/tmp}/ucp-spec-generated.XXXXXX.ts")"
PROJECTED_SPEC_DIR=""
cleanup() {
  rm -f "$TMP_OUTPUT"
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
  --src "$SPEC_DIR"/discovery/*.json
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

  -o "$TMP_OUTPUT"
)

if [[ "$SCHEMA_LAYOUT" == "legacy" ]]; then
  QUICKTYPE_ARGS+=(--src "$SPEC_DIR"/schemas/shopping/types/*.json)
fi

npx quicktype "${QUICKTYPE_ARGS[@]}"

node scripts/normalize-generated-schemas.mjs "$TMP_OUTPUT" src/spec_generated.ts

# Re-attach the value constraints (minimum, pattern, type: integer, ...) that
# quicktype's typescript-zod target drops. The raw schema pass preserves
# authored cross-file constraints; the projected pass then fills constraints on
# create/update schemas that only exist after request projection.
node scripts/inject-schema-constraints.mjs "$RAW_CONSTRAINT_SCHEMA_DIR" src/spec_generated.ts
if [[ -n "$PROJECTED_CONSTRAINT_SCHEMA_DIR" ]]; then
  node scripts/inject-schema-constraints.mjs "$PROJECTED_CONSTRAINT_SCHEMA_DIR" src/spec_generated.ts
fi
