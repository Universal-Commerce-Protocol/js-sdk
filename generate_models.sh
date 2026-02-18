#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Error: spec directory path is required."
  echo "Usage: $0 <spec_dir>"
  echo "Example: npm run generate -- /path/to/spec"
  exit 1
fi

SPEC_DIR="${1%/}"

quicktype \
  --lang typescript-zod \
  --src-lang schema \
  --src "$SPEC_DIR"/discovery/*.json \
  --src "$SPEC_DIR"/schemas/shopping/*.json \
  --src "$SPEC_DIR"/schemas/shopping/types/*.json \
  --src "$SPEC_DIR/schemas/shopping/ap2_mandate.json#/\$defs/dev.ucp.shopping.checkout" \
  --src "$SPEC_DIR/schemas/shopping/buyer_consent.json#/\$defs/dev.ucp.shopping.checkout" \
  --src "$SPEC_DIR/schemas/shopping/discount.json#/\$defs/dev.ucp.shopping.checkout" \
  --src "$SPEC_DIR/schemas/shopping/fulfillment.json#/\$defs/dev.ucp.shopping.checkout" \
  -o src/spec_generated.ts
