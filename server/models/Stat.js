import mongoose from "mongoose";

/**
 * PlatformStat Schema
 * Maps to the frontend's `platformStats` array in LandingPage.jsx.
 *
 * Frontend consumes:
 *   label, value, unit, icon
 */
const platformStatSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "📊",
    },
  },
  {
    timestamps: true,
  }
);

const PlatformStat = mongoose.model("PlatformStat", platformStatSchema);

export default PlatformStat;
