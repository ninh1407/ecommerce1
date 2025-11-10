import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { auth, admin } from '../middleware/auth.js';

const router = express.Router();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'products'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', auth, admin, upload.single('image'), createProduct);
router.put('/:id', auth, admin, upload.single('image'), updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

export default router;