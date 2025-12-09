import * as adminService from "../../service/adminService.js";

export const getPendingShops = async (req, res) => {
  try {
    const shops = await adminService.getPendingShops();
    res.status(200).json({ success: true, data: shops });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getAllShops = async (req, res) => {
  try {
    const shops = await adminService.getAllShops();
    res.status(200).json({ success: true, data: shops });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const approveShop = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.approveShop(id);
    res.status(200).json({ success: true, message: result.message, data: result.shop });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const rejectShop = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.rejectShop(id);
    res.status(200).json({ success: true, message: result.message, data: result.shop });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await adminService.getAllCustomers();
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message });
  }
};
