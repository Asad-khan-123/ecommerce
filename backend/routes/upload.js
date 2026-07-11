import express from 'express';
import multer from 'multer';
import CloudinaryStoragePkg from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import '../config/cloudinary.js'; // Ensures cloudinary.config is executed
import { uploadImage } from '../controllers/upload.js';
import { protect, adminOnly } from '../middlewares/authmiddleware.js';

// Support both default and named exports for multer-storage-cloudinary
const CloudinaryStorage = CloudinaryStoragePkg.CloudinaryStorage || CloudinaryStoragePkg;

const storage = CloudinaryStorage({
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
