import express from 'express';
import { auth, admin } from '../middleware/auth.js';
import { createOrder, myOrders, listOrders, updateStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/mine', auth, myOrders);
router.get('/', auth, admin, listOrders);
router.put('/:id/status', auth, admin, updateStatus);

export default router;