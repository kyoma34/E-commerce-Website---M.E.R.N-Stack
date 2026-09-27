import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes     from './routes/authRoutes.js';
import productsRoutes from './routes/porductsRoutes.js';
import userRoutes     from './routes/userRoutes.js';
import orderRoutes    from './routes/orderRoutes.js';
import uploadRoutes   from './routes/uploadRoutes.js';  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth',     authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/upload',   uploadRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});