import connectDB from "../config/db.js";

const createDatabaseMiddleware = (connect = connectDB) => {
  return async (req, res, next) => {
    if (process.env.SERVERLESS !== "true") {
      return next();
    }

    try {
      await connect();
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

const databaseMiddleware = createDatabaseMiddleware();

export { createDatabaseMiddleware };
export default databaseMiddleware;
