import test from "node:test";
import assert from "node:assert/strict";

import {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
  createVerificationCodeExpiry,
} from "../utils/verificationCode.js";

test("generateVerificationCode should return exactly six digits", () => {
  const code = generateVerificationCode();

  assert.equal(typeof code, "string");
  assert.match(code, /^\d{6}$/);
});

test("hashVerificationCode should not return the plain code", () => {
  const plainCode = "012345";
  const secret = "test-verification-secret";

  const hashedCode = hashVerificationCode(plainCode, secret);

  assert.notEqual(hashedCode, plainCode);
});

test("hashVerificationCode should return the same hash for the same input", () => {
  const plainCode = "012345";
  const secret = "test-verification-secret";

  const firstHash = hashVerificationCode(plainCode, secret);
  const secondHash = hashVerificationCode(plainCode, secret);

  assert.equal(firstHash, secondHash);
});

test("hashVerificationCode should reject a missing secret", () => {
  assert.throws(
    () => hashVerificationCode("012345", ""),
    /VERIFICATION_CODE_SECRET is missing/,
  );
});

test("createVerificationCodeExpiry should add the requested minutes", () => {
  const currentTime = new Date("2026-07-26T12:00:00.000Z").getTime();

  const expiryDate = createVerificationCodeExpiry(10, currentTime);

  assert.equal(expiryDate.toISOString(), "2026-07-26T12:10:00.000Z");
});

test("compareVerificationCode should return true for the correct code", () => {
  const plainCode = "012345";
  const secret = "test-verification-secret";

  const storedHash = hashVerificationCode(plainCode, secret);

  const isMatch = compareVerificationCode(plainCode, storedHash, secret);

  assert.equal(isMatch, true);
});

test("compareVerificationCode should return false for an incorrect code", () => {
  const secret = "test-verification-secret";

  const storedHash = hashVerificationCode("012345", secret);

  const isMatch = compareVerificationCode("654321", storedHash, secret);

  assert.equal(isMatch, false);
});
