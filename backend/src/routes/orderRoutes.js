import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from '../controllers/orderControllers.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/',             protect,          createOrder);       // user places an order
router.get('/mine',          protect,          getMyOrders);       // user sees their orders
router.get('/',              protect, isAdmin, getAllOrders);       // admin sees all orders
router.get('/:id',           protect,          getOrderById);      // user or admin sees one order
router.put('/:id/status',    protect, isAdmin, updateOrderStatus); // admin updates status

export default router;