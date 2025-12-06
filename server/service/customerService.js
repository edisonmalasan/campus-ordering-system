import { Customer } from "../models/customerModel.js";
import { Shop } from "../models/shopModel.js";
import Menu from "../models/menuModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Notification from "../models/notificationModel.js";

export const getProfile = async (userId) => {
  const customer = await Customer.findById(userId).select("-password");
  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    id: customer._id,
    name: customer.name,
    email: customer.email,
    contact_number: customer.contact_number,
    department: customer.department,
    gender: customer.gender,
    profile_photo_url: customer.profile_photo_url,
    status: customer.status,
  };
};

export const updateProfile = async (userId, updates) => {
  const allowedFields = [
    "name",
    "email",
    "contact_number",
    "department",
    "gender",
    "profile_photo_url",
  ];
  const filteredUpdates = {};

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    userId,
    filteredUpdates,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedCustomer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: updatedCustomer._id,
    name: updatedCustomer.name,
    email: updatedCustomer.email,
    contact_number: updatedCustomer.contact_number,
    department: updatedCustomer.department,
    gender: updatedCustomer.gender,
    profile_photo_url: updatedCustomer.profile_photo_url,
    status: updatedCustomer.status,
  };
};

export const deactivateAccount = async (userId) => {
  const customer = await Customer.findByIdAndUpdate(
    userId,
    { status: "inactive" },
    { new: true }
  );

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return { message: "Account deactivated successfully" };
};

export const getAvailableShops = async () => {
  const shops = await Shop.find({
    status: "verified",
    isTemporarilyClosed: { $ne: true },
  })
    .select("-password")
    .sort({ shop_name: 1 });

  return shops.map((shop) => ({
    id: shop._id,
    name: shop.name,
    email: shop.email,
    shop_name: shop.shop_name,
    logo_url: shop.logo_url,
    delivery_radius: shop.delivery_radius,
    delivery_fee: shop.delivery_fee,
    operating_hours: shop.operating_hours,
    isTemporarilyClosed: shop.isTemporarilyClosed,
  }));
};

export const getShopMenu = async (shopId) => {
  const shop = await Shop.findById(shopId).select("-password");
  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  if (shop.status !== "verified") {
    const error = new Error("Shop is not verified");
    error.statusCode = 403;
    throw error;
  }

  const menu = await Menu.find({
    shop_id: shopId,
    status: { $in: ["available"] },
  }).sort({ items_category: 1, items_name: 1 });

  return menu;
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate("shop_id", "shop_name logo_url delivery_fee")
    .populate("items.menu_id", "items_name items_price photo_url");

  if (!cart) {
    return {
      shop_id: null,
      items: [],
      total_amount: 0,
    };
  }

  return cart;
};

export const addToCart = async (userId, cartData) => {
  const { shop_id, menu_id, quantity } = cartData;

  if (!shop_id || !menu_id || !quantity || quantity < 1) {
    const error = new Error(
      "shop_id, menu_id, and quantity (>=1) are required"
    );
    error.statusCode = 400;
    throw error;
  }

  const shop = await Shop.findById(shop_id);
  if (!shop || shop.status !== "verified") {
    const error = new Error("Shop not found or not verified");
    error.statusCode = 404;
    throw error;
  }

  const menuItem = await Menu.findById(menu_id);
  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    throw error;
  }

  if (menuItem.shop_id.toString() !== shop_id) {
    const error = new Error("Menu item does not belong to this shop");
    error.statusCode = 400;
    throw error;
  }

  if (menuItem.status !== "available") {
    const error = new Error("Menu item is not available");
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user_id: userId });

  if (cart && cart.shop_id.toString() !== shop_id) {
    await Cart.findByIdAndDelete(cart._id);
    cart = null;
  }

  const subtotal = menuItem.items_price * quantity;

  if (!cart) {
    cart = await Cart.create({
      user_id: userId,
      shop_id: shop_id,
      items: [
        {
          menu_id: menu_id,
          quantity: quantity,
          subtotal: subtotal,
        },
      ],
      total_amount: subtotal,
    });
  } else {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.menu_id.toString() === menu_id
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal =
        menuItem.items_price * cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        menu_id: menu_id,
        quantity: quantity,
        subtotal: subtotal,
      });
    }

    cart.total_amount = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await cart.save();
  }

  return await Cart.findById(cart._id)
    .populate("shop_id", "shop_name logo_url delivery_fee")
    .populate("items.menu_id", "items_name items_price photo_url");
};

