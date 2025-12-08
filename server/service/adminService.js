import { User } from "../models/userModel.js";

export const getPendingShops = async () => {
  const shops = await User.find({ role: "shop", status: "pending" })
    .select("-password")
    .sort({ createdAt: -1 });

  return shops;
};

export const getAllShops = async () => {
  const shops = await User.find({ role: "shop" })
    .select("-password")
    .sort({ createdAt: -1 });

  return shops;
};

export const approveShop = async (shopId) => {
  const shop = await User.findById(shopId);

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  if (shop.role !== "shop") {
    const error = new Error("User is not a shop");
    error.statusCode = 400;
    throw error;
  }

  shop.status = "verified";
  await shop.save();

  return {
    message: "Shop approved successfully",
    shop: {
      id: shop._id,
      email: shop.email,
      shop_name: shop.shop_name,
      status: shop.status,
    },
  };
};

export const rejectShop = async (shopId) => {
  const shop = await User.findById(shopId);

  if (!shop) {
    const error = new Error("Shop not found");
    error.statusCode = 404;
    throw error;
  }

  if (shop.role !== "shop") {
    const error = new Error("User is not a shop");
    error.statusCode = 400;
    throw error;
  }

  shop.status = "rejected";
  await shop.save();

  return {
    message: "Shop rejected successfully",
    shop: {
      id: shop._id,
      email: shop.email,
      shop_name: shop.shop_name,
      status: shop.status,
    },
  };
};

export const getAllCustomers = async () => {
  const customers = await User.find({ role: "customer" })
    .select("-password")
    .sort({ createdAt: -1 });

  return customers;
};

export const getAllUsers = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  return users;
};

export const getDashboardStats = async () => {
  const totalShops = await User.countDocuments({ role: "shop" });
  const verifiedShops = await User.countDocuments({
    role: "shop",
    status: "verified",
  });
  const pendingShops = await User.countDocuments({
    role: "shop",
    status: "pending",
  });
  const totalCustomers = await User.countDocuments({ role: "customer" });

  return {
    totalShops,
    verifiedShops,
    pendingShops,
    totalCustomers,
  };
};
