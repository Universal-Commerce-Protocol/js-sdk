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

const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const { pathToFileURL } = require("node:url");

const ROOT_DIR = path.resolve(__dirname, "..");
const readText = (rel) => fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
const readJson = (rel) => JSON.parse(readText(rel));

describe("ucp-lock.json provenance and git-native build contract", () => {
  it("validates ucp-lock.json schema and Prettier formatting invariants", () => {
    const raw = readText("ucp-lock.json");
    const lock = JSON.parse(raw);

    assert.equal(raw, `${JSON.stringify(lock, null, 2)}\n`);
    assert.ok(lock.channel === "draft" || lock.channel === "release");
    assert.match(
      lock.ucp_ref,
      lock.channel === "draft" ? /^main$/ : /^release\/\d{4}-\d{2}-\d{2}$/
    );
    assert.match(lock.ucp_sha, /^[0-9a-f]{40}$/);
    assert.match(lock.ucp_schema_version, /^\d+\.\d+\.\d+$/);
    assert.equal(lock.vertical, "shopping");
  });

  it("declares prepare build script and synchronized version in package manifests", () => {
    const pkg = readJson("package.json");
    const pkgLock = readJson("package-lock.json");

    assert.equal(pkg.scripts.prepare, "npm run build");
    assert.equal(pkg.version, pkgLock.version);
    assert.equal(pkg.version, pkgLock.packages?.[""]?.version);
    assert.match(
      pkg.version,
      /^(0\.0\.0-draft|\d{8}\.(0|[1-9]\d*)\.(0|[1-9]\d*))$/
    );
    assert.deepEqual(pkg.files, ["dist"]);
  });

  it("enforces the flag-only generate_models.sh CLI contract", () => {
    const script = path.join(ROOT_DIR, "generate_models.sh");
    const help = execFileSync(script, ["--help"], { encoding: "utf8" });
    assert.match(help, /--from-lock/);
    assert.match(help, /--ref <ref>/);

    for (const badArgs of [
      ["draft"],
      ["--unknown-flag"],
      ["--from-lock", "--write-lock"],
      ["--spec-dir", ROOT_DIR, "--write-lock"],
    ]) {
      assert.throws(() => execFileSync(script, badArgs, { stdio: "pipe" }));
    }
  });

  it("builds and loads compiled CJS, ESM, and declaration entrypoints from dist/", async () => {
    const entries = [
      "dist/cjs/index.js",
      "dist/esm/index.js",
      "dist/index.d.ts",
    ].map((rel) => path.join(ROOT_DIR, rel));
    if (entries.some((p) => !fs.existsSync(p))) {
      execFileSync("npm", ["run", "build"], {
        cwd: ROOT_DIR,
        stdio: "inherit",
      });
    }
    for (const entry of entries) assert.ok(fs.existsSync(entry));

    const cjsSdk = require(entries[0]);
    const esmSdk = await import(pathToFileURL(entries[1]).href);

    for (const sdk of [cjsSdk, esmSdk]) {
      assert.equal(typeof sdk.CheckoutSchema?.safeParse, "function");
      const parsed = sdk.ErrorResponseSchema.parse({
        ucp: { version: "2026-08-25", status: "error" },
        messages: [
          {
            type: "error",
            code: "invalid_request",
            content: "Invalid field",
            severity: "recoverable",
          },
        ],
        extra_wire_field: "preserved",
      });
      assert.equal(parsed.extra_wire_field, "preserved");
    }
  });
});
