import Order from "../models/Order.js";
import HarvestAlert from "../models/HarvestAlert.js";
import CropAdvisory from "../models/Advisory.js";

/**
 * @route   GET /api/dashboard/orders
 * @access  Public (auth to be added later)
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/dashboard/alerts
 * @access  Public (auth to be added later)
 */
export const getAlerts = async (req, res) => {
  try {
    const alerts = await HarvestAlert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/dashboard/advisory
 * @access  Public
 */
export const getAdvisory = async (req, res) => {
  try {
    const advisory = await CropAdvisory.find().sort({ urgency: -1 });
    res.json(advisory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
