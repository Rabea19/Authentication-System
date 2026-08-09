import jwt from "jsonwebtoken";

const DEFAULT_ACCESS_TOKEN_EXPIRY = "15m";

const generateAccessToken = (
  { userId, role },
  secret = process.env.JWT_SECRET,
  expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ||
    DEFAULT_ACCESS_TOKEN_EXPIRY,
) => {
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const token = jwt.sign(
    {
      role,
    },
    secret,
    {
      subject: String(userId),
      expiresIn,
      algorithm: "HS256",
    },
  );

  return token;
};

const verifyAccessToken = (token, secret = process.env.JWT_SECRET) => {
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  if (!token) {
    throw new Error("Access token is required");
  }

  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  });

  return payload;
};

export { generateAccessToken, verifyAccessToken };
