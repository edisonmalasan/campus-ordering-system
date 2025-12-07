import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
  preparation_time: {
    type: Number,
    required: true,
  },
  items_category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "sold_out", "hidden"],
    default: "available",
  },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
