import { Customer } from "../models/customerModel.js";
import { Shop } from "../models/shopModel.js";
import Product from "../models/productModel.js";
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
    _id: shop._id,
    shop_name: shop.shop_name,
    logo_url: shop.logo_url,
    profile_photo_url: shop.profile_photo_url,
    delivery_fee: shop.delivery_fee,
    operating_hours: shop.operating_hours,
    status: shop.status,
    isTemporarilyClosed: shop.isTemporarilyClosed,
  }));
};

export const getShopById = async (shopId) => {
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

  return {
    _id: shop._id,
    shop_name: shop.shop_name,
    logo_url: shop.logo_url,
    profile_photo_url: shop.profile_photo_url,
    delivery_fee: shop.delivery_fee,
    operating_hours: shop.operating_hours,
    status: shop.status,
    isTemporarilyClosed: shop.isTemporarilyClosed,
    gcash_qr_url: shop.gcash_qr_url,
  };
};

export const getAllAvailableProducts = async () => {
  try {
    const products = await Product.find({
      status: "available",
    })
      .populate(
        "shop_id",
        "shop_name status operating_hours isTemporarilyClosed"
      )
      .sort({ createdAt: -1 });

    const filtered = products.filter((product) => {
      if (!product.shop_id) return false;
      return product.shop_id.status === "verified";
    });
    return filtered;
  } catch (error) {
    console.error("Error in getAllAvailableProducts:", error);
    throw error;
  }
};

