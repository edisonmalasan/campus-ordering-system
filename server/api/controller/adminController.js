import * as adminService from "../../service/adminService.js";

export const getAllUsers = async (req, res) => {
  try {
    const filters = {
      role: req.query.role,
      status: req.query.status,
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100,
      skip:
        (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 100) ||
        0,
    };

    const result = await adminService.getAllUsers(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const user = await adminService.updateUserStatus(id, status);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllShops = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100,
      skip:
        (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 100) ||
        0,
    };

    const result = await adminService.getAllShops(filters);
    res.status(200).json({ success: true, data: result });
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
    const shop = await adminService.getShopById(id);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const verifyShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await adminService.verifyShop(id);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const rejectShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await adminService.rejectShop(id);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateShopStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const shop = await adminService.updateShopStatus(id, status);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const filters = {
      shop_id: req.query.shop_id,
      customer_id: req.query.customer_id,
      order_status: req.query.order_status,
      payment_status: req.query.payment_status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 100,
      skip:
        (parseInt(req.query.page) - 1) * (parseInt(req.query.limit) || 100) ||
        0,
    };

    const result = await adminService.getAllOrders(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await adminService.getOrderById(id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getPlatformOverviewReport = async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const report = await adminService.getPlatformOverviewReport(filters);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
};
