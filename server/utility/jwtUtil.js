import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default";

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "4h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
