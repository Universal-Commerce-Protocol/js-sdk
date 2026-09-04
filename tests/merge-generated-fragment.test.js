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
const { execFileSync, spawnSync } = require("node:child_process");

const SCRIPT = path.join(
  __dirname,
  "..",
  "scripts",
  "merge-generated-fragment.mjs"
);

// The declaration schemas are generated in their own quicktype invocation so
// the main invocation's global name pool is untouched (adding sources to one
// shared invocation renames existing exports, a breaking API change). This
// script folds the fragment into the raw main output. Its contract:
//   - a chunk whose exported names are all NEW is appended verbatim;
//   - a chunk whose exported names all EXIST must match the main file's text
//     for those names (modulo whitespace), and is then skipped -- a mismatch
//     is a hard error, never a silent skip, because silently binding a
//     fragment reference to a same-named but differently-shaped main type is
//     exactly the class of silent wrong output this pipeline exists to kill;
//   - a chunk mixing new and existing names is a hard error;
//   - a fragment containing no exports at all is a hard error: quicktype
//     exits 0 when it silently drops everything, and that silence is the
//     original bug.

const MAIN = `// UCP generated models

export const FooSchema = z.object({
  a: z.string(),
});
export type Foo = z.infer<typeof FooSchema>;

export const BarSchema = z.object({
  b: z.number(),
});
export type Bar = z.infer<typeof BarSchema>;
`;

