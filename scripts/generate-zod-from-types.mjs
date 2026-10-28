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

import fs from "node:fs";
import path from "node:path";
import { jsonSchemaToZod } from "json-schema-to-zod";
import ts from "typescript";

const [typesJsonArg, targetTsArg] = process.argv.slice(2);
if (!typesJsonArg || !targetTsArg) {
  console.error(
    "Usage: node scripts/generate-zod-from-types.mjs <types-json> <spec-generated-ts>"
  );
  process.exit(1);
}

const typesJsonPath = path.resolve(typesJsonArg);
const targetTsPath = path.resolve(targetTsArg);

function toPascalIdent(raw) {
  const cleaned = String(raw)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  if (!cleaned) {
    return "";
  }
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned;
}

function toSchemaIdentifier(defName) {
  const pascal = toPascalIdent(defName);
  return pascal.endsWith("Schema") && pascal !== "Schema"
    ? pascal
    : `${pascal}Schema`;
}

function toTypeIdentifier(defName) {
  const pascal = toPascalIdent(defName);
  return pascal.endsWith("Schema") && pascal !== "Schema"
    ? pascal.slice(0, -6)
    : pascal;
}

function isPureConditionalBranch(branch) {
  if (!branch || typeof branch !== "object") {
    return false;
  }
  const hasCondition = Boolean(
    branch.if || branch.then || branch.else || branch.not
  );
  const hasStructure = Boolean(
    branch.$ref ||
    branch.properties ||
    branch.type ||
    branch.anyOf ||
    branch.oneOf ||
    branch.allOf
  );
  return hasCondition && !hasStructure;
}

function prepareDefinitions(rawDefs) {
  const defs = structuredClone(rawDefs);

  function normalizeNode(node, isRoot) {
    if (!node || typeof node !== "object") {
      return node;
    }
    if (Array.isArray(node)) {
      return node.map((item) => normalizeNode(item, false));
    }

    if (Array.isArray(node.allOf)) {
      node.allOf = node.allOf.filter(
        (branch) => !isPureConditionalBranch(branch)
      );
      if (node.allOf.length === 0) {
        delete node.allOf;
      }
    }

    delete node.default;
    delete node.if;
    delete node.then;
    delete node.else;
    if (node.not && (node.type || node.properties)) {
      delete node.not;
    }

    if (Array.isArray(node.oneOf)) {
      node.anyOf = node.oneOf;
      delete node.oneOf;
    }

    if (Array.isArray(node.anyOf) && !node.properties) {
      if (node.type === "object") {
        delete node.type;
      }
      delete node.additionalProperties;
    }

    for (const [key, value] of Object.entries(node)) {
      node[key] = normalizeNode(value, false);
    }

    const isObjectNode = node.type === "object" || Boolean(node.properties);

    if (
      isRoot ||
      typeof node.title !== "string" ||
      (!isObjectNode && !node.anyOf)
    ) {
      return node;
    }

    const hoistedName = toPascalIdent(node.title);
    if (!hoistedName) {
      return node;
    }
    if (!defs[hoistedName]) {
      defs[hoistedName] = structuredClone(node);
    }
    return { $ref: `#/$defs/${hoistedName}` };
  }

  for (const name of Object.keys(defs)) {
    defs[name] = normalizeNode(defs[name], true);
  }

  return defs;
}

function collectRefs(node, selfName, out = new Set()) {
  if (!node || typeof node !== "object") {
    return out;
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      collectRefs(item, selfName, out);
    }
    return out;
  }
  if (typeof node.$ref === "string" && node.$ref.startsWith("#/$defs/")) {
    const refName = node.$ref.slice("#/$defs/".length);
    if (refName !== selfName) {
      out.add(refName);
    }
  }
  for (const value of Object.values(node)) {
    collectRefs(value, selfName, out);
  }
  return out;
}

function topologicalSort(defs) {
  const names = Object.keys(defs).sort();
  const visited = new Set();
  const ordered = [];

  function visit(name) {
    if (visited.has(name) || !(name in defs)) {
      return;
    }
    visited.add(name);
    const deps = [...collectRefs(defs[name], name)].sort();
    for (const dep of deps) {
      visit(dep);
    }
    ordered.push(name);
  }

  for (const name of names) {
    visit(name);
  }
  return ordered;
}

