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

// Regression tests for js-sdk#77: the fulfillment family was pinned to a single
// "unified" projection in scripts/project-current-ucp-schemas.mjs, written with
// RESPONSE rules only, so `ucp_request` was never applied even though the same
// types compose into the checkout create/update requests. The generated
// FulfillmentMethodCreateRequestSchema demanded the response-only `id` and
// `line_item_ids`, and every conformant create/update fulfillment payload was
// rejected.
//
// Splitting the family naively is WORSE than the rejection: for requests
// fulfillment_method.json omits `destinations` at the root and redeclares it
// inside the `type: shipping` if/then branch, which quicktype does not emit,
// so a shipping address would validate and then be SILENTLY DROPPED by
// z.object's unknown-key stripping. The projector therefore hoists
// branch-declared properties to the root of the projection (typed by the
// branch). The spec's `dependentRequired` (`destinations` requires `type`) is
// enforced by `scripts/inject-schema-constraints.mjs` (see
// `tests/dependent-required.test.js`).
//
// The required/optional tables below are those of
//   ucp-schema resolve <file> --request --op create
//   ucp-schema resolve <file> --request --op update
//   ucp-schema resolve <file> --response --op read
// against the pinned spec, checked field by field.
//
// The schemas are compiled from src/spec_generated.ts by the "pretest" step so
// the test exercises the generated zod schemas directly.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const g = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

// Unwrap .refine()/.superRefine() (ZodEffects) and .optional() wrappers to
// reach the underlying schema, so shape checks see through injected refines.
function unwrap(schema) {
  let current = schema;
  for (;;) {
    const kind = current?._def?.typeName;
    if (kind === "ZodEffects") {
      current = current._def.schema;
    } else if (kind === "ZodOptional" || kind === "ZodNullable") {
      current = current._def.innerType;
    } else {
      return current;
    }
  }
}

function fieldTable(schema) {
  assert.ok(schema, "schema is not exported");
  const shape = unwrap(schema).shape;
  return Object.fromEntries(
    Object.keys(shape)
      .sort()
      .map((name) => [name, shape[name].isOptional() ? "optional" : "required"])
  );
}

function itemsOf(schema, field) {
  return unwrap(unwrap(schema).shape[field]).element;
}

const address = {
  first_name: "Ada",
  last_name: "Lovelace",
  street_address: "1 Main St",
  address_locality: "Springfield",
  address_region: "IL",
  postal_code: "62701",
  address_country: "US",
};

// The three create payloads from the issue, plus the update-side shape of P4.
const P1 = { type: "shipping" };
const P5 = {
  type: "shipping",
  groups: [{ selected_option_id: "opt_standard" }],
};
const P4 = { type: "shipping", destinations: [address] };
const P4_UPDATE = {
  type: "shipping",
  line_item_ids: ["li_1"],
  destinations: [address],
};

// --- The issue: create/update requests must accept the spec's payloads ------

test("FulfillmentMethodCreateRequestSchema accepts P1 { type }", () => {
  const result = g.FulfillmentMethodCreateRequestSchema.safeParse(P1);
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
});

test("FulfillmentMethodCreateRequestSchema accepts P5 { type, groups[selected_option_id] }", () => {
  const result = g.FulfillmentMethodCreateRequestSchema.safeParse(P5);
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
  assert.deepEqual(result.data.groups, [
    { selected_option_id: "opt_standard" },
  ]);
});

test("FulfillmentMethodCreateRequestSchema accepts P4 { type, destinations[address] } and RETAINS destinations", () => {
  const result = g.FulfillmentMethodCreateRequestSchema.safeParse(P4);
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
  // The naive split (root `ucp_request: omit`, branch ignored) parses P4 to
  // `{ type }` and drops the shipping address on the floor.
  assert.deepEqual(result.data.destinations, [address]);
});

test("FulfillmentMethodUpdateRequestSchema accepts P4 with line_item_ids and RETAINS destinations", () => {
  assert.ok(
    g.FulfillmentMethodUpdateRequestSchema,
    "FulfillmentMethodUpdateRequestSchema is not exported"
  );
  const result = g.FulfillmentMethodUpdateRequestSchema.safeParse(P4_UPDATE);
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
  assert.deepEqual(result.data.destinations, [address]);
});

