import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsControllers.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/',      getProducts);                        // public
router.get('/:id',   getProduct);                         // public
router.post('/',     protect, isAdmin, createProduct);    // admin only
router.put('/:id',   protect, isAdmin, updateProduct);    // admin only
router.delete('/:id',protect, isAdmin, deleteProduct);    // admin only

export default router;