export const updateCartItem = async (userId, itemId, quantity) => {
  if (!quantity || quantity < 1) {
    const error = new Error("Quantity must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    const error = new Error("Item not found in cart");
    error.statusCode = 404;
    throw error;
  }

  const menuItem = await Menu.findById(cart.items[itemIndex].menu_id);
  if (!menuItem) {
    const error = new Error("Menu item not found");
    error.statusCode = 404;
    throw error;
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].subtotal = menuItem.items_price * quantity;

  cart.total_amount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("shop_id", "shop_name logo_url delivery_fee")
    .populate("items.menu_id", "items_name items_price photo_url");
};

export const removeItemFromCart = async (userId, itemId) => {
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1) {
    const error = new Error("Item not found in cart");
    error.statusCode = 404;
    throw error;
  }

  cart.items.splice(itemIndex, 1);

  cart.total_amount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return { message: "Cart cleared", items: [], total_amount: 0 };
  }

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("shop_id", "shop_name logo_url delivery_fee")
    .populate("items.menu_id", "items_name items_price photo_url");
};

export const placeCustomerOrder = async (userId, orderData) => {
  const { delivery_address, payment_method, gcash_reference, notes } =
    orderData;

  if (!delivery_address || !payment_method) {
    const error = new Error("delivery_address and payment_method are required");
    error.statusCode = 400;
    throw error;
  }

  if (!["gcash", "cash"].includes(payment_method)) {
    const error = new Error("payment_method must be 'gcash' or 'cash'");
    error.statusCode = 400;
    throw error;
  }

  if (payment_method === "gcash" && !gcash_reference) {
    const error = new Error("gcash_reference is required for gcash payment");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user_id: userId })
    .populate("shop_id", "delivery_fee")
    .populate("items.menu_id", "items_price");

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  for (const cartItem of cart.items) {
    const menuItem = await Menu.findById(cartItem.menu_id);
    if (!menuItem || menuItem.status !== "available") {
      const error = new Error(
        `Menu item ${menuItem?.items_name || "unknown"} is no longer available`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const orderItems = cart.items.map((cartItem) => ({
    menu_id: cartItem.menu_id._id || cartItem.menu_id,
    quantity: cartItem.quantity,
    price: cartItem.menu_id.items_price,
    subtotal: cartItem.subtotal,
  }));

  const deliveryFee = cart.shop_id.delivery_fee || 0;
  const totalAmount = cart.total_amount + deliveryFee;

  const order = await Order.create({
    customer_id: userId,
    shop_id: cart.shop_id._id || cart.shop_id,
    items: orderItems,
    total_amount: totalAmount,
    delivery_fee: deliveryFee,
    delivery_address: delivery_address,
    payment_method: payment_method,
    payment_status: payment_method === "cash" ? "pending" : "completed",
    gcash_reference: gcash_reference,
    notes: notes,
    order_status: "pending",
  });

  await Cart.findByIdAndDelete(cart._id);

  await Notification.create({
    user_id: cart.shop_id._id || cart.shop_id,
    title: "New Order",
    message: `You have a new order #${order._id} from a customer.`,
    type: "order",
    order_id: order._id,
  });

  return await Order.findById(order._id)
    .populate("shop_id", "shop_name logo_url")
    .populate("items.menu_id", "items_name items_price photo_url");
};

export const getOrderHistory = async (userId) => {
  const orders = await Order.find({ customer_id: userId })
    .sort({ createdAt: -1 })
    .populate("shop_id", "shop_name logo_url")
    .populate("items.menu_id", "items_name items_price photo_url");

  return orders;
};

export const getOrderDetails = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("shop_id", "shop_name logo_url name email contact_number")
    .populate(
      "items.menu_id",
      "items_name items_price photo_url items_description"
    );

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.customer_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return order;
};

export const handleCancelOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.customer_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  // rule to allow only cancellation within 10 mins of placing order (nasa paper to)
  const timeSinceOrder = Date.now() - order.createdAt.getTime();
  if (timeSinceOrder > 10000) {
    const error = new Error("Cannot cancel order after 10 seconds");
    error.statusCode = 400;
    throw error;
  }

  if (order.order_status !== "pending") {
    const error = new Error(
      `Cannot cancel order with status: ${order.order_status}`
    );
    error.statusCode = 400;
    throw error;
  }

  order.order_status = "cancelled";
  await order.save();

  await Notification.create({
    user_id: order.shop_id,
    title: "Order Cancelled",
    message: `Order #${order._id} has been cancelled by the customer.`,
    type: "order",
    order_id: order._id,
  });

  return order;
};

export const getCustomerNotifications = async (userId) => {
  const notifications = await Notification.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .populate("order_id", "order_status total_amount");

  return notifications;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (notification.user_id.toString() !== userId) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  notification.is_read = true;
  await notification.save();

  return notification;
};
