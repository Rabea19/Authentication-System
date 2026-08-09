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

  delete app.locals.mailClient;
});

const successMessage =
  "If the account exists and is not verified, " +
  "a new verification code has been sent.";

test("POST /api/auth/resend-verification-code should send a new code to an unverified user", async () => {
  let saveWasCalled = false;
  let sentEmailMessage;

  const user = {
    _id: "user-123",
    email: "rabea@example.com",
    isVerified: false,

    emailVerificationCode: hashVerificationCode("111111"),

    emailVerificationExpires: new Date(Date.now() - 1000),

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  User.findOne = async () => user;

  app.locals.mailClient = {
    send: async (message) => {
      sentEmailMessage = message;

      return {
        success: true,
        message_ids: ["test-message-id"],
      };
    },
  };

  const response = await request(app)
    .post("/api/auth/resend-verification-code")
    .send({
      email: "  RABEA@EXAMPLE.COM  ",
    });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: successMessage,
  });

  assert.equal(saveWasCalled, true);

  assert.match(user.emailVerificationCode, /^[a-f0-9]{64}$/);

  assert.ok(user.emailVerificationExpires instanceof Date);

  assert.ok(user.emailVerificationExpires.getTime() > Date.now());

  assert.ok(sentEmailMessage);

  assert.equal(sentEmailMessage.to[0].email, "rabea@example.com");

  const codeMatch = sentEmailMessage.text.match(/\b\d{6}\b/);

  assert.ok(codeMatch);

  const sentCode = codeMatch[0];

  assert.equal(hashVerificationCode(sentCode), user.emailVerificationCode);
});

test("POST /api/auth/resend-verification-code should not send an email for an unknown account", async () => {
  let emailWasSent = false;

  User.findOne = async () => null;

  app.locals.mailClient = {
    send: async () => {
      emailWasSent = true;

      return {
        success: true,
      };
    },
  };

  const response = await request(app)
    .post("/api/auth/resend-verification-code")
    .send({
      email: "unknown@example.com",
    });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: successMessage,
  });

  assert.equal(emailWasSent, false);
});

test("POST /api/auth/resend-verification-code should not send another code to a verified user", async () => {
  let saveWasCalled = false;
  let emailWasSent = false;

  const user = {
    email: "rabea@example.com",
    isVerified: true,

    save: async function () {
      saveWasCalled = true;
      return this;
    },
  };

  User.findOne = async () => user;

  app.locals.mailClient = {
    send: async () => {
      emailWasSent = true;

      return {
        success: true,
      };
    },
  };

  const response = await request(app)
    .post("/api/auth/resend-verification-code")
    .send({
      email: "rabea@example.com",
    });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: successMessage,
  });

  assert.equal(saveWasCalled, false);
  assert.equal(emailWasSent, false);
});

test("POST /api/auth/resend-verification-code should reject an invalid email", async () => {
  const response = await request(app)
    .post("/api/auth/resend-verification-code")
    .send({
      email: "not-an-email",
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);

  assert.equal(response.body.message, "Validation failed");

  assert.equal(response.body.errors[0].field, "email");
});
