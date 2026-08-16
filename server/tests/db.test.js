import test from "node:test";
import assert from "node:assert/strict";

import { createDatabaseConnector } from "../config/db.js";

const originalMongoUri = process.env.MONGO_URI;

test.afterEach(() => {
  if (originalMongoUri === undefined) {
    delete process.env.MONGO_URI;
  } else {
    process.env.MONGO_URI = originalMongoUri;
  }
});

test("database connector rejects when MONGO_URI is missing", async () => {
  delete process.env.MONGO_URI;

  const fakeMongoose = {
    connection: { readyState: 0 },
    connect: async () => {
      throw new Error("connect should not run");
    },
  };

  const connectDB = createDatabaseConnector(fakeMongoose);

  await assert.rejects(connectDB(), /MONGO_URI is missing/);
});

test("database connector reuses an already connected mongoose connection", async () => {
  process.env.MONGO_URI = "mongodb://example.test/auth";

  const existingConnection = {
    readyState: 1,
    host: "example.test",
  };

  const fakeMongoose = {
    connection: existingConnection,
    connect: async () => {
      throw new Error("connect should not run");
    },
  };

  const connectDB = createDatabaseConnector(fakeMongoose);

  const result = await connectDB();

  assert.equal(result, existingConnection);
});

test("database connector shares one in-flight connection", async () => {
  process.env.MONGO_URI = "mongodb://example.test/auth";

  let connectCalls = 0;
  let resolveConnect;

  const connection = {
    readyState: 0,
    host: "example.test",
  };

  const pendingConnect = new Promise((resolve) => {
    resolveConnect = resolve;
  });

  const fakeMongoose = {
    connection,
    connect: async () => {
      connectCalls += 1;
      return pendingConnect;
    },
  };

  const connectDB = createDatabaseConnector(fakeMongoose);

  const first = connectDB();
  const second = connectDB();

  assert.equal(connectCalls, 1);

  resolveConnect(fakeMongoose);

  assert.equal(await first, connection);
  assert.equal(await second, connection);
});

test("database connector retries after a failed connection", async () => {
  process.env.MONGO_URI = "mongodb://example.test/auth";

  let connectCalls = 0;

  const connection = {
    readyState: 0,
    host: "example.test",
  };

  const fakeMongoose = {
    connection,
    connect: async () => {
      connectCalls += 1;

      if (connectCalls === 1) {
        throw new Error("temporary failure");
      }

      return fakeMongoose;
    },
  };

  const connectDB = createDatabaseConnector(fakeMongoose);

  await assert.rejects(connectDB(), /temporary failure/);

  const result = await connectDB();

  assert.equal(connectCalls, 2);
  assert.equal(result, connection);
});
