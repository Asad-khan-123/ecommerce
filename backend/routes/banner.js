import express from 'express';
import { getBanners, getActiveBanner, createBanner, updateBanner, deleteBanner, getHighlights, saveHighlights } from '../controllers/banner.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.get('/active', getActiveBanner);
router.get('/highlights', getHighlights);
router.post('/highlights', protect, adminOnly, saveHighlights);

router.get('/', protect, adminOnly, getBanners);
router.post('/', protect, adminOnly, createBanner);
router.put('/:id', protect, adminOnly, updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

export default router;
