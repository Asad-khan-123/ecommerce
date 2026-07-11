import { v2 as cloudinary } from 'cloudinary';
import ENV from '../utils/env.js';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
