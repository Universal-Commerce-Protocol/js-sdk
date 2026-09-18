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

// `dependentRequired` (JSON Schema 2020-12) is dropped by quicktype's
// typescript-zod target. time_interval.json allows an empty fragment but
// requires `opens` and `closes` to appear together, and fulfillment_method.json
// requires `type` whenever `destinations` is present; the generated schemas
// accepted either field alone. The constraint injector now renders the rule as
// an object-level superRefine, keyed like every other object-level constraint
// by the resolved property set, and skips a rule naming a field the property
// set does not carry (a request projection that omitted it) rather than
// approximating it. A rule whose dependents the generated object already
// requires can never change a verdict, so it is not rendered: wrapping the
// object would only turn an exported ZodObject into a ZodEffects.

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
  "inject-schema-constraints.mjs"
);

const {
  TimeIntervalSchema,
  ExceptionHourElementSchema,
  DailyHourElementSchema,
  FulfillmentMethodCreateRequestSchema,
  FulfillmentMethodUpdateRequestSchema,
  FulfillmentMethodResponseSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

function withInjector(schemas, generated, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-dependent-"));
  try {
    const schemaDir = path.join(dir, "schemas");
    fs.mkdirSync(schemaDir);
    for (const [name, schema] of Object.entries(schemas)) {
      fs.writeFileSync(path.join(schemaDir, name), JSON.stringify(schema));
    }
    const target = path.join(dir, "spec_generated.ts");
    fs.writeFileSync(target, 'import * as z from "zod";\n\n' + generated);
    const run = () =>
      execFileSync("node", [SCRIPT, schemaDir, target], { encoding: "utf8" });
    return fn(run, () => fs.readFileSync(target, "utf8"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const interval = {
  $id: "https://ucp.dev/schemas/interval.json",
  title: "Interval",
  type: "object",
  properties: { opens: { type: "string" }, closes: { type: "string" } },
  dependentRequired: { opens: ["closes"], closes: ["opens"] },
};

const intervalTs =
  "export const IntervalSchema = z.object({\n" +
  "  closes: z.string().optional(),\n" +
  "  opens: z.string().optional(),\n" +
  "});\n";

// --- the injector ----------------------------------------------------------

test("injector renders dependentRequired as an object-level superRefine", () => {
  withInjector({ "interval.json": interval }, intervalTs, (run, read) => {
    const report = run();
    assert.match(report, /1 object dependentRequired check\(s\)/);
    const output = read();
    assert.match(
      output,
      /export const IntervalSchema = z\.object\(\{[\s\S]*?\}\)\.superRefine\([\s\S]*dependentRequired/
    );
    assert.match(output, /\["opens",\["closes"\]\]/);
    assert.match(output, /\["closes",\["opens"\]\]/);
  });
});

test("injector dependentRequired splice is idempotent", () => {
  withInjector({ "interval.json": interval }, intervalTs, (run, read) => {
    run();
    const afterFirst = read();
    run();
    assert.equal(
      read(),
      afterFirst,
      "a second pass must not re-apply the rule"
    );
  });
});

test("injector honours dependentRequired declared on an allOf part", () => {
  const composed = {
    $id: "https://ucp.dev/schemas/composed.json",
    title: "Composed",
    type: "object",
    allOf: [
      { $ref: "interval.json" },
      { type: "object", properties: { note: { type: "string" } } },
    ],
  };
  const base = { ...interval, dependentRequired: { opens: ["closes"] } };
  const composedTs =
    "export const ComposedSchema = z.object({\n" +
    "  closes: z.string().optional(),\n" +
    "  note: z.string().optional(),\n" +
    "  opens: z.string().optional(),\n" +
    "});\n";
  withInjector(
    { "interval.json": base, "composed.json": composed },
    composedTs,
    (run, read) => {
      run();
      assert.match(
        read(),
        /ComposedSchema = z\.object\(\{[\s\S]*?\}\)\.superRefine\([\s\S]*\["opens",\["closes"\]\]/
      );
    }
  );
});

test("injector skips a dependentRequired rule naming a field the property set lacks", () => {
  // A request projection may omit the dependent field; the rule is then
  // inapplicable rather than malformed and must not be approximated.
  const projected = {
    ...interval,
    properties: { opens: { type: "string" } },
    dependentRequired: { opens: ["closes"] },
  };
  const projectedTs =
    "export const IntervalSchema = z.object({\n" +
    "  opens: z.string().optional(),\n" +
    "});\n";
  withInjector({ "interval.json": projected }, projectedTs, (run, read) => {
    const report = run();
    assert.match(report, /0 object dependentRequired check\(s\)/);
    assert.doesNotMatch(read(), /dependentRequired/);
  });
});

test("injector leaves a property set that carries conflicting dependentRequired rules untouched", () => {
  const other = {
    $id: "https://ucp.dev/schemas/other.json",
    title: "Other",
    type: "object",
    properties: { opens: { type: "string" }, closes: { type: "string" } },
  };
  withInjector(
    { "interval.json": interval, "other.json": other },
    intervalTs,
    (run, read) => {
      const report = run();
      assert.match(report, /<dependentRequired>@\{closes,opens\}/);
      assert.doesNotMatch(read(), /dependentRequired/);
    }
  );
});

test("injector skips a dependentRequired rule whose dependents the generated object already requires", () => {
  // `required: ["opens", "closes"]` next to the pair rule: z.object already
  // rejects either field alone, so a superRefine could never change a verdict
  // and would only turn the exported ZodObject into a ZodEffects.
  const strict = { ...interval, required: ["opens", "closes"] };
  const strictTs =
    "export const IntervalSchema = z.object({\n" +
    "  closes: z.string(),\n" +
    "  opens: z.string(),\n" +
    "});\n";
  withInjector({ "interval.json": strict }, strictTs, (run, read) => {
    const report = run();
    assert.match(report, /0 object dependentRequired check\(s\)/);
    assert.match(report, /2 vacuous dependentRequired rule\(s\)/);
    assert.doesNotMatch(read(), /dependentRequired/);
  });
});

test("injector keeps only the dependentRequired subjects that can still change a verdict", () => {
  // `opens` is required on the object, so `closes` needs `opens` is vacuous;
  // `opens` needs `closes` is live because `closes` is optional.
  const half = { ...interval, required: ["opens"] };
  const halfTs =
    "export const IntervalSchema = z.object({\n" +
    "  closes: z.string().optional(),\n" +
    "  opens: z.string(),\n" +
    "});\n";
  withInjector({ "interval.json": half }, halfTs, (run, read) => {
    const report = run();
    assert.match(report, /1 object dependentRequired check\(s\)/);
    assert.match(report, /1 vacuous dependentRequired rule\(s\)/);
    const output = read();
    assert.match(output, /\["opens",\["closes"\]\]/);
    assert.doesNotMatch(output, /\["closes",\["opens"\]\]/);
  });
});

// --- the generated schemas -------------------------------------------------

test("TimeIntervalSchema requires opens and closes together (dependentRequired)", () => {
  assert.ok(accepts(TimeIntervalSchema, {}));
  assert.ok(accepts(TimeIntervalSchema, { opens: "09:00", closes: "17:00" }));
  assert.ok(rejects(TimeIntervalSchema, { opens: "09:00" }));
  assert.ok(rejects(TimeIntervalSchema, { closes: "17:00" }));
});

test("ExceptionHourElementSchema inherits the pair rule through allOf: a closure carries neither, an interval both", () => {
  const closure = { valid_from: "2026-11-26", valid_through: "2026-11-26" };
  assert.ok(accepts(ExceptionHourElementSchema, closure));
  assert.ok(
    accepts(ExceptionHourElementSchema, {
      ...closure,
      opens: "10:00",
      closes: "14:00",
    })
  );
  assert.ok(
    rejects(ExceptionHourElementSchema, { ...closure, opens: "10:00" })
  );
});

test("DailyHourElementSchema keeps the pair rule: the generated object carries opens and closes as optional", () => {
  // daily_hour.json lists day, opens and closes as required, but quicktype
  // emits all three optional (a separate, pre-existing loss), so on the
  // generated object the rule is live, not vacuous: judged on the schema's
  // `required` it would have been dropped and `{ day, opens }` kept passing.
  assert.ok(rejects(DailyHourElementSchema, { day: "monday", opens: "09:00" }));
  assert.ok(
    accepts(DailyHourElementSchema, {
      day: "monday",
      opens: "09:00",
      closes: "17:00",
    })
  );
});

test("FulfillmentMethodCreateRequestSchema and FulfillmentMethodResponseSchema stay plain z.object: type is required there, so destinations needs type is vacuous", () => {
  assert.ok(
    FulfillmentMethodCreateRequestSchema.shape,
    "FulfillmentMethodCreateRequestSchema lost .shape: wrapped for a rule that cannot change a verdict"
  );
  assert.ok(
    FulfillmentMethodResponseSchema.shape,
    "FulfillmentMethodResponseSchema lost .shape: wrapped for a rule that cannot change a verdict"
  );
});

test("FulfillmentMethodUpdateRequestSchema enforces dependentRequired: destinations requires type", () => {
  const destination = {
    first_name: "Ada",
    last_name: "Lovelace",
    street_address: "1 Main St",
    address_locality: "Springfield",
    address_region: "IL",
    postal_code: "62701",
    address_country: "US",
  };
  assert.ok(
    accepts(FulfillmentMethodUpdateRequestSchema, {
      line_item_ids: ["li_1"],
    })
  );
  assert.ok(
    accepts(FulfillmentMethodUpdateRequestSchema, {
      type: "shipping",
      line_item_ids: ["li_1"],
      destinations: [destination],
    })
  );
  assert.ok(
    rejects(FulfillmentMethodUpdateRequestSchema, {
      line_item_ids: ["li_1"],
      destinations: [destination],
    })
  );
});
