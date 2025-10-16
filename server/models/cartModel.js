import mongoose from "mongoose";

const cartItemsSchema = new mongoose.Schema({
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemsSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
