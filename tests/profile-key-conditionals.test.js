// Fidelity tests for the conditional rules on a published signing key.
//
// profile.json states five conditional branches on `jwk_public_key`. Two are
// plain `required` consequences that this repo can already model: an EC key
// carries crv, x and y, and an OKP key carries crv and x. Every branch also
// carries a `title`, and the branch shape check treated that annotation as an
// unmodellable extra keyword, so all five were discarded and a key declaring
// `kty: "EC"` with no curve and no coordinates parsed cleanly.
//
// The remaining three branches pair a curve with an algorithm through a
// `properties` consequence, which the recorder does not model. Those are still
// not enforced, so a P-256 key declaring ES384 is still accepted here.

const { test } = require("node:test");
const assert = require("node:assert/strict");

const { EcKeysCarryCrvXYSchema } = require("./.dist/spec_generated.js");

const accepts = (schema, value) => schema.safeParse(value).success === true;
const rejects = (schema, value) => schema.safeParse(value).success === false;

const EC = {
  kid: "key-1",
  kty: "EC",
  crv: "P-256",
  alg: "ES256",
  x: "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
  y: "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
};
const OKP = {
  kid: "key-2",
  kty: "OKP",
  crv: "Ed25519",
  alg: "EdDSA",
  x: "11qY",
};

test("an EC key must carry crv, x and y", () => {
  assert.ok(accepts(EcKeysCarryCrvXYSchema, EC));
  assert.ok(rejects(EcKeysCarryCrvXYSchema, { kid: "key-1", kty: "EC" }));
  const { crv, ...noCrv } = EC;
  assert.ok(rejects(EcKeysCarryCrvXYSchema, noCrv));
  const { y, ...noY } = EC;
  assert.ok(rejects(EcKeysCarryCrvXYSchema, noY));
});

test("an OKP key must carry crv and x", () => {
  assert.ok(accepts(EcKeysCarryCrvXYSchema, OKP));
  assert.ok(rejects(EcKeysCarryCrvXYSchema, { kid: "key-2", kty: "OKP" }));
  const { x, ...noX } = OKP;
  assert.ok(rejects(EcKeysCarryCrvXYSchema, noX));
});

test("the conditional applies only to the matching key type", () => {
  // An unrelated key type carries neither obligation, so the rule must not
  // fire and turn every other key into an error.
  assert.ok(
    accepts(EcKeysCarryCrvXYSchema, { kid: "key-3", kty: "oct", alg: "HS256" })
  );
});

test("the required members the base schema already states still hold", () => {
  assert.ok(rejects(EcKeysCarryCrvXYSchema, { kid: "key-1" }));
  assert.ok(rejects(EcKeysCarryCrvXYSchema, { kty: "EC" }));
});
