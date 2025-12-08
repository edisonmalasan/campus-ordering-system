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

  if (user.status !== "active") {
    const error = new Error("Account is inactive");
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
    status: "active",
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
    business_permit_url: userData.business_permit_url,
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
    },
  };
};
