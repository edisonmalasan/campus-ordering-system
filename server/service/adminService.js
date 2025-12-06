import { User } from "../models/userModel.js";
import { Shop } from "../models/shopModel.js";
import { Customer } from "../models/customerModel.js";
import Order from "../models/orderModel.js";

export const getAllUsers = async (filters = {}) => {
  const query = {};

  if (filters.role) {
    query.role = filters.role;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(filters.limit || 100)
    .skip(filters.skip || 0);

  const total = await User.countDocuments(query);

  return {
    users,
    total,
    page: filters.page || 1,
    limit: filters.limit || 100,
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserStatus = async (userId, status) => {
  const allowedStatuses = ["active", "inactive"];

  if (!allowedStatuses.includes(status)) {
    const error = new Error(
      `Invalid status: ${status}. Must be one of: ${allowedStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const getAllShops = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    query.$or = [
      { shop_name: { $regex: filters.search, $options: "i" } },
      { name: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const shops = await Shop.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(filters.limit || 100)
    .skip(filters.skip || 0);

  const total = await Shop.countDocuments(query);

  return {
    shops,
    total,
    page: filters.page || 1,
    limit: filters.limit || 100,
  };
};

export const getShopById = async (shopId) => {
  const shop = await Shop.findById(shopId).select("-password");

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  return shop;
};

export const verifyShop = async (shopId) => {
  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status: "verified" },
    { new: true, runValidators: true }
  ).select("-password");

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  return shop;
};

export const rejectShop = async (shopId) => {
  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status: "rejected" },
    { new: true, runValidators: true }
  ).select("-password");

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  return shop;
};

export const updateShopStatus = async (shopId, status) => {
  const allowedStatuses = ["pending", "verified", "rejected"];

  if (!allowedStatuses.includes(status)) {
    const error = new Error(
      `Invalid status: ${status}. Must be one of: ${allowedStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status },
    { new: true, runValidators: true }
  ).select("-password");

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  return shop;
};

export const getAllOrders = async (filters = {}) => {
  const query = {};

  if (filters.shop_id) {
    query.shop_id = filters.shop_id;
  }
  if (filters.customer_id) {
    query.customer_id = filters.customer_id;
  }
  if (filters.order_status) {
    query.order_status = filters.order_status;
  }
  if (filters.payment_status) {
    query.payment_status = filters.payment_status;
  }
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.createdAt.$lte = new Date(filters.endDate);
    }
  }

  const orders = await Order.find(query)
    .populate("shop_id", "shop_name logo_url name email")
    .populate("customer_id", "name email contact_number")
    .populate("items.menu_id", "items_name items_price photo_url")
    .sort({ createdAt: -1 })
    .limit(filters.limit || 100)
    .skip(filters.skip || 0);

  const total = await Order.countDocuments(query);

  return {
    orders,
    total,
    page: filters.page || 1,
    limit: filters.limit || 100,
  };
};

export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("shop_id", "shop_name logo_url name email")
    .populate("customer_id", "name email contact_number")
    .populate("items.menu_id", "items_name items_price photo_url");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const getPlatformOverviewReport = async (filters = {}) => {
  const startDate = filters.startDate
    ? new Date(filters.startDate)
    : new Date(new Date().setDate(new Date().getDate() - 30));
  const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

  const totalUsers = await User.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const totalShops = await Shop.countDocuments();
  const activeShops = await Shop.countDocuments({ status: "verified" });
  const pendingShops = await Shop.countDocuments({ status: "pending" });

  const totalOrders = await Order.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });
  const completedOrders = await Order.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
    order_status: "delivered",
  });
  const cancelledOrders = await Order.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
    order_status: "cancelled",
  });

  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    order_status: { $ne: "cancelled" },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  const dailyBreakdown = {};
  orders.forEach((order) => {
    const day = order.createdAt.toISOString().split("T")[0];
    if (!dailyBreakdown[day]) {
      dailyBreakdown[day] = { orders: 0, revenue: 0 };
    }
    dailyBreakdown[day].orders += 1;
    dailyBreakdown[day].revenue += order.total_amount;
  });

  const shopRevenue = {};
  orders.forEach((order) => {
    const shopId = order.shop_id.toString();
    if (!shopRevenue[shopId]) {
      shopRevenue[shopId] = { revenue: 0, orders: 0 };
    }
    shopRevenue[shopId].revenue += order.total_amount;
    shopRevenue[shopId].orders += 1;
  });

  const topShops = await Promise.all(
    Object.entries(shopRevenue)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10)
      .map(async ([shopId, stats]) => {
        const shop = await Shop.findById(shopId).select(
          "shop_name logo_url name"
        );
        return {
          shop: shop || { _id: shopId },
          revenue: stats.revenue,
          orders: stats.orders,
        };
      })
  );

  return {
    period: {
      start: startDate,
      end: endDate,
    },
    users: {
      total: totalUsers,
      customers: totalCustomers,
      shops: totalShops,
      active_shops: activeShops,
      pending_shops: pendingShops,
    },
    orders: {
      total: totalOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
      completion_rate:
        totalOrders > 0
          ? ((completedOrders / totalOrders) * 100).toFixed(2)
          : 0,
    },
    revenue: {
      total: totalRevenue,
      average_per_order: orders.length > 0 ? totalRevenue / orders.length : 0,
    },
    daily_breakdown: dailyBreakdown,
    top_shops: topShops,
  };
};
