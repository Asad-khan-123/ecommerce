import express from 'express';
import multer from 'multer';
import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { uploadImage } from '../controllers/upload.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce/menu',
    resource_type: 'auto'
  }
});

const upload = multer({ storage });

const router = express.Router();

router.post('/admin/upload', protect, adminOnly, upload.single('image'), uploadImage);

export default router;
