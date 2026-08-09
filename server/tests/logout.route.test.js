import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";

test("POST /api/auth/logout should clear the access token cookie", async () => {
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", ["accessToken=fake-token"]);

  assert.equal(response.status, 200);

  assert.deepEqual(response.body, {
    success: true,
    message: "Logout successful",
  });

  const setCookieHeader = response.headers["set-cookie"];

  assert.ok(Array.isArray(setCookieHeader));

  const clearedCookie = setCookieHeader[0];

  assert.match(clearedCookie, /^accessToken=/);

  assert.match(clearedCookie, /Expires=/i);

  assert.match(clearedCookie, /HttpOnly/i);
});
