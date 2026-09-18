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

// quicktype names an anonymous inline object after its property when that
// name is free. Splitting types/fulfillment.json into Create Request / Update
// Request / Response variants freed the bare title `Fulfillment`, and
// order.json's inline `fulfillment` object ({ events, expectations }) took it,
// so the existing FulfillmentSchema export kept compiling while silently
// changing meaning. The normalizer pins that inline object to its historical
// name (FulfillmentClass) and re-exports the split family's unified names as
// compatibility aliases of the response variant.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const SCRIPT = path.join(
  __dirname,
  "..",
  "scripts",
  "normalize-generated-schemas.mjs"
);

function normalize(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-normalize-"));
  try {
    const input = path.join(dir, "input.ts");
    const output = path.join(dir, "output.ts");
    fs.writeFileSync(input, 'import * as z from "zod";\n\n' + source);
    execFileSync("node", [SCRIPT, input, output], { stdio: "pipe" });
    return fs.readFileSync(output, "utf8");
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const orderFulfillment =
  "export const FulfillmentSchema = z.object({\n" +
  "  events: z.array(z.string()).optional(),\n" +
  "  expectations: z.array(z.string()).optional(),\n" +
  "});\n" +
  "export type Fulfillment = z.infer<typeof FulfillmentSchema>;\n";

const fulfillmentResponse =
  "export const FulfillmentResponseSchema = z.object({\n" +
  "  methods: z.array(z.string()).optional(),\n" +
  "});\n" +
  "export type FulfillmentResponse = z.infer<typeof FulfillmentResponseSchema>;\n";

const order =
  "export const OrderSchema = z.object({\n" +
  "  fulfillment: FulfillmentSchema.optional(),\n" +
  "});\n" +
  "export type Order = z.infer<typeof OrderSchema>;\n";

test("the inline order fulfillment object that captured the bare name is renamed back to FulfillmentClass", () => {
  const output = normalize(orderFulfillment + fulfillmentResponse + order);
  assert.match(
    output,
    /export const FulfillmentClassSchema = z\.object\(\{\n  events:[\s\S]*?\}\);\nexport type FulfillmentClass = z\.infer<typeof FulfillmentClassSchema>;/
  );
  assert.match(output, /fulfillment: FulfillmentClassSchema\.optional\(\)/);
  assert.doesNotMatch(output, /typeof FulfillmentSchema>/);
});

test("FulfillmentSchema is then re-exported as an alias of FulfillmentResponseSchema", () => {
  const output = normalize(orderFulfillment + fulfillmentResponse + order);
  assert.match(
    output,
    /export const FulfillmentSchema = FulfillmentResponseSchema;\nexport type Fulfillment = FulfillmentResponse;/
  );
});

test("a Fulfillment export that already IS the response shape is left alone", () => {
  const output = normalize(
    "export const FulfillmentSchema = z.object({\n" +
      "  methods: z.array(z.string()).optional(),\n" +
      "});\n" +
      "export type Fulfillment = z.infer<typeof FulfillmentSchema>;\n" +
      fulfillmentResponse
  );
  assert.doesNotMatch(output, /FulfillmentClass/);
  assert.equal(
    (output.match(/export const FulfillmentSchema\b/g) ?? []).length,
    1
  );
});

test("without a split response variant nothing is renamed", () => {
  const output = normalize(orderFulfillment + order);
  assert.doesNotMatch(output, /FulfillmentClass/);
  assert.match(output, /fulfillment: FulfillmentSchema\.optional\(\)/);
});

test("the split family's unified names are re-exported as response aliases", () => {
  const output = normalize(
    "export const FulfillmentMethodResponseSchema = z.object({\n" +
      "  id: z.string(),\n" +
      "});\n" +
      "export type FulfillmentMethodResponse = z.infer<typeof FulfillmentMethodResponseSchema>;\n"
  );
  assert.match(
    output,
    /export const FulfillmentMethodSchema = FulfillmentMethodResponseSchema;\nexport type FulfillmentMethod = FulfillmentMethodResponse;/
  );
  assert.match(
    output,
    /export const MethodElementSchema = FulfillmentMethodResponseSchema;\nexport type MethodElement = FulfillmentMethodResponse;/
  );
});
