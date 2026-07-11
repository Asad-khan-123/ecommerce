import express from 'express';
import {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/product.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);

// User routes (Protected)
router.post('/:id/reviews', protect, createProductReview);

// Admin routes (Protected)
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin);
router.post('/admin', protect, adminOnly, createProduct);
router.put('/admin/:id', protect, adminOnly, updateProduct);
router.delete('/admin/:id', protect, adminOnly, deleteProduct);

export default router;
