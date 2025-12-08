import { verifyRefreshToken, generateToken } from "../utility/jwtUtil.js";

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    throw error;
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || !decoded.userId) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const newAccessToken = generateToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  return {
    token: newAccessToken,
  };
};
