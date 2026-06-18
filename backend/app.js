import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ENV from './utils/env.js';
import connectDb from './utils/db.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import uploadRoutes from './routes/upload.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import collectionRoutes from './routes/collection.js';
import bannerRoutes from './routes/banner.js';
import settingsRoutes from './routes/settings.js';

const app = express();

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',           // Local development (Vite)
  'http://localhost:3000',           // Alternative local dev
  'http://127.0.0.1:5173',          // Localhost alternative
  'http://127.0.0.1:3000',          // Localhost alternative
  'http://192.168.29.172:5173',     // Your local network IP
  'http://192.168.29.172:3000',     // Your local network IP (alt)
  'https://ecommerce-qchr.onrender.com', // Render backend
  'http://localhost:3001',           // Another common port
  'http://192.168.0.0/16',          // Any local network IP (if needed)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or matches local network pattern
    if (allowedOrigins.includes(origin) || origin.includes('192.168')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow anyway for development, change to callback(new Error('Not allowed by CORS')) for production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce API Server');
});

const PORT = ENV.PORT || 8000;

const server = async () => {
  try {
    await connectDb();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
  }
}

server();
