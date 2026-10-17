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

const { GetProductResponseSchema } = require("./.dist/spec_generated.js");

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
