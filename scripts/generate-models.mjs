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
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const UCP_REPO = "https://github.com/Universal-Commerce-Protocol/ucp.git";
const SHA_RE = /^[0-9a-f]{40}$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const RELEASE_REF_RE = /^release\/\d{4}-\d{2}-\d{2}$/;
const VERTICAL_RE = /^[a-z0-9_-]+$/;
const USAGE = [
  "Usage:",
  "  ./generate_models.sh [--from-lock] [--spec-dir <dir>]",
  "  ./generate_models.sh --ref <ref> [--channel draft|release] [--spec-dir <dir>] [--write-lock]",
  "  ./generate_models.sh --spec-dir <dir>",
].join("\n");

class CliError extends Error {}
const die = (msg) => { throw new CliError(msg); };
const ensure = (ok, msg) => ok || die(msg);
const run = (cmd, argv, opts = {}) => execFileSync(cmd, argv, { encoding: "utf8", ...opts });
const tryRun = (cmd, argv) => {
  try { return run(cmd, argv).trim(); } catch { return null; }
};
const isValidRef = (channel, ref) => (channel === "draft" ? /^main$/ : RELEASE_REF_RE).test(ref);

const origCwd = process.cwd();
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));

let tmpRoot = null;
try {
  const bool = { type: "boolean" };
  const str = { type: "string" };
  const { values: args } = parseArgs({
    strict: true,
    allowPositionals: false,
    options: { "from-lock": bool, ref: str, channel: str, "spec-dir": str, "write-lock": bool, help: { ...bool, short: "h" } },
  });
  if (args.help) (console.log(USAGE), process.exit(0));

  ensure(!args.channel || ["draft", "release"].includes(args.channel), "--channel must be 'draft' or 'release'.");
  const fromLock = Boolean(args["from-lock"] || (!args.ref && !args["spec-dir"]));
  ensure(!fromLock || (!args.ref && !args.channel && !args["write-lock"]), "--from-lock conflicts with --ref/--channel/--write-lock.");
  ensure(fromLock || args.ref || (!args.channel && !args["write-lock"]), "--channel and --write-lock require --ref.");
  ensure(args.ref === undefined || (args.ref.trim() && !args.ref.startsWith("-")), `Invalid --ref '${args.ref}'.`);
  const targetChannel = args.ref ? (args.channel ?? (args.ref.startsWith("release/") ? "release" : "draft")) : undefined;
  ensure(!args["write-lock"] || isValidRef(targetChannel, args.ref), `Invalid --ref '${args.ref}' for channel '${targetChannel}'.`);

  const bin = process.env.UCP_SCHEMA_BIN || "ucp-schema";
  if (process.env.UCP_SCHEMA_BIN) {
    try { fs.accessSync(bin, fs.constants.X_OK); } catch { die(`UCP_SCHEMA_BIN='${bin}' is not executable.`); }
  }
  const binVersion = tryRun(bin, ["--version"])?.split(/\s+/).pop() ?? die("ucp-schema binary not found on PATH (or set UCP_SCHEMA_BIN).");
  const skipVer = process.env.UCP_SKIP_VERSION_CHECK === "1";
  ensure((!args["write-lock"] && skipVer) || SEMVER_RE.test(binVersion), `Invalid SemVer from '${bin} --version': '${binVersion}'.`);
  ensure(skipVer || !process.env.UCP_SCHEMA_VERSION || process.env.UCP_SCHEMA_VERSION === binVersion, `UCP_SCHEMA_VERSION != '${binVersion}'.`);
  ensure(tryRun(bin, ["generate-openapi", "--help"])?.includes("--vertical"), `'${bin}' lacks 'generate-openapi --vertical' (requires ucp-schema >= 2.1.0).`);
  const openapiTs = path.resolve("node_modules/.bin/openapi-typescript");
  const prettier = path.resolve("node_modules/.bin/prettier");
  ensure(fs.existsSync(openapiTs) && fs.existsSync(prettier), "Local codegen binaries missing in node_modules/.bin (run npm ci).");

  let inputDir = args["spec-dir"] ? path.resolve(origCwd, args["spec-dir"]) : undefined;
  ensure(!inputDir || (fs.existsSync(inputDir) && fs.statSync(inputDir).isDirectory()), `--spec-dir '${args["spec-dir"]}' does not exist.`);

  let vertical = "shopping";
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-gen-"));

  if (fromLock) {
    ensure(fs.existsSync("ucp-lock.json"), "ucp-lock.json not found for --from-lock.");
    let lock;
    try { lock = JSON.parse(fs.readFileSync("ucp-lock.json", "utf8")); } catch { die("Invalid JSON in ucp-lock.json."); }
    ensure(["draft", "release"].includes(lock?.channel) && typeof lock.ucp_ref === "string" && VERTICAL_RE.test(lock.vertical || ""), "Invalid metadata in ucp-lock.json.");
    ensure(isValidRef(lock.channel, lock.ucp_ref), `Invalid ucp_ref '${lock.ucp_ref}' for channel '${lock.channel}'.`);
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

  const candidate = path.join(inputDir, "source/schemas");
  const schemaDir = fs.existsSync(candidate) && fs.statSync(candidate).isDirectory() ? candidate : inputDir;
  ensure(fs.existsSync(path.join(schemaDir, "ucp.json")), `Could not find ucp.json under '${inputDir}'.`);

  run(bin, ["generate-openapi", "--schema-dir", schemaDir, "--vertical", vertical, "--output", "src/openapi.json"], { stdio: "inherit" });
  if (!fs.readFileSync("src/openapi.json", "utf8").endsWith("\n")) fs.appendFileSync("src/openapi.json", "\n");
  run(openapiTs, [
    "src/openapi.json",
    "--default-non-nullable",
    "false",
    "--empty-objects-unknown",
    "--root-types",
    "--root-types-no-schema-prefix",
    "-o",
    "src/spec_generated.ts",
  ], { stdio: "inherit" });

  if (args["write-lock"]) {
    const ucpSha = (tryRun("git", ["-C", inputDir, "rev-parse", "HEAD"]) ?? die(`'${inputDir}' is not a git repository.`)).toLowerCase();
    ensure(SHA_RE.test(ucpSha), `Invalid git HEAD SHA '${ucpSha}'.`);
    const lock = { channel: targetChannel, ucp_ref: args.ref, ucp_sha: ucpSha, ucp_schema_version: binVersion, vertical };
    fs.writeFileSync("ucp-lock.json", `${JSON.stringify(lock, null, 2)}\n`);
  }

  run(prettier, ["--write", "src/spec_generated.ts"], { stdio: "inherit" });
} catch (err) {
  if (err instanceof CliError || err?.code?.startsWith("ERR_PARSE_ARGS_")) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  } else {
    throw err;
  }
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}
