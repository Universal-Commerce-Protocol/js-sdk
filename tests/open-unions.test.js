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
  CardCredentialSchema,
  CheckoutSchema,
  CheckoutCreateRequestSchema,
  CheckoutCompleteRequestSchema,
  FulfillmentDestinationSchema,
  FulfillmentDestinationBaseSchema,
  ShippingDestinationSchema,
  LocationDestinationSchema,
  FulfillmentMethodSchema,
  FulfillmentMethodBaseSchema,
  FulfillmentMethodCreateRequestSchema,
  FulfillmentMethodUpdateRequestSchema,
  FulfillmentVariantSchema,
  ShippingMethodCreateRequestSchema,
  ShippingMethodSchema,
  PickupMethodSchema,
  MediaSchema,
  MediaBaseSchema,
  MediaImageSchema,
  MediaVideoSchema,
  MediaExternalVideoSchema,
  MediaModel3dSchema,
  MediaSourceSchema,
  MediaBasePreviewSchema,
  MediaImagePreviewSchema,
  MediaVideoPreviewSchema,
  MediaExternalVideoPreviewSchema,
  MediaModel3dPreviewSchema,
  ProductSchema,
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

test("ShippingDestinationSchema and LocationDestinationSchema reject malformed variant fields", () => {
  assert.equal(
    ShippingDestinationSchema.safeParse({
      id: "dest_1",
      type: "shipping_address",
      postal_code: 12345,
    }).success,
    false
  );
  assert.equal(
    LocationDestinationSchema.safeParse({
      id: "loc_1",
      type: "business_location",
    }).success,
    false
  );
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

test("FulfillmentMethod Create/Update request schemas reject malformed shipping variants and preserve unknown variants", () => {
  assert.equal(
    ShippingMethodCreateRequestSchema.safeParse({
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

test("ProviderSchema validates known oauth2 variant, Oauth2ProviderSchema rejects incomplete oauth2, and ProviderSchema preserves unknown provider types", () => {
  const oauth2 = {
    type: "oauth2",
    auth_url: "https://auth.example.com",
    required_claims: ["email"],
  };
  assert.ok(ProviderSchema.safeParse(oauth2).success);
  assert.ok(Oauth2ProviderSchema.safeParse(oauth2).success);
  assert.ok(ProviderBaseSchema);

  assert.equal(
    Oauth2ProviderSchema.safeParse({ type: "oauth2" }).success,
    false
  );

  const customIdp = {
    type: "com.example.passkey_provider",
    rp_id: "example.com",
  };
  const customRes = ProviderSchema.safeParse(customIdp);
  assert.ok(customRes.success);
  assert.deepEqual(customRes.data, customIdp);
});

test("CheckoutCompleteRequestSchema accepts non-AP2 checkout completion payloads", () => {
  const withoutAp2 = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [] },
  });
  assert.ok(withoutAp2.success);

  const withValidAp2 = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [] },
    ap2: { checkout_mandate: "eyJhbGciOiJFZERTQSJ9.eyJ0ZXN0IjoxfQ.c2ln" },
  });
  assert.ok(withValidAp2.success);
});

test("Media variant schemas and subtypes are publicly exported", () => {
  assert.ok(MediaSchema);
  assert.ok(MediaBaseSchema);
  assert.ok(MediaImageSchema);
  assert.ok(MediaVideoSchema);
  assert.ok(MediaExternalVideoSchema);
  assert.ok(MediaModel3dSchema);
  assert.ok(MediaSourceSchema);
  assert.ok(MediaBasePreviewSchema);
  assert.ok(MediaImagePreviewSchema);
  assert.ok(MediaVideoPreviewSchema);
  assert.ok(MediaExternalVideoPreviewSchema);
  assert.ok(MediaModel3dPreviewSchema);
  assert.ok(CardCredentialSchema);
});

test("MediaSchema validates known image, video, external_video, and model_3d variants with preview and sources", () => {
  const imagePayload = {
    type: "image",
    url: "https://example.com/media/hero.jpg",
    name: "Hero Image",
    alt_text: "Front view of product",
    width: 1200,
    height: 800,
    preview: {
      url: "https://example.com/media/hero-thumb.jpg",
      width: 300,
      height: 200,
    },
    sources: [
      {
        url: "https://example.com/media/hero-2x.webp",
        mime_type: "image/webp",
        format: "webp",
        width: 2400,
        height: 1600,
        filesize: 184320,
      },
    ],
  };
  assert.ok(MediaImageSchema.safeParse(imagePayload).success);
  const parsedImage = MediaSchema.safeParse(imagePayload);
  assert.ok(parsedImage.success);
  assert.deepEqual(parsedImage.data, imagePayload);

  const videoPayload = {
    type: "video",
    url: "https://example.com/media/demo.mp4",
    name: "Product Demo",
    alt_text: "360 spin video",
    width: 1920,
    height: 1080,
    duration: 45,
    preview: {
      url: "https://example.com/media/demo-poster.jpg",
      width: 1920,
      height: 1080,
    },
    sources: [
      {
        url: "https://example.com/media/demo-1080p.mp4",
        mime_type: "video/mp4",
        format: "mp4",
        width: 1920,
        height: 1080,
        filesize: 5242880,
      },
    ],
  };
  assert.ok(MediaVideoSchema.safeParse(videoPayload).success);
  const parsedVideo = MediaSchema.safeParse(videoPayload);
  assert.ok(parsedVideo.success);
  assert.deepEqual(parsedVideo.data, videoPayload);

  const externalVideoPayload = {
    type: "external_video",
    url: "https://video.example.com/watch?v=abc123",
    name: "Launch Keynote",
    duration: 180,
    preview: {
      url: "https://example.com/media/keynote-poster.jpg",
      width: 1280,
      height: 720,
    },
  };
  assert.ok(MediaExternalVideoSchema.safeParse(externalVideoPayload).success);
  const parsedExtVideo = MediaSchema.safeParse(externalVideoPayload);
  assert.ok(parsedExtVideo.success);
  assert.deepEqual(parsedExtVideo.data, externalVideoPayload);

  const model3dPayload = {
    type: "model_3d",
    url: "https://example.com/media/chair.glb",
    name: "3D Chair Model",
    preview: {
      url: "https://example.com/media/chair-preview.png",
      width: 600,
      height: 600,
    },
    sources: [
      {
        url: "https://example.com/media/chair.usdz",
        mime_type: "model/vnd.usdz+zip",
        format: "usdz",
        filesize: 2097152,
      },
    ],
  };
  assert.ok(MediaModel3dSchema.safeParse(model3dPayload).success);
  const parsedModel3d = MediaSchema.safeParse(model3dPayload);
  assert.ok(parsedModel3d.success);
  assert.deepEqual(parsedModel3d.data, model3dPayload);
});

test("MediaSchema rejects malformed media fields and missing/non-string discriminators", () => {
  for (const knownTag of ["image", "video", "external_video", "model_3d"]) {
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
      }).success,
      false,
      `MediaSchema must reject ${knownTag} missing url`
    );
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
        url: "not-a-valid-uri",
      }).success,
      false,
      `MediaSchema must reject ${knownTag} with invalid URI`
    );
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
        url: "https://example.com/media/item",
        width: 0,
      }).success,
      false,
      `MediaSchema must reject ${knownTag} with width: 0`
    );
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
        url: "https://example.com/media/item",
        duration: 0,
      }).success,
      false,
      `MediaSchema must reject ${knownTag} with duration: 0`
    );
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
        url: "https://example.com/media/item",
        preview: { url: "bad" },
      }).success,
      false,
      `MediaSchema must reject ${knownTag} with invalid preview.url`
    );
    assert.equal(
      MediaSchema.safeParse({
        type: knownTag,
        url: "https://example.com/media/item",
        sources: [{ url: "https://example.com/a", filesize: 0 }],
      }).success,
      false,
      `MediaSchema must reject ${knownTag} with sources[0].filesize: 0`
    );
  }

  assert.equal(
    MediaSchema.safeParse({ url: "https://example.com/media/no-type.jpg" })
      .success,
    false
  );
  assert.equal(
    MediaSchema.safeParse({
      type: 123,
      url: "https://example.com/media/bad-type.jpg",
    }).success,
    false
  );
  assert.equal(
    MediaSchema.safeParse({
      type: null,
      url: "https://example.com/media/null-type.jpg",
    }).success,
    false
  );
});

