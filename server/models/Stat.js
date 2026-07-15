import mongoose from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const PlatformStat = mongoose.model("PlatformStat", platformStatSchema);

export default PlatformStat;
