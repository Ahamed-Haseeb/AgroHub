import express from "express";
import {
  getOrders,
  getAlerts,
  getAdvisory,
} from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard/orders    — Active orders table
// GET /api/dashboard/alerts    — JIT harvest alerts
// GET /api/dashboard/advisory  — Crop advisor recommendations
router.get("/orders", getOrders);
router.get("/alerts", getAlerts);
router.get("/advisory", getAdvisory);

export default router;
