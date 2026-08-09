import test from "node:test";
import assert from "node:assert/strict";

import {
  registerSchema,
  verifyEmailSchema,
} from "../validators/auth.validator.js";

test("registerSchema should accept and normalize valid registration data", () => {
  const input = {
    name: "  Rabea Saad  ",
    email: "  RABEA@EXAMPLE.COM  ",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  };

  const result = registerSchema.safeParse(input);

  assert.equal(result.success, true);
  assert.equal(result.data.name, "Rabea Saad");
  assert.equal(result.data.email, "rabea@example.com");
});

test("registerSchema should reject missing required fields", () => {
  const result = registerSchema.safeParse({});

  assert.equal(result.success, false);

  const errorFields = result.error.issues.map((issue) => issue.path[0]);

  assert.ok(errorFields.includes("name"));
  assert.ok(errorFields.includes("email"));
  assert.ok(errorFields.includes("password"));
  assert.ok(errorFields.includes("confirmPassword"));
});

test("registerSchema should reject an invalid email address", () => {
  const input = {
    name: "Rabea Saad",
    email: "not-an-email",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  };

  const result = registerSchema.safeParse(input);

  assert.equal(result.success, false);

  const emailError = result.error.issues.find(
    (issue) => issue.path[0] === "email",
  );

  assert.ok(emailError);
});

test("registerSchema should reject a short password", () => {
  const input = {
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "1234",
    confirmPassword: "1234",
  };

  const result = registerSchema.safeParse(input);

  assert.equal(result.success, false);

  const passwordError = result.error.issues.find(
    (issue) => issue.path[0] === "password",
  );

  assert.ok(passwordError);
});

test("registerSchema should reject non-matching passwords", () => {
  const input = {
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "Rabea@123",
    confirmPassword: "DifferentPassword123",
  };

  const result = registerSchema.safeParse(input);

  assert.equal(result.success, false);

  const confirmationError = result.error.issues.find(
    (issue) => issue.path[0] === "confirmPassword",
  );

  assert.ok(confirmationError);
  assert.equal(confirmationError.message, "Passwords do not match");
});
test("verifyEmailSchema should accept and normalize valid data", () => {
  const input = {
    email: "  RABEA@EXAMPLE.COM  ",
    code: "012345",
  };

  const result = verifyEmailSchema.safeParse(input);

  assert.equal(result.success, true);

  assert.equal(result.data.email, "rabea@example.com");

  assert.equal(result.data.code, "012345");
});

test("verifyEmailSchema should reject a code that is not exactly six digits", () => {
  const input = {
    email: "rabea@example.com",
    code: "1234",
  };

  const result = verifyEmailSchema.safeParse(input);

  assert.equal(result.success, false);

  const codeError = result.error.issues.find(
    (issue) => issue.path[0] === "code",
  );

  assert.ok(codeError);

  assert.equal(codeError.message, "Verification code must be exactly 6 digits");
});
