import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Ensure secure JWT secret: throw error if missing in production, generate cryptographically random fallback in development
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production!');
  } else {
    console.warn('WARNING: JWT_SECRET is missing. Generating a random key for local development...');
    jwtSecret = crypto.randomBytes(32).toString('hex');
  }
}

const ENV = {
  PORT: process.env.PORT || 8000,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: jwtSecret,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean) 
    : [],
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.hostinger.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};

export default ENV;