function formatDeprecationMessage(schemaNode) {
  const raw =
    schemaNode?.["x-ucp-schema-transition"]?.description ||
    schemaNode?.description ||
    "Deprecated.";
  const cleaned = String(raw)
    .replace(/\*\//g, "*\\/")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.replace(/^deprecated:\s*/i, "") || "Deprecated.";
}

function annotateDeprecatedObjectProperties(expr, schema) {
  if (!schema?.properties || typeof schema.properties !== "object") {
    return expr;
  }
  const deprecatedProps = new Map();
  for (const [propName, propSchema] of Object.entries(schema.properties)) {
    if (propSchema?.deprecated === true) {
      deprecatedProps.set(propName, formatDeprecationMessage(propSchema));
    }
  }
  if (deprecatedProps.size === 0) {
    return expr;
  }
  const sf = ts.createSourceFile(
    "__expr.ts",
    expr,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const stmt = sf.statements[0];
  if (!stmt || !ts.isExpressionStatement(stmt)) {
    return expr;
  }
  let cur = stmt.expression;
  while (
    ts.isCallExpression(cur) &&
    ts.isPropertyAccessExpression(cur.expression) &&
    !(
      ts.isIdentifier(cur.expression.expression) &&
      cur.expression.expression.text === "z" &&
      cur.expression.name.text === "object"
    )
  ) {
    cur = cur.expression.expression;
  }
  if (
    !ts.isCallExpression(cur) ||
    !cur.arguments.length ||
    !ts.isObjectLiteralExpression(cur.arguments[0])
  ) {
    return expr;
  }
  const edits = [];
  for (const prop of cur.arguments[0].properties) {
    if (!ts.isPropertyAssignment(prop)) {
      continue;
    }
    const propName =
      ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)
        ? prop.name.text
        : null;
    if (!propName || !deprecatedProps.has(propName)) {
      continue;
    }
    const msg = deprecatedProps.get(propName);
    edits.push({
      pos: prop.getStart(sf),
      text: `\n/** @deprecated ${msg} */\n`,
    });
    edits.push({
      pos: prop.initializer.getEnd(),
      text: `.describe(${JSON.stringify(`@deprecated ${msg}`)})`,
    });
  }
  edits.sort((a, b) => b.pos - a.pos);
  let updated = expr;
  for (const edit of edits) {
    updated = `${updated.slice(0, edit.pos)}${edit.text}${updated.slice(edit.pos)}`;
  }
  return updated;
}

function renderDefinitionExpr(defName, schema) {
  const options = {
    withoutDefaults: true,
    withoutDescribes: true,
    zodVersion: 3,
    parserOverride(subSchema) {
      if (
        typeof subSchema.$ref === "string" &&
        subSchema.$ref.startsWith("#/$defs/")
      ) {
        const refName = subSchema.$ref.slice("#/$defs/".length);
        const refSchemaIdent = toSchemaIdentifier(refName);
        if (refName === defName) {
          return `z.lazy(() => ${refSchemaIdent})`;
        }
        return refSchemaIdent;
      }

      if (
        subSchema.type === "object" &&
        !subSchema.properties &&
        subSchema.additionalProperties &&
        typeof subSchema.additionalProperties === "object" &&
        typeof subSchema.propertyNames?.$ref === "string" &&
        subSchema.propertyNames.$ref.startsWith("#/$defs/")
      ) {
        const keyDefName = subSchema.propertyNames.$ref.slice(
          "#/$defs/".length
        );
        const keySchemaIdent = toSchemaIdentifier(keyDefName);
        const valueExpr = jsonSchemaToZod(
          subSchema.additionalProperties,
          options
        );
        return `z.record(${keySchemaIdent}, ${valueExpr})`;
      }

      return undefined;
    },
  };

  return annotateDeprecatedObjectProperties(
    jsonSchemaToZod(schema, options),
    schema
  );
}

const rawDoc = JSON.parse(fs.readFileSync(typesJsonPath, "utf8"));
const defs = prepareDefinitions(rawDoc.$defs || {});
const sortedNames = topologicalSort(defs);

const lines = [
  'import { z } from "zod";',
  "",
  'declare module "zod" {',
  "  interface ZodObject<",
  "    T extends z.ZodRawShape,",
  "    UnknownKeys extends z.UnknownKeysParam = z.UnknownKeysParam,",
  "    Catchall extends z.ZodTypeAny = z.ZodTypeAny,",
  "    Output = z.objectOutputType<T, Catchall, UnknownKeys>,",
  "    Input = z.objectInputType<T, Catchall, UnknownKeys>,",
  "  > {",
  "    catchall<Index extends z.ZodTypeAny>(",
  "      index: Index",
  "    ): z.ZodObject<",
  "      T,",
  "      UnknownKeys,",
  "      Index,",
  "      {",
  "        [K in keyof z.objectOutputType<",
  "          T,",
  "          Index,",
  "          UnknownKeys",
  "        >]: z.objectOutputType<T, Index, UnknownKeys>[K];",
  "      },",
  "      {",
  "        [K in keyof z.objectInputType<",
  "          T,",
  "          Index,",
  "          UnknownKeys",
  "        >]: z.objectInputType<T, Index, UnknownKeys>[K];",
  "      }",
  "    >;",
  "  }",
  "}",
  "",
];

for (const defName of sortedNames) {
  const schema = defs[defName];
  const schemaIdent = toSchemaIdentifier(defName);
  const typeIdent = toTypeIdentifier(defName);
  const expr = renderDefinitionExpr(defName, schema);
  const isRecursive = expr.includes(`z.lazy(() => ${schemaIdent})`);
  const topDeprecationComment =
    schema?.deprecated === true
      ? `/** @deprecated ${formatDeprecationMessage(schema)} */`
      : null;

  if (topDeprecationComment) {
    lines.push(topDeprecationComment);
  }
  if (isRecursive) {
    lines.push(`export const ${schemaIdent}: z.ZodType<any> = ${expr};`);
  } else {
    lines.push(`export const ${schemaIdent} = ${expr};`);
  }
  if (topDeprecationComment) {
    lines.push(topDeprecationComment);
  }
  lines.push(`export type ${typeIdent} = z.infer<typeof ${schemaIdent}>;`);
  lines.push("");
}

fs.writeFileSync(targetTsPath, `${lines.join("\n").trimEnd()}\n`);
