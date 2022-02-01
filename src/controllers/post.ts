import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import Post from '../models/post';
import validateDB from '../utils/validateDB';

export const createPost = expressAsyncHandler(async (req: any, res: Response) => {
  const { user } = req.body;
  validateDB(user);
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
