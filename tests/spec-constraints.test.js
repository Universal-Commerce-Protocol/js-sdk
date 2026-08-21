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
  CheckoutResponseMessageSchema,
  LookupResponseMessageSchema,
  CheckoutResponseSchema,
  CartResponseSchema,
  FulfillmentEventSchema,
  AdjustmentSchema,
  FulfillmentOptionSchema,
  PurpleUnitPriceSchema,
  UcpSchema,
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

// --- Unit price measure/reference: contextual split -------------------------
// Both objects have {unit,value}, but the pinned schema declares measure.value
// as `number` and reference.value as `integer`. The generated schemas must not
// let quicktype's shared-object merge apply the integer rule to both contexts.

const unitPrice = (measureValue, referenceValue) => ({
  amount: 125,
  currency: "USD",
  measure: { unit: "kg", value: measureValue },
  reference: { unit: "kg", value: referenceValue },
});

test("unit price measure accepts fractional and integer values", () => {
  assert.ok(accepts(PurpleUnitPriceSchema, unitPrice(0.5, 100)));
  assert.ok(accepts(PurpleUnitPriceSchema, unitPrice(1, 100)));
});

test("unit price reference requires an integer value", () => {
  assert.ok(rejects(PurpleUnitPriceSchema, unitPrice(0.5, 0.5)));
  assert.ok(accepts(PurpleUnitPriceSchema, unitPrice(0.5, 100)));
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

// --- Capability extends: branch-local oneOf constraints --------------------
// capability.json defines extends as either a reverse-domain capability name or
// a non-empty array of those names. quicktype renders the oneOf as a plain
// z.union, so the injector must recover constraints on each union branch.

test("CapabilityResponseSchema rejects an empty extends array", () => {
  assert.ok(
    rejects(CapabilityResponseSchema, {
      version: "2026-04-08",
      extends: [],
    })
  );
});

test("CapabilityResponseSchema rejects invalid extends names", () => {
  assert.ok(
    rejects(CapabilityResponseSchema, {
      version: "2026-04-08",
      extends: "bad name",
    })
  );
  assert.ok(
    rejects(CapabilityResponseSchema, {
      version: "2026-04-08",
      extends: ["com.example.good", "BadName"],
    })
  );
});

test("CapabilityResponseSchema accepts valid extends names", () => {
  assert.ok(
    accepts(CapabilityResponseSchema, {
      version: "2026-04-08",
      extends: "dev.ucp.checkout",
    })
  );
  assert.ok(
    accepts(CapabilityResponseSchema, {
      version: "2026-04-08",
      extends: ["dev.ucp.checkout", "com.example_capability.v1"],
    })
  );
});

test("UcpSchema enforces the discovery version pattern", () => {
  const discovery = { capabilities: [], services: {} };
  assert.ok(rejects(UcpSchema, { ...discovery, version: "not-a-date" }));
  assert.ok(accepts(UcpSchema, { ...discovery, version: "2026-04-08" }));
});

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

// --- format: date-time must stay an RFC 3339 STRING -------------------------
// checkout.expires_at, cart.expires_at, fulfillment_event.occurred_at,
// adjustment.occurred_at and fulfillment_option.*_fulfillment_time are
// { type: string, format: date-time } in the source schemas. quicktype emits
// z.coerce.date() for them, which (a) accepts a raw number (epoch), (b)
// accepts a date-only string, (c) accepts a timezone-less local datetime, and
// (d) parses to a JS Date so a round-trip re-serializes a changed value.

const ExpiresAtSchema = CheckoutResponseSchema.shape.expires_at;
const CartExpiresAtSchema = CartResponseSchema.shape.expires_at;
const OccurredAtSchema = FulfillmentEventSchema.shape.occurred_at;
const AdjustmentOccurredAtSchema = AdjustmentSchema.shape.occurred_at;

test("checkout expires_at rejects a raw number (spec type is string)", () => {
  assert.ok(rejects(ExpiresAtSchema, 12345));
  assert.ok(rejects(CartExpiresAtSchema, 12345));
});

test("checkout expires_at rejects a date-only string (format: date-time)", () => {
  assert.ok(rejects(ExpiresAtSchema, "2026-04-08"));
});

test("checkout expires_at rejects a datetime without a UTC offset", () => {
  // RFC 3339 date-time requires time-offset ("Z" or +hh:mm / -hh:mm).
  assert.ok(rejects(ExpiresAtSchema, "2026-04-08T10:00:00"));
});

test("checkout expires_at accepts RFC 3339 date-times", () => {
  assert.ok(accepts(ExpiresAtSchema, "2026-04-08T10:00:00Z"));
  assert.ok(accepts(ExpiresAtSchema, "2026-04-08T10:00:00+02:00"));
  assert.ok(accepts(ExpiresAtSchema, "2026-04-08T10:00:00.123Z"));
  assert.ok(accepts(ExpiresAtSchema, undefined)); // stays optional
});

test("fulfillment/adjustment occurred_at enforce the same string format", () => {
  assert.ok(rejects(OccurredAtSchema, 12345));
  assert.ok(rejects(AdjustmentOccurredAtSchema, 12345));
  assert.ok(accepts(OccurredAtSchema, "2026-04-08T10:00:00Z"));
  assert.ok(accepts(AdjustmentOccurredAtSchema, "2026-04-08T10:00:00Z"));
});

test("fulfillment option times enforce the same string format", () => {
  const Earliest = FulfillmentOptionSchema.shape.earliest_fulfillment_time;
  const Latest = FulfillmentOptionSchema.shape.latest_fulfillment_time;
  assert.ok(rejects(Earliest, 12345));
  assert.ok(rejects(Latest, "2026-04-08"));
  assert.ok(accepts(Earliest, "2026-04-08T10:00:00Z"));
  assert.ok(accepts(Latest, "2026-04-09T10:00:00Z"));
});

test("a date-time field round-trips verbatim (string in, same string out)", () => {
  const wire = "2026-04-08T10:00:00+02:00";
  assert.equal(OccurredAtSchema.parse(wire), wire);
});

// --- message oneOf: per-variant required fields ------------------------------
// types/message.json is a oneOf of error/warning/info variants discriminated
// by a `type` const. Per the source schemas: an error message REQUIRES code,
// content and severity; a warning REQUIRES code and content; an info only
// content. quicktype collapses the union into one object with the
// INTERSECTION of the required lists ({type, content}), so an error message
// without code/severity used to parse. python-sdk rejects the same input.

const errorMessage = {
  type: "error",
  code: "payment_failed",
  content: "The payment could not be processed.",
  severity: "recoverable",
};

test("an error message without code and severity is rejected", () => {
  assert.ok(
    rejects(CheckoutResponseMessageSchema, { type: "error", content: "x" })
  );
});

test("an error message without severity is rejected", () => {
  const { severity, ...noSeverity } = errorMessage;
  assert.ok(rejects(CheckoutResponseMessageSchema, noSeverity));
});

test("an error message without code is rejected", () => {
  const { code, ...noCode } = errorMessage;
  assert.ok(rejects(CheckoutResponseMessageSchema, noCode));
});

test("a complete error message is accepted", () => {
  assert.ok(accepts(CheckoutResponseMessageSchema, errorMessage));
});

test("a warning message without code is rejected", () => {
  assert.ok(
    rejects(CheckoutResponseMessageSchema, { type: "warning", content: "x" })
  );
});

test("a warning message with code and content is accepted", () => {
  assert.ok(
    accepts(CheckoutResponseMessageSchema, {
      type: "warning",
      code: "low_stock",
      content: "Only 2 left.",
    })
  );
});

test("an info message needs only type and content", () => {
  assert.ok(
    accepts(CheckoutResponseMessageSchema, { type: "info", content: "x" })
  );
  // Variants do not set additionalProperties: false, so optional fields from
  // the union stay legal on any variant.
  assert.ok(
    accepts(CheckoutResponseMessageSchema, {
      type: "info",
      content: "x",
      path: "$.line_items[0]",
    })
  );
});

test("the lookup message alias enforces the same variant rules", () => {
  assert.ok(
    rejects(LookupResponseMessageSchema, { type: "error", content: "x" })
  );
  assert.ok(accepts(LookupResponseMessageSchema, errorMessage));
});
