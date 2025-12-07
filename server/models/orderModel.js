import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  delivery_fee: {
    type: Number,
    default: 0,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["gcash", "cash"],
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  order_status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "cancelled",
      "preparing",
      "ready_for_pickup",
      "on_the_way",
      "delivered",
      "claimed",
    ],
    default: "pending",
  },
  gcash_reference: {
    type: String,
  }, // gcash payment reference number
  notes: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
