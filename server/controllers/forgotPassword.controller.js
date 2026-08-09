import User from "../models/User.js";

import {
  generatePasswordResetToken,
  hashPasswordResetToken,
  createPasswordResetExpiry,
} from "../utils/passwordResetToken.js";

import { sendPasswordResetEmail } from "../services/email.service.js";

const forgotPasswordSuccessMessage =
  "If an account exists for this email, a password reset link has been sent.";

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    /*
      لو الإيميل مش موجود:
      مش هنقول للمستخدم إنه غير موجود.

      هنرجع نفس Response
      علشان منكشفش الإيميلات
      المسجلة عندنا.
    */
    if (!user) {
      return res.status(200).json({
        success: true,

        message: forgotPasswordSuccessMessage,
      });
    }

    /*
      ننشئ Reset Token أصلية.
      دي اللي هتروح في الإيميل.
    */
    const plainResetToken = generatePasswordResetToken();

    /*
      نعمل Hash للتوكن.
      دي اللي هتتخزن في MongoDB.
    */
    const hashedResetToken = hashPasswordResetToken(plainResetToken);

    /*
      مدة صلاحية Reset Token
      15 دقيقة.
    */
    const resetTokenExpires = createPasswordResetExpiry();

    user.passwordResetToken = hashedResetToken;

    user.passwordResetExpires = resetTokenExpires;

    await user.save();

    /*
      نبعت التوكن الأصلية
      للمستخدم في الإيميل.
    */
    await sendPasswordResetEmail(
      {
        to: user.email,

        token: plainResetToken,
      },

      req.app.locals.mailClient,
    );

    return res.status(200).json({
      success: true,

      message: forgotPasswordSuccessMessage,
    });
  } catch (error) {
    return next(error);
  }
};

export { forgotPassword };
