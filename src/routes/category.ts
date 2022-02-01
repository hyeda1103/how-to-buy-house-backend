import express from 'express';

import { createCategory, fetchAllCategories, fetchSingleCategory } from '../controllers/category';
import authMiddleware from '../middlewares/auth';

const categoryRoutes = express.Router();

categoryRoutes.post('/', authMiddleware, createCategory);
categoryRoutes.get('/', fetchAllCategories);
categoryRoutes.get('/:id', fetchSingleCategory);

export default categoryRoutes;
