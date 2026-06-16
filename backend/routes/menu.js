import express from 'express';
import {
  getMenuItems,
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems
} from '../controllers/menu.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

// Public route
router.get('/', getMenuItems);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllMenuItems);
router.post('/admin', protect, adminOnly, createMenuItem);
router.put('/admin/:id', protect, adminOnly, updateMenuItem);
router.delete('/admin/:id', protect, adminOnly, deleteMenuItem);
router.post('/admin/reorder', protect, adminOnly, reorderMenuItems);

export default router;
