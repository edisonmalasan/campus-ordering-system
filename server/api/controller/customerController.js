import * as customerService from "../../service/customerService.js";

export const getProfile = async (req, res) => {
  try {
    const user = await customerService.getProfile(req.user.userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await customerService.updateProfile(
      req.user.userId,
      req.body
    );
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const response = await customerService.deactivateAccount(req.user.userId);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAvailableShops = async (req, res) => {
  try {
    const shops = await customerService.getAvailableShops();
    res.status(200).json({ success: true, data: shops });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await customerService.getShopById(id);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllAvailableProducts = async (req, res) => {
  try {
    const products = await customerService.getAllAvailableProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getShopProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await customerService.getShopProduct(id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await customerService.getCart(req.user.userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const cartData = req.body;
    const cart = await customerService.addToCart(req.user.userId, cartData);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        error: "Quantity is required",
      });
    }

    const cart = await customerService.updateCartItem(
      req.user.userId,
      itemId,
      quantity
    );
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await customerService.removeItemFromCart(
      req.user.userId,
      itemId
    );
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const placeCustomerOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await customerService.placeCustomerOrder(
      req.user.userId,
      orderData,
      req.body.selected_items
    );
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const orders = await customerService.getOrderHistory(req.user.userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await customerService.getOrderDetails(id, req.user.userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const handleCancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await customerService.handleCancelOrder(id, req.user.userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCustomerNotifications = async (req, res) => {
  try {
    const notifications = await customerService.getCustomerNotifications(
      req.user.userId
    );
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await customerService.markNotificationAsRead(
      id,
      req.user.userId
    );
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getCheckout = async (req, res) => {
  try {
    const checkoutData = await customerService.getCheckout(
      req.user.userId,
      req.body.selected_items
    );
    res.status(200).json({ success: true, data: checkoutData });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrderSuccess = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await customerService.getOrderSuccess(id, req.user.userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const claimOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await customerService.claimOrder(id, req.user.userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
