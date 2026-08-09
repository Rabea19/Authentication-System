import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { comparePassword } from "../utils/password.js";

import { hashVerificationCode } from "../utils/verificationCode.js";

const originalFindOne = User.findOne;
const originalCreate = User.create;

process.env.VERIFICATION_CODE_SECRET = "test-verification-code-secret";

afterEach(() => {
  User.findOne = originalFindOne;
  User.create = originalCreate;

  delete app.locals.mailClient;
});

test("POST /api/auth/register should create a new user and send a verification email", async () => {
  let createdUserData;
  let sentEmailMessage;

  User.findOne = async () => {
    return null;
  };

  User.create = async (userData) => {
    createdUserData = userData;

    return {
      _id: "user-123",
      ...userData,
      isVerified: false,
      role: "user",
    };
  };

  app.locals.mailClient = {
    send: async (message) => {
      sentEmailMessage = message;

      return {
        success: true,

        message_ids: ["test-message-id"],
      };
    },
  };

  const response = await request(app).post("/api/auth/register").send({
    name: "  Rabea Saad  ",
    email: "  RABEA@EXAMPLE.COM  ",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);

  assert.equal(createdUserData.name, "Rabea Saad");

  assert.equal(createdUserData.email, "rabea@example.com");

  assert.notEqual(createdUserData.password, "Rabea@123");

  const passwordMatches = await comparePassword(
    "Rabea@123",
    createdUserData.password,
  );

  assert.equal(passwordMatches, true);

  assert.match(createdUserData.emailVerificationCode, /^[a-f0-9]{64}$/);

  assert.ok(createdUserData.emailVerificationExpires instanceof Date);

  assert.ok(sentEmailMessage);

  assert.equal(sentEmailMessage.to[0].email, "rabea@example.com");

  assert.equal(sentEmailMessage.subject, "Verify your email address");

  const verificationCodeMatch = sentEmailMessage.text.match(/\b\d{6}\b/);

  assert.ok(verificationCodeMatch);

  const sentVerificationCode = verificationCodeMatch[0];

  assert.equal(
    hashVerificationCode(sentVerificationCode),
    createdUserData.emailVerificationCode,
  );

  assert.equal(response.body.data.user.email, "rabea@example.com");

  assert.equal("password" in response.body.data.user, false);

  assert.equal("emailVerificationCode" in response.body.data.user, false);
});

test("POST /api/auth/register should reject an existing email without sending an email", async () => {
  let createWasCalled = false;
  let emailWasSent = false;

  User.findOne = async () => {
    return {
      _id: "existing-user-id",
      email: "rabea@example.com",
    };
  };

  User.create = async () => {
    createWasCalled = true;
  };

  app.locals.mailClient = {
    send: async () => {
      emailWasSent = true;

      return {
        success: true,
      };
    },
  };

  const response = await request(app).post("/api/auth/register").send({
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  });

  assert.equal(response.status, 409);
  assert.equal(response.body.success, false);

  assert.equal(response.body.message, "Email is already registered");

  assert.equal(createWasCalled, false);
  assert.equal(emailWasSent, false);
});

test("POST /api/auth/register should return a safe response for unexpected errors", async () => {
  User.findOne = async () => {
    throw new Error("Database is unavailable");
  };

  const response = await request(app).post("/api/auth/register").send({
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  });

  assert.equal(response.status, 500);

  assert.deepEqual(response.body, {
    success: false,
    message: "Internal server error",
  });
});
