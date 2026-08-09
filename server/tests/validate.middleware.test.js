import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";

import validate from "../middlewares/validate.js";
import { registerSchema } from "../validators/auth.validator.js";

const createTestApp = () => {
  const app = express();

  app.use(express.json());

  app.post("/register", validate(registerSchema), (req, res) => {
    res.status(200).json({
      success: true,
      data: req.body,
    });
  });

  return app;
};

test("validate should pass normalized data to the next handler", async () => {
  const app = createTestApp();

  const response = await request(app).post("/register").send({
    name: "  Rabea Saad  ",
    email: "  RABEA@EXAMPLE.COM  ",
    password: "Rabea@123",
    confirmPassword: "Rabea@123",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.name, "Rabea Saad");
  assert.equal(response.body.data.email, "rabea@example.com");
});

test("validate should return 400 when registration data is invalid", async () => {
  const app = createTestApp();

  const response = await request(app).post("/register").send({
    name: "Rabea Saad",
    email: "not-an-email",
    password: "1234",
    confirmPassword: "different-password",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Validation failed");

  const errorFields = response.body.errors.map((error) => error.field);

  assert.ok(errorFields.includes("email"));
  assert.ok(errorFields.includes("password"));
  assert.ok(errorFields.includes("confirmPassword"));
});
