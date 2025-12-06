import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  getAllShops,
  verifyShop,
  updateShopStatus,
  getAllOrders,
  getPlatformOverviewReport,
} from "../controller/adminController.js";
import { validateToken, requireRole } from "../../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(validateToken(), requireRole("admin"));

adminRouter.get("/users", getAllUsers);
adminRouter.put("/users/:id/status", updateUserStatus);
adminRouter.get("/shops", getAllShops);
adminRouter.put("/shops/:id/verify", verifyShop);
adminRouter.put("/shops/:id/status", updateShopStatus);
adminRouter.get("/orders", getAllOrders);
adminRouter.get("/reports/overview", getPlatformOverviewReport);

export default adminRouter;
