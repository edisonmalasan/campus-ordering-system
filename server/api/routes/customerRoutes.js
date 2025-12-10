import express from "express";
import {
  getProfile,
  updateProfile,
  deactivateAccount,
  getAvailableShops,
  getShopById,
  getAllAvailableProducts,
  getShopProduct,
  getCart,
  addToCart,
  updateCartItem,
  removeItemFromCart,
  placeCustomerOrder,
  getOrderHistory,
  getOrderDetails,
  handleCancelOrder,
  getCustomerNotifications,
  markNotificationAsRead,
  getCheckout,
  getOrderSuccess,
  claimOrder,
} from "../controller/customerController.js";
import { validateToken, requireRole } from "../../middleware/authMiddleware.js";

const customerRouter = express.Router();

// pub routes
customerRouter.get("/shops", getAvailableShops);
customerRouter.get("/shops/:id", getShopById);
customerRouter.get("/products", getAllAvailableProducts);
customerRouter.get("/shops/:id/product", getShopProduct);

// protected routes
const protect = [validateToken(), requireRole("customer")];

customerRouter.get("/profile", ...protect, getProfile);
customerRouter.put("/profile", ...protect, updateProfile);
customerRouter.put("/deactivate", ...protect, deactivateAccount);

customerRouter.get("/cart", ...protect, getCart);
customerRouter.post("/cart/add", ...protect, addToCart);
customerRouter.put("/cart/update/:itemId", ...protect, updateCartItem);
customerRouter.delete("/cart/remove/:itemId", ...protect, removeItemFromCart);
customerRouter.post("/checkout", ...protect, getCheckout);
customerRouter.post("/orders", ...protect, placeCustomerOrder);
customerRouter.get("/orders", ...protect, getOrderHistory);
customerRouter.get("/orders/:id", ...protect, getOrderDetails);
customerRouter.get("/order-success/:id", ...protect, getOrderSuccess);
customerRouter.post("/orders/:id/cancel", ...protect, handleCancelOrder);
customerRouter.post("/orders/:id/claim", ...protect, claimOrder);
customerRouter.get("/notifications", ...protect, getCustomerNotifications);
customerRouter.put(
  "/notifications/:id/read",
  ...protect,
  markNotificationAsRead
);

export default customerRouter;
