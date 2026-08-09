import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { comparePassword } from "../utils/password.js";

import { hashPasswordResetToken } from "../utils/passwordResetToken.js";

const originalFindOne = User.findOne;

afterEach(() => {
  User.findOne = originalFindOne;
});

test("POST /api/auth/reset-password should reset the password for a valid token", async () => {
  let saveWasCalled = false;

  const plainResetToken = "a".repeat(64);

  const expectedHashedToken = hashPasswordResetToken(plainResetToken);

  const user = {
    _id: "user-123",

    email: "rabea@example.com",

    password: "old-password-hash",

    passwordResetToken: expectedHashedToken,

    passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),

    save: async function () {
      saveWasCalled = true;

      return this;
    },
  };

  User.findOne = async (query) => {
    assert.equal(query.passwordResetToken, expectedHashedToken);

    assert.ok(query.passwordResetExpires.$gt instanceof Date);

    return user;
  };

  const response = await request(app).post("/api/auth/reset-password").send({
    token: plainResetToken,

    password: "NewPassword@123",

    confirmPassword: "NewPassword@123",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,

    message: "Password reset successfully",
  });

  assert.equal(saveWasCalled, true);

  /*
    نتأكد إن الباسورد الجديدة
    اتخزنت Hash وليست Plain Text.
  */
  assert.notEqual(user.password, "NewPassword@123");

  const passwordMatches = await comparePassword(
    "NewPassword@123",
    user.password,
  );

  assert.equal(passwordMatches, true);

  /*
    بعد استخدام Reset Token
    لازم نمسحها.
  */
  assert.equal(user.passwordResetToken, undefined);

  assert.equal(user.passwordResetExpires, undefined);
});

test("POST /api/auth/reset-password should reject an invalid or expired token", async () => {
  let saveWasCalled = false;

  User.findOne = async () => null;

  const response = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "b".repeat(64),

      password: "NewPassword@123",

      confirmPassword: "NewPassword@123",
    });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,

    message: "Invalid or expired password reset token",
  });

  assert.equal(saveWasCalled, false);
});

test("POST /api/auth/reset-password should reject mismatched passwords", async () => {
  const response = await request(app)
    .post("/api/auth/reset-password")
    .send({
      token: "c".repeat(64),

      password: "NewPassword@123",

      confirmPassword: "DifferentPassword@123",
    });

  assert.equal(response.status, 400);

  assert.equal(response.body.success, false);

  assert.equal(response.body.message, "Validation failed");

  const confirmPasswordError = response.body.errors.find(
    (error) => error.field === "confirmPassword",
  );

  assert.ok(confirmPasswordError);

  assert.equal(confirmPasswordError.message, "Passwords do not match");
});