test("MediaSchema preserves forward-compatible unknown media types and extra properties across ProductSchema and FulfillmentVariantSchema", () => {
  const customHologram = {
    type: "com.example.hologram",
    url: "https://example.com/media/shoe.holo",
    name: "Shoe Hologram",
    duration: 30,
    preview: {
      url: "https://example.com/media/shoe-still.jpg",
      width: 512,
      height: 512,
    },
    sources: [
      {
        url: "https://example.com/media/shoe.holo",
        mime_type: "application/x-example-holo",
        format: "holo-v2",
        filesize: 4096,
      },
    ],
    "com.example.fov_degrees": 120,
  };
  const baseResult = MediaBaseSchema.safeParse(customHologram);
  assert.ok(baseResult.success);
  assert.deepEqual(baseResult.data, customHologram);

  const unionResult = MediaSchema.safeParse(customHologram);
  assert.ok(unionResult.success);
  assert.deepEqual(unionResult.data, customHologram);

  const audioMedia = {
    type: "audio",
    url: "https://example.com/media/chime.flac",
    duration: 12,
    codec: "flac",
  };
  const audioResult = MediaSchema.safeParse(audioMedia);
  assert.ok(audioResult.success);
  assert.deepEqual(audioResult.data, audioMedia);

  assert.equal(
    MediaSchema.safeParse({
      type: "com.example.hologram",
      url: "not-a-uri",
    }).success,
    false
  );
  assert.equal(
    MediaSchema.safeParse({
      type: "com.example.hologram",
      url: "https://example.com/media/shoe.holo",
      duration: -1,
    }).success,
    false
  );

  const variantPayload = {
    id: "var_1",
    title: "Holo Sneaker - Size 10",
    description: { plain: "Sneaker with hologram media" },
    price: { amount: 12000, currency: "USD" },
    media: [
      {
        type: "image",
        url: "https://example.com/media/sneaker.jpg",
        width: 1000,
        height: 1000,
      },
      customHologram,
    ],
  };
  const parsedVariant = FulfillmentVariantSchema.safeParse(variantPayload);
  assert.ok(parsedVariant.success, JSON.stringify(parsedVariant.error?.issues));
  assert.equal(parsedVariant.data.media.length, 2);
  assert.equal(parsedVariant.data.media[1]["com.example.fov_degrees"], 120);

  const productPayload = {
    id: "prod_1",
    title: "Holo Sneaker",
    description: { plain: "Flagship sneaker" },
    price_range: {
      min: { amount: 12000, currency: "USD" },
      max: { amount: 12000, currency: "USD" },
    },
    media: [customHologram, audioMedia],
    variants: [variantPayload],
  };
  const parsedProduct = ProductSchema.safeParse(productPayload);
  assert.ok(parsedProduct.success, JSON.stringify(parsedProduct.error?.issues));
  assert.deepEqual(parsedProduct.data.media[0], customHologram);
  assert.deepEqual(parsedProduct.data.media[1], audioMedia);
});

