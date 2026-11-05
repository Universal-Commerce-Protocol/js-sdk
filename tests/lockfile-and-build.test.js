const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const { pathToFileURL } = require("node:url");

const ROOT_DIR = path.resolve(__dirname, "..");

describe("ucp-lock.json provenance and git-native build contract", () => {
  it("validates ucp-lock.json schema and Prettier formatting invariants", () => {
    const lockPath = path.join(ROOT_DIR, "ucp-lock.json");
    assert.equal(
      fs.existsSync(lockPath),
      true,
      "ucp-lock.json must exist at repository root"
    );

    const raw = fs.readFileSync(lockPath, "utf8");
    const lock = JSON.parse(raw);

    assert.equal(
      raw,
      JSON.stringify(lock, null, 2) + "\n",
      "ucp-lock.json must be 2-space formatted with a single trailing newline"
    );
    assert.ok(
      lock.channel === "draft" || lock.channel === "release",
      `Invalid channel: ${lock.channel}`
    );
    if (lock.channel === "draft") {
      assert.equal(lock.ucp_ref, "main");
    } else {
      assert.match(lock.ucp_ref, /^release\/\d{4}-\d{2}-\d{2}$/);
    }
    assert.match(lock.ucp_sha, /^[0-9a-f]{40}$/);
    assert.match(lock.ucp_schema_version, /^\d+\.\d+\.\d+$/);
    assert.equal(lock.vertical, "shopping");
  });

  it("declares prepare build script and valid version in package.json", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8")
    );
    const pkgLock = JSON.parse(
      fs.readFileSync(path.join(ROOT_DIR, "package-lock.json"), "utf8")
    );

    assert.equal(pkg.scripts.prepare, "npm run build");
    assert.equal(pkg.version, pkgLock.version);
    if (pkgLock.packages && pkgLock.packages[""]) {
      assert.equal(pkg.version, pkgLock.packages[""].version);
    }
    assert.match(
      pkg.version,
      /^(0\.0\.0-draft|\d{8}\.\d+\.\d+)$/,
      `Unexpected package version: ${pkg.version}`
    );
  });

  it("builds and loads compiled CJS, ESM, and TypeScript declaration entrypoints from dist/", async () => {
    const cjsEntry = path.join(ROOT_DIR, "dist", "cjs", "index.js");
    const esmEntry = path.join(ROOT_DIR, "dist", "esm", "index.js");
    const dtsEntry = path.join(ROOT_DIR, "dist", "index.d.ts");

    if (
      !fs.existsSync(cjsEntry) ||
      !fs.existsSync(esmEntry) ||
      !fs.existsSync(dtsEntry)
    ) {
      execFileSync("npm", ["run", "build"], {
        cwd: ROOT_DIR,
        stdio: "inherit",
      });
    }

    assert.equal(fs.existsSync(cjsEntry), true, "dist/cjs/index.js must exist");
    assert.equal(fs.existsSync(esmEntry), true, "dist/esm/index.js must exist");
    assert.equal(fs.existsSync(dtsEntry), true, "dist/index.d.ts must exist");

    const cjsSdk = require(cjsEntry);
    const esmSdk = await import(pathToFileURL(esmEntry).href);

    assert.equal(typeof cjsSdk.CheckoutSchema?.safeParse, "function");
    assert.equal(typeof esmSdk.CheckoutSchema?.safeParse, "function");
    assert.equal(typeof cjsSdk.ErrorResponseSchema?.safeParse, "function");
    assert.equal(typeof esmSdk.ErrorResponseSchema?.safeParse, "function");

    const sampleError = {
      ucp: {
        version: "2026-08-25",
        status: "error",
      },
      messages: [
        {
          type: "error",
          code: "invalid_request",
          content: "Invalid field",
          severity: "recoverable",
        },
      ],
      extra_wire_field: "preserved",
    };
    const cjsParsed = cjsSdk.ErrorResponseSchema.parse(sampleError);
    const esmParsed = esmSdk.ErrorResponseSchema.parse(sampleError);
    assert.equal(cjsParsed.extra_wire_field, "preserved");
    assert.equal(esmParsed.extra_wire_field, "preserved");
  });
});
