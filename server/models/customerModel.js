import mongoose from "mongoose";
import { User } from "../models/userModel.js";

const customerSchema = new mongoose.Schema({
  department: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  student_id: { type: String, unique: true, sparse: true },
});

export const Customer =
  mongoose.models.Customer || User.discriminator("customer", customerSchema);