test("CheckoutCompleteRequestSchema marks cart_id as @deprecated while keeping runtime validation optional string", () => {
  assert.equal(
    typeof CheckoutCompleteRequestSchema.shape.cart_id.description,
    "string"
  );
  assert.ok(
    CheckoutCompleteRequestSchema.shape.cart_id.description.startsWith(
      "@deprecated"
    )
  );
  assert.equal(
    CheckoutCreateRequestSchema.shape.cart_id.description,
    undefined
  );
  assert.equal(CheckoutSchema.shape.cart_id.description, undefined);

  const omittedCartId = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [] },
  });
  assert.ok(omittedCartId.success);

  const stringCartId = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [] },
    cart_id: "cart_legacy_123",
  });
  assert.ok(stringCartId.success);
  assert.equal(stringCartId.data.cart_id, "cart_legacy_123");

  const numericCartId = CheckoutCompleteRequestSchema.safeParse({
    payment: { instruments: [] },
    cart_id: 123,
  });
  assert.equal(numericCartId.success, false);
});

test("CheckoutCreateRequestSchema enforces line_items and quantity >= 1 while preserving third-party extension fields", () => {
  const validCreate = {
    line_items: [
      {
        item: { id: "sku_100" },
        quantity: 2,
        "com.example.gift_wrap": true,
      },
    ],
    cart_id: "cart_abc",
    "com.example.channel": "mobile_app",
  };
  const parsed = CheckoutCreateRequestSchema.safeParse(validCreate);
  assert.ok(parsed.success, JSON.stringify(parsed.error?.issues));
  assert.equal(parsed.data.cart_id, "cart_abc");
  assert.equal(parsed.data["com.example.channel"], "mobile_app");
  assert.equal(parsed.data.line_items[0]["com.example.gift_wrap"], true);

  assert.equal(
    CheckoutCreateRequestSchema.safeParse({
      cart_id: "cart_missing_items",
    }).success,
    false
  );
  assert.equal(
    CheckoutCreateRequestSchema.safeParse({
      line_items: [{ item: { id: "sku_100" }, quantity: 0 }],
    }).success,
    false
  );
  assert.equal(
    CheckoutCreateRequestSchema.safeParse({
      line_items: [{ item: {}, quantity: 1 }],
    }).success,
    false
  );
});
