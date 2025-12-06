import * as shopService from "../../service/shopService.js";

export const getShopProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await shopService.getProfile(userId);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const updateShopProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    const updatedProfile = await shopService.updateProfile(userId, updateData);
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getShopOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await shopService.getShopOrders(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const handleAcceptOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const order = await shopService.acceptOrder(id, userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const handleRejectOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const order = await shopService.rejectOrder(id, userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const order = await shopService.updateOrderStatus(id, userId, status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const handleCancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const order = await shopService.cancelOrder(id, userId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getShopMenu = async (req, res) => {
  try {
    const userId = req.user.userId;
    const menu = await shopService.getMenu(userId);
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const menuData = req.body;
    const menuItem = await shopService.addMenuItem(userId, menuData);
    res.status(201).json({ success: true, data: menuItem });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;
    const updated = await shopService.updateMenuItem(id, userId, updateData);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await shopService.deleteMenuItem(id, userId);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getDailySalesReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const report = await shopService.getDailySalesReport(userId);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getWeeklySalesReport = async (req, res) => {
  try {
    const userId = req.user.userId;
    const report = await shopService.getWeeklySalesReport(userId);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getShopNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await shopService.getNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};
