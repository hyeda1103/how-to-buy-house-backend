import express from 'express';

import {
  createCategory, fetchAllCategories, fetchSingleCategory, updateCategory, deleteCategory,
} from '../controllers/category';
import authMiddleware from '../middlewares/auth';

const categoryRoutes = express.Router();

categoryRoutes.post('/', authMiddleware, createCategory);
categoryRoutes.get('/', fetchAllCategories);
categoryRoutes.get('/:id', fetchSingleCategory);
categoryRoutes.put('/:id', authMiddleware, updateCategory);
categoryRoutes.delete('/:id', authMiddleware, deleteCategory);

export default categoryRoutes;
