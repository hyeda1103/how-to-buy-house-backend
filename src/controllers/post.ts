import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Filter from 'bad-words';
// import fs from 'fs';

// import { ImageUploaded } from 'types';
import User from '../models/user';
// import Post from '../models/post';
import validateDB from '../utils/validateDB';
// import cloudinaryImageUpload from '../utils/cloudinary';
import Post from '../models/post';

// @desc    Create post
// @route   POST /api/posts
// @access  Private
export const createPost = expressAsyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  validateDB(_id);

  const { title, description } = req.body;
  // Check for bad words
  const filter = new Filter({
    replaceRegex: /[A-Za-z0-9가-힣]/g, // Multilingual support for word filtering
    list: [], // Add words to the blacklist
  });

  const isProfane = filter.isProfane(description) || filter.isProfane(title);

  // Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error('부적절한 단어가 포함되어 있어 포스팅을 완료할 수 없습니다. 또한 사용자는 블락되었습니다');
  }

  // Get the oath to img
  // const localPath = `public/images/posts/${req.file.filename}`;
  // Upload to cloudinary
  // const imageUploaded = await cloudinaryImageUpload(localPath);
  try {
    const post = await Post.create({
      ...req.body,
      user: _id,
    });
    res.json(post);
    // res.json(imageUploaded);
    // Remove uploaded image
    // fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Fetch all post
// @route   GET /api/posts
// @access  Public
export const fetchAllPost = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({}).populate('user');
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Fetch a single post
// @route   GET /api/posts/:id
// @access  Public
export const fetchSinglePost = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateDB(id);
  try {
    const post = await Post.findById(id).populate('dislikes').populate('likes');
    // Update number of views
    await Post.findByIdAndUpdate(id, {
      $inc: { viewCounts: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = expressAsyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);
  try {
    const post = await Post.findByIdAndUpdate(id, {
      ...req.body,
      user: req.user?.id,
    }, {
      new: true,
    });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = expressAsyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);
  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Like a post
// @route   PUT /api/posts/likes
// @access  Private
export const toggleLikeToPost = expressAsyncHandler(async (req: any, res: Response) => {
  // Find the post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  // Find the login user
  const loginUserId = req.user?.id;
  // Find if this user has liked this post already
  const { isLiked, dislikes } = post;
  // Check if this user has disliked this post
  const alreadyDisLiked = dislikes?.find(
    (userId: string) => userId?.toString() === loginUserId.toString(),
  );
  // Remove the user from dislikes array if exists
  if (alreadyDisLiked) {
    await Post.findByIdAndUpdate(postId, {
      $pull: { dislikes: loginUserId },
      isDisLiked: false,
    }, {
      new: true,
    });
  }
  // Toggle
  // Remove the user if she/he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    }, {
      new: true,
    });
    res.json(post);
  } else {
    // Add to likes
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { likes: loginUserId },
      isLiked: true,
    }, {
      new: true,
    });
    res.json(post);
  }
});

// @desc    Dislike a post
// @route   PUT /api/posts/dislikes
// @access  Private
export const toggleDislikeToPost = expressAsyncHandler(async (req: any, res: Response) => {
  // Find the post to be disliked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  // Find the login user
  const loginUserId = req.user?.id;
  // Check if the user has already disLiked this post
  const { likes, isDisLiked } = post;
  // Check if the user has already liked this post
  const alreadyLiked = likes?.find(
    (userId: string) => userId.toString() === loginUserId?.toString(),
  );
  // Remove the user from likes array if exists
  if (alreadyLiked) {
    await Post.findOneAndUpdate(postId, {
      $pull: { likes: loginUserId },
      isLiked: false,
    }, {
      new: true,
    });
  }
  // Toggle
  // Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { dislikes: loginUserId },
      isDisLiked: false,
    }, {
      new: true,
    });
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { dislikes: loginUserId },
      isDisLiked: true,
    }, {
      new: true,
    });
    res.json(post);
  }
});
