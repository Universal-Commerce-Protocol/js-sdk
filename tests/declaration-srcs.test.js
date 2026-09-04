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

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const SCRIPT = path.join(
  __dirname,
  "..",
  "scripts",
  "discover-declaration-srcs.mjs"
);

// A capability may redeclare the platform_schema / business_schema roles that
// capability.json defines, under a $defs key equal to its own declared name.
// Nothing in the hand written --src list reaches those declarations, and a file
// passed whole yields nothing for them because quicktype only generates what the
// root schema references. This script discovers them by SHAPE so no capability
// has to be named anywhere.

function writeTree(root, files) {
  for (const [rel, value] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, JSON.stringify(value, null, 2));
  }
}

function declaration(name, roles) {
  const defs = {};
  for (const [role, title] of Object.entries(roles)) {
    defs[role] = { title, allOf: [{ $ref: "../capability.json" }] };
  }
  return { $defs: { [name]: defs } };
}

function run(root) {
  return execFileSync("node", [SCRIPT, root], { encoding: "utf8" })
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function withTree(files, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-decl-"));
  try {
    writeTree(root, files);
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test("discovers every declaration role, keyed on shape not on file names", () => {
  const out = withTree(
    {
      "schemas/common/identity_linking.json": declaration(
        "dev.ucp.common.identity_linking",
        {
          platform_schema: "Identity Linking (Platform)",
          business_schema: "Identity Linking (Business)",
        }
      ),
      "schemas/shopping/permalink.json": declaration(
        "dev.ucp.shopping.permalink",
        {
          platform_schema: "Permalink Capability (Platform)",
          business_schema: "Permalink Capability (Business)",
          response_schema: "Permalink Capability (Response)",
        }
      ),
    },
    run
  );

  assert.deepEqual(out, [
    "schemas/common/identity_linking.json#/$defs/dev.ucp.common.identity_linking/business_schema",
    "schemas/common/identity_linking.json#/$defs/dev.ucp.common.identity_linking/platform_schema",
    "schemas/shopping/permalink.json#/$defs/dev.ucp.shopping.permalink/business_schema",
    "schemas/shopping/permalink.json#/$defs/dev.ucp.shopping.permalink/platform_schema",
    "schemas/shopping/permalink.json#/$defs/dev.ucp.shopping.permalink/response_schema",
  ]);
});

test("emits one fragment per capability and role when projection split the file into request and response variants", () => {
  // The projector splits a capability that also declares checkout attachments
  // into create_req / update_req / _resp files. All three carry the SAME
  // declaration; emitting all three would generate three copies of one type.
  const roles = {
    platform_schema: "Fulfillment Capability (Platform)",
    business_schema: "Fulfillment Capability (Business)",
  };
  const out = withTree(
    {
      "schemas/shopping/fulfillment.create_req.json": declaration(
        "dev.ucp.shopping.fulfillment",
        roles
      ),
      "schemas/shopping/fulfillment.update_req.json": declaration(
        "dev.ucp.shopping.fulfillment",
        roles
      ),
      "schemas/shopping/fulfillment_resp.json": declaration(
        "dev.ucp.shopping.fulfillment",
        roles
      ),
    },
    run
  );

  assert.deepEqual(out, [
    "schemas/shopping/fulfillment_resp.json#/$defs/dev.ucp.shopping.fulfillment/business_schema",
    "schemas/shopping/fulfillment_resp.json#/$defs/dev.ucp.shopping.fulfillment/platform_schema",
  ]);
});

test("emits every variant when the variants genuinely differ", () => {
  // Deduplication is by STRUCTURE, not by name. If a projection ever makes the
  // declarations genuinely differ, dropping one would silently lose a type.
  const out = withTree(
    {
      "schemas/shopping/thing.create_req.json": {
        $defs: {
          "dev.ucp.shopping.thing": {
            business_schema: {
              title: "Thing (Business) Create Request",
              properties: { a: { type: "string" } },
            },
          },
        },
      },
      "schemas/shopping/thing_resp.json": {
        $defs: {
          "dev.ucp.shopping.thing": {
            business_schema: {
              title: "Thing (Business) Response",
              properties: { b: { type: "string" } },
            },
          },
        },
      },
    },
    run
  );

  assert.equal(out.length, 2, `expected both variants, got ${out.join(", ")}`);
});

test("ignores schemas that are not declaration shaped", () => {
  // Negative control. Without this the discovery could pass by emitting
  // everything it sees.
  const out = withTree(
    {
      "schemas/common/types/amount.json": {
        type: "object",
        properties: { value: { type: "number" } },
      },
      "schemas/shopping/checkout.json": {
        $defs: {
          // a $defs key that is NOT a reverse domain capability name
          checkout: { type: "object", properties: { id: { type: "string" } } },
        },
      },
      "schemas/shopping/other.json": {
        $defs: {
          // a reverse domain key that holds no declaration roles
          "dev.ucp.shopping.other": {
            type: "object",
            properties: { id: { type: "string" } },
          },
        },
      },
    },
    run
  );

  assert.deepEqual(out, []);
});

test("--manifest writes one JSON entry per emitted fragment, carrying title and structure hash", () => {
  const out = withTree(
    {
      "schemas/common/identity_linking.json": declaration(
        "dev.ucp.common.identity_linking",
        { platform_schema: "Identity Linking (Platform)" }
      ),
      "schemas/shopping/permalink.json": declaration(
        "dev.ucp.shopping.permalink",
        { platform_schema: "Permalink Capability (Platform)" }
      ),
    },
    (root) => {
      const manifestPath = path.join(root, "manifest.json");
      const stdout = execFileSync(
        "node",
        [SCRIPT, "--manifest", manifestPath, root],
        { encoding: "utf8" }
      );
      return {
        srcs: stdout
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        manifest: JSON.parse(fs.readFileSync(manifestPath, "utf8")),
      };
    }
  );

  // The src list on stdout is unchanged by the flag.
  assert.equal(out.srcs.length, 2);
  assert.equal(out.manifest.length, 2);
  const byCapability = new Map(out.manifest.map((e) => [e.capability, e]));
  const idLink = byCapability.get("dev.ucp.common.identity_linking");
  const permalink = byCapability.get("dev.ucp.shopping.permalink");
  assert.equal(idLink.role, "platform_schema");
  assert.equal(idLink.title, "Identity Linking (Platform)");
  assert.equal(idLink.src, out.srcs[0]);
  assert.ok(idLink.structureHash);
  // Both declarations are a bare allOf over capability.json: identical modulo
  // annotations, so they share one structure hash. quicktype unifies exactly
  // such pairs, and the shared hash is what lets the alias step find the
  // surviving sibling.
  assert.equal(idLink.structureHash, permalink.structureHash);
});

test("structure hashing ignores annotations (title, description) but not constraints", () => {
  const variant = (description, extra) => ({
    $defs: {
      "dev.ucp.common.thing": {
        business_schema: {
          title: "Thing (Business)",
          description,
          allOf: [{ $ref: "../capability.json" }],
          ...extra,
        },
      },
    },
  });
  // Same structure, different description: deduplicated to ONE fragment.
  const deduped = withTree(
    {
      "schemas/a/thing.create_req.json": variant("described one way"),
      "schemas/a/thing_resp.json": variant("described another way"),
    },
    run
  );
  assert.equal(deduped.length, 1, deduped.join(", "));

  // A real structural difference still yields both.
  const kept = withTree(
    {
      "schemas/a/thing.create_req.json": variant("same words"),
      "schemas/a/thing_resp.json": variant("same words", {
        required: ["config"],
      }),
    },
    run
  );
  assert.equal(kept.length, 2, kept.join(", "));
});
