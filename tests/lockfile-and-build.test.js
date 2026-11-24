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
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { describe, it } = require("node:test");
const { pathToFileURL } = require("node:url");

const ROOT_DIR = path.resolve(__dirname, "..");
const readText = (rel) => fs.readFileSync(path.join(ROOT_DIR, rel), "utf8");
const readJson = (rel) => JSON.parse(readText(rel));

describe("ucp-lock.json provenance and pure-TypeScript build contract", () => {
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

  it("enforces zero runtime dependencies, ./openapi.json export, and exact openapi-typescript pin", () => {
    const pkg = readJson("package.json");
    const pkgLock = readJson("package-lock.json");

    assert.equal(pkg.dependencies, undefined);
    assert.equal(pkgLock.packages?.[""]?.dependencies, undefined);
    assert.equal(pkg.devDependencies?.["json-schema-to-zod"], undefined);
    assert.match(
      pkg.devDependencies?.["openapi-typescript"] || "",
      /^\d+\.\d+\.\d+$/
    );
    assert.equal(pkg.exports?.["./openapi.json"], "./dist/openapi.json");
    assert.equal(pkg.scripts.prepare, "npm run build");
    assert.equal(pkg.scripts.pretest, "tsc -p tests/tsconfig.json --noEmit");
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

  it("wires zero-copy OpenAPI --vertical codegen without custom Zod scripts", () => {
    const hasScript = (rel) => fs.existsSync(path.join(ROOT_DIR, rel));
    assert.ok(!hasScript("scripts/generate-zod-from-types.mjs"));
    assert.ok(!hasScript("scripts/generate-zod-from-openapi.mjs"));

    const script = path.join(ROOT_DIR, "generate_models.sh");
    const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-test-"));
    try {
      const tmpEnvDir = path.join(sandbox, "tmp");
      const argvLog = path.join(sandbox, "argv.txt");
      fs.mkdirSync(tmpEnvDir);
      const runCli = (args, extraEnv) =>
        spawnSync(script, args, {
          encoding: "utf8",
          env: { ...process.env, TMPDIR: tmpEnvDir, ...extraEnv },
        });

      const oldBin = path.join(sandbox, "old-bin");
      fs.writeFileSync(
        oldBin,
        '#!/bin/sh\n[ "$1" = "--version" ] && echo "ucp-schema 2.0.0" || echo "Options: --profile"\n',
        { mode: 0o755 }
      );
      const oldRes = runCli(["--spec-dir", sandbox], {
        UCP_SCHEMA_BIN: oldBin,
      });
      assert.notEqual(oldRes.status, 0);
      assert.match(oldRes.stderr, /generate-openapi --vertical/);

      const newBin = path.join(sandbox, "new-bin");
      fs.writeFileSync(
        newBin,
        `#!/bin/sh\n[ "$1" = "--version" ] && { echo "ucp-schema \${FAKE_VER:-2.1.0}"; exit 0; }\n[ "$2" = "--help" ] && { echo "Options: --schema-dir --vertical"; exit 0; }\nprintf '%s\\n' "$@" > "${argvLog}"\necho "no REST OpenAPI service template (requires UCP >= 2026-04-08)" >&2\nexit 2\n`,
        { mode: 0o755 }
      );
      const spec = path.join(sandbox, "legacy-spec");
      fs.mkdirSync(path.join(spec, "source/schemas"), { recursive: true });
      fs.writeFileSync(path.join(spec, "source/schemas/ucp.json"), "{}\n");

      const legacyRes = runCli(
        ["--ref", "release/2026-01-23", "--spec-dir", spec],
        { UCP_SCHEMA_BIN: newBin }
      );
      assert.notEqual(legacyRes.status, 0);
      assert.match(legacyRes.stderr, /2026-04-08/);
      assert.deepEqual(fs.readFileSync(argvLog, "utf8").trim().split("\n"), [
        "generate-openapi",
        "--schema-dir",
        path.join(spec, "source/schemas"),
        "--vertical",
        "shopping",
        "--output",
        "src/openapi.json",
      ]);

      assert.notEqual(
        runCli(["--ref", "feature/bad", "--write-lock"], {
          UCP_SCHEMA_BIN: newBin,
        }).status,
        0
      );
      assert.notEqual(
        runCli(["--ref", "main", "--write-lock"], {
          UCP_SCHEMA_BIN: newBin,
          FAKE_VER: "2.1.0-dev",
          UCP_SKIP_VERSION_CHECK: "1",
        }).status,
        0
      );
      assert.deepEqual(fs.readdirSync(tmpEnvDir), []);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  });

  it("packs dist/openapi.json and declarations, loads CJS/ESM entrypoints, and typechecks consumers", async () => {
    execFileSync("npm", ["run", "build"], { cwd: ROOT_DIR, stdio: "inherit" });
    const entries = [
      "dist/cjs/index.js",
      "dist/esm/index.js",
      "dist/index.d.ts",
      "dist/openapi.json",
    ].map((rel) => path.join(ROOT_DIR, rel));
    for (const entry of entries) assert.ok(fs.existsSync(entry));
    assert.equal(readText("dist/openapi.json"), readText("src/openapi.json"));

    const cjsSdk = require(entries[0]);
    const esmSdk = await import(pathToFileURL(entries[1]).href);
    assert.deepEqual(Object.keys(cjsSdk), []);
    assert.deepEqual(Object.keys(esmSdk), []);

    const [packMeta] = JSON.parse(
      execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
        cwd: ROOT_DIR,
        encoding: "utf8",
      })
    );
    const packedPaths = packMeta.files.map((f) => f.path);
    assert.ok(packedPaths.includes("dist/index.d.ts"));
    assert.ok(packedPaths.includes("dist/openapi.json"));
    assert.ok(
      packedPaths.every(
        (p) =>
          p.startsWith("dist/") ||
          ["package.json", "README.md", "LICENSE"].includes(p)
      ),
      `Unexpected files in npm tarball: ${packedPaths.join(", ")}`
    );

    const consumerDir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-consumer-"));
    try {
      const pkgDir = path.join(consumerDir, "node_modules/@ucp-js/sdk");
      fs.mkdirSync(path.dirname(pkgDir), { recursive: true });
      fs.cpSync(path.join(ROOT_DIR, "package.json"), `${pkgDir}/package.json`);
      fs.cpSync(path.join(ROOT_DIR, "dist"), `${pkgDir}/dist`, {
        recursive: true,
      });
      const write = (f, s) => fs.writeFileSync(path.join(consumerDir, f), s);
      const runNode = (args) =>
        execFileSync(process.execPath, args, {
          cwd: consumerDir,
          stdio: "pipe",
        });

      runNode([
        "-e",
        'const a = require("node:assert/strict"), d = require("@ucp-js/sdk/openapi.json"); a.equal(d.openapi, "3.1.0"); a.equal(typeof d.components?.schemas?.Checkout, "object");',
      ]);
      runNode([
        "--input-type=module",
        "-e",
        'import a from "node:assert/strict"; const { default: d } = await import("@ucp-js/sdk/openapi.json", { with: { type: "json" } }); a.equal(d.openapi, "3.1.0"); a.equal(typeof d.components?.schemas?.Checkout, "object");',
      ]);

      write(
        "tsconfig.json",
        JSON.stringify({
          compilerOptions: {
            target: "ES2020",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            resolveJsonModule: true,
            strict: true,
            noEmit: true,
          },
          include: ["consumer.mts", "consumer.cts"],
        })
      );
      write(
        "consumer.mts",
        [
          'import openapi from "@ucp-js/sdk/openapi.json" with { type: "json" };',
          'import type { Checkout, ErrorResponse, ProfileBusinessSchema, ValueConstraint, paths } from "@ucp-js/sdk";',
          "export const specVersion: string = openapi.openapi;",
          'export type CreatePost = paths["/checkout-sessions"]["post"];',
          'export const chk: Checkout = { ucp: { version: "2026-08-25", payment_handlers: {} }, id: "c1", status: "incomplete", currency: "USD", line_items: [], totals: [], links: [], "com.example.ext": 1 };',
          'export const err: ErrorResponse = { ucp: { version: "2026-08-25", status: "error" }, messages: [] };',
          'export const prof: ProfileBusinessSchema = { ucp: { version: "2026-08-25", services: {}, payment_handlers: {} } };',
          "// @ts-expect-error closed constraint rejects excess keys",
          'export const badVc: ValueConstraint = { const: "US", extra: 1 };',
        ].join("\n")
      );
      write(
        "consumer.cts",
        'import openapi = require("@ucp-js/sdk/openapi.json");\nimport type { Checkout } from "@ucp-js/sdk";\nexport const v: string = openapi.openapi;\nexport type C = Checkout;\n'
      );
      execFileSync(`${ROOT_DIR}/node_modules/.bin/tsc`, [
        "-p",
        `${consumerDir}/tsconfig.json`,
      ]);
    } finally {
      fs.rmSync(consumerDir, { recursive: true, force: true });
    }
  });
});
