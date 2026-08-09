import {
  getAccessTokenCookieName,
  getAccessTokenClearOptions,
} from "../utils/authCookie.js";

const logout = (req, res) => {
  res.clearCookie(getAccessTokenCookieName(), getAccessTokenClearOptions());

  res.set("Cache-Control", "no-store");

  return res.status(200).json({
    success: true,

    message: "Logout successful",
  });
};

export { logout };
