import express from "express";
import { getOrderTraceability } from "../controllers/orderController.js";

const router = express.Router();

// GET /api/orders/:id/traceability
router.get("/:id/traceability", getOrderTraceability);

export default router;
