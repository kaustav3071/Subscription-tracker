import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { auth } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/admin.controller.js';

const router = Router();

router.use(auth, requireAdmin);
router.get('/users', asyncHandler(listUsers));
router.get('/users/:id', asyncHandler(getUser));
router.put('/users/:id', asyncHandler(updateUser));
router.delete('/users/:id', asyncHandler(deleteUser));

export default router;
