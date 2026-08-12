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

// Fidelity tests for the generated UCP response envelope. The envelope is
// derived from ucp.json#/$defs/base + the per-entity #/$defs/response_schema
// shapes, so it must model every base registry (capabilities, payment_handlers,
// services) plus status, each with the REAL response item shape -- not a legacy
// hand-written approximation.
//
// Before the fix UcpResponseSchema was { capabilities (required), version } and
// PaymentHandlerResponseSchema was the stale discovery shape
// { config, config_schema, id, instrument_schemas, name, spec, version } with
// all fields required. A spec-conformant checkout response's payment_handlers
// and services were silently stripped, and a real handler entry (which carries
// available_instruments/schema, not config_schema/instrument_schemas/name) was
// unrepresentable.
//
// The schemas are compiled from src/spec_generated.ts by the "pretest" step so
// the test exercises the generated zod schemas directly.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  UcpResponseSchema,
  CheckoutResponseSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

// A real handler entry, shaped exactly like the conformance golden snapshot's
// payment_handlers entry (ci/merchant_golden_snapshot.json): required id +
// version, plus available_instruments / schema / spec. This is the case the
// pre-fix (and the naive one-property patch) schema WRONGLY REJECTED.
const goldenHandler = {
  available_instruments: [{ constraints: { brands: ["visa"] }, type: "card" }],
  id: "giftpay",
  schema: "https://spck.dev/fixture/handlers/giftpay/schema.json",
  spec: "https://spck.dev/fixture/handlers/giftpay",
  version: "2026-04-08",
};

const serviceEntry = {
  transport: "rest",
  endpoint: "https://example.com/ucp",
  version: "2026-04-08",
};

// The full checkout ucp envelope from the conformance golden snapshot
// (merchant_golden_snapshot.json checkout_create.body.ucp): all three
// registries together. Capability items carry only {schema, version} (+ a
// string `extends`) -- NO `name`. This is the case that regressed twice: the
// envelope was fixed one registry at a time while capabilities still ran
// through a legacy `name`-required item shape and false-rejected this payload.
const goldenCheckoutEnvelope = {
  version: "2026-04-08",
  capabilities: {
    "dev.ucp.shopping.checkout": [
      {
        schema: "https://ucp.dev/schemas/shopping/checkout.json",
        version: "2026-04-08",
      },
    ],
    "dev.ucp.shopping.discount": [
      {
        extends: "dev.ucp.shopping.checkout",
        schema: "https://ucp.dev/schemas/shopping/discount.json",
        version: "2026-04-08",
      },
    ],
  },
  payment_handlers: { "dev.spck.giftpay": [goldenHandler] },
};

const envelopeWithHandlers = {
  version: "2026-04-08",
  payment_handlers: { "dev.spck.giftpay": [goldenHandler] },
};

// --- payment_handlers: modeled with the REAL response shape -----------------

test("envelope accepts a golden-snapshot-shaped payment handler (available_instruments/schema/spec)", () => {
  assert.ok(accepts(UcpResponseSchema, envelopeWithHandlers));
});

test("envelope accepts a minimal handler carrying only the required {id, version}", () => {
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: { "com.example": [{ id: "h", version: "2026-04-08" }] },
    })
  );
});

test("envelope PRESERVES payment_handlers on parse (was silently stripped)", () => {
  const result = UcpResponseSchema.safeParse(envelopeWithHandlers);
  assert.ok(result.success);
  assert.deepEqual(
    result.data.payment_handlers,
    envelopeWithHandlers.payment_handlers
  );
});

test("envelope rejects a handler missing the required id / version", () => {
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: { "com.example": [{ version: "2026-04-08" }] }, // no id
    })
  );
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: { "com.example": [{ id: "h" }] }, // no version
    })
  );
});

test("envelope rejects the stale legacy handler fields as required (config_schema/instrument_schemas/name)", () => {
  // The pre-fix schema REQUIRED these; a real response never sends them. A
  // handler with only {id, version} must now pass (proves they are gone).
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: { "com.example": [{ id: "h", version: "2026-04-08" }] },
    })
  );
});

test("envelope enforces available_instruments minItems: 1 when present", () => {
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: {
        "com.example": [
          { id: "h", version: "2026-04-08", available_instruments: [] },
        ],
      },
    })
  );
});

test("envelope rejects a payment_handlers registry value that is not an array", () => {
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      payment_handlers: { "com.example": goldenHandler }, // object, not array
    })
  );
});

// --- the FULL golden envelope: all registries together ----------------------

