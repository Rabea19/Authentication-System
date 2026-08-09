import test from "node:test";
import assert from "node:assert/strict";

import { hashPassword, comparePassword } from "../utils/password.js";

test("hashPassword should not return the plain password", async () => {
  const plainPassword = "Rabea@123";

  const hashedPassword = await hashPassword(plainPassword);

  assert.notEqual(hashedPassword, plainPassword);
});

test("hashPassword should create different hashes for the same password", async () => {
  const plainPassword = "Rabea@123";

  const firstHash = await hashPassword(plainPassword);
  const secondHash = await hashPassword(plainPassword);

  assert.notEqual(firstHash, secondHash);
});

test("comparePassword should return true for the correct password", async () => {
  const plainPassword = "Rabea@123";
  const hashedPassword = await hashPassword(plainPassword);

  const isMatch = await comparePassword(plainPassword, hashedPassword);

  assert.equal(isMatch, true);
});

test("comparePassword should return false for an incorrect password", async () => {
  const correctPassword = "Rabea@123";
  const incorrectPassword = "WrongPassword123";

  const hashedPassword = await hashPassword(correctPassword);

  const isMatch = await comparePassword(incorrectPassword, hashedPassword);

  assert.equal(isMatch, false);
});
