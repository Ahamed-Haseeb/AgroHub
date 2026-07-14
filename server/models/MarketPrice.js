import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    change: { type: String, required: true },
    direction: { type: String, required: true, enum: ['positive', 'negative', 'neutral'] },
    label: { type: String, required: true },
    updated: { type: String, required: true },
  },
  { timestamps: true }
);

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);
export default MarketPrice;
