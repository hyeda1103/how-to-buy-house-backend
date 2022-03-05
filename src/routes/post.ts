import express from 'express';

import authMiddleware from '../middlewares/auth';
import { imageUploadMiddleware, PostImageResizeMiddleware, UploadImageMiddleware } from '../middlewares/imageUpload';
import {
  createPost,
  fetchPostsByKeyword,
  fetchSinglePost,
  updatePost,
  deletePost,
  toggleLikeToPost,
  toggleDislikeToPost,
  uploadFile,
} from '../controllers/post';

const postRoutes = express.Router();

postRoutes.post('/', authMiddleware, imageUploadMiddleware.single('image'), PostImageResizeMiddleware, createPost);
postRoutes.get('/', fetchPostsByKeyword);
postRoutes.post('/upload-file', imageUploadMiddleware.single('file'), UploadImageMiddleware, uploadFile);
postRoutes.put('/likes', authMiddleware, toggleLikeToPost);
postRoutes.put('/dislikes', authMiddleware, toggleDislikeToPost);
postRoutes.get('/:id', fetchSinglePost);
postRoutes.put('/:id', authMiddleware, updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
