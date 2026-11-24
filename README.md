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

### Generating REST Server & Client Stubs

Starter Shopping services and single-version platforms without custom capability extensions can import `paths` and `operations` directly from `@ucp-js/sdk` with no CLI step. When composing custom capability profiles or supporting multiple protocol versions simultaneously, compile your profile with `ucp-schema generate-openapi --profile` and `openapi-typescript`:

#### 1. Merchant Server Stubs

Merchants publish a fixed discovery profile, so server route types can be generated once at build time with active capabilities and custom extensions composed in place:

```bash
ucp-schema generate-openapi --profile ./profile.json -o openapi.json
npx openapi-typescript openapi.json --default-non-nullable false --empty-objects-unknown -o src/ucp-openapi.d.ts
```

Disabling non-nullable defaults keeps optional UCP fields with JSON Schema defaults optional in TypeScript, and typing empty objects as unknown records aligns open extension containers with the SDK's generated models (validate incoming wire payloads via `Ajv2020` or OpenAPI middleware per [Validation](#validation) before invoking handlers):

```typescript
import type { components, operations } from "./ucp-openapi.js";

type Body<T> = T extends { content: Record<string, infer B> } ? B : never;
type Resp<T> = { [K in keyof T]: Body<T[K]> }[keyof T];
export type MerchantHandlers<Ops> = {
  [Op in keyof Ops]: (ctx: {
    params: Ops[Op] extends { parameters: infer P } ? P : never;
    body: Ops[Op] extends { requestBody: infer B } ? Body<B> : undefined;
  }) => Promise<Ops[Op] extends { responses: infer R } ? Resp<R> : never>;
};

export const handlers: Pick<MerchantHandlers<operations>, "create_checkout"> = {
  async create_checkout({ body }) {
    const amount = 1500 * (body.line_items?.[0]?.quantity ?? 1);
    const checkout: components["schemas"]["Checkout"] = {
      ucp: { version: "2026-08-25", payment_handlers: {} },
      id: "chk_123",
      status: "incomplete",
      currency: "USD",
      line_items: [],
      totals: ["subtotal", "total"].map((type) => ({ type, amount })),
      links: [],
    };
    return checkout;
  },
};
```

#### 2. Platform Runtime Stub Factory

Multi-version platforms compile their profile once per supported protocol version at build time rather than running code generation per merchant:

```bash
ucp-schema generate-openapi --profile ./platform-2026-08-25.json -o openapi-2026-08-25.json
npx openapi-typescript openapi-2026-08-25.json --default-non-nullable false --empty-objects-unknown -o src/ucp-2026-08-25.d.ts
```

At runtime, validate each merchant's fetched discovery profile over HTTPS using an SSRF-safe `fetch` (for example via `Ajv2020` against `ProfileBusinessSchema` or `ucp-schema validate`), negotiate the highest mutually supported version (following `supported_versions` links when needed and rejecting `supported_versions` on version-specific leaf profiles), cache an `openapi-fetch` client per factory instance, and attach per-version `UCP-Agent`, request headers, and RFC 9421 signing middleware:

