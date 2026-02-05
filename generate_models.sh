#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Error: spec directory path is required."
  echo "Usage: $0 <spec_dir>"
  echo "Example: npm run generate -- /path/to/spec"
  exit 1
fi

SPEC_DIR="${1%/}"

npx quicktype \
  --lang typescript-zod \
  --src-lang schema \
  --src "$SPEC_DIR"/discovery/*.json \
  --src "$SPEC_DIR"/schemas/shopping/*.json \
  --src "$SPEC_DIR"/schemas/shopping/types/*.json \
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/ap2_with_checkout_mandate" \
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/ap2_with_merchant_authorization" \
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/checkout_mandate" \
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/merchant_authorization" \
  --src "$SPEC_DIR/schemas/shopping/buyer_consent.json#/\$defs/buyer" \
  --src "$SPEC_DIR/schemas/shopping/buyer_consent.json#/\$defs/consent" \
  --src "$SPEC_DIR/schemas/shopping/discount.json#/\$defs/allocation" \
  --src "$SPEC_DIR/schemas/shopping/discount.json#/\$defs/applied_discount" \
  --src "$SPEC_DIR/schemas/shopping/discount.json#/\$defs/discounts_object" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/fulfillment" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/fulfillment_available_method" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/fulfillment_group" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/fulfillment_method" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/fulfillment_option" \
  -o src/spec_generated.ts
