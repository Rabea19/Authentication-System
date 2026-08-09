import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";

import errorHandler from "./middlewares/error.js";

import csrfProtection from "./middlewares/csrf.js";

import {
  helmetMiddleware,
  corsMiddleware,
  apiLimiter,
} from "./middlewares/security.js";

const app = express();

app.disable("x-powered-by");

/*
  Security Headers
*/
app.use(helmetMiddleware);

/*
  CORS
*/
app.use(corsMiddleware);

/*
  CSRF Protection

  بنحطها قبل Routes
  وقبل Controllers.
*/
app.use(csrfProtection);

/*
  Rate Limiting
*/
app.use(apiLimiter);

/*
  JSON Parser
*/
app.use(
  express.json({
    limit: "10kb",
  }),
);

/*
  Cookie Parser
*/
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,

    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
