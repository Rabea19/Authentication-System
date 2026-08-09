import User from "../models/User.js";

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

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

export { getCurrentUser };
