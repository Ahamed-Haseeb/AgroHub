import express from "express";
import { getPrediction, getAvailableCrops } from "../controllers/aiController.js";

const router = express.Router();

// GET /api/ai/crops                   — Available crops for the selector
// GET /api/ai/predictions/:cropId     — SARIMA/GARCH prediction for a crop
router.get("/crops", getAvailableCrops);
router.get("/predictions/:cropId", getPrediction);

export default router;
