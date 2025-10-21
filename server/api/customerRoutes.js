const express = require("express");
const customerRouter = express.Router();
const customerController = require("../controllers/customerController");
const customerMiddleware = require("../middleware/customerMiddleware");

customerRouter.use(customerMiddleware.validateCustomerToken());

customerRouter.get("/profile", customerController.getCustomerProfile);
customerRouter.put("/profile", customerController.updateCustomerProfile);
customerRouter.get("/shops", customerController.getAvailableShops);
customerRouter.get("/shops/:id/menu", customerController.getShopMenu);
customerRouter.get("/cart", customerController.getCart);
customerRouter.post("/cart/add", customerController.addToCart);
customerRouter.put("/cart/update/:itemId", customerController.updateCartItem);
customerRouter.delete(
  "/cart/remove/:itemId",
  customerController.removeItemFromCart
);
customerRouter.post("/orders", customerController.placeCustomerOrder);
customerRouter.get("/orders", customerController.getOrderHistory);
customerRouter.get("/orders/:id", customerController.getOrderDetails);
customerRouter.post("/orders/:id/cancel", customerController.handleCancelOrder);
customerRouter.get(
  "/notifications",
  customerController.getCustomerNotifications
);
customerRouter.put(
  "/notifications/:id/read",
  customerController.markNotificationAsRead
);

module.exports = customerRouter;
