import { Router } from "express";

import {
  register,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/auth.controller.js";

import { login } from "../controllers/login.controller.js";

import { getCurrentUser } from "../controllers/profile.controller.js";

import { logout } from "../controllers/logout.controller.js";

import { forgotPassword } from "../controllers/forgotPassword.controller.js";

import { resetPassword } from "../controllers/resetPassword.controller.js";

import { changePassword } from "../controllers/changePassword.controller.js";

import validate from "../middlewares/validate.js";

import authenticate from "../middlewares/auth.js";

import { authLimiter } from "../middlewares/security.js";

import {
  registerSchema,
  verifyEmailSchema,
  resendVerificationCodeSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();

/*
  =========================
  REGISTER
  =========================
*/

router.post(
  "/register",

  authLimiter,

  validate(registerSchema),

  register,
);

/*
  =========================
  VERIFY EMAIL
  =========================
*/

router.post(
  "/verify-email",

  authLimiter,

  validate(verifyEmailSchema),

  verifyEmail,
);

/*
  =========================
  RESEND VERIFICATION
  =========================
*/

router.post(
  "/resend-verification-code",

  authLimiter,

  validate(resendVerificationCodeSchema),

  resendVerificationCode,
);

/*
  =========================
  LOGIN
  =========================
*/

router.post(
  "/login",

  authLimiter,

  validate(loginSchema),

  login,
);

/*
  =========================
  CURRENT USER
  =========================
*/

router.get(
  "/me",

  authenticate,

  getCurrentUser,
);

/*
  =========================
  LOGOUT
  =========================
*/

router.post(
  "/logout",

  logout,
);

/*
  =========================
  FORGOT PASSWORD
  =========================
*/

router.post(
  "/forgot-password",

  authLimiter,

  validate(forgotPasswordSchema),

  forgotPassword,
);

/*
  =========================
  RESET PASSWORD
  =========================
*/

router.post(
  "/reset-password",

  authLimiter,

  validate(resetPasswordSchema),

  resetPassword,
);

/*
  =========================
  CHANGE PASSWORD
  =========================
*/

router.post(
  "/change-password",

  authenticate,

  authLimiter,

  validate(changePasswordSchema),

  changePassword,
);

export default router;
