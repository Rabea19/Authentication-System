import User from "../models/User.js";

import { comparePassword } from "../utils/password.js";

import { generateAccessToken } from "../utils/token.js";

import {
  getAccessTokenCookieName,
  getAccessTokenCookieOptions,
} from "../utils/authCookie.js";

const invalidCredentialsResponse = (res) => {
  return res.status(401).json({
    success: false,

    message: "Invalid email or password",
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return invalidCredentialsResponse(res);
    }

    const passwordMatches = await comparePassword(password, user.password);

    if (!passwordMatches) {
      return invalidCredentialsResponse(res);
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,

        message: "Please verify your email before logging in",
      });
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),

      role: user.role,
    });

    res.cookie(
      getAccessTokenCookieName(),
      accessToken,
      getAccessTokenCookieOptions(),
    );

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,

      message: "Login successful",

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

export { login };
