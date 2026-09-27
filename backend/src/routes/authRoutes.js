import express from 'express';
import { register, login, getMe } from '../controllers/authControllers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);  // get logged-in user's profile

export default router;