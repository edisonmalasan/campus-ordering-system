import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const hoursSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    required: true,
  },
  open: String,
  close: String,
  isClosed: { type: Boolean, default: false },
});

const shopSchema = new mongoose.Schema({
  shop_name: { type: String, required: true },
  logo_url: { type: String },
  delivery_fee: { type: Number, required: true },
  business_permit_code: { type: String },
  operating_hours: [hoursSchema],
  gcash_qr_url: { type: String },
  isTemporarilyClosed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
});

export const Shop =
  mongoose.models.shop || User.discriminator("shop", shopSchema);
