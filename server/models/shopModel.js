import mongoose from "mongoose";

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
  open: {
    type: String,
  },
  close: {
    type: String,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

const shopSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop_name: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
  },
  operating_hours: [hoursSchema],
  business_permit_url: {
    type: String,
  },
  isTemporarilyClosed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "verified", "inactive"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Shop || mongoose.model("Shop", shopSchema);