test("envelope ACCEPTS the full golden checkout ucp envelope and RETAINS every registry", () => {
  const result = UcpResponseSchema.safeParse(goldenCheckoutEnvelope);
  assert.ok(
    result.success,
    "golden checkout envelope must validate: " +
      (result.success ? "" : JSON.stringify(result.error.issues.slice(0, 3)))
  );
  assert.deepEqual(
    result.data.capabilities,
    goldenCheckoutEnvelope.capabilities
  );
  assert.deepEqual(
    result.data.payment_handlers,
    goldenCheckoutEnvelope.payment_handlers
  );
});

// --- capabilities: derived response shape (required only version, no name) ---

test("envelope accepts a minimal capability carrying only the required {version}", () => {
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      capabilities: { "dev.x": [{ version: "2026-04-08" }] },
    })
  );
});

test("envelope accepts capability `extends` as both string and string[]", () => {
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      capabilities: { "dev.x": [{ extends: "a.b", version: "2026-04-08" }] },
    })
  );
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      capabilities: {
        "dev.x": [{ extends: ["a.b", "c.d"], version: "2026-04-08" }],
      },
    })
  );
});

test("envelope rejects a capability missing the required version", () => {
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      capabilities: { "dev.x": [{ schema: "https://example.com/s.json" }] },
    })
  );
});

// --- services: modeled and retained ----------------------------------------

test("envelope accepts and PRESERVES a services registry (service response shape)", () => {
  const env = {
    version: "2026-04-08",
    services: { "com.example": [serviceEntry] },
  };
  const result = UcpResponseSchema.safeParse(env);
  assert.ok(result.success, "services envelope must validate");
  assert.deepEqual(result.data.services, env.services);
});

test("envelope rejects a service missing the required transport / version", () => {
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      services: { "com.example": [{ version: "2026-04-08" }] }, // no transport
    })
  );
  assert.ok(
    rejects(UcpResponseSchema, {
      version: "2026-04-08",
      services: { "com.example": [{ transport: "rest" }] }, // no version
    })
  );
});

test("envelope rejects malformed registry keys", () => {
  for (const [registry, value] of [
    ["capabilities", [{ version: "2026-04-08" }]],
    ["payment_handlers", [{ id: "h", version: "2026-04-08" }]],
    ["services", [serviceEntry]],
  ]) {
    assert.ok(
      rejects(UcpResponseSchema, {
        version: "2026-04-08",
        [registry]: { "bad KEY!": value },
      }),
      `${registry} must reject keys outside the reverse-domain pattern`
    );
  }
});

test("envelope accepts reverse-domain registry keys", () => {
  assert.ok(accepts(UcpResponseSchema, goldenCheckoutEnvelope));
  assert.ok(
    accepts(UcpResponseSchema, {
      version: "2026-04-08",
      services: { "com.example.service": [serviceEntry] },
    })
  );
});

// --- status: modeled and retained (base enum success/error) -----------------

test("envelope RETAINS status (was stripped); accepts success/error, rejects other", () => {
  const err = UcpResponseSchema.safeParse({
    version: "2026-04-08",
    status: "error",
  });
  assert.ok(err.success);
  assert.equal(
    err.data.status,
    "error",
    "status must be retained, not stripped"
  );
  assert.ok(
    accepts(UcpResponseSchema, { version: "2026-04-08", status: "success" })
  );
  assert.ok(
    rejects(UcpResponseSchema, { version: "2026-04-08", status: "pending" })
  );
});

// --- base required-ness: only version is required ---------------------------

test("envelope no longer wrongly requires capabilities (base requires only version)", () => {
  assert.ok(accepts(UcpResponseSchema, { version: "2026-04-08" }));
});

test("envelope enforces the base version format ^\\d{4}-\\d{2}-\\d{2}$", () => {
  assert.ok(rejects(UcpResponseSchema, { version: "not-a-date" }));
});

// --- the checkout response type carries the fixed envelope ------------------

test("CheckoutResponseSchema.ucp models payment_handlers, services, and status", () => {
  const shape =
    typeof CheckoutResponseSchema._def?.shape === "function"
      ? CheckoutResponseSchema._def.shape()
      : CheckoutResponseSchema.shape;
  const ucpSchema = shape.ucp;
  const ucpShape =
    typeof ucpSchema._def?.shape === "function"
      ? ucpSchema._def.shape()
      : ucpSchema.shape;
  for (const key of [
    "payment_handlers",
    "services",
    "status",
    "capabilities",
  ]) {
    assert.ok(
      key in ucpShape,
      `checkout response ucp envelope must model ${key}`
    );
  }
});
