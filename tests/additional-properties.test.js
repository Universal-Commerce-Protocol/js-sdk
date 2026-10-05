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

// `additionalProperties: true` is dropped by quicktype's typescript-zod
// target, and a bare z.object strips unknown keys on parse, so every object
// the spec declares open lost data: a complete checkout request dropped
// `payment.instruments[].credential.token`, and a checkout parsed with the
// base schema dropped its extension fields. The retention step
// (scripts/retain-additional-properties.mjs) appends `.catchall(z.any())` to a
// generated object when every source schema of its property set is open, and
// leaves it as generated when one of them is closed or never declared itself
// open.
//
// The schemas are compiled from src/ by the "pretest" step so the test
// exercises the generated zod schemas and the hand-written extensions
// directly.

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
  "retain-additional-properties.mjs"
);

const {
  CartResponseSchema,
  CheckoutCompleteRequestSchema,
  CheckoutCreateRequestSchema,
  CheckoutResponseSchema,
  ErrorResponseSchema,
  FulfillmentCreateRequestSchema,
  PaymentCredentialSchema,
  PostalAddressSchema,
  TokenCredentialSchema,
} = require("./.dist/spec_generated.js");
const {
  ExtendedCheckoutCreateRequestSchema,
  ExtendedCheckoutResponseSchema,
  ExtendedPaymentCredentialSchema,
} = require("./.dist/extensions.js");

