import mongoose from "mongoose";

const cropListingSchema = new mongoose.Schema(
  {
    listing_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    crop_name: {
      type: String,
      required: true,
    },
    farmer_name: {
      type: String,
      required: true,
    },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    origin: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
    },
    quantity_kg: {
      type: Number,
      required: true,
      min: 0,
    },
    available_kg: {
      type: Number,
      required: true,
      min: 0,
    },
    price_per_kg: {
      type: Number,
      required: true,
      min: 0,
    },
    harvest_date: {
      type: String,
      required: true,
    },
    delivery_days: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    grade: {
      type: String,
      required: true,
      enum: ["A+", "A", "B"],
    },
    packaging: {
      type: String,
      default: "Ventilated Crate",
    },
    jit_status: {
      type: String,
      default: "Awaiting Order",
      enum: ["Awaiting Order", "Harvest Triggered", "In Transit", "Delivered"],
    },
    organic: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    orders: {
      type: Number,
      default: 0,
      min: 0,
    },
    image_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CropListing = mongoose.model("CropListing", cropListingSchema);

export default CropListing;
