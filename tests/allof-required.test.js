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

// Schema nodes that declare `required` alongside `allOf` (and carry no
// top-level `properties`, such as daily_hour.json and exception_hour.json)
// had their `required` array discarded during projection because
// scripts/project-current-ucp-schemas.mjs only processed `required`
// when inspecting `key === "properties"`, skipping it on all other keys.
// The projection now preserves top-level `required` when `properties`
// is not present on the schema node.

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
  "project-current-ucp-schemas.mjs"
);

const {
  DailyHourElementSchema,
  ExceptionHourElementSchema,
} = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

function roots() {
  const entity = {
    type: "object",
    properties: { schema: { type: "string" }, spec: { type: "string" } },
  };
  return {
    "schemas/ucp.json": {
      $defs: {
        version: { type: "string" },
        entity,
        base: {
          type: "object",
          required: ["version"],
          properties: { version: { $ref: "#/$defs/version" } },
        },
        business_schema: {
          allOf: [{ $ref: "#/$defs/base" }, { type: "object" }],
        },
      },
    },
    "schemas/payment_handler.json": {
      $defs: { response_schema: entity },
    },
    "schemas/service.json": {
      $defs: {
        base: {
          allOf: [
            {},
            { type: "object", properties: { endpoint: { type: "string" } } },
          ],
        },
        response_schema: entity,
      },
    },
    "schemas/capability.json": {
      $defs: {
        base: {
          allOf: [
            {},
            { type: "object", properties: { extends: { type: "string" } } },
          ],
        },
        response_schema: entity,
      },
    },
  };
}

function project(schemas) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-allof-required-"));
  const source = path.join(dir, "source");
  const output = path.join(dir, "projected");
  try {
    const files = {
      ...roots(),
      ...schemas,
    };
    fs.mkdirSync(path.join(source, "schemas/shopping/types"), { recursive: true });
    fs.mkdirSync(path.join(source, "schemas/common/types"), { recursive: true });
    for (const [rel, schema] of Object.entries(files)) {
      const abs = path.join(source, rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, JSON.stringify(schema, null, 2));
    }
    execFileSync("node", [SCRIPT, source, output], { stdio: "pipe" });
    const result = {};
    for (const rel of Object.keys(schemas)) {
      result[rel] = JSON.parse(
        fs.readFileSync(path.join(output, rel), "utf8")
      );
    }
    return result;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// --- projection tests ------------------------------------------------------

test("projection preserves required on schemas with allOf and no top-level properties", () => {
  const projected = project({
    "schemas/common/types/base_interval.json": {
      title: "Base Interval",
      type: "object",
      properties: {
        opens: { type: "string" },
        closes: { type: "string" },
      },
    },
    "schemas/common/types/hour.json": {
      title: "Hour",
      type: "object",
      allOf: [{ $ref: "base_interval.json" }],
      required: ["opens", "closes"],
    },
  });

  assert.deepEqual(projected["schemas/common/types/hour.json"].required, [
    "opens",
    "closes",
  ]);
});

test("projection preserves required on schemas with top-level properties", () => {
  const projected = project({
    "schemas/common/types/regular.json": {
      title: "Regular",
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      },
    },
  });

  assert.deepEqual(projected["schemas/common/types/regular.json"].required, [
    "name",
  ]);
});

// --- generated schema tests ------------------------------------------------

test("DailyHourElementSchema requires day, opens, and closes", () => {
  const valid = {
    day: "monday",
    opens: "09:00",
    closes: "17:00",
  };
  assert.ok(accepts(DailyHourElementSchema, valid));
  assert.ok(rejects(DailyHourElementSchema, {}));
  assert.ok(
    rejects(DailyHourElementSchema, { opens: "09:00", closes: "17:00" })
  );
  assert.ok(
    rejects(DailyHourElementSchema, { day: "monday", closes: "17:00" })
  );
  assert.ok(
    rejects(DailyHourElementSchema, { day: "monday", opens: "09:00" })
  );
});

test("ExceptionHourElementSchema requires valid_from and valid_through", () => {
  const closure = {
    valid_from: "2026-11-26",
    valid_through: "2026-11-26",
  };
  assert.ok(accepts(ExceptionHourElementSchema, closure));
  assert.ok(
    accepts(ExceptionHourElementSchema, {
      ...closure,
      opens: "10:00",
      closes: "14:00",
    })
  );
  assert.ok(rejects(ExceptionHourElementSchema, {}));
  assert.ok(
    rejects(ExceptionHourElementSchema, { valid_from: "2026-11-26" })
  );
  assert.ok(
    rejects(ExceptionHourElementSchema, { valid_through: "2026-11-26" })
  );
});
