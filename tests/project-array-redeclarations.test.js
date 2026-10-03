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

// quicktype intersects `allOf`, and its intersection of two arrays drops the
// items of the first array it meets. catalog_lookup.json's detail_product
// composes product.json and redeclares `options` so that options[].values[]
// are detail_option_value.json, but the generated GetProductResponseSchema
// kept product.json's plain option value and stripped `available` and
// `exists`. The projection (scripts/project-current-ucp-schemas.mjs) now
// moves such a redeclaration into a trailing allOf branch, the array whose
// items quicktype keeps.

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

const { GetProductResponseSchema } = require("./.dist/spec_generated.js");

// The smallest root schema set the projection needs to derive its discovery
// envelope; the shapes under test live in shopping/types.
function roots() {
  const entity = {
    type: "object",
    properties: { schema: { type: "string" }, spec: { type: "string" } },
  };
  return {
    "schemas/ucp.json": {
      $defs: {
        version: { type: "string" },
        entity,
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
      $defs: { response_schema: entity },
    },
    "schemas/service.json": {
      $defs: {
        base: {
          allOf: [
            {},
            { type: "object", properties: { endpoint: { type: "string" } } },
          ],
        },
        response_schema: entity,
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
        response_schema: entity,
      },
    },
  };
}

const value = {
  title: "Value",
  type: "object",
  required: ["label"],
  properties: { label: { type: "string" } },
};

const detailValue = {
  title: "Detail Value",
  type: "object",
  allOf: [{ $ref: "value.json" }],
  properties: { available: { type: "boolean" } },
};

const item = {
  title: "Item",
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    values: { type: "array", items: { $ref: "value.json" } },
  },
};

function project(detail) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-project-"));
  const source = path.join(dir, "source");
  const output = path.join(dir, "projected");
  try {
    const files = {
      ...roots(),
      "schemas/shopping/types/value.json": value,
      "schemas/shopping/types/detail_value.json": detailValue,
      "schemas/shopping/types/item.json": item,
      "schemas/shopping/types/detail_item.json": detail,
    };
    for (const [rel, schema] of Object.entries(files)) {
      const abs = path.join(source, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, JSON.stringify(schema, null, 2));
    }
    execFileSync("node", [SCRIPT, source, output], { stdio: "pipe" });
    return JSON.parse(
      fs.readFileSync(
        path.join(output, "schemas/shopping/types/detail_item.json"),
        "utf8"
      )
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("projection moves an array redeclared with narrower items into a trailing allOf branch", () => {
  const projected = project({
    title: "Detail Item",
    type: "object",
    allOf: [{ $ref: "item.json" }],
    required: ["values"],
    properties: {
      selected: { type: "array", items: { type: "string" } },
      values: { type: "array", items: { $ref: "detail_value.json" } },
    },
  });
  assert.deepEqual(projected.allOf, [
    { $ref: "item.json" },
    {
      type: "object",
      properties: {
        values: { type: "array", items: { $ref: "detail_value.json" } },
      },
      required: ["values"],
    },
  ]);
  assert.deepEqual(Object.keys(projected.properties), ["selected"]);
  assert.equal(projected.required, undefined);
});

test("projection leaves a redeclaration with the base's own items in place", () => {
  const projected = project({
    title: "Detail Item",
    type: "object",
    allOf: [{ $ref: "item.json" }],
    properties: {
      tags: { type: "array", items: { type: "string" }, minItems: 1 },
    },
  });
  assert.deepEqual(projected.allOf, [{ $ref: "item.json" }]);
  assert.deepEqual(Object.keys(projected.properties), ["tags"]);
});

test("GetProductResponseSchema keeps detail option value availability", () => {
  const product = {
    id: "prod_1",
    title: "Runner",
    description: { plain: "A shoe." },
    price_range: {
      min: { amount: 9900, currency: "USD" },
      max: { amount: 9900, currency: "USD" },
    },
    variants: [
      {
        id: "var_1",
        title: "Runner, 9",
        description: { plain: "Size 9." },
        price: { amount: 9900, currency: "USD" },
      },
    ],
    options: [
      {
        name: "Size",
        values: [
          { label: "9", available: true, exists: true },
          { label: "10", available: false, exists: true },
        ],
      },
    ],
  };
  const result = GetProductResponseSchema.safeParse({
    ucp: { version: "2026-08-25" },
    product,
  });
  assert.ok(result.success, JSON.stringify(result.error?.issues));
  assert.deepEqual(
    result.data.product.options[0].values,
    product.options[0].values
  );
  assert.equal(
    GetProductResponseSchema.safeParse({
      ucp: { version: "2026-08-25" },
      product: { ...product, options: [{ name: "Size", values: [] }] },
    }).success,
    false,
    "values keeps minItems: 1"
  );
});
