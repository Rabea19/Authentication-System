import test from "node:test";
import assert from "node:assert/strict";

import { generateAccessToken, verifyAccessToken } from "../utils/token.js";

test("generateAccessToken should create a valid token containing the user identity", () => {
  const token = generateAccessToken(
    {
      userId: "user-123",
      role: "user",
    },
    "test-jwt-secret",
    "15m",
  );

  assert.equal(typeof token, "string");

  const payload = verifyAccessToken(token, "test-jwt-secret");

  assert.equal(payload.sub, "user-123");

  assert.equal(payload.role, "user");

  assert.equal(payload.alg, undefined);

  assert.equal(typeof payload.iat, "number");

  assert.equal(typeof payload.exp, "number");

  assert.ok(payload.exp > payload.iat);
});

test("generateAccessToken should throw when JWT_SECRET is missing", () => {
  assert.throws(
    () => {
      generateAccessToken(
        {
          userId: "user-123",
          role: "user",
        },
        "",
      );
    },
    {
      message: "JWT_SECRET is missing",
    },
  );
});

test("verifyAccessToken should reject a token signed with a different secret", () => {
  const token = generateAccessToken(
    {
      userId: "user-123",
      role: "user",
    },
    "correct-secret",
    "15m",
  );

  assert.throws(() => {
    verifyAccessToken(token, "wrong-secret");
  });
});