function withRetainer(trees, generated, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-retain-"));
  try {
    const schemaDirs = Object.entries(trees).map(([tree, schemas]) => {
      const schemaDir = path.join(dir, tree);
      fs.mkdirSync(schemaDir);
      for (const [name, schema] of Object.entries(schemas)) {
        fs.writeFileSync(path.join(schemaDir, name), JSON.stringify(schema));
      }
      return schemaDir;
    });
    const target = path.join(dir, "spec_generated.ts");
    fs.writeFileSync(target, 'import * as z from "zod";\n\n' + generated);
    const run = () =>
      execFileSync("node", [SCRIPT, target, ...schemaDirs], {
        encoding: "utf8",
      });
    return fn(run, () => fs.readFileSync(target, "utf8"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const credential = {
  $id: "https://ucp.dev/schemas/credential.json",
  title: "Credential",
  type: "object",
  required: ["type"],
  properties: { type: { type: "string" } },
  additionalProperties: true,
};

const credentialTs =
  "export const CredentialSchema = z.object({\n" +
  "  type: z.string(),\n" +
  "});\n";

// --- the retention step ----------------------------------------------------

test("retainer appends catchall to an object its source declares open", () => {
  withRetainer(
    { schemas: { "credential.json": credential } },
    credentialTs,
    (run, read) => {
      const report = run();
      assert.match(report, /1 open object schema\(s\) retain unknown keys/);
      assert.match(
        read(),
        /CredentialSchema = z\.object\(\{[\s\S]*?\}\)\.catchall\(z\.any\(\)\);/
      );
    }
  );
});

test("retainer is idempotent", () => {
  withRetainer(
    { schemas: { "credential.json": credential } },
    credentialTs,
    (run, read) => {
      run();
      const afterFirst = read();
      run();
      assert.equal(read(), afterFirst, "a second pass must not add another");
    }
  );
});

test("retainer treats a schema that composes an open base through allOf as open", () => {
  // token_credential.json declares no keyword of its own; its allOf branch is
  // not an occurrence, so it cannot veto the open base it shares a shape with.
  const token = {
    $id: "https://ucp.dev/schemas/token.json",
    title: "Token",
    allOf: [
      { $ref: "credential.json" },
      { type: "object", properties: { type: { type: "string" } } },
    ],
  };
  withRetainer(
    { schemas: { "credential.json": credential, "token.json": token } },
    credentialTs,
    (run, read) => {
      run();
      assert.match(read(), /\.catchall\(z\.any\(\)\)/);
    }
  );
});

test("retainer leaves a shape alone when a source of it is closed", () => {
  const closed = {
    $id: "https://ucp.dev/schemas/closed.json",
    title: "Closed",
    type: "object",
    properties: { type: { type: "string" } },
    additionalProperties: false,
  };
  withRetainer(
    { schemas: { "credential.json": credential, "closed.json": closed } },
    credentialTs,
    (run, read) => {
      const report = run();
      assert.match(report, /CredentialSchema \(closed\+open\)/);
      assert.doesNotMatch(read(), /catchall/);
    }
  );
});

test("retainer leaves a shape alone when a source of it never declared itself open", () => {
  const plain = {
    $id: "https://ucp.dev/schemas/plain.json",
    title: "Plain",
    type: "object",
    properties: { type: { type: "string" } },
  };
  withRetainer(
    { schemas: { "credential.json": credential, "plain.json": plain } },
    credentialTs,
    (run, read) => {
      const report = run();
      assert.match(report, /CredentialSchema \(default\+open\)/);
      assert.doesNotMatch(read(), /catchall/);
    }
  );
});

test("retainer weighs every schema tree it is given together", () => {
  // The authored tree alone says open; the projection adds a same-shape
  // source that does not. A per-tree decision would open the shared object.
  const plain = {
    $id: "https://ucp.dev/schemas/plain.json",
    title: "Plain",
    type: "object",
    properties: { type: { type: "string" } },
  };
  withRetainer(
    {
      raw: { "credential.json": credential },
      projected: { "plain.json": plain },
    },
    credentialTs,
    (run, read) => {
      run();
      assert.doesNotMatch(read(), /catchall/);
    }
  );
});

test("retainer keeps catchall ahead of a refinement and skips a decided object", () => {
  // `.catchall` does not exist on a refined schema, so it must precede the
  // injector's superRefine; a chain that already decides unknown keys is left.
  const generated =
    "export const CredentialSchema = z.object({\n" +
    "  type: z.string(),\n" +
    "}).superRefine((value, ctx) => {});\n" +
    "export const PassSchema = z.object({\n" +
    "  type: z.string(),\n" +
    "}).passthrough();\n";
  withRetainer(
    { schemas: { "credential.json": credential } },
    generated,
    (run, read) => {
      const report = run();
      assert.match(report, /1 already decided/);
      const output = read();
      assert.match(
        output,
        /CredentialSchema = z\.object\(\{[\s\S]*?\}\)\.catchall\(z\.any\(\)\)\.superRefine\(/
      );
      assert.match(
        output,
        /PassSchema = z\.object\(\{[\s\S]*?\}\)\.passthrough\(\);/
      );
    }
  );
});

// --- the generated schemas -------------------------------------------------

const instrument = {
  id: "pi_tok_visa",
  handler_id: "merchant_tokenizer",
  type: "card",
  credential: { type: "card", token: "tok_visa_123" },
};

test("CheckoutCompleteRequestSchema keeps the instrument credential token", () => {
  const result = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [instrument] },
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
    ap2: { checkout_mandate: "eyJhbGciOiJ" },
  });
  assert.ok(result.success);
  assert.equal(
    result.data.payment.instruments[0].credential.encrypted_data,
    "ZW5j"
  );
  assert.deepEqual(result.data.ap2, { checkout_mandate: "eyJhbGciOiJ" });
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
    CheckoutCompleteRequestSchema.safeParse({ payment: { instruments: "x" } })
      .success,
    false,
    "retaining unknown keys must not loosen a modelled field"
  );
  for (const schema of [CheckoutResponseSchema, CartResponseSchema]) {
    assert.ok(schema.shape, "extensions.ts needs .shape, .extend and .pick");
  }
});

test("TokenCredentialSchema stays the response projection: no token field, extras kept", () => {
  // token_credential.json marks `token` ucp_response: omit, so the response
  // shape does not model it; the credential is still open.
  assert.equal("token" in TokenCredentialSchema.shape, false);
  assert.equal(TokenCredentialSchema, PaymentCredentialSchema);
  const result = PaymentCredentialSchema.safeParse({
    type: "card",
    network: "visa",
  });
  assert.ok(result.success);
  assert.equal(result.data.network, "visa");
});

test("a closed schema still strips unknown keys", () => {
  // error_response.json is `additionalProperties: false`.
  const result = ErrorResponseSchema.safeParse({
    ucp: { version: "2026-04-08", status: "error" },
    messages: [
      {
        type: "error",
        code: "timeout_error",
        content: "An internal service timed out.",
        severity: "recoverable",
      },
    ],
    debug: "not in the schema",
  });
  assert.ok(result.success);
  assert.equal("debug" in result.data, false);
});

test("an object the spec does not declare open still strips unknown keys", () => {
  const address = PostalAddressSchema.safeParse({
    address_country: "US",
    nickname: "home",
  });
  assert.ok(address.success);
  assert.equal("nickname" in address.data, false);
  // The checkout fulfillment request shares its {methods} shape with the open
  // catalog fulfillment but is not open itself.
  const fulfillment = FulfillmentCreateRequestSchema.safeParse({
    methods: [],
    note: "x",
  });
  assert.ok(fulfillment.success);
  assert.equal("note" in fulfillment.data, false);
});

// --- the hand-written extensions -------------------------------------------

test("Extended* schemas built with .extend() and .pick() keep unknown keys", () => {
  const request = ExtendedCheckoutCreateRequestSchema.safeParse({
    line_items: [{ item: { id: "sku_123" }, quantity: 1 }],
    "com.example.gift_wrap": true,
  });
  assert.ok(request.success);
  assert.equal(request.data["com.example.gift_wrap"], true);

  const credentialResult = ExtendedPaymentCredentialSchema.safeParse({
    type: "card",
    token: "tok_visa_123",
    network: "visa",
  });
  assert.ok(credentialResult.success);
  assert.equal(credentialResult.data.token, "tok_visa_123");
  assert.equal(credentialResult.data.network, "visa");

  assert.ok(
    ExtendedCheckoutResponseSchema.shape.fulfillment,
    "the picked extension field is still modelled"
  );
});
