/**
 * AI Predictions Controller
 *
 * Serves mock SARIMA/GARCH prediction data until the Python AI Bridge
 * microservice is built. The data structure matches mockPrediction from
 * the frontend's mockData.js exactly.
 *
 * @desc    Get AI price prediction for a crop
 * @route   GET /api/ai/predictions/:cropId
 * @access  Public
 */

// Mock prediction data — exact copy of frontend's mockPrediction
const mockPredictions = {
  ONION_BIG_LK: {
    crop_id: "ONION_BIG_LK",
    crop_name: "Big Onion",
    model: "SARIMA(3,1,2)(0,0,2)[52]",
    currency: "LKR",
    generated_at: new Date().toISOString(),
    forecast: [
      { week: 1, week_label: "Wk 1", price: 210, lower_ci: 195, upper_ci: 228 },
      { week: 2, week_label: "Wk 2", price: 215, lower_ci: 198, upper_ci: 234 },
      { week: 3, week_label: "Wk 3", price: 208, lower_ci: 192, upper_ci: 226 },
      { week: 4, week_label: "Wk 4", price: 220, lower_ci: 202, upper_ci: 240 },
      { week: 5, week_label: "Wk 5", price: 218, lower_ci: 200, upper_ci: 238 },
      { week: 6, week_label: "Wk 6", price: 225, lower_ci: 205, upper_ci: 247 },
      { week: 7, week_label: "Wk 7", price: 230, lower_ci: 210, upper_ci: 252 },
      { week: 8, week_label: "Wk 8", price: 235, lower_ci: 214, upper_ci: 258 },
      { week: 9, week_label: "Wk 9", price: 240, lower_ci: 218, upper_ci: 264 },
      { week: 10, week_label: "Wk 10", price: 245, lower_ci: 222, upper_ci: 270 },
      { week: 11, week_label: "Wk 11", price: 250, lower_ci: 226, upper_ci: 276 },
      { week: 12, week_label: "Wk 12", price: 255, lower_ci: 230, upper_ci: 282 },
      { week: 21, week_label: "Wk 21", price: 310, lower_ci: 280, upper_ci: 342, lean_season: true },
      { week: 22, week_label: "Wk 22", price: 340, lower_ci: 308, upper_ci: 375, lean_season: true },
      { week: 23, week_label: "Wk 23", price: 380, lower_ci: 345, upper_ci: 418, lean_season: true },
      { week: 24, week_label: "Wk 24", price: 420, lower_ci: 382, upper_ci: 462, lean_season: true },
      { week: 25, week_label: "Wk 25", price: 465, lower_ci: 423, upper_ci: 511, lean_season: true },
      { week: 26, week_label: "Wk 26", price: 490, lower_ci: 446, upper_ci: 538, lean_season: true },
      { week: 27, week_label: "Wk 27", price: 478, lower_ci: 434, upper_ci: 526, lean_season: true },
      { week: 28, week_label: "Wk 28", price: 455, lower_ci: 412, upper_ci: 500, lean_season: true },
      { week: 29, week_label: "Wk 29", price: 420, lower_ci: 380, upper_ci: 462, lean_season: true },
      { week: 30, week_label: "Wk 30", price: 340, lower_ci: 308, upper_ci: 375 },
      { week: 35, week_label: "Wk 35", price: 280, lower_ci: 255, upper_ci: 308 },
      { week: 40, week_label: "Wk 40", price: 265, lower_ci: 240, upper_ci: 292 },
      { week: 49, week_label: "Wk 49", price: 390, lower_ci: 355, upper_ci: 428, lean_season: true },
      { week: 50, week_label: "Wk 50", price: 430, lower_ci: 392, upper_ci: 472, lean_season: true },
      { week: 51, week_label: "Wk 51", price: 450, lower_ci: 410, upper_ci: 494, lean_season: true },
      { week: 52, week_label: "Wk 52", price: 445, lower_ci: 405, upper_ci: 490, lean_season: true },
    ],
    garch_metrics: {
      model: "GARCH(1,1)",
      current_volatility: 0.187,
      volatility_label: "Moderate-High",
      risk_score: 68,
      volatility_history: [
        { week: "Wk 1", sigma: 0.12 },
        { week: "Wk 4", sigma: 0.14 },
        { week: "Wk 8", sigma: 0.16 },
        { week: "Wk 12", sigma: 0.13 },
        { week: "Wk 16", sigma: 0.18 },
        { week: "Wk 20", sigma: 0.24 },
        { week: "Wk 24", sigma: 0.31 },
        { week: "Wk 28", sigma: 0.28 },
        { week: "Wk 32", sigma: 0.20 },
        { week: "Wk 36", sigma: 0.16 },
        { week: "Wk 40", sigma: 0.14 },
        { week: "Wk 44", sigma: 0.19 },
        { week: "Wk 48", sigma: 0.29 },
        { week: "Wk 52", sigma: 0.33 },
      ],
      forecast_confidence: 0.91,
      recommendation:
        "Consider advance contracts during Weeks 21–29 to lock in pre-spike prices.",
    },
  },
};

// Available crops list (matches frontend's availableCrops)
const availableCrops = [
  { id: "ONION_BIG_LK", name: "Big Onion", origin: "Dambulla", category: "Vegetables" },
  { id: "TOMATO_LK", name: "Tomato", origin: "Nuwara Eliya", category: "Vegetables" },
  { id: "CARROT_LK", name: "Carrot", origin: "Nuwara Eliya", category: "Root Crops" },
  { id: "POTATO_LK", name: "Potato", origin: "Badulla", category: "Root Crops" },
  { id: "LEEKS_LK", name: "Leeks", origin: "Nuwara Eliya", category: "Vegetables" },
  { id: "CAPSICUM_LK", name: "Capsicum", origin: "Dambulla", category: "Vegetables" },
];

export const getPrediction = async (req, res) => {
  try {
    const { cropId } = req.params;

    // For now, return the Big Onion mock for all crops
    // Once the Python AI Bridge is built, this will proxy to FastAPI
    const prediction = mockPredictions[cropId] || {
      ...mockPredictions["ONION_BIG_LK"],
      crop_id: cropId,
      crop_name: availableCrops.find((c) => c.id === cropId)?.name || cropId,
    };

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableCrops = async (req, res) => {
  try {
    res.json(availableCrops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