export const getShopProduct = async (shopId) => {
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

  const products = await Product.find({
    shop_id: shopId,
    status: { $in: ["available"] },
  }).sort({ items_category: 1, items_name: 1 });

  return products;
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate("items.shop_id", "shop_name logo_url delivery_fee gcash_qr_url")
    .populate("items.product_id", "items_name items_price photo_url");

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
  const { shop_id, product_id, quantity } = cartData;

  if (!shop_id || !product_id || !quantity || quantity < 1) {
    const error = new Error(
      "shop_id, product_id, and quantity (>=1) are required"
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

  const productItem = await Product.findById(product_id);
  if (!productItem) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productItem.shop_id.toString() !== shop_id) {
    const error = new Error("Product does not belong to this shop");
    error.statusCode = 400;
    throw error;
  }

  if (productItem.status !== "available") {
    const error = new Error("Product is not available");
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user_id: userId });

  const subtotal = productItem.items_price * quantity;

  if (!cart) {
    cart = await Cart.create({
      user_id: userId,
      items: [
        {
          product_id: product_id,
          shop_id: shop_id,
          quantity: quantity,
          subtotal: subtotal,
        },
      ],
      total_amount: subtotal,
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].subtotal =
        cart.items[itemIndex].quantity * productItem.items_price;
      cart.items[itemIndex].shop_id = shop_id;
    } else {
      cart.items.push({
        product_id: product_id,
        shop_id: shop_id,
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
    .populate("items.shop_id", "shop_name logo_url delivery_fee") // Updated population
    .populate("items.product_id", "items_name items_price photo_url");
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

  const productItem = await Product.findById(cart.items[itemIndex].product_id);
  if (!productItem) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].subtotal = productItem.items_price * quantity;

  cart.total_amount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("items.shop_id", "shop_name logo_url delivery_fee")
    .populate("items.product_id", "items_name items_price photo_url");
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
    .populate("items.shop_id", "shop_name logo_url delivery_fee")
    .populate("items.product_id", "items_name items_price photo_url");
};

export const placeCustomerOrder = async (userId, orderData, selectedItems) => {
  const {
    delivery_address,
    payment_method,
    gcash_reference,
    notes,
    fulfillment_option,
  } = orderData;

  if (
    (!delivery_address && fulfillment_option === "delivery") ||
    !payment_method ||
    !fulfillment_option
  ) {
    const error = new Error(
      "delivery_address (if delivery), payment_method, and fulfillment_option are required"
    );
    error.statusCode = 400;
    throw error;
  }

  if (!["gcash", "cash"].includes(payment_method)) {
    const error = new Error("payment_method must be 'gcash' or 'cash'");
    error.statusCode = 400;
    throw error;
  }

  if (!["delivery", "pickup"].includes(fulfillment_option)) {
    const error = new Error(
      "fulfillment_option must be 'delivery' or 'pickup'"
    );
    error.statusCode = 400;
    throw error;
  }

  if (payment_method === "gcash" && !gcash_reference) {
    const error = new Error("gcash_reference is required for gcash payment");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user_id: userId })
    .populate("items.shop_id", "delivery_fee")
    .populate("items.product_id", "items_price items_name status");

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  let itemsToProcess = cart.items;
  if (selectedItems && selectedItems.length > 0) {
    itemsToProcess = cart.items.filter((item) =>
      selectedItems.includes(item._id.toString())
    );
  }

  if (itemsToProcess.length === 0) {
    const error = new Error("No items selected for checkout");
    error.statusCode = 400;
    throw error;
  }

  const firstShopId = itemsToProcess[0].shop_id._id.toString();
  const multipleShops = itemsToProcess.some(
    (item) => item.shop_id._id.toString() !== firstShopId
  );

  if (multipleShops) {
    const error = new Error("Can only checkout items from one shop at a time.");
    error.statusCode = 400;
    throw error;
  }

  for (const cartItem of itemsToProcess) {
    const productItem = await Product.findById(
      cartItem.product_id._id || cartItem.product_id
    );
    if (!productItem || productItem.status !== "available") {
      const error = new Error(
        `Product ${productItem?.items_name || "unknown"} is no longer available`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const orderItems = itemsToProcess.map((cartItem) => ({
    product_id: cartItem.product_id._id || cartItem.product_id,
    quantity: cartItem.quantity,
    price: cartItem.product_id.items_price,
    subtotal: cartItem.subtotal,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shopInfo = itemsToProcess[0].shop_id; // Get shop from first item
  const deliveryFee =
    fulfillment_option === "pickup" ? 0 : shopInfo.delivery_fee || 0;
  const totalAmount = subtotal + deliveryFee;

  const order = await Order.create({
    customer_id: userId,
    shop_id: shopInfo._id,
    items: orderItems,
    total_amount: totalAmount,
    delivery_fee: deliveryFee,
    delivery_address:
      fulfillment_option === "pickup" ? "Pickup at Store" : delivery_address,
    payment_method: payment_method,
    fulfillment_option: fulfillment_option,
    payment_status: payment_method === "cash" ? "pending" : "completed",
    gcash_reference: gcash_reference,
    notes: notes,
    order_status: "pending",
  });

  if (
    selectedItems &&
    selectedItems.length > 0 &&
    selectedItems.length < cart.items.length
  ) {
    cart.items = cart.items.filter(
      (item) => !selectedItems.includes(item._id.toString())
    );

    cart.total_amount = cart.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    await cart.save();
  } else {
    await Cart.findByIdAndDelete(cart._id);
  }

  await Notification.create({
    user_id: shopInfo._id,
    title: "New Order",
    message: `You have a new order #${order._id} from a customer.`,
    type: "order",
    order_id: order._id,
  });

  return await Order.findById(order._id)
    .populate("shop_id", "shop_name logo_url")
    .populate("items.product_id", "items_name items_price photo_url");
};

export const getOrderHistory = async (userId) => {
  const orders = await Order.find({ customer_id: userId })
    .sort({ createdAt: -1 })
    .populate("shop_id", "shop_name logo_url")
    .populate(
      "items.product_id",
      "items_name items_price photo_url items_description"
    );

  return orders;
};

export const getOrderDetails = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate(
      "shop_id",
      "shop_name profile_photo_url logo_url name email contact_number"
    )
    .populate(
      "items.product_id",
      "items_name items_price photo_url items_description"
    );

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.customer_id.toString() !== userId.toString()) {
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

export const getCheckout = async (userId, selectedItemIds) => {
  const cart = await Cart.findOne({ user_id: userId })
    .populate(
      "items.shop_id",
      "shop_name logo_url delivery_fee operating_hours gcash_qr_url"
    )
    .populate(
      "items.product_id",
      "items_name items_price photo_url items_description"
    );

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  let checkoutItems = cart.items;
  if (selectedItemIds && selectedItemIds.length > 0) {
    checkoutItems = cart.items.filter((item) =>
      selectedItemIds.includes(item._id.toString())
    );
  }

  if (checkoutItems.length === 0) {
    const error = new Error("No items selected for checkout");
    error.statusCode = 400;
    throw error;
  }

  const firstShopId = checkoutItems[0].shop_id._id.toString();
  const multipleShops = checkoutItems.some(
    (item) => item.shop_id._id.toString() !== firstShopId
  );

  if (multipleShops) {
    const error = new Error("Can only checkout items from one shop at a time.");
    error.statusCode = 400;
    throw error;
  }

  for (const cartItem of checkoutItems) {
    const productItem = await Product.findById(
      cartItem.product_id._id || cartItem.product_id
    );
    if (!productItem || productItem.status !== "available") {
      const error = new Error(
        `Product ${productItem?.items_name || "unknown"} is no longer available`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  const shopInfo = checkoutItems[0].shop_id;
  const deliveryFee = shopInfo.delivery_fee || 0;

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = subtotal + deliveryFee;

  const modifiedCart = {
    ...cart.toObject(),
    items: checkoutItems,
    shop_id: shopInfo,
  };

  return {
    cart: modifiedCart,
    subtotal: subtotal,
    delivery_fee: deliveryFee,
    total_amount: totalAmount,
    shop: shopInfo,
  };
};

export const getOrderSuccess = async (orderId, userId) => {
  const order = await Order.findById(orderId)
    .populate("shop_id", "shop_name logo_url name email contact_number")
    .populate(
      "items.product_id",
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

export const claimOrder = async (orderId, userId) => {
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

  if (!["ready_for_pickup", "delivered"].includes(order.order_status)) {
    const error = new Error(
      `Cannot claim order with status: ${order.order_status}. Order must be ready_for_pickup or delivered.`
    );
    error.statusCode = 400;
    throw error;
  }

  order.order_status = "claimed";
  await order.save();

  await Notification.create({
    user_id: order.shop_id,
    title: "Order Claimed",
    message: `Order #${order._id} has been claimed/picked up by the customer.`,
    type: "order",
    order_id: order._id,
  });

  return order;
};
