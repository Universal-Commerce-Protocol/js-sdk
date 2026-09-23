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

// The request projection (scripts/project-current-ucp-schemas.mjs) feeds
// quicktype, which emits `properties` and ignores `if`/`then`/`else`. A
// property the spec declares ONLY inside a conditional branch for a variant
// (fulfillment_method.json: `destinations` is `ucp_request: omit` at the root
// and `optional` inside the `type: shipping` branch) therefore vanishes from
// the generated z.object, and z.object then strips it from parsed input
// SILENTLY. The projector hoists such branch-declared properties to the root
// of the projection, as optional, typed by the branch that declares them, and
// refuses to guess when two branches disagree.

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
  "project-current-ucp-schemas.mjs"
);

// The smallest root schema set the projection needs to derive its discovery
// envelope; the shapes under test live in shopping/types.
function roots() {
  return {
    "schemas/ucp.json": {
      $defs: {
        version: { type: "string" },
        entity: {
          type: "object",
          properties: { schema: { type: "string" }, spec: { type: "string" } },
        },
        base: {
          type: "object",
          required: ["version"],
          properties: { version: { $ref: "#/$defs/version" } },
        },
        business_schema: {
          allOf: [{ $ref: "#/$defs/base" }, { type: "object" }],
        },
      },
    },
    "schemas/payment_handler.json": {
      $defs: {
        response_schema: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string" } },
        },
      },
    },
    "schemas/service.json": {
      $defs: {
        base: {
          allOf: [
            {},
            { type: "object", properties: { endpoint: { type: "string" } } },
          ],
        },
        response_schema: {
          type: "object",
          properties: { endpoint: { type: "string" } },
        },
      },
    },
    "schemas/capability.json": {
      $defs: {
        base: {
          allOf: [
            {},
            { type: "object", properties: { extends: { type: "string" } } },
          ],
        },
        response_schema: {
          type: "object",
          properties: { extends: { type: "string" } },
        },
      },
    },
  };
}

function branch(typeValue, thenSchema) {
  return {
    if: { properties: { type: { const: typeValue } }, required: ["type"] },
    then: thenSchema,
  };
}

// fulfillment_method.json in miniature: root `destinations` omitted from
// requests; the shipping branch redeclares it optional with its own items;
// the pickup branch declares it omitted.
function methodSchema() {
  return {
    title: "Method",
    type: "object",
    required: ["id", "type"],
    properties: {
      id: {
        type: "string",
        ucp_request: { create: "omit", update: "optional" },
      },
      type: {
        type: "string",
        ucp_request: { create: "required", update: "optional" },
      },
      destinations: {
        type: "array",
        description: "Root destinations.",
        ucp_request: "omit",
        items: { $ref: "dest.json" },
      },
    },
    allOf: [
      branch("shipping", {
        properties: {
          destinations: {
            type: "array",
            description: "Shipping branch destinations.",
            ucp_request: "optional",
            items: { $ref: "ship_dest.json" },
          },
        },
      }),
      branch("pickup", {
        properties: {
          destinations: {
            type: "array",
            ucp_request: "omit",
            items: { $ref: "loc_dest.json" },
          },
        },
      }),
    ],
    dependentRequired: { destinations: ["type"] },
  };
}

function baseTree() {
  return {
    ...roots(),
    "schemas/shopping/types/method.json": methodSchema(),
    "schemas/shopping/types/dest.json": {
      title: "Dest",
      type: "object",
      properties: { id: { type: "string", ucp_request: "optional" } },
    },
    "schemas/shopping/types/ship_dest.json": {
      title: "Ship Dest",
      type: "object",
      required: ["id"],
      properties: {
        postal_code: { type: "string" },
        id: { type: "string", ucp_request: "optional" },
      },
    },
    "schemas/shopping/types/loc_dest.json": {
      title: "Loc Dest",
      type: "object",
      properties: { name: { type: "string", ucp_request: "omit" } },
    },
  };
}

function writeTree(root, files) {
  for (const [rel, value] of Object.entries(files)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, JSON.stringify(value, null, 2));
  }
}

