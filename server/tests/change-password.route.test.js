import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { hashPassword, comparePassword } from "../utils/password.js";

import { generateAccessToken } from "../utils/token.js";

const originalFindById = User.findById;

process.env.JWT_SECRET = "test-jwt-secret";

process.env.COOKIE_SECURE = "false";

process.env.COOKIE_SAME_SITE = "lax";

afterEach(() => {
  User.findById = originalFindById;
});

const createAccessToken = () => {
  return generateAccessToken(
    {
      userId: "user-123",
      role: "user",
    },
    "test-jwt-secret",
    "15m",
  );
};

const mockFindByIdResult = (user) => {
  User.findById = () => {
    return {
      select: async () => user,
    };
  };
};

test("POST /api/auth/change-password should change the password and clear the access token cookie", async () => {
  let saveWasCalled = false;

  const oldHashedPassword = await hashPassword("OldPassword@123");

  const user = {
    _id: "user-123",

    email: "rabea@example.com",

    password: oldHashedPassword,

    passwordResetToken: "old-reset-token",

    passwordResetExpires: new Date(),

    save: async function () {
      saveWasCalled = true;

      return this;
    },
  };

  mockFindByIdResult(user);

  const accessToken = createAccessToken();

  const response = await request(app)
    .post("/api/auth/change-password")
    .set("Cookie", [`accessToken=${accessToken}`])
    .send({
      currentPassword: "OldPassword@123",

      newPassword: "NewPassword@123",

      confirmPassword: "NewPassword@123",
    });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,

    message: "Password changed successfully. Please log in again.",
  });

  assert.equal(saveWasCalled, true);

  const newPasswordMatches = await comparePassword(
    "NewPassword@123",
    user.password,
  );

  assert.equal(newPasswordMatches, true);

  const oldPasswordMatches = await comparePassword(
    "OldPassword@123",
    user.password,
  );

  assert.equal(oldPasswordMatches, false);

  assert.equal(user.passwordResetToken, undefined);

  assert.equal(user.passwordResetExpires, undefined);

  const setCookieHeader = response.headers["set-cookie"];

  assert.ok(Array.isArray(setCookieHeader));

  assert.match(setCookieHeader[0], /^accessToken=/);

  assert.match(setCookieHeader[0], /Expires=/i);
});

test("POST /api/auth/change-password should reject an incorrect current password", async () => {
  let saveWasCalled = false;

  const hashedPassword = await hashPassword("OldPassword@123");

  const user = {
    _id: "user-123",

    password: hashedPassword,

    save: async function () {
      saveWasCalled = true;

      return this;
    },
  };

  mockFindByIdResult(user);

  const accessToken = createAccessToken();

  const response = await request(app)
    .post("/api/auth/change-password")
    .set("Cookie", [`accessToken=${accessToken}`])
    .send({
      currentPassword: "WrongPassword@123",

      newPassword: "NewPassword@123",

      confirmPassword: "NewPassword@123",
    });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,

    message: "Current password is incorrect",
  });

  assert.equal(saveWasCalled, false);
});

test("POST /api/auth/change-password should reject using the current password as the new password", async () => {
  let saveWasCalled = false;

  const hashedPassword = await hashPassword("OldPassword@123");

  const user = {
    _id: "user-123",

    password: hashedPassword,

    save: async function () {
      saveWasCalled = true;

      return this;
    },
  };

  mockFindByIdResult(user);

  const accessToken = createAccessToken();

  const response = await request(app)
    .post("/api/auth/change-password")
    .set("Cookie", [`accessToken=${accessToken}`])
    .send({
      currentPassword: "OldPassword@123",

      newPassword: "OldPassword@123",

      confirmPassword: "OldPassword@123",
    });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,

    message: "New password must be different from current password",
  });

  assert.equal(saveWasCalled, false);
});

test("POST /api/auth/change-password should reject mismatched new passwords", async () => {
  const accessToken = createAccessToken();

  const response = await request(app)
    .post("/api/auth/change-password")
    .set("Cookie", [`accessToken=${accessToken}`])
    .send({
      currentPassword: "OldPassword@123",

      newPassword: "NewPassword@123",

      confirmPassword: "DifferentPassword@123",
    });

  assert.equal(response.status, 400);

  assert.equal(response.body.success, false);

  assert.equal(response.body.message, "Validation failed");

  const error = response.body.errors.find(
    (item) => item.field === "confirmPassword",
  );

  assert.ok(error);

  assert.equal(error.message, "Passwords do not match");
});
