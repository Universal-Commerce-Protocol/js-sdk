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

// Follow-on to js-sdk#33/#34: the generated zod schemas must also enforce the
// JSON Schema array set/cardinality constraints quicktype drops, not just the
// scalar/length/items constraints #34 restored. Covered here:
//   - `uniqueItems: true`         (Context.eligibility)
//   - `contains` + `minContains`/`maxContains`
//                                 (checkout/cart/order `totals`)
//
// The schemas are compiled from src/spec_generated.ts by the "pretest" step so
// the test exercises the generated zod schemas directly. Each array constraint
// is reached through its parent object's `.shape` so the injected
// `.refine()` / `.superRefine()` is exercised in isolation.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  CheckoutCreateRequestContextSchema,
  CheckoutResponseSchema,
  OrderSchema,
  FulfillmentOptionSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

// --- uniqueItems: Context.eligibility --------------------------------------
// eligibility is { type: array, uniqueItems: true }. quicktype dropped the
// uniqueItems, so `[x, x]` used to parse.

const EligibilitySchema = CheckoutCreateRequestContextSchema.shape.eligibility;

test("Context.eligibility rejects duplicate items (uniqueItems)", () => {
  assert.ok(
    rejects(EligibilitySchema, ["com.example.loyalty", "com.example.loyalty"])
  );
});

test("Context.eligibility accepts distinct items", () => {
  assert.ok(
    accepts(EligibilitySchema, ["com.example.loyalty", "org.school.student"])
  );
});

test("Context.eligibility accepts an empty array and stays optional", () => {
  assert.ok(accepts(EligibilitySchema, []));
  assert.ok(accepts(EligibilitySchema, undefined));
});

// --- contains + minContains/maxContains: checkout/cart/order totals ---------
// The `totals` array (references types/totals.json) MUST contain exactly one
// entry with type "subtotal" and exactly one with type "total"; detail entries
// (tax, fee, discount, fulfillment) may repeat.

const CheckoutTotalsSchema = CheckoutResponseSchema.shape.totals;

const subtotal = { amount: 900, type: "subtotal" };
const total = { amount: 1000, type: "total" };
const tax = { amount: 100, type: "tax" };

test("checkout totals accept exactly one subtotal and one total", () => {
  assert.ok(accepts(CheckoutTotalsSchema, [subtotal, total]));
});

test("checkout totals accept repeated detail entries alongside the pair", () => {
  assert.ok(accepts(CheckoutTotalsSchema, [subtotal, tax, tax, total]));
});

test("checkout totals reject a missing subtotal (minContains: 1)", () => {
  assert.ok(rejects(CheckoutTotalsSchema, [total]));
});

test("checkout totals reject a missing total (minContains: 1)", () => {
  assert.ok(rejects(CheckoutTotalsSchema, [subtotal]));
});

test("checkout totals reject an empty array", () => {
  assert.ok(rejects(CheckoutTotalsSchema, []));
});

test("checkout totals reject two subtotals (maxContains: 1)", () => {
  assert.ok(
    rejects(CheckoutTotalsSchema, [
      subtotal,
      { amount: 1, type: "subtotal" },
      total,
    ])
  );
});

test("checkout totals reject two totals (maxContains: 1)", () => {
  assert.ok(
    rejects(CheckoutTotalsSchema, [
      subtotal,
      total,
      { amount: 1, type: "total" },
    ])
  );
});

test("order totals enforce the same subtotal/total cardinality", () => {
  const OrderTotalsSchema = OrderSchema.shape.totals;
  assert.ok(accepts(OrderTotalsSchema, [subtotal, total]));
  assert.ok(rejects(OrderTotalsSchema, [subtotal, subtotal, total]));
});

// --- object-scoped correctness (the killer test) ---------------------------
// A fulfillment-option `totals` is an inline `total.json` array WITHOUT the
// `contains` rules. The injector must NOT wrongly apply the checkout
// cardinality here: a shipping breakdown with no "subtotal"/"total" entry is
// valid.

test("fulfillment-option totals do NOT inherit the checkout contains rule", () => {
  const FulfillmentTotalsSchema = FulfillmentOptionSchema.shape.totals;
  assert.ok(
    accepts(FulfillmentTotalsSchema, [{ amount: 500, type: "shipping" }])
  );
  assert.ok(accepts(FulfillmentTotalsSchema, []));
});
