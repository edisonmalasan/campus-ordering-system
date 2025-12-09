import { Shop } from "../models/shopModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
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
    .populate("items.product_id", "items_name items_price photo_url");

  return orders;
};

export const getOrderById = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("customer_id", "name email contact_number")
    .populate("items.product_id", "items_name items_price photo_url");

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
  const allowedStatuses = [
    "preparing",
    "ready_for_pickup",
    "on_the_way",
    "delivered",
    "claimed",
    "cancelled",
  ];

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
    ready_for_pickup: "Your order is ready for pickup!",
    on_the_way: "Your order is on the way!",
    delivered: "Your order has been delivered.",
    claimed: "Your order has been marked as claimed.",
    cancelled: "Your order has been cancelled.",
  };

  await Notification.create({
    user_id: order.customer_id,
    title: `Order ${newStatus.replace(/_/g, " ")}`,
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

export const getProduct = async (userId) => {
  const product = await Product.find({ shop_id: userId }).sort({
    createdAt: -1,
  });
  return product;
};

export const getProductById = async (productId, userId) => {
  const productItem = await Product.findById(productId);

  if (!productItem) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productItem.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return productItem;
};

export const addProduct = async (userId, productData) => {
  const productItem = await Product.create({
    shop_id: userId,
    items_name: productData.items_name || productData.name,
    items_description: productData.items_description || productData.description,
    items_price: productData.items_price || productData.price,
    photo_url: productData.photo_url || productData.image_url,
    preparation_time: productData.preparation_time || 15,
    items_category:
      productData.items_category || productData.category || "general",
    status: productData.status || "available",
    stock: productData.stock || 0,
  });

  return productItem;
};

export const updateProduct = async (productId, userId, updateData) => {
  const productItem = await Product.findById(productId);

  if (!productItem) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productItem.shop_id.toString() !== userId) {
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

  const updated = await Product.findByIdAndUpdate(productId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  return updated;
};

export const deleteProduct = async (productId, userId) => {
  const productItem = await Product.findById(productId);

  if (!productItem) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productItem.shop_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully" };
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

export const getDashboardStats = async (userId) => {
  const totalOrders = await Order.countDocuments({ shop_id: userId });

  const revenueResult = await Order.aggregate([
    {
      $match: {
        shop_id: userId,
        order_status: { $ne: "cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$total_amount" },
      },
    },
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  const productCount = await Product.countDocuments({ shop_id: userId });

  const recentOrders = await Order.find({ shop_id: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("customer_id", "name")
    .select("order_status total_amount createdAt");

  const pendingOrders = await Order.countDocuments({
    shop_id: userId,
    order_status: "pending",
  });

  return {
    totalOrders,
    totalRevenue,
    productCount,
    pendingOrders,
    recentOrders,
  };
};
