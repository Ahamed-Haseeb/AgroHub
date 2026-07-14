import express from "express";
import { getMarketPrices } from "../controllers/marketController.js";

const router = express.Router();

// GET /api/market/prices
router.get("/prices", getMarketPrices);

export default router;
