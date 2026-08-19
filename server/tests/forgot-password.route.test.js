import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { hashPasswordResetToken } from "../utils/passwordResetToken.js";

const originalFindOne = User.findOne;

process.env.CLIENT_URL = "http://localhost:5173";

afterEach(() => {
  User.findOne = originalFindOne;

  delete app.locals.mailClient;
});

const successMessage =
  "If an account exists for this email, a password reset link has been sent.";

test("POST /api/auth/forgot-password should create a reset token and send an email", async () => {
  let saveWasCalled = false;
  let sentEmailMessage;

  const user = {
    _id: "user-123",

    email: "rabea@example.com",

    passwordResetToken: undefined,

    passwordResetExpires: undefined,

    save: async function () {
      saveWasCalled = true;

      return this;
    },
  };

  User.findOne = async () => user;

  app.locals.mailClient = {
    sendMail: async (message) => {
      sentEmailMessage = message;

      return {
        success: true,

        message_ids: ["reset-message-id"],
      };
    },
  };

  const response = await request(app).post("/api/auth/forgot-password").send({
    email: "  RABEA@EXAMPLE.COM  ",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: successMessage,
  });

  assert.equal(saveWasCalled, true);

  /*
    MongoDB Ù„Ø§Ø²Ù… ØªØ³ØªÙ‚Ø¨Ù„ Hash
    ÙˆÙ„ÙŠØ³ Reset Token Ø§Ù„Ø£ØµÙ„ÙŠØ©.
  */
  assert.match(user.passwordResetToken, /^[a-f0-9]{64}$/);

  assert.ok(user.passwordResetExpires instanceof Date);

  assert.ok(user.passwordResetExpires.getTime() > Date.now());

  /*
    Ù†ØªØ£ÙƒØ¯ Ø£Ù† Ø±Ø³Ø§Ù„Ø© Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„
    ØªÙ… ØªØ¬Ù‡ÙŠØ²Ù‡Ø§.
  */
  assert.ok(sentEmailMessage);

  assert.equal(sentEmailMessage.to, "rabea@example.com");

  assert.equal(sentEmailMessage.subject, "Reset your password");

  /*
    Ù†Ø³ØªØ®Ø±Ø¬ Reset Token Ø§Ù„Ø£ØµÙ„ÙŠØ©
    Ù…Ù† Ø±Ø§Ø¨Ø· Ø§Ù„Ø¥ÙŠÙ…ÙŠÙ„.
  */
  const tokenMatch = sentEmailMessage.text.match(/token=([a-f0-9]{64})/i);

  assert.ok(tokenMatch);

  const sentPlainToken = tokenMatch[1];

  /*
    Ù†Ø¹Ù…Ù„ Hash Ù„Ù„ØªÙˆÙƒÙ† Ø§Ù„Ù„ÙŠ Ø§ØªØ¨Ø¹Øª
    ÙˆÙ†ØªØ£ÙƒØ¯ Ø¥Ù†Ù‡Ø§ Ù†ÙØ³ Ø§Ù„Ù‚ÙŠÙ…Ø©
    Ø§Ù„Ù…Ø®Ø²Ù†Ø© ÙÙŠ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù….
  */
  const expectedHash = hashPasswordResetToken(sentPlainToken);

  assert.equal(expectedHash, user.passwordResetToken);
});

test("POST /api/auth/forgot-password should return the same response for an unknown email", async () => {
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

  const response = await request(app).post("/api/auth/forgot-password").send({
    email: "unknown@example.com",
  });

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: successMessage,
  });

  assert.equal(emailWasSent, false);
});

test("POST /api/auth/forgot-password should reject an invalid email", async () => {
  const response = await request(app).post("/api/auth/forgot-password").send({
    email: "not-an-email",
  });

  assert.equal(response.status, 400);

  assert.equal(response.body.success, false);

  assert.equal(response.body.message, "Validation failed");

  assert.equal(response.body.errors[0].field, "email");
});
