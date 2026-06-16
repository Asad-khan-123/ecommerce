import cloudinary from 'cloudinary';
import ENV from '../utils/env.js';

cloudinary.v2.config({
  cloud_name: ENV.CLOUDINARY_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET
});

export default cloudinary;
