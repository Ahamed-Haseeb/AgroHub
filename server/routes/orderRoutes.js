import express from 'express';
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  getOrderTraceability,
} from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, getMyOrders);
router.get('/farmer', protect, getFarmerOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, updateOrderStatus);
router.get('/:id/traceability', getOrderTraceability);

export default router;
