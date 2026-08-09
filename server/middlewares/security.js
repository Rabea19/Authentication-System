import helmet from "helmet";
import cors from "cors";

import { rateLimit } from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

/*
  =========================
  HELMET
  =========================

  يضيف Security Headers.

  أثناء Local Development
  نقفل HSTS فقط علشان localhost
  يفضل شغال بـ http بشكل طبيعي.
*/

const helmetOptions = isProduction
  ? {}
  : {
      strictTransportSecurity: false,
    };

const helmetMiddleware = helmet(helmetOptions);

/*
  =========================
  CORS
  =========================

  نسمح فقط للـFrontend
  المحدد في CLIENT_URL.

  credentials: true
  مهمة لأن Authentication
  تستخدم HttpOnly Cookie.
*/

const corsMiddleware = cors({
  origin: clientUrl,

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
});

/*
  =========================
  GENERAL API RATE LIMIT
  =========================

  Production:
  200 Request / 15 min

  Development:
  1000 Request / 15 min
  علشان منضايقش نفسنا أثناء التجارب.
*/

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: isProduction ? 200 : 1000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message: "Too many requests. Please try again later.",
  },
});

/*
  =========================
  AUTH RATE LIMIT
  =========================

  ده أشد من الـGeneral Limiter.

  Production:
  10 محاولات / 15 دقيقة

  Development:
  100 محاولة
  علشان Postman والTests.
*/

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: isProduction ? 10 : 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message: "Too many authentication attempts. Please try again later.",
  },
});

export { helmetMiddleware, corsMiddleware, apiLimiter, authLimiter };
