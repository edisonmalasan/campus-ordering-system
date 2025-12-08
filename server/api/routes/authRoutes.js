import express from "express";
import {
  handleCustomerRegistration,
  handleShopRegistration,
  handleLogin,
  handleLogout,
  handleGetCurrentUser,
  handleRefreshToken,
  handleUpdatePassword,
  handleUpdateProfile,
  handleUpdateShopSettings,
} from "../controller/authController.js";
import { validateToken } from "../../middleware/authMiddleware.js";

const authRouter = express.Router();

// pub
authRouter.post("/register/customer", handleCustomerRegistration);
authRouter.post("/register/shop", handleShopRegistration);
authRouter.post("/login", handleLogin);
authRouter.post("/refresh", handleRefreshToken);

// priv
authRouter.get("/me", validateToken(), handleGetCurrentUser);
authRouter.post("/logout", validateToken(), handleLogout);
authRouter.post("/update-password", validateToken(), handleUpdatePassword);
authRouter.put("/profile", validateToken(), handleUpdateProfile);
authRouter.put("/shop/settings", validateToken(), handleUpdateShopSettings);
export default authRouter;
