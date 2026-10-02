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

// The hand written `--src` list in generate_models.sh names the capabilities it
// generates. quicktype exits 0 whether or not a source produced anything, so a
// capability the list does not name -- every capability a later spec release
// adds -- generates nothing and says nothing. scripts/discover-capability-srcs.mjs
// re-derives the fragments from the schema tree by shape, generates the sources
// the shared list does not model in isolation, merges them, and refuses to
// continue when a fragment cannot be represented unless a reviewer excluded it
// on purpose.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.join(
  __dirname,
  "..",
  "scripts",
  "discover-capability-srcs.mjs"
);

function withTree(files, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-capability-srcs-"));
  try {
    for (const [rel, value] of Object.entries(files)) {
      const abs = path.join(root, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(
        abs,
        typeof value === "string"
          ? value
          : `${JSON.stringify(value, null, 2)}\n`
      );
    }
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function run(root, extra) {
  return spawnSync("node", [SCRIPT, ...extra, path.join(root, "schemas")], {
    encoding: "utf8",
  });
}

function discover(files, shared = []) {
  return withTree(
    { ...files, "shared.txt": `${shared.join("\n")}\n` },
    (root) => {
      const manifest = path.join(root, "manifest.json");
      const result = run(root, [
        "--shared",
        path.join(root, "shared.txt"),
        "--manifest",
        manifest,
      ]);
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(fs.readFileSync(manifest, "utf8"));
    }
  );
}

// A next release capability: a declared dev.ucp name plus a lookup pair.
function futureLookup() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    name: "dev.ucp.common.future.lookup",
    $defs: {
      lookup_request: {
        type: "object",
        required: ["id"],
        properties: { id: { type: "string" } },
      },
      lookup_response: {
        type: "object",
        properties: { result: { type: "string" } },
      },
    },
  };
}

// A capability extending checkout: the composition, plus the surface it adds.
function attachment() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    name: "dev.ucp.common.thing.authentication",
    $defs: {
      "dev.ucp.shopping.checkout": {
        allOf: [
          { $ref: "../shopping/checkout.json" },
          { type: "object", properties: { thing: { type: "string" } } },
        ],
      },
    },
  };
}

