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
  PriceFilterSchema,
  TotalResponseSchema,
  TotalsResponseSchema,
  SearchResponsePaginationSchema,
  MediaSchema,
  ProductOptionSchema,
  ProductSchema,
  LookupRequestSchema,
  LineItemCreateRequestSchema,
  LineItemUpdateRequestSchema,
  CapabilityResponseSchema,
  ServiceResponseSchema,
  PaymentHandlerResponseSchema,
  AvailablePaymentInstrumentSchema,
  DescriptionSchema,
  OrderConfirmationSchema,
  LineItemQuantityRefSchema,
  AdjustmentLineItemSchema,
  EventLineItemSchema,
  ExpectationLineItemSchema,
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

// --- Shared line-item quantity refs: contextual split ----------------------
// adjustment / fulfillment_event / expectation all declare
// `line_items[].quantity` as `type: integer`. Only the event and expectation
// quantities add `minimum: 1`; the adjustment quantity is signed (negative =
// returns). The shared LineItemQuantityRefSchema carries `.int()`; the two
// `minimum: 1` aliases are split into standalone objects with `.gte(1)`.

test("shared LineItemQuantityRefSchema enforces an integer quantity", () => {
  assert.ok(rejects(LineItemQuantityRefSchema, { id: "li_1", quantity: 1.5 }));
  assert.ok(accepts(LineItemQuantityRefSchema, { id: "li_1", quantity: -1 }));
});

test("AdjustmentLineItemSchema allows a signed integer quantity", () => {
  assert.ok(accepts(AdjustmentLineItemSchema, { id: "li_1", quantity: -1 }));
  assert.ok(rejects(AdjustmentLineItemSchema, { id: "li_1", quantity: 1.5 }));
});

test("EventLineItemSchema rejects a zero quantity (minimum: 1)", () => {
  assert.ok(rejects(EventLineItemSchema, { id: "li_1", quantity: 0 }));
});

test("EventLineItemSchema rejects a negative quantity (minimum: 1)", () => {
  assert.ok(rejects(EventLineItemSchema, { id: "li_1", quantity: -1 }));
});

test("EventLineItemSchema rejects a fractional quantity (type: integer)", () => {
  assert.ok(rejects(EventLineItemSchema, { id: "li_1", quantity: 1.5 }));
});

test("EventLineItemSchema accepts a positive integer quantity", () => {
  assert.ok(accepts(EventLineItemSchema, { id: "li_1", quantity: 1 }));
  assert.ok(accepts(EventLineItemSchema, { id: "li_1", quantity: 3 }));
});

test("ExpectationLineItemSchema rejects a zero quantity (minimum: 1)", () => {
  assert.ok(rejects(ExpectationLineItemSchema, { id: "li_1", quantity: 0 }));
});

test("ExpectationLineItemSchema rejects a negative quantity (minimum: 1)", () => {
  assert.ok(rejects(ExpectationLineItemSchema, { id: "li_1", quantity: -1 }));
});

test("ExpectationLineItemSchema rejects a fractional quantity (type: integer)", () => {
  assert.ok(rejects(ExpectationLineItemSchema, { id: "li_1", quantity: 1.5 }));
});

test("ExpectationLineItemSchema accepts a positive integer quantity", () => {
  assert.ok(accepts(ExpectationLineItemSchema, { id: "li_1", quantity: 1 }));
});

// --- Projected request constraints -----------------------------------------
// create/update projections must retain the constraints from their source
// schemas even after omitted fields change the generated object's property set.

test("PriceFilterSchema enforces amount constraints on min and max", () => {
  assert.ok(rejects(PriceFilterSchema, { min: -1 }));
  assert.ok(rejects(PriceFilterSchema, { max: 9.99 }));
  assert.ok(accepts(PriceFilterSchema, { min: 0, max: 500 }));
});

test("LineItemCreateRequestSchema enforces positive integer quantity", () => {
  assert.ok(
    rejects(LineItemCreateRequestSchema, {
      item: { id: "item_1" },
      quantity: 0,
    })
  );
  assert.ok(
    rejects(LineItemCreateRequestSchema, {
      item: { id: "item_1" },
      quantity: 1.5,
    })
  );
  assert.ok(
    accepts(LineItemCreateRequestSchema, {
      item: { id: "item_1" },
      quantity: 1,
    })
  );
});

