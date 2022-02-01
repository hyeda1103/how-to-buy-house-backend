import express from 'express';

import { createCategory, fetchAllCategories } from '../controllers/category';
import authMiddleware from '../middlewares/auth';

const categoryRoutes = express.Router();

categoryRoutes.post('/', authMiddleware, createCategory);
categoryRoutes.get('/', fetchAllCategories);

export default categoryRoutes;
