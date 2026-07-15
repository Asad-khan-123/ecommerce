import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
  updatePaymentStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  deleteOrder
} from '../controllers/order.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrdersAdmin);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/admin/:id/payment', protect, adminOnly, updatePaymentStatus);
router.delete('/admin/:id', protect, adminOnly, deleteOrder);

export default router;
