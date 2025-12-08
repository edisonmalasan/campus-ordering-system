import express from "express";
import {
  handleCustomerRegistration,
  handleShopRegistration,
  handleLogin,
  handleLogout,
  handleGetCurrentUser,
  handleRefreshToken,
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

export default authRouter;
