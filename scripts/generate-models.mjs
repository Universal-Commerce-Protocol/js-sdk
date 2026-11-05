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

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

const UCP_REPO = "https://github.com/Universal-Commerce-Protocol/ucp.git";
const SHA_RE = /^[0-9a-f]{40}$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const USAGE = [
  "Usage:",
  "  ./generate_models.sh [--from-lock] [--spec-dir <dir>]",
  "  ./generate_models.sh --ref <ref> [--channel draft|release] [--spec-dir <dir>] [--write-lock]",
  "  ./generate_models.sh --spec-dir <dir>",
].join("\n");

const die = (msg) => (console.error(`Error: ${msg}`), process.exit(1));
const ensure = (ok, msg) => ok || die(msg);
const run = (cmd, argv, opts = {}) => execFileSync(cmd, argv, { encoding: "utf8", ...opts });
const tryRun = (cmd, argv) => {
  try { return run(cmd, argv).trim(); } catch { return null; }
};

let args;
try {
  ({ values: args } = parseArgs({
    strict: true,
    allowPositionals: false,
    options: {
      "from-lock": { type: "boolean" },
      ref: { type: "string" },
      channel: { type: "string" },
      "spec-dir": { type: "string" },
      "write-lock": { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  }));
} catch (err) {
  die(err.message);
}
if (args.help) (console.log(USAGE), process.exit(0));

ensure(!args.channel || ["draft", "release"].includes(args.channel), "--channel must be 'draft' or 'release'.");
const fromLock = Boolean(args["from-lock"] || (!args.ref && !args["spec-dir"]));
ensure(!fromLock || (!args.ref && !args.channel && !args["write-lock"]), "--from-lock conflicts with --ref/--channel/--write-lock.");
ensure(fromLock || args.ref || (!args.channel && !args["write-lock"]), "--channel and --write-lock require --ref.");
ensure(args.ref === undefined || (args.ref.trim() && !args.ref.startsWith("-")), `Invalid --ref '${args.ref}'.`);

const bin = process.env.UCP_SCHEMA_BIN || "ucp-schema";
if (process.env.UCP_SCHEMA_BIN) {
  try { fs.accessSync(bin, fs.constants.X_OK); } catch { die(`UCP_SCHEMA_BIN='${bin}' is not executable.`); }
}
const binVersion = tryRun(bin, ["--version"])?.split(/\s+/).pop() ?? die("ucp-schema binary not found on PATH (or set UCP_SCHEMA_BIN).");
const skipVer = process.env.UCP_SKIP_VERSION_CHECK === "1";
ensure(skipVer || SEMVER_RE.test(binVersion), `Invalid version from '${bin} --version': '${binVersion}'.`);
ensure(skipVer || !process.env.UCP_SCHEMA_VERSION || process.env.UCP_SCHEMA_VERSION === binVersion, `UCP_SCHEMA_VERSION != '${binVersion}'.`);

let vertical = "shopping";
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-gen-"));

try {
  let inputDir = args["spec-dir"];
  ensure(!inputDir || (fs.existsSync(inputDir) && fs.statSync(inputDir).isDirectory()), `--spec-dir '${inputDir}' does not exist.`);

  if (fromLock) {
    ensure(fs.existsSync("ucp-lock.json"), "ucp-lock.json not found for --from-lock.");
    let lock;
    try { lock = JSON.parse(fs.readFileSync("ucp-lock.json", "utf8")); } catch { die("Invalid JSON in ucp-lock.json."); }
    ensure(["draft", "release"].includes(lock.channel) && lock.ucp_ref && lock.vertical, "Invalid metadata in ucp-lock.json.");
    ensure(SHA_RE.test(lock.ucp_sha || "") && SEMVER_RE.test(lock.ucp_schema_version || ""), "Invalid SHA or SemVer in ucp-lock.json.");
    ensure(skipVer || binVersion === lock.ucp_schema_version, `ucp-schema '${binVersion}' != ucp-lock.json '${lock.ucp_schema_version}'.`);
    vertical = lock.vertical;
    if (inputDir) {
      const headSha = tryRun("git", ["-C", inputDir, "rev-parse", "HEAD"]) ?? die(`--spec-dir '${inputDir}' is not a git repository.`);
      ensure(headSha === lock.ucp_sha, `--spec-dir HEAD (${headSha}) != ucp-lock.json (${lock.ucp_sha}).`);
    } else {
      inputDir = path.join(tmpRoot, "repo");
      run("git", ["clone", "--filter=blob:none", "--no-checkout", UCP_REPO, inputDir], { stdio: "inherit" });
      run("git", ["-C", inputDir, "checkout", "--quiet", lock.ucp_sha], { stdio: "inherit" });
    }
  } else if (!inputDir) {
    inputDir = path.join(tmpRoot, "repo");
    run("git", ["clone", "-b", args.ref, "--depth", "1", UCP_REPO, inputDir], { stdio: "inherit" });
  }

  const schemaDir = ["source/schemas", "spec/schemas", "schemas", "."]
    .map((rel) => path.join(inputDir, rel))
    .find((dir) => fs.existsSync(path.join(dir, "ucp.json"))) ?? die(`Could not find ucp.json under '${inputDir}'.`);

  const scopedDir = path.join(tmpRoot, "schemas");
  fs.mkdirSync(scopedDir);
  for (const entry of fs.readdirSync(schemaDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".json")) fs.copyFileSync(path.join(schemaDir, entry.name), path.join(scopedDir, entry.name));
  }
  for (const sub of ["common", "transports", vertical]) {
    if (fs.existsSync(path.join(schemaDir, sub))) fs.cpSync(path.join(schemaDir, sub), path.join(scopedDir, sub), { recursive: true });
  }

  const tmpTypes = path.join(tmpRoot, "ucp.types.json");
  run(bin, ["generate-types", "--schema-dir", scopedDir, "--output", tmpTypes], { stdio: "inherit" });
  run(process.execPath, ["scripts/generate-zod-from-types.mjs", tmpTypes, "src/spec_generated.ts"], { stdio: "inherit" });

  if (args["write-lock"]) {
    const ucpSha = (tryRun("git", ["-C", inputDir, "rev-parse", "HEAD"]) ?? die(`'${inputDir}' is not a git repository.`)).toLowerCase();
    const schemaVersion = SEMVER_RE.test(binVersion) ? binVersion : "2.0.0";
    ensure(SHA_RE.test(ucpSha) && SEMVER_RE.test(schemaVersion), "Invalid lockfile provenance values.");
    const channel = args.channel ?? (args.ref.startsWith("release/") ? "release" : "draft");
    const lock = { channel, ucp_ref: args.ref, ucp_sha: ucpSha, ucp_schema_version: schemaVersion, vertical };
    fs.writeFileSync("ucp-lock.json", `${JSON.stringify(lock, null, 2)}\n`);
  }

  const prettier = path.resolve("node_modules/.bin/prettier");
  const hasLocal = fs.existsSync(prettier);
  run(hasLocal ? prettier : "npx", hasLocal ? ["--write", "src/spec_generated.ts"] : ["prettier", "--write", "src/spec_generated.ts"], { stdio: "inherit" });
} finally {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
}
