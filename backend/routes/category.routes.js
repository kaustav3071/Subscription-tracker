import express from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { auth } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const router = express.Router();

// All category ops require auth to scope to a user; we still return global (user=null) along with user categories.
router.use(auth);

router.get('/', asyncHandler(listCategories));
// Admin only mutations
router.post('/', requireAdmin, asyncHandler(createCategory));
router.patch('/:id', requireAdmin, asyncHandler(updateCategory));
router.delete('/:id', requireAdmin, asyncHandler(deleteCategory));

export default router;
