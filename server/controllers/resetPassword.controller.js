import User from "../models/User.js";

import { hashPassword } from "../utils/password.js";

import { hashPasswordResetToken } from "../utils/passwordResetToken.js";

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    /*
      التوكن اللي جاية من المستخدم
      هي Plain Token.

      لكن MongoDB فيها Hash،
      لذلك لازم نعمل لها نفس الـHash.
    */
    const hashedResetToken = hashPasswordResetToken(token);

    /*
      نبحث بشرطين:

      1. الـHash متطابقة.
      2. تاريخ الانتهاء أكبر من الوقت الحالي.
    */
    const user = await User.findOne({
      passwordResetToken: hashedResetToken,

      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,

        message: "Invalid or expired password reset token",
      });
    }

    /*
      نستخدم نفس hashPassword()
      اللي استخدمناها في Register.
    */
    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    /*
      Reset Token تستخدم مرة واحدة فقط.
    */
    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,

      message: "Password reset successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export { resetPassword };
