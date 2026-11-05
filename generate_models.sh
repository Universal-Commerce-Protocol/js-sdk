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

FROM_LOCK=0
SPEC_DIR=""
OVERRIDE_CHANNEL=""
OVERRIDE_REF=""
WRITE_LOCK=0
POSITIONAL=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --from-lock)
      FROM_LOCK=1
      shift
      ;;
    --spec-dir)
      if [[ $# -lt 2 ]]; then
        echo "Error: --spec-dir requires a directory argument."
        exit 1
      fi
      SPEC_DIR="${2%/}"
      shift 2
      ;;
    --channel)
      if [[ $# -lt 2 ]]; then
        echo "Error: --channel requires an argument (draft or release)."
        exit 1
      fi
      OVERRIDE_CHANNEL="$2"
      shift 2
      ;;
    --ref)
      if [[ $# -lt 2 ]]; then
        echo "Error: --ref requires a UCP ref argument."
        exit 1
      fi
      OVERRIDE_REF="$2"
      shift 2
      ;;
    --write-lock)
      WRITE_LOCK=1
      shift
      ;;
    -h|--help)
      echo "Usage:"
      echo "  ./generate_models.sh --from-lock [--spec-dir <dir>]"
      echo "  ./generate_models.sh [draft | main | YYYY-MM-DD | <git-sha> | <local-ucp-dir>] [--channel draft|release] [--ref <ucp-ref>] [--write-lock]"
      exit 0
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [[ $FROM_LOCK -eq 0 && ${#POSITIONAL[@]} -eq 0 ]]; then
  if [[ -f "ucp-lock.json" ]]; then
    FROM_LOCK=1
  else
    POSITIONAL+=("2026-08-25")
  fi
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

BIN_VERSION="$("$UCP_SCHEMA_BIN" --version | awk '{print $2}')"

CLONED_DIR=""
SCOPED_SCHEMA_DIR=""
TMP_TYPES_JSON="$(mktemp "${TMPDIR:-/tmp}/ucp-types.XXXXXX.json")"
cleanup() {
  rm -f "$TMP_TYPES_JSON"
  if [[ -n "$SCOPED_SCHEMA_DIR" && -d "$SCOPED_SCHEMA_DIR" ]]; then
    rm -rf "$SCOPED_SCHEMA_DIR"
  fi
  if [[ -n "$CLONED_DIR" && -d "$CLONED_DIR" ]]; then
    rm -rf "$CLONED_DIR"
  fi
}
trap cleanup EXIT

EXISTING_CHANNEL="draft"
EXISTING_REF="main"
EXISTING_SCHEMA_VERSION=""
if [[ -f "ucp-lock.json" ]]; then
  EXISTING_CHANNEL="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).channel || 'draft'")"
  EXISTING_REF="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).ucp_ref || 'main'")"
  EXISTING_SCHEMA_VERSION="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).ucp_schema_version || ''")"
fi

VERTICAL="shopping"
RESOLVED_SHA=""
RESOLVED_CHANNEL="$EXISTING_CHANNEL"
RESOLVED_REF="$EXISTING_REF"

if [[ $FROM_LOCK -eq 1 ]]; then
  if [[ ! -f "ucp-lock.json" ]]; then
    echo "Error: ucp-lock.json not found for --from-lock."
    exit 1
  fi
  LOCK_SHA="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).ucp_sha")"
  LOCK_SCHEMA_VERSION="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).ucp_schema_version")"
  VERTICAL="$(node -p "JSON.parse(require('fs').readFileSync('ucp-lock.json', 'utf8')).vertical || 'shopping'")"

  if [[ "${UCP_SKIP_VERSION_CHECK:-0}" != "1" ]]; then
    if [[ "$BIN_VERSION" != "$LOCK_SCHEMA_VERSION" ]]; then
      echo "Error: ucp-schema version '$BIN_VERSION' does not match ucp-lock.json ucp_schema_version '$LOCK_SCHEMA_VERSION'."
      exit 1
    fi
  fi

  if [[ -n "$SPEC_DIR" ]]; then
    if [[ ! -d "$SPEC_DIR" ]]; then
      echo "Error: --spec-dir '$SPEC_DIR' does not exist."
      exit 1
    fi
    if git -C "$SPEC_DIR" rev-parse HEAD &> /dev/null; then
      ACTUAL_SHA="$(git -C "$SPEC_DIR" rev-parse HEAD)"
      if [[ "$ACTUAL_SHA" != "$LOCK_SHA" ]]; then
        echo "Error: --spec-dir HEAD ($ACTUAL_SHA) does not match ucp-lock.json ucp_sha ($LOCK_SHA)."
        exit 1
      fi
    fi
    INPUT_DIR="$SPEC_DIR"
  else
    echo "Cloning UCP repository at locked commit $LOCK_SHA..."
    CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
    git clone https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
    git -C "$CLONED_DIR" checkout --quiet "$LOCK_SHA"
    INPUT_DIR="$CLONED_DIR"
  fi
