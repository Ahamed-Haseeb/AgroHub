import express from "express";
import { getPrediction, getAvailableCrops } from "../controllers/aiController.js";

const router = express.Router();

router.get("/crops", getAvailableCrops);
router.get("/predictions/:cropId", getPrediction);

export default router;
