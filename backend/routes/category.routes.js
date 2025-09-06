import express from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import {auth} from '../middlewares/auth.js';

const router = express.Router();

// All category ops require auth to scope to a user; we still return global (user=null) along with user categories.
router.use(auth);

router.get('/', listCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
