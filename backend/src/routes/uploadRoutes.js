import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/upload
// admin only — uploads one image, returns the Cloudinary URL
router.post('/', protect, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({
      url:       req.file.path,        // Cloudinary URL
      public_id: req.file.filename,    // useful if you want to delete later
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;