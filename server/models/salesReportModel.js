import mongoose from "mongoose";

const salesReportSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  total_orders: {
    type: Number,
    default: 0,
  },
  total_revenue: {
    type: Number,
    default: 0,
  },
  total_items_sold: {
    type: Number,
    default: 0,
  },
  daily_breakdown: [
    {
      hour: {
        type: Number,
        required: true,
      },
      orders: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const SalesReport =
  mongoose.models.SalesReport ||
  mongoose.model("SalesReport", salesReportSchema);
export default SalesReport;
