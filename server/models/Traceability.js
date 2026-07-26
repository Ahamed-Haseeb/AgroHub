import mongoose from "mongoose";

const traceabilitySchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true },
    step: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    done: { type: Boolean, default: false },
    order_index: { type: Number, required: true },
  },
  { timestamps: true }
);

const Traceability = mongoose.model("Traceability", traceabilitySchema);
export default Traceability;
