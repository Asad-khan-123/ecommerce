import express from 'express';
import { getSettings, saveSettings } from '../controllers/settings.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.post('/', protect, adminOnly, saveSettings);

export default router;