function generationFixture(root, files) {
  for (const [rel, value] of Object.entries(files)) {
    const abs = path.join(root, "schemas", rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
  }
  const generated = path.join(root, "generated.ts");
  fs.writeFileSync(generated, 'import * as z from "zod";\n');
  const exclusions = path.join(root, "exclusions.json");
  fs.writeFileSync(exclusions, `${JSON.stringify({ exclusions: [] })}\n`);
  return { generated, exclusions };
}

function generate(root, fixture, extra = []) {
  return run(root, [
    "--manifest",
    path.join(root, "manifest.json"),
    "--generated",
    fixture.generated,
    "--exclusions",
    fixture.exclusions,
    ...extra,
  ]);
}

test("discovers operations and extensions of a declared capability, and nothing else", () => {
  const manifest = discover({
    "schemas/common/future_lookup.json": futureLookup(),
    "schemas/common/thing_authentication.json": attachment(),
    // The same shapes without a UCP capability declaration: a helper def is not
    // a capability, and a nested allOf is not a capability attachment.
    "schemas/common/helper.json": { $defs: futureLookup().$defs },
    "schemas/shopping/product.json": {
      name: "dev.ucp.shopping.product",
      $defs: {
        lookup_variant: {
          allOf: [
            { $ref: "./variant.json" },
            { type: "object", properties: { x: { type: "string" } } },
          ],
        },
      },
    },
  });

  assert.deepEqual(
    manifest.map((entry) => [entry.source, entry.modeled]),
    [
      ["common/future_lookup.json", false],
      ["common/thing_authentication.json", false],
    ]
  );
  assert.deepEqual(
    manifest[0].fragments.map(({ kind, topLevel }) => ({ kind, topLevel })),
    [
      { kind: "operation", topLevel: "FutureLookupLookupRequest" },
      { kind: "operation", topLevel: "FutureLookupLookupResponse" },
    ]
  );
  assert.deepEqual(
    manifest[1].fragments.map(({ kind, topLevel }) => ({ kind, topLevel })),
    [
      { kind: "extended", topLevel: "ThingAuthenticationCheckout" },
      { kind: "payload", topLevel: "ThingAuthenticationCheckoutPayload" },
    ]
  );
});

test("coverage ignores layout prefixes and the projector's variant suffixes", () => {
  const manifest = discover({ "schemas/shopping/thing.json": attachment() }, [
    "schemas/shopping/thing.create_req.json#/$defs/checkout",
  ]);
  assert.equal(manifest.length, 1);
  assert.equal(manifest[0].modeled, true);
});

test("a future capability generates and merges with names derived from the spec", () => {
  return withTree({}, (root) => {
    const fixture = generationFixture(root, {
      "common/future_lookup.json": futureLookup(),
    });
    const result = generate(root, fixture);
    assert.equal(result.status, 0, result.stderr);
    const generated = fs.readFileSync(fixture.generated, "utf8");
    assert.match(
      generated,
      /export const FutureLookupLookupRequestSchema = z\.object/
    );
    assert.match(
      generated,
      /export const FutureLookupLookupResponseSchema = z\.object/
    );
  });
});

test("an unrepresentable fragment without a reviewed exclusion fails the build", () => {
  return withTree({}, (root) => {
    const fixture = generationFixture(root, {
      "common/future_lookup.json": futureLookup(),
    });
    const failing = path.join(root, "quicktype-fails");
    fs.writeFileSync(failing, "#!/bin/sh\nexit 7\n");
    fs.chmodSync(failing, 0o755);
    const result = generate(root, fixture, ["--quicktype", failing]);
    assert.notEqual(result.status, 0);
    assert.match(
      result.stderr,
      /failed generation without a reviewed exclusion/
    );
  });
});

test("a quicktype success that exports nothing is still a failure", () => {
  return withTree({}, (root) => {
    const fixture = generationFixture(root, {
      "common/future_lookup.json": futureLookup(),
    });
    const silent = path.join(root, "quicktype-silent");
    fs.writeFileSync(
      silent,
      `#!/bin/sh
while [ "$1" != "-o" ]; do shift; done
printf '%s\\n' '// quicktype exits 0 having emitted nothing' > "$2"
`
    );
    fs.chmodSync(silent, 0o755);
    const result = generate(root, fixture, ["--quicktype", silent]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /generated no schema exports/);
  });
});

test("an exclusion that no longer matches a discovered fragment is rejected", () => {
  return withTree({}, (root) => {
    const fixture = generationFixture(root, {
      "common/future_lookup.json": futureLookup(),
    });
    fs.writeFileSync(
      fixture.exclusions,
      `${JSON.stringify({
        exclusions: [
          { src: "common/removed.json#/$defs/removed", reason: "old" },
        ],
      })}\n`
    );
    const result = generate(root, fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /exclusions no longer discovered/);
  });
});

test("an excluded fragment that generates again must leave the exclusion list", () => {
  return withTree({}, (root) => {
    const fixture = generationFixture(root, {
      "common/future_lookup.json": futureLookup(),
    });
    fs.writeFileSync(
      fixture.exclusions,
      `${JSON.stringify({
        exclusions: [
          {
            src: "common/future_lookup.json#/$defs/lookup_request",
            reason: "was broken",
          },
        ],
      })}\n`
    );
    const result = generate(root, fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /now generates; remove the stale exclusion/);
  });
});

// Generated from the real 2026-08-25 spec by the pipeline this change extends.
// Before it, every one of these models was absent while generation exited 0.
const {
  PaymentAuthenticationCheckoutPayloadSchema,
  DevUcpCommonPaymentDeviceDataCollectionConfigSchema,
  DevUcpCommonPaymentThreeDsChallengeConfigSchema,
} = require("./.dist/spec_generated.js");

test("payment authentication ships its actions, with the spec's value constraints", () => {
  const payload = {
    actions: {
      "dev.ucp.common.payment.device_data_collection": [
        {
          config: { payment_instrument_id: "pi-1", url: "https://3ds.test/d" },
        },
      ],
      "dev.ucp.common.payment.three_ds_challenge": [
        {
          config: { payment_instrument_id: "pi-1", url: "https://3ds.test/c" },
        },
      ],
    },
  };
  assert.equal(
    PaymentAuthenticationCheckoutPayloadSchema.safeParse(payload).success,
    true
  );
  assert.equal(
    DevUcpCommonPaymentDeviceDataCollectionConfigSchema.safeParse({
      payment_instrument_id: "",
      url: "https://3ds.test/d",
    }).success,
    false
  );
  assert.equal(
    DevUcpCommonPaymentThreeDsChallengeConfigSchema.safeParse({
      payment_instrument_id: "pi-1",
      url: "not-a-url",
    }).success,
    false
  );
});
