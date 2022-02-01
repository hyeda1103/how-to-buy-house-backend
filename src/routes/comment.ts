import express from 'express';

import {
  createComment,
} from '../controllers/comment';
import authMiddleware from '../middlewares/auth';

const commentRoutes = express.Router();

commentRoutes.post('/', authMiddleware, createComment);

export default commentRoutes;
