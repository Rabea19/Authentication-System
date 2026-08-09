import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const VERIFICATION_CODE_LENGTH = 6;

const VERIFICATION_CODE_RANGE = 10 ** VERIFICATION_CODE_LENGTH;

const DEFAULT_EXPIRY_MINUTES = 10;

const generateVerificationCode = () => {
  const randomNumber = randomInt(0, VERIFICATION_CODE_RANGE);

  const verificationCode = randomNumber
    .toString()
    .padStart(VERIFICATION_CODE_LENGTH, "0");

  return verificationCode;
};

const hashVerificationCode = (
  plainCode,
  secret = process.env.VERIFICATION_CODE_SECRET,
) => {
  if (!secret) {
    throw new Error("VERIFICATION_CODE_SECRET is missing");
  }

  const hashedCode = createHmac("sha256", secret)
    .update(String(plainCode))
    .digest("hex");

  return hashedCode;
};

const compareVerificationCode = (
  plainCode,
  storedHash,
  secret = process.env.VERIFICATION_CODE_SECRET,
) => {
  if (typeof storedHash !== "string" || !/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false;
  }

  const incomingHash = hashVerificationCode(plainCode, secret);

  const incomingBuffer = Buffer.from(incomingHash, "hex");

  const storedBuffer = Buffer.from(storedHash, "hex");

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingBuffer, storedBuffer);
};

const createVerificationCodeExpiry = (
  minutes = DEFAULT_EXPIRY_MINUTES,
  currentTime = Date.now(),
) => {
  const milliseconds = minutes * 60 * 1000;

  const expiryDate = new Date(currentTime + milliseconds);

  return expiryDate;
};

export {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
  createVerificationCodeExpiry,
};
