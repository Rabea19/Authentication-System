import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";

test("POST request from an untrusted origin should be blocked", async () => {
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Origin", "https://evil-example.com");

  assert.equal(response.status, 403);

  assert.deepEqual(response.body, {
    success: false,
    message: "Forbidden request origin",
  });
});

test("POST request from the trusted frontend origin should be allowed", async () => {
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Origin", "http://localhost:5173");

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: "Logout successful",
  });
});

test("cross-site browser requests should be blocked", async () => {
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Sec-Fetch-Site", "cross-site");

  assert.equal(response.status, 403);

  assert.equal(response.body.success, false);
});

test("safe GET requests should not be blocked by CSRF protection", async () => {
  const response = await request(app)
    .get("/api/health")
    .set("Origin", "https://evil-example.com");

  assert.equal(response.status, 200);
});
