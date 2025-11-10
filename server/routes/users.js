import express from 'express';
import { auth, admin } from '../middleware/auth.js';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', auth, admin, listUsers);
router.get('/:id', auth, admin, getUser);
router.put('/:id', auth, admin, updateUser);
router.delete('/:id', auth, admin, deleteUser);

export default router;