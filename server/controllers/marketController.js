import MarketPrice from "../models/MarketPrice.js";

// @route   GET /api/market/prices
// @access  Public
export const getMarketPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find({}).sort({ rank: 1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
