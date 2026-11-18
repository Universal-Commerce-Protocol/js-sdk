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

This repository contains the JavaScript SDK for the
[Universal Commerce Protocol (UCP)](https://ucp.dev). It provides TypeScript
types and [Zod](https://zod.dev/) schemas for UCP models, making it easy to
build UCP-compliant applications in JavaScript and TypeScript.

### UCP Version Compatibility

Each version of the JavaScript SDK is generated against a specific version of the UCP schema:

| SDK Version | UCP Schema Version |
| ----------- | ------------------ |
| **`0.6.x`** | **`2026-08-25`**   |
| `0.5.x`     | `2026-08-25`       |
| `0.4.x`     | `2026-04-08`       |
| `0.1.1`     | `2026-01-23`       |
| `0.1.0`     | `2026-01-11`       |

## Installation

To install the SDK in your project, run:

```bash
npm install @ucp-js/sdk
```

## Usage

The SDK provides Zod schemas and TypeScript types for UCP wire data transfer objects (DTOs). Generated Zod schemas perform structural type parsing and tolerant-reader deserialization while preserving unknown extension fields.

### TypeScript / ES Modules

```typescript
import { CheckoutSchema, Checkout } from "@ucp-js/sdk";

// Parse wire payload into a typed UCP DTO
const parseResult = CheckoutSchema.safeParse(checkoutData);

if (parseResult.success) {
  const checkout: Checkout = parseResult.data;
  console.log(checkout.status); // "incomplete" | "ready_for_complete" | ...
  console.log(checkout.currency); // ISO 4217 currency code
} else {
  console.error(parseResult.error);
}
```

### CommonJS

```javascript
const { CheckoutSchema } = require("@ucp-js/sdk");

const parseResult = CheckoutSchema.safeParse(checkoutData);
if (parseResult.success) {
  const checkout = parseResult.data;
  // ...
}
```

### Validation

Zod DTO schemas validate structural wire types and preserve unknown extension properties for forward compatibility, but they do not enforce full UCP protocol conformance on their own.

To enforce normative UCP message constraints (capability profile composition, directional `ucp_request` and `ucp_response` visibility, `dependentRequired`, `if`/`then`, `uniqueItems`, `contains`, `propertyNames`, `not.enum`, and closed-schema rules):

1. **In-Memory Runtime Validation (Production Services)**: Compile your UCP discovery profile once at build or startup time into a standard JSON Schema Draft 2020-12 bundle (`ucp-schema generate-types --profile profile.json -o ucp.types.json`) or OpenAPI 3.1 specification (`ucp-schema generate-openapi --profile profile.json -o openapi.json`). Because `ucp-schema` resolves all UCP-specific annotations and capability extensions into standard JSON Schema 2020-12, your server can validate payloads in memory on every request using [`ajv`](https://ajv.js.org/) (`Ajv2020`) or standard OpenAPI middleware before parsing into SDK DTOs:

```typescript
import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { CheckoutSchema, Checkout } from "@ucp-js/sdk";

// At startup: compile the pre-generated schema bundle once in memory
const bundle = JSON.parse(fs.readFileSync("ucp.types.json", "utf8"));
const ajv = new Ajv2020({ strict: false });
addFormats(ajv);
ajv.addSchema(bundle, "https://ucp.dev/bundle.json");
const validateCheckout = ajv.getSchema(
  "https://ucp.dev/bundle.json#/$defs/Checkout"
)!;

// Per request: validate in-memory, then parse into a typed DTO
if (!validateCheckout(rawPayload)) {
  throw new Error(ajv.errorsText(validateCheckout.errors));
}
const checkout: Checkout = CheckoutSchema.parse(rawPayload);
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
[UCP Specification](https://ucp.dev).

Model generation via `ucp-schema generate-types` supports UCP release `2026-08-25` and later. To regenerate the models against a specific release version:

```bash
npm run generate -- 2026-08-25
```

Alternatively, you can point to a local directory containing the UCP repository or schemas:

```bash
npm run generate -- /path/to/ucp
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
