import express from "express";
import {
  getOrders,
  getAlerts,
  getAdvisory,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/orders", getOrders);
router.get("/alerts", getAlerts);
router.get("/advisory", getAdvisory);

export default router;
