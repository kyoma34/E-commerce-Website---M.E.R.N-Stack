import express from 'express';
import productsRoutes from './routes/porductsRoutes.js';
import {connectDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

//middleware to parse JSON bodies
app.use(express.json());

app.use(rateLimiter); // Apply the rate limiter middleware to all routes 

app.use((req,res,next) => {
  console.log(`Request: ${req.method} & URL: ${req.url}`);
  next();
});

app.use("/api/products", productsRoutes);


app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

