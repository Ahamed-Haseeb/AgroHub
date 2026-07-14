import express from "express";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();

// GET /api/stats — Platform-wide statistics for the landing page
router.get("/", getStats);

export default router;
