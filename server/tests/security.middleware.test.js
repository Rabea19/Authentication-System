import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../app.js";

test("GET /api/health should include security and CORS headers", async () => {
  const response = await request(app)
    .get("/api/health")
    .set("Origin", "http://localhost:5173");

  assert.equal(response.status, 200);

  /*
    CORS:
    الـFrontend المسموح له
    هو React على port 5173.
  */
  assert.equal(
    response.headers["access-control-allow-origin"],
    "http://localhost:5173",
  );

  /*
    لازم نسمح بإرسال Cookie
    بين React والBackend.
  */
  assert.equal(response.headers["access-control-allow-credentials"], "true");

  /*
    Header من Helmet.
  */
  assert.equal(response.headers["x-content-type-options"], "nosniff");

  /*
    من الأفضل عدم الإعلان
    أن السيرفر Express.
  */
  assert.equal(response.headers["x-powered-by"], undefined);

  /*
    نتأكد أن Rate Limit
    أرسلت Headers.
  */
  const hasRateLimitHeader = Boolean(
    response.headers["ratelimit-policy"] || response.headers["ratelimit"],
  );

  assert.equal(hasRateLimitHeader, true);
});
