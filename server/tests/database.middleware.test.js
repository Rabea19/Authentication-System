import test from "node:test";
import assert from "node:assert/strict";

import { createDatabaseMiddleware } from "../middlewares/database.js";

const originalServerless = process.env.SERVERLESS;

test.afterEach(() => {
  if (originalServerless === undefined) {
    delete process.env.SERVERLESS;
  } else {
    process.env.SERVERLESS = originalServerless;
  }
});

test("database middleware skips connection outside serverless mode", async () => {
  delete process.env.SERVERLESS;

  let connectCalls = 0;
  let nextError;

  const middleware = createDatabaseMiddleware(async () => {
    connectCalls += 1;
  });

  await middleware({}, {}, (error) => {
    nextError = error;
  });

  assert.equal(connectCalls, 0);
  assert.equal(nextError, undefined);
});

test("database middleware connects before continuing in serverless mode", async () => {
  process.env.SERVERLESS = "true";

  const order = [];

  const middleware = createDatabaseMiddleware(async () => {
    order.push("connect");
  });

  await middleware({}, {}, (error) => {
    assert.equal(error, undefined);
    order.push("next");
  });

  assert.deepEqual(order, ["connect", "next"]);
});

test("database middleware forwards connection failures", async () => {
  process.env.SERVERLESS = "true";

  const expectedError = new Error("database unavailable");
  let receivedError;

  const middleware = createDatabaseMiddleware(async () => {
    throw expectedError;
  });

  await middleware({}, {}, (error) => {
    receivedError = error;
  });

  assert.equal(receivedError, expectedError);
});
