import test from "node:test";
import assert from "node:assert/strict";

import User from "../models/User.js";

test("User should require name, email, and password", () => {
  const user = new User({});

  const validationError = user.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.name);
  assert.ok(validationError.errors.email);
  assert.ok(validationError.errors.password);
});

test("User should normalize name and email and apply default values", () => {
  const user = new User({
    name: "  Rabea Saad  ",
    email: "  RABEA@EXAMPLE.COM  ",
    password: "12345678",
  });

  assert.equal(user.name, "Rabea Saad");
  assert.equal(user.email, "rabea@example.com");
  assert.equal(user.isVerified, false);
  assert.equal(user.role, "user");
});

test("User should reject an invalid email address", () => {
  const user = new User({
    name: "Rabea Saad",
    email: "not-an-email",
    password: "12345678",
  });

  const validationError = user.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.email);
});

test("User should reject a password shorter than 8 characters", () => {
  const user = new User({
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "1234",
  });

  const validationError = user.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.password);
});

test("User role should only be user or admin", () => {
  const user = new User({
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: "12345678",
    role: "manager",
  });

  const validationError = user.validateSync();

  assert.ok(validationError);
  assert.ok(validationError.errors.role);
});
