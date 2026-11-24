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

import type {
  Cart,
  Checkout,
  CheckoutCompleteRequest,
  CheckoutCreateRequest,
  CheckoutUpdateRequest,
  ErrorResponse,
  FulfillmentDestination,
  FulfillmentMethod,
  Media,
  Order,
  PaymentInstrument,
  ProfileBusinessSchema,
  RequestConstraints,
  ValueConstraint,
  components,
  operations,
  paths,
  webhooks,
} from "../index.js";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

export type ContractAssertions = [
  Expect<Equal<Checkout, components["schemas"]["Checkout"]>>,
  Expect<
    Equal<ProfileBusinessSchema, components["schemas"]["ProfileBusinessSchema"]>
  >,
  Expect<
    Equal<paths["/checkout-sessions"]["post"], operations["create_checkout"]>
  >,
  Expect<
    Equal<
      operations["create_checkout"]["requestBody"]["content"]["application/json"],
      CheckoutCreateRequest
    >
  >,
  Expect<
    Equal<webhooks["orderEvent"]["post"], operations["order_event_webhook"]>
  >,
];

export const openCheckout: Checkout = {
  ucp: { version: "2026-08-25", payment_handlers: {} },
  id: "chk_123",
  status: "incomplete",
  currency: "USD",
  line_items: [],
  totals: [{ type: "total", amount: 1500 }],
  links: [],
  "com.example.ext": { loyalty_tier: "gold" },
};

export const createReq: CheckoutCreateRequest = {
  line_items: [{ item: { id: "sku_1" }, quantity: 1 }],
  "com.example.ext": true,
};

export const updateReq: CheckoutUpdateRequest = {
  id: "chk_123",
  currency: "USD",
  line_items: [{ id: "li_1", item: { id: "sku_1" }, quantity: 2 }],
  payment: {},
  "com.example.ext": "updated",
};

export const completeReq: CheckoutCompleteRequest = {
  payment: { instruments: [] },
  "com.example.ext": 1,
};

export const errorResp: ErrorResponse = {
  ucp: { version: "2026-08-25", status: "error" },
  messages: [
    {
      type: "error",
      code: "invalid_request",
      content: "Invalid field",
      severity: "recoverable",
    },
  ],
  "com.example.trace_id": "req_1",
};

export const instrument: PaymentInstrument = {
  id: "pi_1",
  handler_id: "card_1",
  type: "card",
  display: { brand: "Visa", last4: "4242" },
  "com.example.token": "tok_1",
};

export const profile: ProfileBusinessSchema = {
  ucp: {
    version: "2026-08-25",
    services: {
      "dev.ucp.shopping": [
        {
          version: "2026-08-25",
          transport: "rest",
          endpoint: "https://merchant.example/ucp",
        },
      ],
    },
    payment_handlers: {},
  },
};

export type AdditionalRootDtos = [Cart, Order, Order["fulfillment"]];

export const customDestination: FulfillmentDestination = {
  type: "drone_locker",
  id: "dst_1",
  locker_code: "A4",
};

export const customMethod: FulfillmentMethod = {
  id: "m_1",
  type: "locker_drop",
  line_item_ids: ["li_1"],
  carrier_hint: "local",
};

export const customMedia: Media = {
  type: "hologram",
  url: "https://cdn.example/item.holo",
  frame_rate: 60,
};

// @ts-expect-error FulfillmentDestination requires string discriminator `type`
export const missingDestType: FulfillmentDestination = { id: "dst_1" };

export const numericDestType: FulfillmentDestination = {
  // @ts-expect-error FulfillmentDestination rejects non-string `type`
  type: 42,
  id: "dst_1",
};

export const validValueConst: ValueConstraint = { const: "US" };
export const validValueEnum: ValueConstraint = { enum: ["US", "CA"] };

export const invalidValueConstraint: ValueConstraint = {
  const: "US",
  // @ts-expect-error ValueConstraint is closed (`additionalProperties: false`)
  extra_field: true,
};

export const validRequestConstraints: RequestConstraints = {
  required: ["buyer"],
  properties: { buyer: { const: "present" } },
};

export const invalidRequestConstraints: RequestConstraints = {
  required: ["buyer"],
  // @ts-expect-error RequestConstraints is closed (`additionalProperties: false`)
  unknown_constraint: true,
};
