import express from 'express';

import authMiddleware from '../middlewares/auth';
import {
  createPost,
} from '../controllers/post';

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, createPost);

export default postRoutes;
