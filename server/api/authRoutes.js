const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

authRouter.post(
  "/register/customer",
  authController.handleCustomerRegistration
);
authRouter.post("register/shop", authController.handleShopRegistration);
authRouter.post("/login", authController.handleLogin);

authRouter.post("/refresh-token", authController.handleTokenRefresh);
authRouter.get("/verify-email/:token", authController.handleEmailVerification);
authRouter.post("/forgot-password", authController.handleForgotPassword);
authRouter.post("/reset-password/:token", authController.handleResetPassword);
authRouter.post(
  "/logout",
  authMiddleware.validateToken(),
  authController.handleLogout
);

module.exports = authRoutes;