test("LineItemUpdateRequestSchema enforces positive integer quantity", () => {
  assert.ok(
    rejects(LineItemUpdateRequestSchema, {
      item: { id: "item_1" },
      quantity: 0,
    })
  );
  assert.ok(
    rejects(LineItemUpdateRequestSchema, {
      item: { id: "item_1" },
      quantity: 1.5,
    })
  );
  assert.ok(
    accepts(LineItemUpdateRequestSchema, {
      item: { id: "item_1" },
      quantity: 1,
    })
  );
});

// --- TotalResponseSchema: object-scoped correctness ------------------------
// A signed total amount is { type: integer } WITHOUT `minimum`. The fix must
// enforce `.int()` here but must NOT wrongly add `.gte(0)` -- a discount total
// is legitimately negative.

test("TotalResponseSchema accepts a negative integer amount", () => {
  assert.ok(accepts(TotalResponseSchema, { amount: -100, type: "discount" }));
});

test("TotalResponseSchema enforces conditional amount signs", () => {
  assert.ok(rejects(TotalResponseSchema, { amount: 50, type: "discount" }));
  assert.ok(
    rejects(TotalResponseSchema, { amount: 50, type: "items_discount" })
  );
  assert.ok(rejects(TotalResponseSchema, { amount: -50, type: "subtotal" }));
  assert.ok(rejects(TotalResponseSchema, { amount: -50, type: "tax" }));
});

test("TotalResponseSchema accepts amounts with valid conditional signs", () => {
  assert.ok(accepts(TotalResponseSchema, { amount: -50, type: "discount" }));
  assert.ok(accepts(TotalResponseSchema, { amount: 50, type: "subtotal" }));
  assert.ok(accepts(TotalResponseSchema, { amount: 0, type: "fee" }));
  assert.ok(accepts(TotalResponseSchema, { amount: -50, type: "custom" }));
});

test("TotalResponseSchema still rejects a non-integer amount", () => {
  assert.ok(rejects(TotalResponseSchema, { amount: 1.5, type: "discount" }));
});

// --- TotalsResponseSchema: conditional display_text for custom types --------
// totals.json: when `type` is NOT one of the well-known categories, the entry
// must carry display_text so the platform can render it by label.

test("TotalsResponseSchema requires display_text for a custom type", () => {
  assert.ok(
    rejects(TotalsResponseSchema, { type: "shipping_surcharge", amount: 500 })
  );
});

test("TotalsResponseSchema accepts a custom type with display_text", () => {
  assert.ok(
    accepts(TotalsResponseSchema, {
      type: "shipping_surcharge",
      amount: 500,
      display_text: "Shipping surcharge",
    })
  );
});

test("TotalsResponseSchema does not require display_text for well-known types", () => {
  for (const type of [
    "subtotal",
    "items_discount",
    "discount",
    "fulfillment",
    "tax",
    "fee",
    "total",
  ]) {
    assert.ok(accepts(TotalsResponseSchema, { type, amount: 100 }), type);
    assert.ok(
      accepts(TotalsResponseSchema, {
        type,
        amount: 100,
        display_text: "Label",
      }),
      `${type} with display_text`
    );
  }
});

test("TotalsResponseSchema does not trigger conditional display_text constraint when type is missing", () => {
  const result = TotalsResponseSchema.safeParse({ amount: 100 });
  assert.strictEqual(result.success, false);
  const issues = result.error.issues;
  assert.ok(issues.some((issue) => issue.path[0] === "type"));
  assert.ok(!issues.some((issue) => issue.path[0] === "display_text"));
});

// --- SearchResponsePaginationSchema: conditional required ------------------
// cursor is required only when has_next_page is true.

test("pagination requires a cursor when another page is available", () => {
  assert.ok(rejects(SearchResponsePaginationSchema, { has_next_page: true }));
  assert.ok(
    accepts(SearchResponsePaginationSchema, {
      has_next_page: true,
      cursor: "next-page",
    })
  );
});

