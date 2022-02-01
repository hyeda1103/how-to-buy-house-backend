import express from 'express';

import authMiddleware from '../middlewares/auth';
import { imageUploadMiddleware, PostImageResizeMiddleware } from '../middlewares/imageUpload';
import {
  createPost,
  fetchAllPost,
  fetchSinglePost,
  updatePost,
  deletePost,
} from '../controllers/post';

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, imageUploadMiddleware.single('image'), PostImageResizeMiddleware, createPost);
postRoutes.get('/', fetchAllPost);
postRoutes.get('/:id', fetchSinglePost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
