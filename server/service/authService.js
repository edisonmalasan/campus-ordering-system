import { User } from "../models/userModel.js";
import { Customer } from "../models/customerModel.js";
import { Shop } from "../models/shopModel.js";
import bcrypt from "bcrypt";
import { generateToken, generateRefreshToken } from "../utility/jwtUtil.js";

export const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.role === "shop" && user.status !== "verified") {
    const error = new Error(
      user.status === "pending"
        ? "Account pending verification"
        : "Account has been rejected"
    );
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile_photo_url: user.profile_photo_url,
      contact_number: user.contact_number,
      status: user.status,
      access_level: user.access_level,
      createdAt: user.createdAt,
      ...(user.role === "customer" && {
        department: user.department,
        gender: user.gender,
        student_id: user.student_id,
      }),
      ...(user.role === "shop" && {
        shop_name: user.shop_name,
        business_permit_code: user.business_permit_code,
        logo_url: user.logo_url,
        delivery_fee: user.delivery_fee,
      }),
    },
  };
};

export const registerCustomer = async (userData) => {
  const existing = await User.findOne({
    email: userData.email.toLowerCase(),
  });
  if (existing) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const customer = await Customer.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    contact_number: userData.contact_number,
    department: userData.department,
    gender: userData.gender,
    student_id: userData.student_id,
  });

  const token = generateToken({
    userId: customer._id,
    email: customer.email,
    role: "customer",
  });

  const refreshToken = generateRefreshToken({
    userId: customer._id,
    email: customer.email,
    role: "customer",
  });

  return {
    token,
    refreshToken,
    user: {
      id: customer._id,
      email: customer.email,
      name: customer.name,
      contact_number: customer.contact_number,
      role: "customer",
      department: customer.department,
      gender: customer.gender,
      student_id: customer.student_id,
      profile_photo_url: customer.profile_photo_url,
      status: customer.status,
      createdAt: customer.createdAt,
    },
  };
};

export const registerShop = async (userData) => {
  const existing = await User.findOne({
    email: userData.email.toLowerCase(),
  });

  if (existing) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const shop = await Shop.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    shop_name: userData.shop_name,
    contact_number: userData.contact_number,
    delivery_fee: userData.delivery_fee,
    business_permit_code: userData.business_permit_code,
    status: "pending",
  });

  const token = generateToken({
    userId: shop._id,
    email: shop.email,
    role: "shop",
  });

  const refreshToken = generateRefreshToken({
    userId: shop._id,
    email: shop.email,
    role: "shop",
  });

  return {
    token,
    refreshToken,
    user: {
      id: shop._id,
      name: shop.name,
      email: shop.email,
      role: "shop",
      shop_name: shop.shop_name,
      status: shop.status,
      contact_number: shop.contact_number,
      business_permit_code: shop.business_permit_code,
      logo_url: shop.logo_url,
      delivery_fee: shop.delivery_fee,
      profile_photo_url: shop.profile_photo_url,
      createdAt: shop.createdAt,
    },
  };
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password updated successfully",
  };
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name) user.name = updateData.name;
  if (updateData.contact_number)
    user.contact_number = updateData.contact_number;

  await user.save();

  return {
    message: "Profile updated successfully",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      contact_number: user.contact_number,
      profile_photo_url: user.profile_photo_url,
      status: user.status,
      access_level: user.access_level,
      createdAt: user.createdAt,
      ...(user.role === "customer" && {
        department: user.department,
        gender: user.gender,
        student_id: user.student_id,
      }),
      ...(user.role === "shop" && {
        shop_name: user.shop_name,
        business_permit_code: user.business_permit_code,
        logo_url: user.logo_url,
        delivery_fee: user.delivery_fee,
      }),
    },
  };
};

export const updateShopSettings = async (userId, settingsData) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "shop") {
    const error = new Error("Only shop owners can update shop settings");
    error.statusCode = 403;
    throw error;
  }

  if (settingsData.shop_name) user.shop_name = settingsData.shop_name;
  if (settingsData.delivery_fee !== undefined)
    user.delivery_fee = settingsData.delivery_fee;
  if (settingsData.logo_url !== undefined)
    user.logo_url = settingsData.logo_url;
  if (settingsData.gcash_qr_url !== undefined)
    user.gcash_qr_url = settingsData.gcash_qr_url;
  if (settingsData.isTemporarilyClosed !== undefined)
    user.isTemporarilyClosed = settingsData.isTemporarilyClosed;
  if (settingsData.operating_hours !== undefined)
    user.operating_hours = settingsData.operating_hours;

  await user.save();

  return {
    message: "Shop settings updated successfully",
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      contact_number: user.contact_number,
      profile_photo_url: user.profile_photo_url,
      status: user.status,
      access_level: user.access_level,
      createdAt: user.createdAt,
      shop_name: user.shop_name,
      business_permit_code: user.business_permit_code,
      logo_url: user.logo_url,
      gcash_qr_url: user.gcash_qr_url,
      delivery_fee: user.delivery_fee,
      isTemporarilyClosed: user.isTemporarilyClosed,
      operating_hours: user.operating_hours,
    },
  };
};
