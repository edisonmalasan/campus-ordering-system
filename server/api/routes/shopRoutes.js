import express from "express";
import {
  getShopProfile,
  updateShopProfile,
  getShopProduct,
  addProductItem,
  updateProductItem,
  deleteProductItem,
  getShopOrders,
  handleAcceptOrder,
  handleRejectOrder,
  updateOrderStatus,
  handleCancelOrder,
  getDailySalesReport,
  getWeeklySalesReport,
  getShopNotifications,
  getDashboardStats,
} from "../controller/shopController.js";
import { validateToken, requireRole } from "../../middleware/authMiddleware.js";

const shopRouter = express.Router();

shopRouter.use(validateToken(), requireRole("shop"));

shopRouter.get("/profile", getShopProfile);
shopRouter.put("/profile", updateShopProfile);
shopRouter.get("/dashboard/stats", getDashboardStats);
shopRouter.get("/product", getShopProduct);
shopRouter.post("/product", addProductItem);
shopRouter.put("/product/:id", updateProductItem);
shopRouter.delete("/product/:id", deleteProductItem);
shopRouter.get("/orders", getShopOrders);

shopRouter.patch("/orders/:id/accept", handleAcceptOrder);
shopRouter.patch("/orders/:id/reject", handleRejectOrder);
shopRouter.patch("/orders/:id/status", updateOrderStatus);
shopRouter.patch("/orders/:id/cancel", handleCancelOrder);

shopRouter.get("/reports/daily", getDailySalesReport);
shopRouter.get("/reports/weekly", getWeeklySalesReport);
shopRouter.get("/notifications", getShopNotifications);

export default shopRouter;
