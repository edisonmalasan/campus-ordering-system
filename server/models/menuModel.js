import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  items_name: {
    type: String,
    required: true,
  },
  items_description: {
    type: String,
    required: true,
  },
  items_price: {
    type: Number,
    required: true,
  },
  photo_url: {
    type: String,
  },
  items_category: {
    type: String,
    required: true,
  },
  is_sold_out: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.Menu || mongoose.model("Menu", menuSchema);
