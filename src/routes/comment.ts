import express from 'express';

import {
  createComment,
  fetchAllComment,
  fetchSingleComment,
  updateComment,
  deleteComment,
} from '../controllers/comment';
import authMiddleware from '../middlewares/auth';

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, createComment);
commentRoutes.get('/', authMiddleware, fetchAllComment);
commentRoutes.get('/:id', authMiddleware, fetchSingleComment);
commentRoutes.put('/:id', authMiddleware, updateComment);
commentRoutes.delete('/:id', authMiddleware, deleteComment);

export default commentRoutes;
