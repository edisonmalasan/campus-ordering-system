import { verifyToken } from "../utility/jwtUtil.js";
import { User } from "../models/userModel.js";

const validateToken = () => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "No token provided or invalid format" });
      }

      const token = authHeader.substring(7);

      const decoded = verifyToken(token);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      // attach user object to the req
      req.user = {
        userId: user._id,
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      next();
    } catch (error) {
      console.error("Auth middleware error: ", error);
      return res.status(500).json({ error: "Authentication error" });
    }
  };
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

export { validateToken, requireRole };
