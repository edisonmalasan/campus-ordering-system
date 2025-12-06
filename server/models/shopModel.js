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
  delivery_radius: { type: Number, required: true },
  delivery_fee: { type: Number, required: true },
  business_permit_url: { type: String },
  operating_hours: [hoursSchema],
  isTemporarilyClosed: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
});

export const Shop =
  mongoose.models.Shop || User.discriminator("shop", shopSchema);
