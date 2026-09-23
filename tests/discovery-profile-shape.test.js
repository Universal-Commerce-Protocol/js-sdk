// Fidelity tests for the discovery profile projection (UcpDiscoveryProfileSchema
// and its `ucp` member, UcpSchema).
//
// ucp.json#/$defs/base declares every registry (services, capabilities,
// payment_handlers) as an object keyed by reverse domain name whose values are
// arrays of entities, and requires only `version`; #/$defs/business_schema (the
// shape a business publishes at /.well-known/ucp) additionally requires
// services and payment_handlers. Before the fix the hand written projection
// carried the withdrawn 2026-01-11 shape: capabilities as a flat array (and
// required), services as a record of single objects, no payment_handlers. It
// REJECTED the business profile example the specification publishes while
// the derived UcpProfileDocumentSchema in the same file accepted it.
//
// tests/fixtures/business_profile_2026-08-25.json is the business profile
// example from docs/specification/overview/index.md at release/2026-08-25
// (the block annotated `ucp:example schema=profile def=business_schema`), with
// the `{{ ucp_version }}` macro rendered as 2026-08-25. It is JSON equal to
// that block; whitespace follows the repository prettier configuration.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  UcpDiscoveryProfileSchema,
  UcpSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

const specProfile = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "business_profile_2026-08-25.json"),
    "utf8"
  )
);

test("UcpDiscoveryProfileSchema accepts the business profile example from the specification", () => {
  const result = UcpDiscoveryProfileSchema.safeParse(specProfile);
  assert.ok(
    result.success,
    result.success ? "" : JSON.stringify(result.error.issues, null, 2)
  );
});

test("UcpSchema models capabilities as a record of entity arrays, not a flat array", () => {
  const ucp = specProfile.ucp;
  assert.ok(accepts(UcpSchema, ucp));
  const flat = {
    ...ucp,
    capabilities: Object.entries(ucp.capabilities).flatMap(([name, entries]) =>
      entries.map((entry) => ({ name, ...entry }))
    ),
  };
  assert.ok(rejects(UcpSchema, flat));
});

test("UcpSchema models each services entry as an array of service entities", () => {
  const ucp = specProfile.ucp;
  const singleObject = {
    ...ucp,
    services: Object.fromEntries(
      Object.entries(ucp.services).map(([name, entries]) => [name, entries[0]])
    ),
  };
  assert.ok(rejects(UcpSchema, singleObject));
});

test("UcpSchema carries payment_handlers, which the business profile requires", () => {
  const { payment_handlers, ...withoutHandlers } = specProfile.ucp;
  assert.ok(rejects(UcpSchema, withoutHandlers));
  const parsed = UcpSchema.parse(specProfile.ucp);
  assert.deepEqual(parsed.payment_handlers, payment_handlers);
});

test("UcpSchema does not require capabilities (base requires only version)", () => {
  const { capabilities, ...withoutCapabilities } = specProfile.ucp;
  assert.ok(accepts(UcpSchema, withoutCapabilities));
});

test("UcpSchema requires services, per business_schema", () => {
  const { services, ...withoutServices } = specProfile.ucp;
  assert.ok(rejects(UcpSchema, withoutServices));
});

test("UcpSchema models map_order as a record of key arrays (ucp.json#/$defs/map_order)", () => {
  // The second business profile example in the overview carries
  // map_order.payment_handlers; the envelope builder used to collapse the
  // map_order $ref to a string and rejected it.
  const ucp = specProfile.ucp;
  const ordered = {
    ...ucp,
    map_order: { payment_handlers: Object.keys(ucp.payment_handlers) },
  };
  assert.ok(accepts(UcpSchema, ordered));
  assert.ok(rejects(UcpSchema, { ...ucp, map_order: "payment_handlers" }));
});

test("UcpSchema types supported_versions values as strings, not any", () => {
  // business_schema declares supported_versions as version key to profile URI.
  // toCompatLeaf widened the value to any, so a number passed.
  const ucp = specProfile.ucp;
  assert.ok(
    accepts(UcpSchema, {
      ...ucp,
      supported_versions: {
        "2026-04-08": "https://example.com/.well-known/ucp",
      },
    })
  );
  assert.ok(
    rejects(UcpSchema, { ...ucp, supported_versions: { "2026-04-08": 1 } })
  );
  assert.ok(
    rejects(UcpSchema, {
      ...ucp,
      supported_versions: { "not-a-version": "https://e.example" },
    })
  );
});
