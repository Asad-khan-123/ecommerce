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

// CORS Configuration - Restrict origins in production
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  ...ENV.ALLOWED_ORIGINS
];

// Allow localhost only in development mode
if (!isProduction) {
  allowedOrigins.push(
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://localhost:3001'
  );
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || (!isProduction && origin.includes('192.168'));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      if (isProduction) {
        callback(new Error('Not allowed by CORS'));
      } else {
        // Fallback for local development testing
        callback(null, true);
      }
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
