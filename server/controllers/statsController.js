import PlatformStat from "../models/Stat.js";

/**
 * @route   GET /api/stats
 * @access  Public
 */
export const getStats = async (req, res) => {
  try {
    const stats = await PlatformStat.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
