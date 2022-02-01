import express from 'express';

import {
  createComment,
  fetchAllComment,
} from '../controllers/comment';
import authMiddleware from '../middlewares/auth';

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, createComment);
commentRoutes.get('/', authMiddleware, fetchAllComment);

export default commentRoutes;
