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

export const getShopProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const product = await shopService.getProduct(userId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const addProductItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productData = req.body;
    const productItem = await shopService.addProduct(userId, productData);
    res.status(201).json({ success: true, data: productItem });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const updateProductItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updateData = req.body;
    const updated = await shopService.updateProduct(id, userId, updateData);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const deleteProductItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const result = await shopService.deleteProduct(id, userId);
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

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await shopService.getDashboardStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
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

    const order = await shopService.updatePaymentStatus(id, userId, status);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};