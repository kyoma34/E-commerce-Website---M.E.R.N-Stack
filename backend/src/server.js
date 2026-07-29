import express from 'express';
import productsRoutes from './routes/porductsRoutes.js';
import {connectDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import dotenv from 'dotenv';
import UserModel from './models/User.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // only needed if you're using cookies/sessions
}));
const PORT = process.env.PORT || 5001;



//middleware to parse JSON bodies
app.use(express.json());

//app.use(rateLimiter); // Apply the rate limiter middleware to all routes 

app.use((req,res,next) => {
  console.log(`Request: ${req.method} & URL: ${req.url}`);
  next();
});

app.use("/api/products", productsRoutes);

app.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const user = await UserModel.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Here you would typically compare the password with the hashed one
        res.status(200).json({ message: "Login successful", user });
    })
    .catch(error => res.status(400).json({ error: error.message }));
});

connectDB().then(() => {

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });
})