function project(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-project-"));
  const source = path.join(dir, "source");
  const output = path.join(dir, "projected");
  try {
    writeTree(source, files);
    execFileSync("node", [SCRIPT, source, output], { stdio: "pipe" });
    const read = (rel) =>
      JSON.parse(
        fs.readFileSync(
          path.join(output, "schemas", "shopping", "types", rel),
          "utf8"
        )
      );
    return {
      create: read("method.create_req.json"),
      update: read("method.update_req.json"),
      response: read("method_resp.json"),
      read,
    };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("create projection hoists the shipping branch's destinations to the root, optional and typed by the branch", () => {
  const { create } = project(baseTree());
  assert.deepEqual(create.properties.destinations, {
    type: "array",
    description: "Shipping branch destinations.",
    items: { $ref: "ship_dest.create_req.json" },
  });
  assert.deepEqual(create.required, ["type"]);
});

test("update projection hoists destinations too, with the update rules applied", () => {
  const { update } = project(baseTree());
  assert.deepEqual(update.properties.destinations, {
    type: "array",
    description: "Shipping branch destinations.",
    items: { $ref: "ship_dest.update_req.json" },
  });
  assert.equal(update.required, undefined);
  assert.equal(update.properties.id.type, "string");
});

test("the branches themselves are projected and kept, so the request still records the rule", () => {
  const { create } = project(baseTree());
  assert.deepEqual(create.allOf[0].then.properties.destinations, {
    type: "array",
    description: "Shipping branch destinations.",
    items: { $ref: "ship_dest.create_req.json" },
  });
  assert.deepEqual(create.allOf[1].then.properties, {});
  assert.deepEqual(create.dependentRequired, { destinations: ["type"] });
});

test("a root-declared property is never overridden by a branch", () => {
  const { response } = project(baseTree());
  assert.deepEqual(response.properties.destinations, {
    type: "array",
    description: "Root destinations.",
    items: { $ref: "dest_resp.json" },
  });
  assert.deepEqual(response.required, ["id", "type"]);
});

test("a property the root never declares is left to its branch, not restored", () => {
  // Restoring is scoped to what the projection itself removed. A branch-only
  // property (identity_linking.json's provider declares auth_url only inside
  // its branches) is a quicktype limitation independent of the variant rules,
  // and the capability declaration fragments are generated from the raw tree,
  // so restoring it in the projection alone would make the two generations of
  // one declaration disagree and fail the merge.
  const files = baseTree();
  files["schemas/shopping/types/method.json"].allOf.push(
    branch("locker", {
      properties: { locker_code: { type: "string", ucp_request: "required" } },
    })
  );
  const { create, update, response } = project(files);
  for (const variant of [create, update, response]) {
    assert.equal(variant.properties.locker_code, undefined);
    assert.deepEqual(variant.allOf[2].then.properties.locker_code, {
      type: "string",
    });
  }
});

test("a root property omitted for the response is restored from a branch that admits it there", () => {
  const files = baseTree();
  const method = files["schemas/shopping/types/method.json"];
  method.properties.hint = { type: "string", ucp_response: "omit" };
  method.allOf.push(
    branch("locker", {
      properties: { hint: { type: "string", description: "Locker hint." } },
    })
  );
  const { create, response } = project(files);
  assert.deepEqual(response.properties.hint, {
    type: "string",
    description: "Locker hint.",
  });
  assert.ok(!(response.required ?? []).includes("hint"));
  // The request variants never omitted it, so the root declaration stands.
  assert.deepEqual(create.properties.hint, { type: "string" });
});

test("two branches declaring the same hoisted property identically are accepted", () => {
  const files = baseTree();
  files["schemas/shopping/types/method.json"].allOf.push(
    branch("express", {
      properties: {
        destinations: {
          type: "array",
          description: "Shipping branch destinations.",
          ucp_request: "optional",
          items: { $ref: "ship_dest.json" },
        },
      },
    })
  );
  const { create } = project(files);
  assert.equal(
    create.properties.destinations.items.$ref,
    "ship_dest.create_req.json"
  );
});

test("two branches declaring the same hoisted property differently fail the projection loudly", () => {
  const files = baseTree();
  files["schemas/shopping/types/method.json"].allOf.push(
    branch("express", {
      properties: {
        destinations: {
          type: "array",
          ucp_request: "optional",
          items: { $ref: "loc_dest.json" },
        },
      },
    })
  );
  let failure = null;
  try {
    project(files);
  } catch (error) {
    failure = error;
  }
  assert.ok(failure, "the projection must not silently pick one branch");
  assert.notEqual(failure.status, 0);
  assert.match(String(failure.stderr), /destinations/);
  assert.match(String(failure.stderr), /method\.json/);
});
