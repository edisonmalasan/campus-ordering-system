import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const customerSchema = new mongoose.Schema({
  department: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
});

export const Customer =
  mongoose.models.Customer || User.discriminator("customer", customerSchema);
