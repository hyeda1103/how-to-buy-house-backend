import express from 'express';

import createCategory from '../controllers/category';
import authMiddleware from '../middlewares/auth';

const categoryRoutes = express.Router();

categoryRoutes.post('/', authMiddleware, createCategory);

export default categoryRoutes;