function withFiles(mainText, fragmentText, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-merge-"));
  const mainPath = path.join(root, "main.ts");
  const fragmentPath = path.join(root, "fragment.ts");
  try {
    fs.writeFileSync(mainPath, mainText);
    fs.writeFileSync(fragmentPath, fragmentText);
    return fn(mainPath, fragmentPath);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function run(mainPath, fragmentPath) {
  execFileSync("node", [SCRIPT, mainPath, fragmentPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return fs.readFileSync(mainPath, "utf8");
}

function runExpectingFailure(mainPath, fragmentPath) {
  try {
    execFileSync("node", [SCRIPT, mainPath, fragmentPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    return { status: error.status, stderr: String(error.stderr) };
  }
  assert.fail("expected the merge to exit non-zero");
}

test("appends chunks whose exported names are all new", () => {
  const fragment = `// fragment banner comment

export const NewThingSchema = z.object({
  c: z.boolean(),
});
export type NewThing = z.infer<typeof NewThingSchema>;
`;
  const merged = withFiles(MAIN, fragment, run);
  assert.match(merged, /export const NewThingSchema = z\.object\(\{/);
  assert.match(
    merged,
    /export type NewThing = z\.infer<typeof NewThingSchema>;/
  );
  // The pre-existing declarations are byte-for-byte untouched.
  assert.ok(merged.startsWith(MAIN.replace(/\s*$/, "")));
  // The fragment's banner comment is not copied in.
  assert.ok(!merged.includes("fragment banner comment"));
});

test("skips a chunk identical to the main file's chunk for the same name", () => {
  const fragment = `export const FooSchema = z.object({
  a: z.string(),
});
export type Foo = z.infer<typeof FooSchema>;

export const NewThingSchema = z.object({
  c: z.boolean(),
});
export type NewThing = z.infer<typeof NewThingSchema>;
`;
  const merged = withFiles(MAIN, fragment, run);
  // Foo appears exactly once (the original), NewThing was appended.
  assert.equal(merged.match(/export const FooSchema/g).length, 1);
  assert.match(merged, /export const NewThingSchema/);
});

test("whitespace differences alone do not count as a conflict", () => {
  const fragment = `export const FooSchema = z.object({ a: z.string(), });
export type Foo = z.infer<typeof FooSchema>;
`;
  const merged = withFiles(MAIN, fragment, run);
  assert.equal(merged.match(/export const FooSchema/g).length, 1);
});

test("a same-named chunk with a different shape is a hard error, not a silent skip", () => {
  const fragment = `export const FooSchema = z.object({
  a: z.number(),
});
export type Foo = z.infer<typeof FooSchema>;
`;
  const { status, stderr } = withFiles(MAIN, fragment, runExpectingFailure);
  assert.notEqual(status, 0);
  assert.match(stderr, /Foo/);
  assert.match(stderr, /conflict|differs|mismatch/i);
});

test("a chunk mixing existing and new names is a hard error", () => {
  // One chunk (no blank line inside) declaring both an existing and a new name.
  const fragment = `export const FooSchema = z.object({
  a: z.string(),
});
export type Foo = z.infer<typeof FooSchema>;
export const NewThingSchema = z.object({
  c: z.boolean(),
});
export type NewThing = z.infer<typeof NewThingSchema>;
`;
  const { status, stderr } = withFiles(MAIN, fragment, runExpectingFailure);
  assert.notEqual(status, 0);
  assert.match(stderr, /mix/i);
});

test("a fragment with no exports at all is a hard error (the silent-drop tripwire)", () => {
  const fragment = `// quicktype emitted nothing but a banner\n`;
  const { status, stderr } = withFiles(MAIN, fragment, runExpectingFailure);
  assert.notEqual(status, 0);
  assert.match(stderr, /no export/i);
});

test("a colliding chunk that differs only by a consistent rename of an equivalent referenced schema is skipped", () => {
  // The two invocations can name the SAME underlying schema differently
  // (main: AllowedCombinationElement, fragment: InstrumentGroup, both
  // generated from the same instrument_group definition). The chunks are
  // interchangeable, so the fragment copy is skipped -- but only after the
  // referenced pair is itself proven equivalent, recursively.
  const main = `export const AllowedCombinationElementSchema = z.object({
  handlers: z.array(z.string()),
});
export type AllowedCombinationElement = z.infer<typeof AllowedCombinationElementSchema>;

export const SplitConfigSchema = z.object({
  allowed_combinations: z.array(z.array(AllowedCombinationElementSchema)),
});
export type SplitConfig = z.infer<typeof SplitConfigSchema>;
`;
  const fragment = `export const InstrumentGroupSchema = z.object({
  handlers: z.array(z.string()),
});
export type InstrumentGroup = z.infer<typeof InstrumentGroupSchema>;

export const SplitConfigSchema = z.object({
  allowed_combinations: z.array(z.array(InstrumentGroupSchema)),
});
export type SplitConfig = z.infer<typeof SplitConfigSchema>;

export const NewDeclSchema = z.object({
  config: SplitConfigSchema.optional(),
});
export type NewDecl = z.infer<typeof NewDeclSchema>;
`;
  const merged = withFiles(main, fragment, run);
  // SplitConfig kept its main-invocation body, InstrumentGroup and NewDecl
  // were appended, and nothing was duplicated.
  assert.equal(merged.match(/export const SplitConfigSchema/g).length, 1);
  assert.match(
    merged,
    /z\.array\(z\.array\(AllowedCombinationElementSchema\)\)/
  );
  assert.match(merged, /export const InstrumentGroupSchema/);
  assert.match(merged, /export const NewDeclSchema/);
});

test("a renamed reference that is NOT equivalent still fails loudly", () => {
  const main = `export const AllowedCombinationElementSchema = z.object({
  handlers: z.array(z.string()),
});
export type AllowedCombinationElement = z.infer<typeof AllowedCombinationElementSchema>;

export const SplitConfigSchema = z.object({
  allowed_combinations: z.array(AllowedCombinationElementSchema),
});
export type SplitConfig = z.infer<typeof SplitConfigSchema>;
`;
  const fragment = `export const InstrumentGroupSchema = z.object({
  handlers: z.number(),
});
export type InstrumentGroup = z.infer<typeof InstrumentGroupSchema>;

export const SplitConfigSchema = z.object({
  allowed_combinations: z.array(InstrumentGroupSchema),
});
export type SplitConfig = z.infer<typeof SplitConfigSchema>;
`;
  const { status, stderr } = withFiles(main, fragment, runExpectingFailure);
  assert.notEqual(status, 0);
  assert.match(stderr, /SplitConfig/);
});

// Identifier renaming must never reach INSIDE a string or regex literal. Two
// enums whose members differ are different schemas, however their surrounding
// identifiers pair up. Treating literal contents as renameable schema
// references would silently skip the fragment chunk and bind its references to
// a differently shaped main type, which is the exact silent wrong output this
// pipeline exists to kill.
test("two enums differing only inside string literals are not equivalent", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ucp-merge-lit-"));
  try {
    const mainPath = path.join(root, "main.ts");
    const fragmentPath = path.join(root, "fragment.ts");
    fs.writeFileSync(
      mainPath,
      [
        'import * as z from "zod";',
        "",
        "export const CardSchema = z.object({ kind: z.string() });",
        "export type Card = z.infer<typeof CardSchema>;",
        "",
        'export const MethodSchema = z.enum(["Card"]);',
        "export type Method = z.infer<typeof MethodSchema>;",
        "",
      ].join("\n")
    );
    // Same export name, same shape except the enum MEMBER. Card and Voucher
    // name equivalent schemas, so a renaming-based comparison pairs them.
    fs.writeFileSync(
      fragmentPath,
      [
        'import * as z from "zod";',
        "",
        "export const VoucherSchema = z.object({ kind: z.string() });",
        "export type Voucher = z.infer<typeof VoucherSchema>;",
        "",
        'export const MethodSchema = z.enum(["Voucher"]);',
        "export type Method = z.infer<typeof MethodSchema>;",
        "",
      ].join("\n")
    );

    const result = spawnSync("node", [SCRIPT, mainPath, fragmentPath], {
      encoding: "utf8",
    });

    assert.equal(
      result.status,
      1,
      `expected a hard error for a differing enum member, got status ${result.status}. stderr: ${result.stderr}`
    );
    assert.ok(
      !fs.readFileSync(mainPath, "utf8").includes('z.enum(["Voucher"])'),
      "the fragment must not have been silently merged"
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
