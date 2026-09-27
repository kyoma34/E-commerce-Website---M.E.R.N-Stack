import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userControllers.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// all routes here are admin-only
router.get('/',     protect, isAdmin, getAllUsers);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;