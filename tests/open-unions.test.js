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
  CheckoutSchema,
  FulfillmentDestinationSchema,
  FulfillmentDestinationBaseSchema,
  ShippingDestinationSchema,
  LocationDestinationSchema,
  FulfillmentMethodSchema,
  FulfillmentMethodBaseSchema,
  FulfillmentMethodCreateRequestSchema,
  FulfillmentMethodUpdateRequestSchema,
  ShippingMethodSchema,
  PickupMethodSchema,
  ProviderSchema,
  ProviderBaseSchema,
  Oauth2ProviderSchema,
} = require("./.dist/spec_generated.js");

test("FulfillmentDestinationSchema validates known shipping_address and business_location variants", () => {
  const shipping = FulfillmentDestinationSchema.safeParse({
    id: "dest_1",
    type: "shipping_address",
    street_address: "1 Main St",
    address_locality: "Springfield",
    address_region: "IL",
    postal_code: "62701",
    address_country: "US",
  });
  assert.ok(shipping.success);
  assert.equal(shipping.data.street_address, "1 Main St");

  const location = FulfillmentDestinationSchema.safeParse({
    id: "loc_1",
    type: "business_location",
    name: "Flagship Store",
  });
  assert.ok(location.success);
  assert.equal(location.data.name, "Flagship Store");
});

test("FulfillmentDestinationSchema preserves unknown destination variants via FulfillmentDestinationBaseSchema", () => {
  const custom = {
    id: "locker_42",
    type: "com.example.parcel_locker",
    locker_code: "B12",
  };
  const result = FulfillmentDestinationSchema.safeParse(custom);
  assert.ok(result.success);
  assert.deepEqual(result.data, custom);
  assert.ok(FulfillmentDestinationBaseSchema.safeParse(custom).success);
});

test("FulfillmentDestinationSchema and FulfillmentMethodSchema reject missing or non-string discriminators", () => {
  assert.equal(
    FulfillmentDestinationSchema.safeParse({
      id: "dest_missing_type",
      postal_code: "62701",
    }).success,
    false
  );
  assert.equal(
    FulfillmentDestinationSchema.safeParse({
      id: "dest_bad_type",
      type: 123,
    }).success,
    false
  );
  assert.equal(
    FulfillmentMethodSchema.safeParse({
      id: "m_missing_type",
      line_item_ids: ["li_1"],
    }).success,
    false
  );
  assert.equal(
    FulfillmentMethodSchema.safeParse({
      id: "m_bad_type",
      type: null,
      line_item_ids: ["li_1"],
    }).success,
    false
  );
});

test("FulfillmentDestinationSchema rejects malformed known variants instead of falling back to base", () => {
  assert.equal(
    FulfillmentDestinationSchema.safeParse({
      id: "dest_1",
      type: "shipping_address",
      postal_code: 12345,
    }).success,
    false
  );
  assert.equal(
    FulfillmentDestinationSchema.safeParse({
      id: "loc_1",
      type: "business_location",
    }).success,
    false
  );
  assert.equal(
    FulfillmentDestinationBaseSchema.safeParse({
      id: "dest_1",
      type: "shipping_address",
    }).success,
    false
  );
  assert.ok(ShippingDestinationSchema);
  assert.ok(LocationDestinationSchema);
});

test("FulfillmentMethodSchema validates known shipping and pickup variants and preserves unknown variants", () => {
  const shipping = FulfillmentMethodSchema.safeParse({
    id: "m_ship",
    type: "shipping",
    line_item_ids: ["li_1"],
    destinations: [
      {
        id: "dest_1",
        type: "shipping_address",
        postal_code: "62701",
      },
    ],
  });
  assert.ok(shipping.success);
  assert.equal(shipping.data.destinations[0].postal_code, "62701");

  const pickup = FulfillmentMethodSchema.safeParse({
    id: "m_pick",
    type: "pickup",
    line_item_ids: ["li_1"],
    destinations: [
      {
        id: "loc_1",
        type: "business_location",
        name: "Downtown Store",
      },
    ],
  });
  assert.ok(pickup.success);
  assert.equal(pickup.data.destinations[0].name, "Downtown Store");

  const drone = {
    id: "m_drone",
    type: "com.example.drone_delivery",
    line_item_ids: ["li_1"],
    landing_pad_id: "pad_9",
  };
  const customResult = FulfillmentMethodSchema.safeParse(drone);
  assert.ok(customResult.success);
  assert.deepEqual(customResult.data, drone);
  assert.ok(FulfillmentMethodBaseSchema.safeParse(drone).success);
  assert.ok(ShippingMethodSchema);
  assert.ok(PickupMethodSchema);
});

