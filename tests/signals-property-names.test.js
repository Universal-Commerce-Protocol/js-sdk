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

// propertyNames enforcement for the Signals object.
//
// signals.json declares named `properties` (dev.ucp.buyer_ip, dev.ucp.user_agent)
// alongside `propertyNames.pattern` (reverse-domain) and
// `additionalProperties: true`. quicktype's typescript-zod target emits only the
// object shape, dropping both `propertyNames` (so a malformed key is not
// rejected) and `additionalProperties: true` (so a well-formed reverse-domain
// extra is silently stripped rather than preserved). This is the js-sdk sibling
// of python-sdk#66; the enforcement is re-attached in
// scripts/inject-schema-constraints.mjs.
//
// The schemas are compiled from src/spec_generated.ts by the "pretest" step so
// the test exercises the generated zod schemas directly.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  CheckoutCreateRequestSignalsSchema,
  LookupRequestSignalsSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

// The reverse-domain key pattern signals.json/propertyNames requires, identical
// to shopping/types/reverse_domain_name.json.
const PATTERN = /^[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_]*)+$/;

test("Signals rejects a malformed (non reverse-domain) property name", () => {
  assert.ok(
    rejects(CheckoutCreateRequestSignalsSchema, {
      "dev.ucp.buyer_ip": "1.2.3.4",
      "bogus KEY!": "x",
    }),
    "a key that violates propertyNames.pattern must be rejected"
  );
});

test("Signals accepts and preserves a well-formed reverse-domain extra key", () => {
  const result = CheckoutCreateRequestSignalsSchema.safeParse({
    "dev.ucp.buyer_ip": "1.2.3.4",
    "com.example.device_id": "abc123",
  });
  assert.ok(result.success, "a reverse-domain extra key must be accepted");
  assert.equal(
    result.data["com.example.device_id"],
    "abc123",
    "additionalProperties: true means the reverse-domain extra must be preserved"
  );
});

test("Signals still populates its named fields", () => {
  const result = CheckoutCreateRequestSignalsSchema.safeParse({
    "dev.ucp.buyer_ip": "1.2.3.4",
    "dev.ucp.user_agent": "curl/8",
  });
  assert.ok(result.success);
  assert.equal(result.data["dev.ucp.buyer_ip"], "1.2.3.4");
  assert.equal(result.data["dev.ucp.user_agent"], "curl/8");
});

// python-sdk#66 anchor lesson, pinned for the JS/ECMA-262 dialect. Python's
// re.match admits a trailing newline against a `$`-anchored pattern; in
// JavaScript `$` (no `m` flag) matches only end-of-input, so RegExp.test — the
// operator that matches JSON Schema's unanchored `pattern` semantics — already
// rejects "com.example.k\n". This test pins that behavior so a future
// refactor cannot silently regress to a newline-admitting check.
test("Signals rejects a reverse-domain key with a trailing newline", () => {
  assert.equal(
    PATTERN.test("com.example.k\n"),
    false,
    "sanity: pattern rejects trailing newline"
  );
  assert.ok(
    rejects(CheckoutCreateRequestSignalsSchema, {
      "com.example.k\n": "x",
    }),
    "a trailing-newline key must be rejected (anchor safety)"
  );
});

test("LookupRequestSignalsSchema enforces the same propertyNames rule", () => {
  assert.ok(
    rejects(LookupRequestSignalsSchema, { "bogus KEY!": "x" }),
    "the aliased Signals schema must enforce propertyNames too"
  );
  assert.ok(accepts(LookupRequestSignalsSchema, { "com.example.ok": "y" }));
});

// Known boundary, pinned. zod-core drops an own `__proto__` key from every
// z.object (a prototype-pollution safeguard) BEFORE .catchall/.superRefine run,
// so the key never reaches this per-object propertyNames check. The direction is
// safe -- the key is dropped, not preserved, and the prototype is not polluted --
// but it is silently dropped rather than rejected. This is an SDK-wide zod trait,
// not specific to Signals, so it is documented here rather than special-cased.
// Every OTHER pattern-violating own key, including "constructor" and "prototype",
// is rejected as normal.
test("Signals: an own __proto__ key is dropped by zod-core (not preserved, no pollution)", () => {
  const result = CheckoutCreateRequestSignalsSchema.safeParse(
    JSON.parse('{"__proto__":{"polluted":true},"dev.ucp.buyer_ip":"1.2.3.4"}')
  );
  assert.ok(result.success, "zod-core strips own __proto__ before validation");
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.data, "__proto__"),
    "the __proto__ key must not survive into the parsed output"
  );
  assert.equal({}.polluted, undefined, "Object.prototype must not be polluted");
});

test("Signals rejects own constructor / prototype keys (only literal __proto__ is dropped)", () => {
  assert.ok(rejects(CheckoutCreateRequestSignalsSchema, { constructor: "x" }));
  assert.ok(rejects(CheckoutCreateRequestSignalsSchema, { prototype: "x" }));
});
