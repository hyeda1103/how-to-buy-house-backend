import express from 'express';

import authMiddleware from '../middlewares/auth';
import { imageUploadMiddleware, PostImageResizeMiddleware } from '../middlewares/imageUpload';
import {
  createPost,
} from '../controllers/post';

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, imageUploadMiddleware.single('image'), PostImageResizeMiddleware, createPost);

export default postRoutes;
