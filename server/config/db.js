import mongoose from "mongoose";

const createDatabaseConnector = (mongooseClient = mongoose) => {
  let connectionPromise = null;

  return async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from the environment");
    }

    if (mongooseClient.connection.readyState === 1) {
      return mongooseClient.connection;
    }

    if (!connectionPromise) {
      connectionPromise = mongooseClient.connect(mongoUri).then(
        () => {
          connectionPromise = null;
          return mongooseClient.connection;
        },
        (error) => {
          connectionPromise = null;
          throw error;
        },
      );
    }

    return connectionPromise;
  };
};

const connectDB = createDatabaseConnector();

export { createDatabaseConnector };
export default connectDB;
