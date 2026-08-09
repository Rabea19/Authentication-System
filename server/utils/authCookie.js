const DEVELOPMENT_COOKIE_NAME = "accessToken";

const PRODUCTION_COOKIE_NAME = "__Host-accessToken";

const DEFAULT_COOKIE_MAX_AGE = 15 * 60 * 1000;

const getAccessTokenCookieName = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return isProduction ? PRODUCTION_COOKIE_NAME : DEVELOPMENT_COOKIE_NAME;
};

const getAccessTokenCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  const maxAge = Number(
    process.env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS || DEFAULT_COOKIE_MAX_AGE,
  );

  /*
      في Production نجبر Secure=true
      حتى لو .env فيها false بالغلط.
    */
  const secure = isProduction || process.env.COOKIE_SECURE === "true";

  const configuredSameSite = (
    process.env.COOKIE_SAME_SITE || "lax"
  ).toLowerCase();

  const allowedSameSite = new Set(["lax", "strict", "none"]);

  const sameSite = allowedSameSite.has(configuredSameSite)
    ? configuredSameSite
    : "lax";

  /*
      SameSite=None
      لازم تكون Secure.
    */
  if (sameSite === "none" && !secure) {
    throw new Error("SameSite=None requires Secure cookies");
  }

  return {
    httpOnly: true,

    secure,

    sameSite,

    maxAge,

    path: "/",
  };
};

const getAccessTokenClearOptions = () => {
  const cookieOptions = getAccessTokenCookieOptions();

  return {
    httpOnly: cookieOptions.httpOnly,

    secure: cookieOptions.secure,

    sameSite: cookieOptions.sameSite,

    path: cookieOptions.path,
  };
};

export {
  getAccessTokenCookieName,
  getAccessTokenCookieOptions,
  getAccessTokenClearOptions,
};
