import User from "../models/User.js";

import { comparePassword, hashPassword } from "../utils/password.js";

import {
  getAccessTokenCookieName,
  getAccessTokenClearOptions,
} from "../utils/authCookie.js";

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentPasswordMatches = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!currentPasswordMatches) {
      return res.status(400).json({
        success: false,

        message: "Current password is incorrect",
      });
    }

    const newPasswordIsSame = await comparePassword(newPassword, user.password);

    if (newPasswordIsSame) {
      return res.status(400).json({
        success: false,

        message: "New password must be different from current password",
      });
    }

    const newHashedPassword = await hashPassword(newPassword);

    user.password = newHashedPassword;

    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    await user.save();

    res.clearCookie(getAccessTokenCookieName(), getAccessTokenClearOptions());

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,

      message: "Password changed successfully. Please log in again.",
    });
  } catch (error) {
    return next(error);
  }
};

export { changePassword };
