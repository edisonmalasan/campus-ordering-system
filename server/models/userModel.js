import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Invalid email format"],
    },
    password: { type: String, required: true, minlength: 8 },
    contact_number: { type: String },
    profile_photo_url: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    access_level: {
      type: String,
      enum: ["super admin", "admin", "base"],
      default: "base",
    },
  },
  baseOptions
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
