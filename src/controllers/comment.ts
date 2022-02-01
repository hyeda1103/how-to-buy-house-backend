import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import Comment from '../models/comment';
/* eslint-disable import/prefer-default-export */
export const createComment = expressAsyncHandler(async (req: any, res: Response) => {
  // Get the user
  const { user } = req;
  // Get the post Id
  const { postId, description } = req.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});