test("pagination allows an absent cursor on the final page", () => {
  assert.ok(accepts(SearchResponsePaginationSchema, { has_next_page: false }));
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

test("AvailablePaymentInstrumentSchema enforces constraints minProperties", () => {
  assert.ok(
    rejects(AvailablePaymentInstrumentSchema, {
      type: "card",
      constraints: {},
    })
  );
  assert.ok(
    accepts(AvailablePaymentInstrumentSchema, {
      type: "card",
      constraints: { network: "visa" },
    })
  );
  assert.ok(accepts(AvailablePaymentInstrumentSchema, { type: "card" }));
});

test("DescriptionSchema enforces minProperties and retains additional properties", () => {
  assert.ok(rejects(DescriptionSchema, {}));
  assert.ok(accepts(DescriptionSchema, { plain: "Description" }));
  assert.deepEqual(DescriptionSchema.parse({ other: "Description" }), {
    other: "Description",
  });
});

test("MediaSchema rejects a url that is not a URL (format: uri)", () => {
  assert.ok(rejects(MediaSchema, { type: "image", url: "not a url" }));
  assert.ok(
    rejects(MediaSchema, { type: "image", url: "cdn.example.com/1.png" })
  );
  assert.ok(
    accepts(MediaSchema, { type: "image", url: "https://cdn.example/1.png" })
  );
});

test("OrderConfirmationSchema rejects a non-URL permalink_url (format: uri)", () => {
  assert.ok(
    rejects(OrderConfirmationSchema, { id: "o_1", permalink_url: "/orders/1" })
  );
  assert.ok(
    accepts(OrderConfirmationSchema, {
      id: "o_1",
      permalink_url: "https://shop.example/orders/1",
    })
  );
});

// --- Cross-file $ref provenance: entity version patterns --------------------
// Every UCP entity inherits `version` from ucp.json#/$defs/entity via a
// cross-file allOf `$ref`. The injector must resolve that property's own
// file (ucp.json) so the YYYY-MM-DD pattern survives on derived schemas.

test("CapabilityResponseSchema enforces the entity version pattern", () => {
  assert.ok(
    rejects(CapabilityResponseSchema, { version: "not-a-date", id: "cap" })
  );
  assert.ok(
    accepts(CapabilityResponseSchema, {
      version: "2026-04-08",
      id: "cap",
    })
  );
});

test("ServiceResponseSchema enforces the entity version pattern", () => {
  assert.ok(
    rejects(ServiceResponseSchema, {
      version: "v2",
      transport: "rest",
    })
  );
  assert.ok(
    accepts(ServiceResponseSchema, {
      version: "2026-04-08",
      transport: "rest",
    })
  );
});

test("PaymentHandlerResponseSchema enforces the entity version pattern", () => {
  assert.ok(
    rejects(PaymentHandlerResponseSchema, {
      version: "abc123",
      id: "handler",
      available_instruments: [{ type: "card", constraints: {} }],
    })
  );
  assert.ok(
    accepts(PaymentHandlerResponseSchema, {
      version: "2026-04-08",
      id: "handler",
      available_instruments: [
        { type: "card", constraints: { network: "visa" } },
      ],
    })
  );
});

// --- Array minItems restored alongside the same provenance fix --------------
// LookupRequest.ids and Product.variants are non-empty arrays per their
// schemas; quicktype drops minItems, and the injector recovers it.

test("LookupRequestSchema rejects an empty ids array (minItems: 1)", () => {
  assert.ok(rejects(LookupRequestSchema, { ids: [] }));
  assert.ok(accepts(LookupRequestSchema, { ids: ["shoes-red-42"] }));
});

const validProduct = (variants) => ({
  description: { plain: "A product" },
  id: "p1",
  price_range: {
    min: { amount: 10, currency: "USD" },
    max: { amount: 20, currency: "USD" },
  },
  title: "Shoes",
  variants,
});

test("ProductSchema rejects a product without variants (minItems: 1)", () => {
  assert.ok(rejects(ProductSchema, validProduct([])));
  assert.ok(
    accepts(
      ProductSchema,
      validProduct([
        {
          id: "v1",
          title: "Red",
          description: { plain: "Red variant" },
          price: { amount: 10, currency: "USD" },
        },
      ])
    )
  );
});

test("ProductSchema rejects a non-URL url (format: uri via cross-file)", () => {
  const productWithUrl = (url) => ({
    ...validProduct([
      {
        id: "v1",
        title: "Red",
        description: { plain: "Red variant" },
        price: { amount: 10, currency: "USD" },
      },
    ]),
    url,
  });
  assert.ok(rejects(ProductSchema, productWithUrl("not a url")));
  assert.ok(
    accepts(ProductSchema, productWithUrl("https://cdn.example/1.png"))
  );
});
