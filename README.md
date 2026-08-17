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
| **`0.4.x`** | **`2026-04-08`**   |
| `0.1.1`     | `2026-01-23`       |
| `0.1.0`     | `2026-01-11`       |

## Installation

To install the SDK in your project, run:

```bash
npm install @ucp-js/sdk
```

## Usage

The SDK provides Zod schemas and TypeScript types for UCP models. You can use Zod to validate incoming data or ensure your outgoing data matches the specification.

### TypeScript / ES Modules

```typescript
import { CheckoutResponseSchema, CheckoutResponse } from "@ucp-js/sdk";

// Validate data against UCP schemas
const parseResult = CheckoutResponseSchema.safeParse(checkoutData);

if (parseResult.success) {
  const checkout: CheckoutResponse = parseResult.data;
  console.log(checkout.status); // "incomplete" | "ready_for_complete" | ...
  console.log(checkout.currency); // ISO 4217 currency code
} else {
  console.error(parseResult.error);
}
```

### CommonJS

```javascript
const { CheckoutResponseSchema } = require("@ucp-js/sdk");

const parseResult = CheckoutResponseSchema.safeParse(checkoutData);
if (parseResult.success) {
  const checkout = parseResult.data;
  // ...
}
```

## Development

### Prerequisites

This project uses `npm` for package management and `typescript` for building.

### Generating Models

The models are automatically generated from the JSON schemas in the
[UCP Specification](https://ucp.dev).

To regenerate the models, you first need a local copy of the
[UCP specification](https://github.com/Universal-Commerce-Protocol/ucp). If you
don't have one, you can clone it via:

```bash
git clone https://github.com/Universal-Commerce-Protocol/ucp.git
```

Then, run `npm run generate` pointing to the root of the cloned repository,
e.g.:

```bash
npm run generate -- ucp
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