test("FulfillmentMethodUpdateRequestSchema requires only line_item_ids", () => {
  assert.ok(
    g.FulfillmentMethodUpdateRequestSchema,
    "FulfillmentMethodUpdateRequestSchema is not exported"
  );
  assert.ok(
    accepts(g.FulfillmentMethodUpdateRequestSchema, { line_item_ids: ["li_1"] })
  );
  assert.ok(
    rejects(g.FulfillmentMethodUpdateRequestSchema, { type: "shipping" })
  );
});

// --- destinations are VALIDATED, not merely passed through -----------------

for (const [label, schemaName, extra] of [
  ["create", "FulfillmentMethodCreateRequestSchema", {}],
  [
    "update",
    "FulfillmentMethodUpdateRequestSchema",
    { line_item_ids: ["li_1"] },
  ],
]) {
  test(`${label} request rejects a non-array destinations`, () => {
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    assert.ok(
      rejects(schema, {
        type: "shipping",
        destinations: "not-an-array",
        ...extra,
      })
    );
  });

  test(`${label} request rejects a destination with a non-string postal_code`, () => {
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    const result = schema.safeParse({
      type: "shipping",
      destinations: [{ ...address, postal_code: 62701 }],
      ...extra,
    });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some(
        (issue) => issue.path.join(".") === "destinations.0.postal_code"
      ),
      `expected an issue at destinations.0.postal_code, got ${JSON.stringify(result.error.issues)}`
    );
  });

  test(`${label} request rejects a business_location destination on a shipping method`, () => {
    // shipping_destination.json pins `type` to the const `shipping_address`.
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    assert.ok(
      rejects(schema, {
        type: "shipping",
        destinations: [{ type: "business_location", id: "loc_1" }],
        ...extra,
      })
    );
  });

  test(`${label} request rejects non-object destination entries`, () => {
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    assert.ok(
      rejects(schema, { type: "shipping", destinations: [null], ...extra })
    );
    assert.ok(
      rejects(schema, {
        type: "shipping",
        destinations: ["1 Main St"],
        ...extra,
      })
    );
  });

  test(`${label} request accepts a fully specified shipping destination`, () => {
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    const destination = { id: "dest_1", type: "shipping_address", ...address };
    const result = schema.safeParse({
      type: "shipping",
      destinations: [destination],
      ...extra,
    });
    assert.ok(
      result.success,
      `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
    );
    assert.deepEqual(result.data.destinations, [destination]);
  });

  test(`${label} request never silently drops destinations, whatever the method type`, () => {
    // The flat zod target cannot express the per-branch if/then: the
    // projection types `destinations` by the only branch that admits it on
    // requests (shipping). Whatever the verdict for other method types, the
    // one outcome that is never acceptable is a success that lost the data.
    const schema = g[schemaName];
    assert.ok(schema, `${schemaName} is not exported`);
    for (const type of ["pickup", "curbside"]) {
      const result = schema.safeParse({
        type,
        destinations: [address],
        ...extra,
      });
      if (result.success) {
        assert.deepEqual(result.data.destinations, [address]);
      }
    }
  });
}

// --- destinations together with type ---------------------------------------

test("update request accepts destinations together with type", () => {
  assert.ok(
    g.FulfillmentMethodUpdateRequestSchema,
    "FulfillmentMethodUpdateRequestSchema is not exported"
  );
  assert.ok(
    accepts(g.FulfillmentMethodUpdateRequestSchema, {
      line_item_ids: ["li_1"],
      type: "shipping",
      destinations: [address],
    })
  );
});

test("create request rejects destinations without type", () => {
  assert.ok(
    rejects(g.FulfillmentMethodCreateRequestSchema, { destinations: [address] })
  );
});

// --- required/optional sets match the spec oracle, field by field ----------

const postalAddressOptional = {
  address_country: "optional",
  address_locality: "optional",
  address_region: "optional",
  extended_address: "optional",
  first_name: "optional",
  last_name: "optional",
  phone_number: "optional",
  postal_code: "optional",
  street_address: "optional",
};

const oracle = {
  FulfillmentMethodCreateRequestSchema: {
    destinations: "optional",
    groups: "optional",
    selected_destination_id: "optional",
    type: "required",
  },
  FulfillmentMethodUpdateRequestSchema: {
    destinations: "optional",
    groups: "optional",
    id: "optional",
    line_item_ids: "required",
    selected_destination_id: "optional",
    type: "optional",
  },
  FulfillmentMethodResponseSchema: {
    destinations: "optional",
    groups: "optional",
    id: "required",
    line_item_ids: "required",
    selected_destination_id: "optional",
    type: "required",
  },
  FulfillmentCreateRequestSchema: { methods: "optional" },
  FulfillmentUpdateRequestSchema: { methods: "optional" },
  FulfillmentResponseSchema: {
    available_methods: "optional",
    methods: "optional",
  },
  FulfillmentGroupCreateRequestSchema: { selected_option_id: "optional" },
  FulfillmentGroupUpdateRequestSchema: {
    id: "required",
    selected_option_id: "optional",
  },
  FulfillmentGroupResponseSchema: {
    id: "required",
    line_item_ids: "required",
    options: "optional",
    selected_option_id: "optional",
  },
  FulfillmentOptionResponseSchema: {
    carrier: "optional",
    description: "optional",
    earliest_fulfillment_time: "optional",
    id: "required",
    latest_fulfillment_time: "optional",
    title: "required",
    totals: "required",
  },
  FulfillmentOptionBaseResponseSchema: {
    description: "optional",
    id: "required",
    title: "required",
  },
  FulfillmentAvailableMethodResponseSchema: {
    description: "optional",
    fulfillable_on: "optional",
    line_item_ids: "required",
    type: "required",
  },
  FulfillmentDestinationCreateRequestSchema: {
    id: "optional",
    type: "optional",
  },
  FulfillmentDestinationUpdateRequestSchema: {
    id: "optional",
    type: "optional",
  },
  FulfillmentDestinationResponseSchema: { id: "required", type: "required" },
  ShippingDestinationCreateRequestSchema: {
    ...postalAddressOptional,
    id: "optional",
    type: "optional",
  },
  ShippingDestinationUpdateRequestSchema: {
    ...postalAddressOptional,
    id: "optional",
    type: "optional",
  },
  ShippingDestinationResponseSchema: {
    ...postalAddressOptional,
    id: "required",
    type: "required",
  },
  BusinessLocationDestinationResponseSchema: {
    address: "optional",
    id: "required",
    name: "required",
    type: "required",
  },
};

for (const [name, expected] of Object.entries(oracle)) {
  test(`${name} required/optional set matches ucp-schema resolve`, () => {
    assert.deepEqual(fieldTable(g[name]), expected);
  });
}

// --- the arrays are typed by the right variant -----------------------------

test("request destinations are typed by the shipping branch; response destinations by the base", () => {
  assert.equal(
    itemsOf(g.FulfillmentMethodCreateRequestSchema, "destinations"),
    g.ShippingDestinationCreateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentMethodUpdateRequestSchema, "destinations"),
    g.ShippingDestinationUpdateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentMethodResponseSchema, "destinations"),
    g.FulfillmentDestinationResponseSchema
  );
});

test("groups and methods are typed by the matching variant", () => {
  assert.equal(
    itemsOf(g.FulfillmentMethodCreateRequestSchema, "groups"),
    g.FulfillmentGroupCreateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentMethodUpdateRequestSchema, "groups"),
    g.FulfillmentGroupUpdateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentMethodResponseSchema, "groups"),
    g.FulfillmentGroupResponseSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentCreateRequestSchema, "methods"),
    g.FulfillmentMethodCreateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentUpdateRequestSchema, "methods"),
    g.FulfillmentMethodUpdateRequestSchema
  );
  assert.equal(
    itemsOf(g.FulfillmentResponseSchema, "methods"),
    g.FulfillmentMethodResponseSchema
  );
});

// --- the response side still requires what the spec requires ---------------

test("FulfillmentMethodResponseSchema still requires id, type and line_item_ids", () => {
  const full = { id: "m1", type: "shipping", line_item_ids: ["li_1"] };
  assert.ok(accepts(g.FulfillmentMethodResponseSchema, full));
  for (const missing of ["id", "type", "line_item_ids"]) {
    const value = { ...full };
    delete value[missing];
    assert.ok(
      rejects(g.FulfillmentMethodResponseSchema, value),
      `response must reject a method without ${missing}`
    );
  }
});

test("ShippingDestinationResponseSchema still requires id and type", () => {
  const full = { id: "dest_1", type: "shipping_address", ...address };
  assert.ok(accepts(g.ShippingDestinationResponseSchema, full));
  assert.ok(
    rejects(g.ShippingDestinationResponseSchema, { type: "shipping_address" })
  );
  assert.ok(rejects(g.ShippingDestinationResponseSchema, { id: "dest_1" }));
});

test("FulfillmentGroupResponseSchema still requires id and line_item_ids", () => {
  assert.ok(
    accepts(g.FulfillmentGroupResponseSchema, {
      id: "g1",
      line_item_ids: ["li_1"],
    })
  );
  assert.ok(rejects(g.FulfillmentGroupResponseSchema, { id: "g1" }));
  assert.ok(
    rejects(g.FulfillmentGroupResponseSchema, { line_item_ids: ["li_1"] })
  );
});

// --- compatibility: the unified names keep resolving to the response shape --

const compatibilityAliases = [
  ["AvailableMethodElement", "FulfillmentAvailableMethodResponse"],
  ["BusinessLocationDestination", "BusinessLocationDestinationResponse"],
  [
    "BusinessLocationDestinationType",
    "BusinessLocationDestinationResponseType",
  ],
  ["DestinationElement", "FulfillmentDestinationResponse"],
  ["Fulfillment", "FulfillmentResponse"],
  ["FulfillmentAvailableMethod", "FulfillmentAvailableMethodResponse"],
  ["FulfillmentDestination", "FulfillmentDestinationResponse"],
  ["FulfillmentGroup", "FulfillmentGroupResponse"],
  ["FulfillmentMethod", "FulfillmentMethodResponse"],
  ["FulfillmentOption", "FulfillmentOptionResponse"],
  ["FulfillmentOptionBase", "FulfillmentOptionBaseResponse"],
  ["FulfillmentOptionElement", "FulfillmentOptionResponse"],
  ["GroupElement", "FulfillmentGroupResponse"],
  ["MethodElement", "FulfillmentMethodResponse"],
  ["ShippingDestination", "ShippingDestinationResponse"],
  ["ShippingDestinationType", "ShippingDestinationCreateRequestType"],
];

for (const [alias, target] of compatibilityAliases) {
  test(`${alias}Schema is a compatibility alias of ${target}Schema`, () => {
    assert.ok(g[`${target}Schema`], `${target}Schema is not exported`);
    assert.equal(g[`${alias}Schema`], g[`${target}Schema`]);
  });
}

test("FulfillmentSchema keeps meaning the checkout fulfillment container, not order.json's inline fulfillment", () => {
  // Once types/fulfillment.json stopped occupying the bare title, quicktype
  // handed the name `Fulfillment` to order.json's anonymous `fulfillment`
  // property ({ events, expectations }), silently changing what an existing
  // export means. That inline object keeps its historical name.
  assert.deepEqual(Object.keys(fieldTable(g.FulfillmentSchema)), [
    "available_methods",
    "methods",
  ]);
  assert.deepEqual(Object.keys(fieldTable(g.FulfillmentClassSchema)), [
    "events",
    "expectations",
  ]);
  assert.equal(
    unwrap(unwrap(g.OrderSchema).shape.fulfillment),
    g.FulfillmentClassSchema
  );
});

// --- end to end through the checkout capability schemas --------------------

test("CheckoutWithFulfillmentCreateRequestSchema accepts a shipping method with destinations and retains them", () => {
  const result = g.CheckoutWithFulfillmentCreateRequestSchema.safeParse({
    line_items: [{ item: { id: "sku_1" }, quantity: 1 }],
    fulfillment: { methods: [P4] },
  });
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
  assert.deepEqual(result.data.fulfillment.methods[0].destinations, [address]);
});

test("CheckoutWithFulfillmentUpdateRequestSchema accepts a shipping method with destinations and retains them", () => {
  const result = g.CheckoutWithFulfillmentUpdateRequestSchema.safeParse({
    line_items: [{ id: "li_1", item: { id: "sku_1" }, quantity: 1 }],
    fulfillment: { methods: [P4_UPDATE] },
  });
  assert.ok(
    result.success,
    `rejected: ${JSON.stringify(result.error?.issues ?? null)}`
  );
  assert.deepEqual(result.data.fulfillment.methods[0].destinations, [address]);
});
