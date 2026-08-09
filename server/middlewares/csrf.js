const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const forbiddenResponse = (res) => {
  return res.status(403).json({
    success: false,

    message: "Forbidden request origin",
  });
};

const getTrustedOrigin = () => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    return new URL(clientUrl).origin;
  } catch {
    throw new Error("CLIENT_URL is invalid");
  }
};

const getOriginFromReferer = (referer) => {
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

const csrfProtection = (req, res, next) => {
  /*
    GET / HEAD / OPTIONS
    مش بتغيّر بيانات عندنا،
    لذلك نسمح لها مباشرة.
  */
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const trustedOrigin = getTrustedOrigin();

  /*
    المتصفحات الحديثة ترسل
    Sec-Fetch-Site.

    لو Browser قالت صراحةً
    إن الطلب cross-site
    نرفضه فورًا.
  */
  const fetchSite = req.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return forbiddenResponse(res);
  }

  /*
    Origin هي أقوى إشارة
    عند وجودها.
  */
  const origin = req.get("origin");

  if (origin) {
    let requestOrigin;

    try {
      requestOrigin = new URL(origin).origin;
    } catch {
      return forbiddenResponse(res);
    }

    if (requestOrigin !== trustedOrigin) {
      return forbiddenResponse(res);
    }

    return next();
  }

  /*
    لو Origin مش موجودة
    نجرب Referer.
  */
  const referer = req.get("referer");

  if (referer) {
    const refererOrigin = getOriginFromReferer(referer);

    if (refererOrigin !== trustedOrigin) {
      return forbiddenResponse(res);
    }

    return next();
  }

  /*
    أثناء Development:
    نسمح لـPostman والTests
    لأنهم غالبًا مش بيرسلوا
    Origin أو Referer.

    في Production:
    أي Unsafe Request
    بدون Origin/Referer
    يتم رفضها.
  */
  if (process.env.NODE_ENV === "production") {
    return forbiddenResponse(res);
  }

  return next();
};

export default csrfProtection;
