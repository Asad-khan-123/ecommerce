import express from 'express';
import { googleAuth, getCurrentUser } from '../controllers/auth.js';
import { protect } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/me', protect, getCurrentUser);

export default router;
