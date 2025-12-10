import mongoose from "mongoose";

const cartItemsSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shop",
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
  total_amount: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
