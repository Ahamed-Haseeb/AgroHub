import mongoose from "mongoose";

const cropAdvisorySchema = new mongoose.Schema(
  {
    advisory_id: {
      type: Number,
      required: true,
      unique: true,
    },
    crop: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    roi_estimate: {
      type: String,
      required: true,
    },
    risk: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    season: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🌱",
    },
    urgency: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
  },
  {
    timestamps: true,
  }
);

const CropAdvisory = mongoose.model("CropAdvisory", cropAdvisorySchema);

export default CropAdvisory;
