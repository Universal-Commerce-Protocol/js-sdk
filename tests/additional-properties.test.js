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

const {
  CartSchema,
  CheckoutCompleteRequestSchema,
  CheckoutCreateRequestSchema,
  CheckoutSchema,
  ErrorResponseSchema,
  FulfillmentCreateRequestSchema,
  PaymentCredentialSchema,
  PostalAddressSchema,
  RequestConstraintsSchema,
  TokenCredentialSchema,
  ValueConstraintSchema,
} = require("./.dist/spec_generated.js");

const instrument = {
  id: "pi_tok_visa",
  handler_id: "merchant_tokenizer",
  type: "card",
  credential: { type: "card", token: "tok_visa_123" },
};

const ap2Mandate = {
  checkout_mandate: "eyJhbGciOiJ.eyJpc3MiOiJ.c2ln",
};

test("CheckoutCompleteRequestSchema keeps the instrument credential token", () => {
  const result = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [instrument] },
    ap2: ap2Mandate,
  });
  assert.ok(result.success);
  assert.equal(
    result.data.payment.instruments[0].credential.token,
    "tok_visa_123",
    "payment_credential.json is open: the handler's credential fields survive"
  );
});

test("CheckoutCompleteRequestSchema keeps an extension field and handler-specific credential fields", () => {
  const result = CheckoutCompleteRequestSchema.safeParse({
    payment: {
      instruments: [
        {
          ...instrument,
          credential: { type: "encrypted", encrypted_data: "ZW5j" },
        },
      ],
    },
    ap2: ap2Mandate,
    "com.example.custom": { flag: true },
  });
  assert.ok(result.success);
  assert.equal(
    result.data.payment.instruments[0].credential.encrypted_data,
    "ZW5j"
  );
  assert.deepEqual(result.data.ap2, ap2Mandate);
  assert.deepEqual(result.data["com.example.custom"], { flag: true });
});

test("CheckoutCreateRequestSchema keeps extension fields it does not model", () => {
  const body = {
    line_items: [{ item: { id: "sku_123" }, quantity: 1 }],
    fulfillment: {
      methods: [{ type: "pickup", selected_destination_id: "loc_1375" }],
    },
    discounts: { codes: ["SAVE10"] },
  };
  const result = CheckoutCreateRequestSchema.safeParse(body);
  assert.ok(result.success);
  assert.deepEqual(result.data.fulfillment, body.fulfillment);
  assert.deepEqual(result.data.discounts, body.discounts);
});

test("an open schema still validates the fields it models and keeps .shape", () => {
  assert.equal(
    CheckoutCompleteRequestSchema.safeParse({
      payment: { instruments: "x" },
      ap2: ap2Mandate,
    }).success,
    false,
    "retaining unknown keys must not loosen a modelled field"
  );
  for (const schema of [CheckoutSchema, CartSchema]) {
    assert.ok(schema.shape, "object schemas expose .shape");
  }
});

test("TokenCredentialSchema stays the response projection: no token field, extras kept", () => {
  assert.equal("token" in TokenCredentialSchema.shape, false);
  assert.equal("token" in PaymentCredentialSchema.shape, false);
  for (const schema of [TokenCredentialSchema, PaymentCredentialSchema]) {
    const result = schema.safeParse({
      type: "card",
      network: "visa",
    });
    assert.ok(result.success);
    assert.equal(result.data.network, "visa");
  }
});

test("ErrorResponseSchema preserves unknown keys as a tolerant-reader DTO", () => {
  const basePayload = {
    ucp: { version: "2026-04-08", status: "error" },
    messages: [
      {
        type: "error",
        code: "timeout_error",
        content: "An internal service timed out.",
        severity: "recoverable",
      },
    ],
  };
  const result = ErrorResponseSchema.safeParse({
    ...basePayload,
    debug: "preserved on wire DTO",
  });
  assert.ok(result.success);
  assert.equal(result.data.debug, "preserved on wire DTO");

  const valueConstraint = ValueConstraintSchema.safeParse({
    const: "visa",
    extra_hint: "preserved",
  });
  assert.ok(valueConstraint.success);
  assert.equal(valueConstraint.data.extra_hint, "preserved");

  const reqConstraints = RequestConstraintsSchema.safeParse({
    properties: { brands: { const: "visa", extra_hint: "preserved" } },
    extra_constraint: true,
  });
  assert.ok(reqConstraints.success);
  assert.equal(reqConstraints.data.extra_constraint, true);
});

test("open-by-default UCP object schemas retain unknown keys", () => {
  const address = PostalAddressSchema.safeParse({
    address_country: "US",
    nickname: "home",
  });
  assert.ok(address.success);
  assert.equal(address.data.nickname, "home");

  const fulfillment = FulfillmentCreateRequestSchema.safeParse({
    methods: [],
    note: "x",
  });
  assert.ok(fulfillment.success);
  assert.equal(fulfillment.data.note, "x");
});
