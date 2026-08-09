import { randomBytes, createHash } from "node:crypto";

const PASSWORD_RESET_TOKEN_BYTES = 32;

const DEFAULT_RESET_EXPIRY_MINUTES = 15;

const generatePasswordResetToken = () => {
  const token = randomBytes(PASSWORD_RESET_TOKEN_BYTES).toString("hex");

  return token;
};

const hashPasswordResetToken = (plainToken) => {
  if (!plainToken) {
    throw new Error("Password reset token is required");
  }

  const hashedToken = createHash("sha256")
    .update(String(plainToken))
    .digest("hex");

  return hashedToken;
};

const createPasswordResetExpiry = (
  minutes = DEFAULT_RESET_EXPIRY_MINUTES,
  currentTime = Date.now(),
) => {
  const milliseconds = minutes * 60 * 1000;

  const expiryDate = new Date(currentTime + milliseconds);

  return expiryDate;
};

export {
  generatePasswordResetToken,
  hashPasswordResetToken,
  createPasswordResetExpiry,
};
