import test from "node:test";
import assert from "node:assert/strict";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

test("sendVerificationEmail should send the verification code with Nodemailer", async () => {
  let sentMessage;

  const fakeTransporter = {
    sendMail: async (message) => {
      sentMessage = message;

      return {
        accepted: ["rabea@example.com"],
        messageId: "verification-message-id",
      };
    },
  };

  const result = await sendVerificationEmail(
    {
      to: "rabea@example.com",
      code: "012345",
    },
    fakeTransporter,
  );

  assert.equal(result.messageId, "verification-message-id");

  assert.equal(sentMessage.to, "rabea@example.com");

  assert.equal(sentMessage.subject, "Verify your email address");

  assert.match(sentMessage.text, /012345/);

  assert.match(sentMessage.html, /012345/);
});

test("sendPasswordResetEmail should send a reset password link with Nodemailer", async () => {
  let sentMessage;

  const fakeTransporter = {
    sendMail: async (message) => {
      sentMessage = message;

      return {
        accepted: ["rabea@example.com"],
        messageId: "reset-message-id",
      };
    },
  };

  const resetToken = "test-password-reset-token";

  const result = await sendPasswordResetEmail(
    {
      to: "rabea@example.com",
      token: resetToken,
    },
    fakeTransporter,
  );

  assert.equal(result.messageId, "reset-message-id");

  assert.equal(sentMessage.to, "rabea@example.com");

  assert.equal(sentMessage.subject, "Reset your password");

  assert.match(sentMessage.text, /reset-password/);

  assert.match(sentMessage.text, /test-password-reset-token/);

  assert.match(sentMessage.html, /test-password-reset-token/);
});