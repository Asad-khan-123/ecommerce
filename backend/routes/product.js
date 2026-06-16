import express from 'express';
import {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from '../controllers/product.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);

// Admin routes (Protected)
router.get('/admin/all', protect, adminOnly, getAllProductsAdmin);
router.post('/admin', protect, adminOnly, createProduct);
router.put('/admin/:id', protect, adminOnly, updateProduct);
router.delete('/admin/:id', protect, adminOnly, deleteProduct);

export default router;
