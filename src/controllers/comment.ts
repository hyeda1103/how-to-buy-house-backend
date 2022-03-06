import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import Comment from '../models/comment';
import validateDB from '../utils/validateDB';

interface IComment {
  user: any
  post: string
  description: string
  parentId?: string
  depth?: number
}

// @desc    Create a comment
// @route   PUT /api/comments
// @access  Private
export const createComment = expressAsyncHandler(async (req: any, res: Response) => {
  // Get the user
  const { user } = req;
  // Get the post Id
  const {
    postId, description, parentId, depth,
  } = req.body;
  const data: IComment = {
    user,
    post: postId,
    description,
    parentId,
    depth,
  };
  try {
    const comment = await Comment.create(data);
    res.json(comment);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

// @desc    Fetch all comments
// @route   GET /api/comments
// @access  Private
export const fetchAllComment = expressAsyncHandler(async (req: any, res: Response) => {
  try {
    const comments = await Comment.find({}).sort('-created');
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Fetch a single comment
// @route   GET /api/comments/:id
// @access  Private
export const fetchSingleComment = expressAsyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);

  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Update a single comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = expressAsyncHandler((async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);
  const { postId, description } = req.body;

  try {
    const updated = await Comment.findByIdAndUpdate(id, {
      post: postId,
      user: req?.user,
      description,
    }, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
}));

// @desc    Delete a single comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = expressAsyncHandler((async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);

  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
}));
