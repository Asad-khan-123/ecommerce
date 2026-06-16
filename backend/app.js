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

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
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

app.get('/', (req, res) => {
  res.send('E-commerce API Server');
});

const PORT = ENV.PORT || 8000;

const server = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server", error);
  }
}

server();
