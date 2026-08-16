import "dotenv/config";
import dns from "node:dns";

import app from "./app.js";
import connectDB from "./config/db.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connection = await connectDB();

  console.log(`MongoDB connected successfully: ${connection.host}`);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (process.env.SERVERLESS !== "true") {
  startServer().catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

export default app;
