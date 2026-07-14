import mongoose from "mongoose";

/**
 * HarvestAlert Schema
 * Maps to the frontend's `harvestAlerts` array in FarmerDashboard.jsx.
 *
 * Frontend consumes:
 *   id (alert_id), crop, buyer, quantity_kg, order_value_lkr,
 *   harvest_window, status, message
 */
const harvestAlertSchema = new mongoose.Schema(
  {
    alert_id: {
      type: String,
      required: true,
      unique: true,
    },
    crop: {
      type: String,
      required: true,
    },
    buyer: {
      type: String,
      required: true,
    },
    quantity_kg: {
      type: Number,
      required: true,
      min: 0,
    },
    order_value_lkr: {
      type: Number,
      required: true,
      min: 0,
    },
    harvest_window: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "confirmed",
      enum: ["pending", "confirmed", "completed", "expired"],
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const HarvestAlert = mongoose.model("HarvestAlert", harvestAlertSchema);

export default HarvestAlert;
