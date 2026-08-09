import test from "node:test";
import assert from "node:assert/strict";

import {
  generatePasswordResetToken,
  hashPasswordResetToken,
  createPasswordResetExpiry,
} from "../utils/passwordResetToken.js";

test("generatePasswordResetToken should generate a 64-character hexadecimal token", () => {
  const token = generatePasswordResetToken();

  assert.equal(typeof token, "string");

  assert.equal(token.length, 64);

  assert.match(token, /^[a-f0-9]{64}$/);
});

test("generatePasswordResetToken should generate different tokens", () => {
  const firstToken = generatePasswordResetToken();

  const secondToken = generatePasswordResetToken();

  assert.notEqual(firstToken, secondToken);
});

test("hashPasswordResetToken should create a SHA-256 hash", () => {
  const plainToken = "test-reset-token";

  const hashedToken = hashPasswordResetToken(plainToken);

  assert.equal(typeof hashedToken, "string");

  assert.equal(hashedToken.length, 64);

  assert.match(hashedToken, /^[a-f0-9]{64}$/);

  assert.notEqual(hashedToken, plainToken);
});

test("hashPasswordResetToken should return the same hash for the same token", () => {
  const plainToken = "test-reset-token";

  const firstHash = hashPasswordResetToken(plainToken);

  const secondHash = hashPasswordResetToken(plainToken);

  assert.equal(firstHash, secondHash);
});

test("createPasswordResetExpiry should add the specified number of minutes", () => {
  const currentTime = new Date("2026-08-07T10:00:00.000Z").getTime();

  const expiry = createPasswordResetExpiry(15, currentTime);

  const expectedExpiry = new Date("2026-08-07T10:15:00.000Z");

  assert.equal(expiry.getTime(), expectedExpiry.getTime());
});
