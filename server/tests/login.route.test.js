import test, { afterEach } from "node:test";

import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";
import User from "../models/User.js";

import { hashPassword } from "../utils/password.js";

const originalFindOne = User.findOne;

process.env.JWT_SECRET = "test-jwt-secret";

process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";

process.env.COOKIE_SECURE = "false";

process.env.COOKIE_SAME_SITE = "lax";

process.env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS = "900000";

afterEach(() => {
  User.findOne = originalFindOne;
});

const mockFindOneResult = (user) => {
  User.findOne = () => {
    return {
      select: async () => user,
    };
  };
};

test("POST /api/auth/login should set an HttpOnly cookie for valid credentials", async () => {
  const hashedPassword = await hashPassword("Rabea@123");

  const user = {
    _id: "user-123",
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: hashedPassword,
    isVerified: true,
    role: "user",
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/login").send({
    email: "  RABEA@EXAMPLE.COM  ",
    password: "Rabea@123",
  });

  assert.equal(response.status, 200);

  assert.equal(response.body.success, true);

  assert.equal(response.body.message, "Login successful");

  /*
    التوكن لم تعد موجودة
    داخل JSON Response.

    المفروض تكون داخل
    HttpOnly Cookie.
  */
  assert.equal("accessToken" in response.body.data, false);

  /*
    نتأكد أن السيرفر
    أرسل Set-Cookie Header.
  */
  const setCookieHeader = response.headers["set-cookie"];

  assert.ok(Array.isArray(setCookieHeader));

  assert.equal(setCookieHeader.length, 1);

  const authCookie = setCookieHeader[0];

  /*
    الكوكي لازم تبدأ باسم:
    accessToken
  */
  assert.match(authCookie, /^accessToken=/);

  /*
    HttpOnly تمنع JavaScript
    في المتصفح من قراءة التوكن.
  */
  assert.match(authCookie, /HttpOnly/i);

  /*
    الكوكي متاحة لكل Routes.
  */
  assert.match(authCookie, /Path=\//i);

  /*
    أثناء التطوير المحلي
    بنستخدم SameSite=Lax.
  */
  assert.match(authCookie, /SameSite=Lax/i);

  /*
    نتأكد أن بيانات المستخدم
    الآمنة رجعت بشكل صحيح.
  */
  assert.deepEqual(response.body.data.user, {
    id: "user-123",
    name: "Rabea Saad",
    email: "rabea@example.com",
    isVerified: true,
    role: "user",
  });

  /*
    الباسورد مينفعش ترجع
    داخل Response.
  */
  assert.equal("password" in response.body.data.user, false);
});

test("POST /api/auth/login should reject an unknown email", async () => {
  mockFindOneResult(null);

  const response = await request(app).post("/api/auth/login").send({
    email: "unknown@example.com",
    password: "Rabea@123",
  });

  assert.equal(response.status, 401);

  assert.deepEqual(response.body, {
    success: false,
    message: "Invalid email or password",
  });
});

test("POST /api/auth/login should reject an incorrect password", async () => {
  const hashedPassword = await hashPassword("Rabea@123");

  const user = {
    _id: "user-123",
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: hashedPassword,
    isVerified: true,
    role: "user",
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/login").send({
    email: "rabea@example.com",
    password: "WrongPassword123",
  });

  assert.equal(response.status, 401);

  assert.deepEqual(response.body, {
    success: false,
    message: "Invalid email or password",
  });
});

test("POST /api/auth/login should reject an unverified account", async () => {
  const hashedPassword = await hashPassword("Rabea@123");

  const user = {
    _id: "user-123",
    name: "Rabea Saad",
    email: "rabea@example.com",
    password: hashedPassword,
    isVerified: false,
    role: "user",
  };

  mockFindOneResult(user);

  const response = await request(app).post("/api/auth/login").send({
    email: "rabea@example.com",
    password: "Rabea@123",
  });

  assert.equal(response.status, 403);

  assert.deepEqual(response.body, {
    success: false,
    message: "Please verify your email before logging in",
  });
});
