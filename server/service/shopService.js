import { Shop } from "../models/shopModel.js";
import Order from "../models/orderModel.js";
import Menu from "../models/menuModel.js";
import Notification from "../models/notificationModel.js";

export const getProfile = async (userId) => {
  const shop = await Shop.findById(userId).select("-password");
  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    id: shop._id,
    name: shop.name,
    email: shop.email,
    shop_name: shop.shop_name,
    logo_url: shop.logo_url,
    delivery_radius: shop.delivery_radius,
    delivery_fee: shop.delivery_fee,
    operating_hours: shop.operating_hours,
    status: shop.status,
    contact_number: shop.contact_number,
    isTemporarilyClosed: shop.isTemporarilyClosed,
  };
};

export const updateProfile = async (userId, updateData) => {
  const allowedFields = [
    "name",
    "email",
    "contact_number",
    "shop_name",
    "logo_url",
    "delivery_radius",
    "delivery_fee",
    "operating_hours",
    "isTemporarilyClosed",
  ];
  const filteredUpdates = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredUpdates[key] = updateData[key];
    }
  }

  const updatedShop = await Shop.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedShop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: updatedShop._id,
    name: updatedShop.name,
    email: updatedShop.email,
    shop_name: updatedShop.shop_name,
    logo_url: updatedShop.logo_url,
    delivery_radius: updatedShop.delivery_radius,
    delivery_fee: updatedShop.delivery_fee,
    operating_hours: updatedShop.operating_hours,
    status: updatedShop.status,
    contact_number: updatedShop.contact_number,
    isTemporarilyClosed: updatedShop.isTemporarilyClosed,
  };
};

export const getShopOrders = async (userId) => {
  const orders = await Order.find({ shop_id: userId })
    .sort({ createdAt: -1 })
    .populate("customer_id", "name email contact_number")
    .populate("items.menu_id", "items_name items_price photo_url");

  return orders;
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("customer_id", "name email contact_number")
    .populate("items.menu_id", "items_name items_price photo_url");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return order;
};

export const acceptOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  if (order.order_status !== "pending") {
    const error = new Error(
      `Cannot accept order with status: ${order.order_status}`
    );
    error.statusCode = 400;
    throw error;
  }

  order.order_status = "accepted";
  await order.save();

  await Notification.create({
    user_id: order.customer_id,
    title: "Order Accepted",
    message: `Your order #${order._id} has been accepted by the shop.`,
    type: "order",
    order_id: order._id,
  });

  return order;
};

export const rejectOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  if (order.order_status !== "pending") {
    const error = new Error(
      `Cannot reject order with status: ${order.order_status}`
    );
    error.statusCode = 400;
    throw error;
  }

  order.order_status = "cancelled";
  await order.save();

  await Notification.create({
    user_id: order.customer_id,
    title: "Order Rejected",
    message: `Your order #${order._id} has been rejected by the shop.`,
    type: "order",
    order_id: order._id,
  });

  return order;
};

export const updateOrderStatus = async (orderId, userId, newStatus) => {
  const allowedStatuses = ["preparing", "on_the_way", "delivered", "cancelled"];

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error(`Invalid order status: ${newStatus}`);
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  order.order_status = newStatus;
  await order.save();

  const statusMessages = {
    preparing: "Your order is being prepared.",
    on_the_way: "Your order is on the way!",
    delivered: "Your order has been delivered.",
    cancelled: "Your order has been cancelled.",
  };

  await Notification.create({
    user_id: order.customer_id,
    title: `Order ${newStatus.replace("_", " ")}`,
    message: `Order #${order._id}: ${statusMessages[newStatus]}`,
    type: "order",
    order_id: order._id,
  });

  return order;
};

export const cancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  if (["delivered", "cancelled"].includes(order.order_status)) {
    const error = new Error(
      `Cannot cancel order with status: ${order.order_status}`
    );
    error.statusCode = 400;
    throw error;
  }

  order.order_status = "cancelled";
  await order.save();

  await Notification.create({
    user_id: order.customer_id,
    title: "Order Cancelled",
    message: `Your order #${order._id} has been cancelled by the shop.`,
    type: "order",
    order_id: order._id,
  });

  return order;
};

export const getMenu = async (userId) => {
  const menu = await Menu.find({ shop_id: userId }).sort({ createdAt: -1 });
  return menu;
};

export const getMenuItemById = async (menuItemId, userId) => {
  const menuItem = await Menu.findById(menuItemId);

  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    throw error;
  }

  if (menuItem.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return menuItem;
};

export const addMenuItem = async (userId, menuData) => {
  const menuItem = await Menu.create({
    shop_id: userId,
    items_name: menuData.items_name || menuData.name,
    items_description: menuData.items_description || menuData.description,
    items_price: menuData.items_price || menuData.price,
    photo_url: menuData.photo_url || menuData.image_url,
    preparation_time: menuData.preparation_time || 15,
    items_category: menuData.items_category || menuData.category || "general",
    status: menuData.status || "available",
    stock: menuData.stock || 0,
  });

  return menuItem;
};

export const updateMenuItem = async (menuItemId, userId, updateData) => {
  const menuItem = await Menu.findById(menuItemId);

  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    throw error;
  }

  if (menuItem.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = [
    "items_name",
    "items_description",
    "items_price",
    "photo_url",
    "preparation_time",
    "items_category",
    "status",
    "stock",
  ];

  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredUpdates[key] = updateData[key];
    }
  }

  if (updateData.name && !filteredUpdates.items_name) {
    filteredUpdates.items_name = updateData.name;
  }
  if (updateData.description && !filteredUpdates.items_description) {
    filteredUpdates.items_description = updateData.description;
  }
  if (updateData.price && !filteredUpdates.items_price) {
    filteredUpdates.items_price = updateData.price;
  }
  if (updateData.image_url && !filteredUpdates.photo_url) {
    filteredUpdates.photo_url = updateData.image_url;
  }
  if (updateData.category && !filteredUpdates.items_category) {
    filteredUpdates.items_category = updateData.category;
  }

  const updated = await Menu.findByIdAndUpdate(menuItemId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  return updated;
};

export const deleteMenuItem = async (menuItemId, userId) => {
  const menuItem = await Menu.findById(menuItemId);

  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    throw error;
  }

  if (menuItem.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  await Menu.findByIdAndDelete(menuItemId);
  return { message: "Menu item deleted successfully" };
};

export const getDailySalesReport = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const orders = await Order.find({
    shop_id: userId,
    createdAt: { $gte: today, $lt: tomorrow },
    order_status: { $ne: "cancelled" },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total_amount,
    0
  );

  return {
    date: today,
    total_orders: orders.length,
    total_revenue: totalRevenue,
    orders: orders,
  };
};

export const getWeeklySalesReport = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const orders = await Order.find({
    shop_id: userId,
    createdAt: { $gte: weekAgo, $lt: today },
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

  return {
    period: { start: weekAgo, end: today },
    total_orders: orders.length,
    total_revenue: totalRevenue,
    daily_breakdown: dailyBreakdown,
  };
};

export const getNotifications = async (userId) => {
  const notifications = await Notification.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .populate("order_id", "order_status total_amount");

  return notifications;
};
