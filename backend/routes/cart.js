import express from 'express';
import {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from '../controllers/cart.js';
import { protect } from '../middlewares/authmiddleware.js';

const router = express.Router();

// All cart routes require token authorization
router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateQuantity);
router.post('/remove', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

export default router;
