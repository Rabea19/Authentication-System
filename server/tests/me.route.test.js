import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { generateAccessToken } from "../utils/token.js";

const originalFindById = User.findById;

process.env.JWT_SECRET = "test-jwt-secret";

const createValidToken = () => {
  return generateAccessToken(
    {
      userId: "user-123",
      role: "user",
    },
    "test-jwt-secret",
    "15m",
  );
};

afterEach(() => {
  User.findById = originalFindById;
});

test("GET /api/auth/me should reject a request without an access token", async () => {
  const response = await request(app).get("/api/auth/me");

  assert.equal(response.status, 401);

  assert.deepEqual(response.body, {
    success: false,
    message: "Unauthorized",
  });
});

test("GET /api/auth/me should reject an invalid access token", async () => {
  const response = await request(app)
    .get("/api/auth/me")
    .set("Authorization", "Bearer invalid-token");

  assert.equal(response.status, 401);

  assert.deepEqual(response.body, {
    success: false,
    message: "Unauthorized",
  });
});

test("GET /api/auth/me should return the authenticated user", async () => {
  const token = createValidToken();

  User.findById = async (userId) => {
    assert.equal(userId, "user-123");

    return {
      _id: "user-123",
      name: "Rabea Saad",
      email: "rabea@example.com",
      isVerified: true,
      role: "user",
    };
  };

  const response = await request(app)
    .get("/api/auth/me")
    .set("Cookie", [`accessToken=${token}`]);

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,

    data: {
      user: {
        id: "user-123",
        name: "Rabea Saad",
        email: "rabea@example.com",
        isVerified: true,
        role: "user",
      },
    },
  });
});

test("GET /api/auth/me should return 404 when the token user no longer exists", async () => {
  const token = createValidToken();

  User.findById = async () => null;

  const response = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 404);

  assert.deepEqual(response.body, {
    success: false,
    message: "User not found",
  });
});
