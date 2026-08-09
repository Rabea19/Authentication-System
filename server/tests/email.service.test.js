import test from "node:test";
import assert from "node:assert/strict";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";

test("sendVerificationEmail should send the verification code", async () => {
  let sentMessage;

  const fakeClient = {
    send: async (message) => {
      sentMessage = message;

      return {
        success: true,
        message_ids: ["verification-message-id"],
      };
    },
  };

  const result = await sendVerificationEmail(
    {
      to: "rabea@example.com",
      code: "012345",
    },
    fakeClient,
  );

  assert.equal(result.success, true);

  assert.equal(result.message_ids[0], "verification-message-id");

  assert.equal(sentMessage.to[0].email, "rabea@example.com");

  assert.equal(sentMessage.subject, "Verify your email address");

  assert.match(sentMessage.text, /012345/);

  assert.match(sentMessage.html, /012345/);
});

test("sendPasswordResetEmail should send a reset password link containing the token", async () => {
  let sentMessage;

  const fakeClient = {
    send: async (message) => {
      sentMessage = message;

      return {
        success: true,
        message_ids: ["reset-message-id"],
      };
    },
  };

  const resetToken = "test-password-reset-token";

  const result = await sendPasswordResetEmail(
    {
      to: "rabea@example.com",
      token: resetToken,
    },
    fakeClient,
  );

  assert.equal(result.success, true);

  assert.equal(result.message_ids[0], "reset-message-id");

  assert.equal(sentMessage.to[0].email, "rabea@example.com");

  assert.equal(sentMessage.subject, "Reset your password");

  assert.match(sentMessage.text, /reset-password/);

  assert.match(sentMessage.text, /test-password-reset-token/);

  assert.match(sentMessage.html, /test-password-reset-token/);
});
