import express from "express";
import { getCrops, getCropById } from "../controllers/cropController.js";

const router = express.Router();

// GET /api/crops         — All listings (with optional filters)
// GET /api/crops/:id     — Single listing by listing_id
router.get("/", getCrops);
router.get("/:id", getCropById);

export default router;
