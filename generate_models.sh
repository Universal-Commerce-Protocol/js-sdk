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

cd "$(dirname "$0")"

INPUT_ARG="${1:-2026-08-25}"
INPUT_ARG="${INPUT_ARG%/}"
CLONED_DIR=""

if [[ -d "$INPUT_ARG" ]]; then
  INPUT_DIR="$INPUT_ARG"
elif [[ "$INPUT_ARG" == /* || "$INPUT_ARG" == ./* || "$INPUT_ARG" == ../* ]]; then
  echo "Error: Local UCP directory not found at '$INPUT_ARG'."
  exit 1
elif [[ "$INPUT_ARG" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  BRANCH="release/$INPUT_ARG"
  echo "Cloning UCP version $INPUT_ARG (branch: $BRANCH)..."
  CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
  git clone --depth 1 --branch "$BRANCH" https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
  INPUT_DIR="$CLONED_DIR"
elif [[ "$INPUT_ARG" =~ ^[0-9a-fA-F]{7,40}$ ]]; then
  echo "Cloning UCP repository at commit $INPUT_ARG..."
  CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
  git clone https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
  git -C "$CLONED_DIR" checkout "$INPUT_ARG"
  INPUT_DIR="$CLONED_DIR"
else
  echo "Cloning UCP branch/ref $INPUT_ARG..."
  CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
  git clone --depth 1 --branch "$INPUT_ARG" https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
  INPUT_DIR="$CLONED_DIR"
fi

if [[ -f "$INPUT_DIR/source/schemas/ucp.json" ]]; then
  SCHEMA_DIR="$INPUT_DIR/source/schemas"
elif [[ -f "$INPUT_DIR/spec/schemas/ucp.json" ]]; then
  SCHEMA_DIR="$INPUT_DIR/spec/schemas"
elif [[ -f "$INPUT_DIR/schemas/ucp.json" ]]; then
  SCHEMA_DIR="$INPUT_DIR/schemas"
elif [[ -f "$INPUT_DIR/ucp.json" ]]; then
  SCHEMA_DIR="$INPUT_DIR"
else
  echo "Error: could not find a supported UCP schema directory (missing ucp.json)."
  echo "Expected one of:"
  echo "  <input>/source/schemas/ucp.json"
  echo "  <input>/spec/schemas/ucp.json"
  echo "  <input>/schemas/ucp.json"
  echo "  <input>/ucp.json"
  exit 1
fi

if [[ -n "${UCP_SCHEMA_BIN:-}" && ! -x "$UCP_SCHEMA_BIN" ]]; then
  echo "Error: UCP_SCHEMA_BIN='$UCP_SCHEMA_BIN' is not executable."
  exit 1
elif [[ -n "${UCP_SCHEMA_BIN:-}" ]]; then
  :
elif command -v ucp-schema &> /dev/null && ucp-schema generate-types --help &> /dev/null; then
  UCP_SCHEMA_BIN="$(command -v ucp-schema)"
elif [[ -x "../ucp-schema/target/release/ucp-schema" ]]; then
  UCP_SCHEMA_BIN="../ucp-schema/target/release/ucp-schema"
elif [[ -x "../ucp-schema/target/debug/ucp-schema" ]]; then
  UCP_SCHEMA_BIN="../ucp-schema/target/debug/ucp-schema"
elif [[ -f "../ucp-schema/Cargo.toml" ]] && command -v cargo &> /dev/null; then
  echo "Building ucp-schema from ../ucp-schema..."
  cargo build --release --manifest-path "../ucp-schema/Cargo.toml"
  UCP_SCHEMA_BIN="../ucp-schema/target/release/ucp-schema"
else
  echo "Error: ucp-schema CLI binary (with generate-types) not found on PATH or in ../ucp-schema/target/{release,debug}."
  exit 1
fi

TMP_TYPES_JSON="$(mktemp "${TMPDIR:-/tmp}/ucp-types.XXXXXX.json")"
cleanup() {
  rm -f "$TMP_TYPES_JSON"
  if [[ -n "$CLONED_DIR" && -d "$CLONED_DIR" ]]; then
    rm -rf "$CLONED_DIR"
  fi
}
trap cleanup EXIT

"$UCP_SCHEMA_BIN" generate-types --schema-dir "$SCHEMA_DIR" --output "$TMP_TYPES_JSON"

node scripts/generate-zod-from-types.mjs "$TMP_TYPES_JSON" src/spec_generated.ts

node scripts/inject-schema-constraints.mjs "$TMP_TYPES_JSON" "$SCHEMA_DIR" src/spec_generated.ts

if [[ -x "./node_modules/.bin/prettier" ]]; then
  ./node_modules/.bin/prettier --write src/spec_generated.ts
else
  npx prettier --write src/spec_generated.ts
fi