```typescript
import createClient from "openapi-fetch";
import type { ProfileBusinessSchema } from "@ucp-js/sdk";
import type { paths as Paths20260825 } from "./ucp-2026-08-25.js";

type AutoHdrs = "Idempotency-Key" | "Request-Id" | "UCP-Agent";
type Hdrs<H> = Omit<H, AutoHdrs> & Partial<Pick<H, AutoHdrs & keyof H>>;
type HdrParam<H> =
  {} extends Omit<H, AutoHdrs> ? { header?: Hdrs<H> } : { header: Hdrs<H> };
type Patch<O> = O extends { parameters: { header: infer H } }
  ? Omit<O, "parameters"> & {
      parameters: Omit<O["parameters"], "header"> & HdrParam<H>;
    }
  : O;
type WithMiddleware<P> = {
  [K in keyof P]: { [M in keyof P[K]]: Patch<P[K][M]> };
};

const CLIENTS = {
  "2026-08-25": (baseUrl: string, fetch?: typeof globalThis.fetch) =>
    createClient<WithMiddleware<Paths20260825>>({ baseUrl, fetch }),
} as const;
type Version = keyof typeof CLIENTS;

export type MerchantClient = {
  [V in Version]: {
    version: V;
    client: ReturnType<(typeof CLIENTS)[V]>;
    capabilities: ReadonlySet<string>;
  };
}[Version];

export interface PlatformOptions {
  agentProfileUrls: Record<Version, string>;
  service?: string;
  fetch?: typeof globalThis.fetch; // Supply an SSRF-safe fetch in production
  validateProfile?: (data: unknown) => void;
  signRequest?: (req: Request) => Request | Promise<Request>;
}

const assertHttps = (u: string) => {
  if (new URL(u).protocol !== "https:") throw new Error(`HTTPS required: ${u}`);
};

export function createPlatformFactory(opts: PlatformOptions) {
  const cache = new Map<string, MerchantClient>();

  function createMerchantClient<V extends Version>(
    v: V,
    url: string,
    capabilities: ReadonlySet<string> = new Set()
  ): Extract<MerchantClient, { version: V }> {
    assertHttps(url);
    const client = CLIENTS[v](url.replace(/\/+$/, ""), opts.fetch);
    client.use({
      async onRequest({ request }) {
        const h = request.headers;
        const set = (k: string, val: string) => h.has(k) || h.set(k, val);
        set("Request-Id", crypto.randomUUID());
        set("UCP-Agent", `profile="${opts.agentProfileUrls[v]}"`);
        // Supply an explicit header["Idempotency-Key"] when retrying mutating calls.
        if (!/^(GET|HEAD)$/.test(request.method))
          set("Idempotency-Key", crypto.randomUUID());
        return opts.signRequest ? await opts.signRequest(request) : request;
      },
    });
    return { version: v, client, capabilities } as Extract<
      MerchantClient,
      { version: V }
    >;
  }

  async function getMerchantClient(url: string): Promise<MerchantClient> {
    const load = async (u: string): Promise<ProfileBusinessSchema> => {
      assertHttps(u);
      const res = await (opts.fetch ?? fetch)(u, { redirect: "error" });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${u}`);
      const raw: unknown = await res.json();
      opts.validateProfile?.(raw); // e.g., Ajv2020 against ProfileBusinessSchema
      return raw as ProfileBusinessSchema;
    };
    let p = await load(url);
    const all = [p.ucp.version, ...Object.keys(p.ucp.supported_versions ?? {})];
    const has = Object.prototype.hasOwnProperty;
    const ver = all
      .filter((v): v is Version => has.call(CLIENTS, v))
      .sort()
      .pop();
    if (!ver) throw new Error(`Unsupported UCP versions: ${all.join(", ")}`);
    const alt = p.ucp.supported_versions?.[ver];
    if (ver !== p.ucp.version && alt) {
      p = await load(alt);
      if (p.ucp.supported_versions)
        throw new Error(`Leaf profile must omit supported_versions: ${alt}`);
    }
    if (p.ucp.version !== ver) throw new Error(`Version mismatch: ${ver}`);

    const svc = opts.service ?? "dev.ucp.shopping";
    const rest = p.ucp.services[svc]?.find((s) => s.transport === "rest");
    if (!rest?.endpoint)
      throw new Error(`No REST endpoint for ${svc} (${ver})`);

    const ep = rest.endpoint.replace(/\/+$/, "");
    const caps = new Set(Object.keys(p.ucp.capabilities ?? {}).sort());
    const key = `${ver}|${ep}|${[...caps]}`;
    const hit = cache.get(key) ?? createMerchantClient(ver, ep, caps);
    cache.set(key, hit);
    return hit;
  }

  return { createMerchantClient, getMerchantClient };
}
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
