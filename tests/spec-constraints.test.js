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

// Regression tests for js-sdk#33: the generated zod schemas must enforce the
// value constraints declared in the UCP JSON Schemas, not just object shape.
//
// The schemas are compiled from src/spec_generated.ts by the "pretest" step so
// the test exercises the generated zod schemas directly.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  PriceSchema,
  TotalResponseSchema,
  MediaSchema,
  ProductOptionSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

// --- PriceSchema: the headline of issue #33 --------------------------------
// amount is { type: integer, minimum: 0 }; currency is ^[A-Z]{3}$.

test("PriceSchema rejects a negative amount (minimum: 0)", () => {
  assert.ok(rejects(PriceSchema, { amount: -50, currency: "USD" }));
});

test("PriceSchema rejects a non-integer amount (type: integer)", () => {
  assert.ok(rejects(PriceSchema, { amount: 9.99, currency: "USD" }));
});

test("PriceSchema rejects a lowercase currency (pattern ^[A-Z]{3}$)", () => {
  assert.ok(rejects(PriceSchema, { amount: 5, currency: "usd" }));
});

test("PriceSchema accepts a spec-valid price", () => {
  assert.ok(accepts(PriceSchema, { amount: 5, currency: "USD" }));
  assert.ok(accepts(PriceSchema, { amount: 0, currency: "EUR" })); // 0 = free
});

test("PriceSchema: the exact invalid payloads from issue #33 are rejected", () => {
  // Each of these `.parse()` calls succeeded before the fix.
  assert.ok(rejects(PriceSchema, { amount: -50 }));
  assert.ok(rejects(PriceSchema, { amount: 9.99 }));
  assert.ok(rejects(PriceSchema, { currency: "usd" }));
});

// --- TotalResponseSchema: object-scoped correctness ------------------------
// A signed total amount is { type: integer } WITHOUT `minimum`. The fix must
// enforce `.int()` here but must NOT wrongly add `.gte(0)` -- a discount total
// is legitimately negative.

test("TotalResponseSchema accepts a negative integer amount", () => {
  assert.ok(accepts(TotalResponseSchema, { amount: -100, type: "discount" }));
});

test("TotalResponseSchema still rejects a non-integer amount", () => {
  assert.ok(rejects(TotalResponseSchema, { amount: 1.5, type: "discount" }));
});

// --- MediaSchema: integer + minimum on dimensions --------------------------
// height / width are { type: integer, minimum: 1 }.

test("MediaSchema rejects a zero dimension (minimum: 1)", () => {
  assert.ok(
    rejects(MediaSchema, { type: "image", url: "https://x/y.png", height: 0 })
  );
});

test("MediaSchema rejects a fractional dimension (type: integer)", () => {
  assert.ok(
    rejects(MediaSchema, { type: "image", url: "https://x/y.png", width: 1.5 })
  );
});

test("MediaSchema accepts positive integer dimensions", () => {
  assert.ok(
    accepts(MediaSchema, {
      type: "image",
      url: "https://x/y.png",
      height: 1,
      width: 640,
    })
  );
});

// --- ProductOptionSchema: array minItems -----------------------------------
// values is an array with minItems: 1.

test("ProductOptionSchema rejects an empty values array (minItems: 1)", () => {
  assert.ok(rejects(ProductOptionSchema, { name: "size", values: [] }));
});

test("ProductOptionSchema accepts a non-empty values array", () => {
  assert.ok(
    accepts(ProductOptionSchema, { name: "size", values: [{ label: "S" }] })
  );
});
