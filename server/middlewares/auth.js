import { verifyAccessToken } from "../utils/token.js";

import { getAccessTokenCookieName } from "../utils/authCookie.js";

const unauthorizedResponse = (res) => {
  return res.status(401).json({
    success: false,
    message: "Unauthorized",
  });
};

const getBearerToken = (req) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
};

const authenticate = (req, res, next) => {
  const cookieName = getAccessTokenCookieName();

  const cookieToken = req.cookies?.[cookieName];

  const bearerToken = getBearerToken(req);

  const accessToken = cookieToken || bearerToken;

  if (!accessToken) {
    return unauthorizedResponse(res);
  }

  try {
    const payload = verifyAccessToken(accessToken);

    if (typeof payload !== "object" || !payload.sub) {
      return unauthorizedResponse(res);
    }

    req.user = {
      id: String(payload.sub),

      role: payload.role,
    };

    return next();
  } catch (error) {
    return unauthorizedResponse(res);
  }
};

export default authenticate;
