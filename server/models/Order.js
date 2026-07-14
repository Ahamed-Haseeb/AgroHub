import mongoose from "mongoose";

/**
 * Order Schema
 * Maps to the frontend's `activeOrders` table in FarmerDashboard.jsx.
 *
 * Frontend consumes:
 *   id (order_number), crop, quantity, status, statusClass (status_class), price
 */
const orderSchema = new mongoose.Schema(
  {
    order_number: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    crop: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Completed", "Cancelled"],
      default: "Processing",
    },
    status_class: {
      type: String,
      required: true,
      default: "status-processing",
    },
    price: {
      type: String,
      required: true,
    },
    farmer_id: {
      type: String,
      default: null,
    },
    buyer_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