else
  INPUT_ARG="${POSITIONAL[0]%/}"
  if [[ -d "$INPUT_ARG" ]]; then
    INPUT_DIR="$INPUT_ARG"
    if [[ $WRITE_LOCK -eq 1 ]]; then
      RESOLVED_SHA="$(git -C "$INPUT_DIR" rev-parse HEAD)"
      RESOLVED_CHANNEL="${OVERRIDE_CHANNEL:-$EXISTING_CHANNEL}"
      RESOLVED_REF="${OVERRIDE_REF:-$EXISTING_REF}"
    fi
  elif [[ "$INPUT_ARG" == /* || "$INPUT_ARG" == ./* || "$INPUT_ARG" == ../* ]]; then
    echo "Error: Local UCP directory not found at '$INPUT_ARG'."
    exit 1
  elif [[ "$INPUT_ARG" == "draft" || "$INPUT_ARG" == "main" ]]; then
    echo "Cloning UCP draft channel (branch: main)..."
    CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
    git clone --depth 1 --branch main https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
    INPUT_DIR="$CLONED_DIR"
    RESOLVED_SHA="$(git -C "$CLONED_DIR" rev-parse HEAD)"
    RESOLVED_CHANNEL="${OVERRIDE_CHANNEL:-draft}"
    RESOLVED_REF="${OVERRIDE_REF:-main}"
    WRITE_LOCK=1
  elif [[ "$INPUT_ARG" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    BRANCH="release/$INPUT_ARG"
    echo "Cloning UCP version $INPUT_ARG (branch: $BRANCH)..."
    CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
    git clone --depth 1 --branch "$BRANCH" https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
    INPUT_DIR="$CLONED_DIR"
    RESOLVED_SHA="$(git -C "$CLONED_DIR" rev-parse HEAD)"
    RESOLVED_CHANNEL="${OVERRIDE_CHANNEL:-release}"
    RESOLVED_REF="${OVERRIDE_REF:-$BRANCH}"
    WRITE_LOCK=1
  elif [[ "$INPUT_ARG" =~ ^[0-9a-fA-F]{7,40}$ ]]; then
    echo "Cloning UCP repository at commit $INPUT_ARG..."
    CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
    git clone https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
    git -C "$CLONED_DIR" checkout --quiet "$INPUT_ARG"
    INPUT_DIR="$CLONED_DIR"
    RESOLVED_SHA="$(git -C "$CLONED_DIR" rev-parse HEAD)"
    RESOLVED_CHANNEL="${OVERRIDE_CHANNEL:-$EXISTING_CHANNEL}"
    RESOLVED_REF="${OVERRIDE_REF:-$EXISTING_REF}"
    WRITE_LOCK=1
  else
    echo "Cloning UCP branch/ref $INPUT_ARG..."
    CLONED_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-repo.XXXXXX")"
    git clone --depth 1 --branch "$INPUT_ARG" https://github.com/Universal-Commerce-Protocol/ucp.git "$CLONED_DIR"
    INPUT_DIR="$CLONED_DIR"
    if [[ $WRITE_LOCK -eq 1 ]]; then
      RESOLVED_SHA="$(git -C "$CLONED_DIR" rev-parse HEAD)"
      RESOLVED_CHANNEL="${OVERRIDE_CHANNEL:-$EXISTING_CHANNEL}"
      RESOLVED_REF="${OVERRIDE_REF:-$INPUT_ARG}"
    fi
  fi
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

# Scope compilation to Shopping + Common + Transports so other verticals do not bleed in.
SCOPED_SCHEMA_DIR="$(mktemp -d "${TMPDIR:-/tmp}/ucp-schemas.XXXXXX")"
cp "$SCHEMA_DIR"/*.json "$SCOPED_SCHEMA_DIR"/
for dir in common transports "$VERTICAL"; do
  if [[ -d "$SCHEMA_DIR/$dir" ]]; then
    cp -R "$SCHEMA_DIR/$dir" "$SCOPED_SCHEMA_DIR/$dir"
  fi
done

"$UCP_SCHEMA_BIN" generate-types --schema-dir "$SCOPED_SCHEMA_DIR" --output "$TMP_TYPES_JSON"

node scripts/generate-zod-from-types.mjs "$TMP_TYPES_JSON" src/spec_generated.ts

if [[ $WRITE_LOCK -eq 1 ]]; then
  if [[ -n "${UCP_SCHEMA_VERSION:-}" ]]; then
    TARGET_SCHEMA_VERSION="$UCP_SCHEMA_VERSION"
  elif [[ "${UCP_SKIP_VERSION_CHECK:-0}" == "1" ]]; then
    TARGET_SCHEMA_VERSION="${EXISTING_SCHEMA_VERSION:-2.0.0}"
  elif [[ -n "$EXISTING_SCHEMA_VERSION" ]]; then
    TARGET_SCHEMA_VERSION="$EXISTING_SCHEMA_VERSION"
  else
    TARGET_SCHEMA_VERSION="${BIN_VERSION:-2.0.0}"
  fi

  RESOLVED_CHANNEL="$RESOLVED_CHANNEL" \
  RESOLVED_REF="$RESOLVED_REF" \
  RESOLVED_SHA="$RESOLVED_SHA" \
  TARGET_SCHEMA_VERSION="$TARGET_SCHEMA_VERSION" \
  VERTICAL="$VERTICAL" \
  node -e '
    const fs = require("fs");
    const lock = {
      channel: process.env.RESOLVED_CHANNEL,
      ucp_ref: process.env.RESOLVED_REF,
      ucp_sha: process.env.RESOLVED_SHA.toLowerCase(),
      ucp_schema_version: process.env.TARGET_SCHEMA_VERSION,
      vertical: process.env.VERTICAL,
    };
    fs.writeFileSync("ucp-lock.json", JSON.stringify(lock, null, 2) + "\n");
  '
fi

if [[ -x "./node_modules/.bin/prettier" ]]; then
  ./node_modules/.bin/prettier --write src/spec_generated.ts
else
  npx prettier --write src/spec_generated.ts
fi
