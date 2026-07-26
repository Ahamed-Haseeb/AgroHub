import express from "express";
import { getCrops, getCropById } from "../controllers/cropController.js";

const router = express.Router();

router.get("/", getCrops);
router.get("/:id", getCropById);

export default router;
