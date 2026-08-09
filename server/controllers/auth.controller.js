import User from "../models/User.js";

import { hashPassword } from "../utils/password.js";

import {
  generateVerificationCode,
  hashVerificationCode,
  compareVerificationCode,
  createVerificationCodeExpiry,
} from "../utils/verificationCode.js";

import { sendVerificationEmail } from "../services/email.service.js";

const resendSuccessMessage =
  "If the account exists and is not verified, " +
  "a new verification code has been sent.";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await hashPassword(password);

    const plainVerificationCode = generateVerificationCode();

    const hashedVerificationCode = hashVerificationCode(plainVerificationCode);

    const verificationCodeExpires = createVerificationCodeExpiry();

    const user = await User.create({
      name,
      email,

      password: hashedPassword,

      emailVerificationCode: hashedVerificationCode,

      emailVerificationExpires: verificationCodeExpires,
    });

    await sendVerificationEmail(
      {
        to: user.email,
        code: plainVerificationCode,
      },
      req.app.locals.mailClient,
    );

    return res.status(201).json({
      success: true,

      message: "Registration successful. Please verify your email.",

      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
    }).select("+emailVerificationCode " + "+emailVerificationExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
      });
    }

    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const codeHasExpired =
      user.emailVerificationExpires.getTime() <= Date.now();

    if (codeHasExpired) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    const codeMatches = compareVerificationCode(
      code,
      user.emailVerificationCode,
    );

    if (!codeMatches) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;

    user.emailVerificationCode = undefined;

    user.emailVerificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,

      message: "Email verified successfully",

      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    /*
      بنرجع نفس الرد سواء الحساب غير موجود
      أو موجود ومفعّل.

      كده منمنعش شخص من تجربة إيميلات
      ومعرفة أيها مسجل في النظام.
    */
    if (!user || user.isVerified) {
      return res.status(200).json({
        success: true,
        message: resendSuccessMessage,
      });
    }

    const plainVerificationCode = generateVerificationCode();

    const hashedVerificationCode = hashVerificationCode(plainVerificationCode);

    const verificationCodeExpires = createVerificationCodeExpiry();

    user.emailVerificationCode = hashedVerificationCode;

    user.emailVerificationExpires = verificationCodeExpires;

    await user.save();

    await sendVerificationEmail(
      {
        to: user.email,
        code: plainVerificationCode,
      },
      req.app.locals.mailClient,
    );

    return res.status(200).json({
      success: true,
      message: resendSuccessMessage,
    });
  } catch (error) {
    return next(error);
  }
};

export { register, verifyEmail, resendVerificationCode };
