import Traceability from "../models/Traceability.js";

// @route   GET /api/orders/:id/traceability
// @access  Public
export const getOrderTraceability = async (req, res) => {
  try {
    const steps = await Traceability.find({ order_id: req.params.id }).sort({ order_index: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
