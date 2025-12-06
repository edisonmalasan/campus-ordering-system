import express from "express";
import {
  getProfile,
  updateProfile,
  deactivateAccount,
  getAvailableShops,
  getShopMenu,
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

customerRouter.use(validateToken(), requireRole("customer"));

customerRouter.get("/profile", getProfile);
customerRouter.put("/profile", updateProfile);
customerRouter.put("/deactivate", deactivateAccount);

customerRouter.get("/shops", getAvailableShops);
customerRouter.get("/shops/:id/menu", getShopMenu);
customerRouter.get("/cart", getCart);
customerRouter.post("/cart/add", addToCart);
customerRouter.put("/cart/update/:itemId", updateCartItem);
customerRouter.delete("/cart/remove/:itemId", removeItemFromCart);
customerRouter.get("/checkout", getCheckout);
customerRouter.post("/orders", placeCustomerOrder);
customerRouter.get("/orders", getOrderHistory);
customerRouter.get("/orders/:id", getOrderDetails);
customerRouter.get("/order-success/:id", getOrderSuccess);
customerRouter.post("/orders/:id/cancel", handleCancelOrder);
customerRouter.post("/orders/:id/claim", claimOrder);
customerRouter.get("/notifications", getCustomerNotifications);
customerRouter.put("/notifications/:id/read", markNotificationAsRead);

export default customerRouter;
