import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { hashVerificationCode } from "../utils/verificationCode.js";

const originalFindOne = User.findOne;

process.env.VERIFICATION_CODE_SECRET = "test-verification-code-secret";

afterEach(() => {
  User.findOne = originalFindOne;
});

const mockFindOneResult = (user) => {
  User.findOne = () => {
    return {
      select: async () => user,
    };
  };
};

test("POST /api/auth/verify-email should verify a valid code", async () => {
  let saveWasCalled = false;

  const plainCode = "012345";

  const user = {
    _id: "user-123",
    email: "rabea@example.com",
    isVerified: false,

    emailVerificationCode: hashVerificationCode(plainCode),

    emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/verify-email").send({
    email: "RABEA@EXAMPLE.COM",
    code: plainCode,
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);

  assert.equal(response.body.message, "Email verified successfully");

  assert.equal(user.isVerified, true);

  assert.equal(user.emailVerificationCode, undefined);

  assert.equal(user.emailVerificationExpires, undefined);

  assert.equal(saveWasCalled, true);
});

test("POST /api/auth/verify-email should reject an incorrect code", async () => {
  let saveWasCalled = false;

  const user = {
    email: "rabea@example.com",
    isVerified: false,

    emailVerificationCode: hashVerificationCode("012345"),

    emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/verify-email").send({
    email: "rabea@example.com",
    code: "654321",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    message: "Invalid or expired verification code",
  });

  assert.equal(saveWasCalled, false);
  assert.equal(user.isVerified, false);
});

test("POST /api/auth/verify-email should reject an expired code", async () => {
  let saveWasCalled = false;

  const plainCode = "012345";

  const user = {
    email: "rabea@example.com",
    isVerified: false,

    emailVerificationCode: hashVerificationCode(plainCode),

    emailVerificationExpires: new Date(Date.now() - 1000),

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/verify-email").send({
    email: "rabea@example.com",
    code: plainCode,
  });

  assert.equal(response.status, 400);

  assert.equal(response.body.message, "Invalid or expired verification code");

  assert.equal(saveWasCalled, false);
  assert.equal(user.isVerified, false);
});

test("POST /api/auth/verify-email should return success when the email is already verified", async () => {
  let saveWasCalled = false;

  const user = {
    email: "rabea@example.com",
    isVerified: true,

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/verify-email").send({
    email: "rabea@example.com",
    code: "012345",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: "Email is already verified",
  });

  assert.equal(saveWasCalled, false);
});

test("POST /api/auth/verify-email should return a generic error for an unknown email", async () => {
  mockFindOneResult(null);

  const response = await request(app).post("/api/auth/verify-email").send({
    email: "unknown@example.com",
    code: "012345",
  });

  assert.equal(response.status, 400);

  assert.deepEqual(response.body, {
    success: false,
    message: "Invalid or expired verification code",
  });
});