test("CheckoutSchema preserves known and unknown fulfillment methods and destinations end-to-end", () => {
  const checkoutPayload = {
    ucp: {
      version: "2026-08-25",
      payment_handlers: {},
    },
    id: "chk_123",
    status: "incomplete",
    currency: "USD",
    line_items: [
      {
        id: "li_1",
        item: {
          id: "sku_1",
          title: "Widget",
          price: 1500,
        },
        quantity: 1,
        totals: [{ type: "total", amount: 1500 }],
      },
    ],
    totals: [
      { type: "subtotal", amount: 1500 },
      { type: "total", amount: 1500 },
    ],
    links: [
      {
        type: "privacy_policy",
        url: "https://example.com/privacy",
      },
    ],
    fulfillment: {
      methods: [
        {
          id: "m_ship",
          type: "shipping",
          line_item_ids: ["li_1"],
          destinations: [
            {
              type: "shipping_address",
              id: "dest_1",
              postal_code: "94043",
            },
          ],
        },
        {
          id: "m_drone",
          type: "drone_delivery",
          line_item_ids: ["li_1"],
          max_weight_kg: 5,
          destinations: [
            {
              type: "locker",
              id: "lk_1",
              name: "Locker bank 7",
            },
          ],
        },
      ],
    },
  };
  const parsed = CheckoutSchema.safeParse(checkoutPayload);
  assert.ok(parsed.success, JSON.stringify(parsed.error?.issues));
  assert.equal(parsed.data.fulfillment.methods.length, 2);
  assert.equal(
    parsed.data.fulfillment.methods[0].destinations[0].postal_code,
    "94043"
  );
  assert.equal(parsed.data.fulfillment.methods[1].max_weight_kg, 5);
  assert.equal(
    parsed.data.fulfillment.methods[1].destinations[0].name,
    "Locker bank 7"
  );
});

test("FulfillmentMethod Create/Update request open unions reject malformed known variants and preserve unknown variants", () => {
  assert.equal(
    FulfillmentMethodCreateRequestSchema.safeParse({
      type: "shipping",
      destinations: [{ postal_code: 999 }],
    }).success,
    false
  );
  const customCreate = {
    type: "com.example.curbside",
    vehicle_plate: "ABC-123",
  };
  const createRes =
    FulfillmentMethodCreateRequestSchema.safeParse(customCreate);
  assert.ok(createRes.success);
  assert.deepEqual(createRes.data, customCreate);

  const customUpdate = {
    type: "com.example.curbside",
    line_item_ids: ["li_1"],
    vehicle_plate: "XYZ-789",
  };
  const updateRes =
    FulfillmentMethodUpdateRequestSchema.safeParse(customUpdate);
  assert.ok(updateRes.success);
  assert.deepEqual(updateRes.data, customUpdate);
});

test("ProviderSchema validates known oauth2 variant, rejects incomplete oauth2, and preserves unknown provider types", () => {
  const oauth2 = {
    type: "oauth2",
    auth_url: "https://auth.example.com",
    required_claims: ["email"],
  };
  assert.ok(ProviderSchema.safeParse(oauth2).success);
  assert.ok(Oauth2ProviderSchema.safeParse(oauth2).success);

  assert.equal(ProviderSchema.safeParse({ type: "oauth2" }).success, false);
  assert.equal(ProviderBaseSchema.safeParse({ type: "oauth2" }).success, false);

  const customIdp = {
    type: "com.example.passkey_provider",
    rp_id: "example.com",
  };
  const customRes = ProviderSchema.safeParse(customIdp);
  assert.ok(customRes.success);
  assert.deepEqual(customRes.data, customIdp);
});
