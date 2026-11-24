<!--
   Copyright 2026 UCP Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->

<p align="center">
  <h1 align="center">UCP JavaScript SDK</h1>
</p>

<p align="center">
  <b>Official JavaScript library for the Universal Commerce Protocol (UCP).</b>
</p>

## Overview

This repository contains the JavaScript and TypeScript SDK for the
[Universal Commerce Protocol (UCP)](https://ucp.dev). It provides
zero-dependency TypeScript types for UCP wire data transfer objects (DTOs) and
REST OpenAPI operations (`paths`, `operations`, `webhooks`, and `components`),
generated via [`openapi-typescript`](https://openapi-ts.dev/), alongside the
compiled Shopping OpenAPI 3.1 specification (`@ucp-js/sdk/openapi.json`).

### UCP Version Compatibility

Starting with the `2026-08-25` UCP specification release, `@ucp-js/sdk` uses spec-aligned `YYYYMMDD.MINOR.PATCH` versioning on `release/YYYY-MM-DD` branches (for example, `20260825.0.0`), while `main` tracks the `draft` UCP schema channel (`0.0.0-draft`, pinned in `ucp-lock.json`):

| SDK Version / Channel      | UCP Schema Version                       | npm Dist-Tag / Install Source                                  |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `0.0.0-draft` (`main`)     | `draft` (`ucp@main` via `ucp-lock.json`) | Git-native (`github:Universal-Commerce-Protocol/js-sdk#<sha>`) |
| **`YYYYMMDD.MINOR.PATCH`** | **`YYYY-MM-DD` (`>= 2026-08-25`)**       | **`latest` / `release-YYYY-MM-DD`**                            |
| `0.5.x`                    | `2026-08-25`                             | Legacy `0.x` release                                           |
| `0.4.x`                    | `2026-04-08`                             | Legacy `0.x` release                                           |
| `0.1.1`                    | `2026-01-23`                             | Legacy `0.x` release                                           |
| `0.1.0`                    | `2026-01-11`                             | Legacy `0.x` release                                           |

## Installation

To install the latest published UCP specification release from npm:

```bash
npm install @ucp-js/sdk
```

To pin your project to a specific UCP specification release track (`release/YYYY-MM-DD`):

```bash
npm install @ucp-js/sdk@release-YYYY-MM-DD
```

To install the `draft` schema channel directly from a commit SHA on `main` (which automatically compiles `dist/` via the package `prepare` script):

```bash
npm install github:Universal-Commerce-Protocol/js-sdk#<commit-sha>
```

## Usage

The SDK exports compile-time TypeScript definitions for UCP wire data transfer objects (DTOs) and REST OpenAPI operations with zero runtime dependencies. Open UCP models preserve index signatures (`[key: string]: unknown`) for forward-compatible capability extensions, while closed constraint models reject unknown properties at compile time.

```typescript
import type {
  Checkout,
  CheckoutCreateRequest,
  operations,
  paths,
} from "@ucp-js/sdk";

type CreateCheckoutOp = paths["/checkout-sessions"]["post"];
type CreateCheckoutResp =
  operations["create_checkout"]["responses"][201]["content"]["application/json"];

const request: CheckoutCreateRequest = {
  line_items: [{ item: { id: "sku_123" }, quantity: 1 }],
  "com.example.custom_extension": { source: "agent" },
};

function renderCheckout(checkout: Checkout | CreateCheckoutResp) {
  console.log(checkout.status, checkout.currency);
}
```

### Validation

`@ucp-js/sdk` ships pure TypeScript type definitions (`0` runtime dependencies) and performs no runtime validation on its own.

To enforce normative UCP message constraints (capability profile composition, directional `ucp_request` and `ucp_response` visibility, `dependentRequired`, `if`/`then`, `uniqueItems`, `contains`, `propertyNames`, `not.enum`, and closed-schema rules):

1. **In-Memory Runtime Validation (Production Services)**: For standard Shopping payloads, load the bundled OpenAPI 3.1 specification (`@ucp-js/sdk/openapi.json`) directly into [`ajv`](https://ajv.js.org/) (`Ajv2020`) and `ajv-formats` (installed separately) with no `ucp-schema` CLI required. Services with custom capability extensions can instead compile their discovery profile via `ucp-schema generate-openapi --profile profile.json -o openapi.json` and register that document the same way:

```typescript
import { Ajv2020 } from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import openapi from "@ucp-js/sdk/openapi.json" with { type: "json" };
import type { Checkout } from "@ucp-js/sdk";

// At startup: compile the bundled OpenAPI 3.1 schemas once in memory
const ajv = new Ajv2020({ strict: false });
addFormats.default(ajv);
ajv.addSchema(openapi, "ucp");
const validateCheckout = ajv.getSchema("ucp#/components/schemas/Checkout")!;

// Per request: validate in-memory, then narrow to a typed UCP DTO
if (!validateCheckout(rawPayload)) {
  throw new Error(ajv.errorsText(validateCheckout.errors));
}
const checkout = rawPayload as Checkout;
```

2. **CLI & CI Conformance Testing**: Verify fixture payloads or recorded traffic from the command line or CI pipelines with [`ucp-schema validate`](https://github.com/Universal-Commerce-Protocol/ucp-schema):

```bash
# 1. Verify a self-describing response or JSON-RPC payload
ucp-schema validate payload.json --op read

# Or verify a REST request against a negotiated discovery profile
ucp-schema validate payload.json --profile profile.json --op create
```

## Development

### Prerequisites

This project uses `npm` for package management, `typescript` for building, and the [`ucp-schema`](https://github.com/Universal-Commerce-Protocol/ucp-schema) CLI for model generation.

### Generating Models

The models are automatically generated from the JSON schemas in the
[UCP Specification](https://ucp.dev) and pinned via `ucp-lock.json`.

To regenerate models deterministically from the commit pinned in `ucp-lock.json`:

```bash
./generate_models.sh
```

To advance `ucp-lock.json` and regenerate against the latest upstream `draft` (`ucp@main`) or a specific release branch (`release/YYYY-MM-DD`):

```bash
./generate_models.sh --ref main --write-lock
./generate_models.sh --ref release/2026-08-25 --write-lock
```

Alternatively, you can point to a local directory containing the UCP repository or schemas:

```bash
./generate_models.sh --spec-dir /path/to/ucp
```

### Building

To build the project for both CommonJS and ESM:

```bash
npm run build
```

## Contributing

We welcome community contributions. See our
[Contribution Guide](https://github.com/Universal-Commerce-Protocol/.github/blob/main/CONTRIBUTING.md)
for details.

## License

UCP is an open-source project under the [Apache License 2.0](LICENSE).
