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

// The injector documents itself as safe to re-run, and generate_models.sh is
// not the only caller — the script advertises a standalone usage. Idempotency
// rests on alreadyConstrained() recognising every method the injector emits,
// so a new emit path that is not listed there silently double-applies.
test("running the constraint injector twice leaves the file unchanged", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-injector-"));
  const schemaDir = path.join(dir, "schemas");
  fs.mkdirSync(schemaDir);
  fs.writeFileSync(
    path.join(schemaDir, "media.json"),
    JSON.stringify({
      $id: "https://ucp.dev/schemas/media.json",
      title: "Media",
      type: "object",
      properties: {
        url: { type: "string", format: "uri" },
        alt_text: { type: "string", minLength: 1 },
      },
      required: ["url"],
    })
  );

  const target = path.join(dir, "spec_generated.ts");
  fs.writeFileSync(
    target,
    'import * as z from "zod";\n' +
      "\n" +
      "export const MediaSchema = z.object({\n" +
      "  url: z.string(),\n" +
      "  alt_text: z.string().optional(),\n" +
      "});\n"
  );

  execFileSync("node", [SCRIPT, schemaDir, target], { stdio: "pipe" });
  const afterFirst = fs.readFileSync(target, "utf8");
  assert.match(
    afterFirst,
    /url: z\.string\(\)\.url\(\)/,
    "the first pass applies the uri format"
  );

  execFileSync("node", [SCRIPT, schemaDir, target], { stdio: "pipe" });
  assert.equal(
    fs.readFileSync(target, "utf8"),
    afterFirst,
    "a second pass must not re-apply an existing constraint"
  );
});
