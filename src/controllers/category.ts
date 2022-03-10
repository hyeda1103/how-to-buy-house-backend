import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/category';

// @desc    Create a category
// @route   POST /api/category
// @access  Private
export const createCategory = expressAsyncHandler((async (req: any, res: Response) => {
  const { _id } = req.user;
  const { title } = req.body;
  const categoryExists = await Category.findOne({ title });
  try {
    if (categoryExists) {
      res.status(400).json({
        error: '이미 존재하는 카테고리입니다',
      });
    } else {
      const category = await Category.create({
        user: _id,
        title,
      });
      res.json(category);
    }
  } catch (error) {
    res.json(error);
  }
}));

// @desc    Fetch all categories
// @route   GET /api/category
// @access  Public
export const fetchAllCategories = expressAsyncHandler((async (req: any, res: Response) => {
  try {
    const allCategories = await Category.find({})
      .populate('user')
      .sort('-createdAt');
    res.json(allCategories);
  } catch (error) {
    res.json(error);
  }
}));

// @desc    Fetch a single category
// @route   GET /api/category/:id
// @access  Public
export const fetchSingleCategory = expressAsyncHandler((async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id)
      .populate('user')
      .sort('-createdAt');
    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));

// @desc    Update a category
// @route   PUT /api/category/:id
// @access  Private
export const updateCategory = expressAsyncHandler((async (req: any, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  const categoryExists = await Category.findOne({ title });

  try {
    if (categoryExists) {
      res.status(400).json({
        error: '이미 존재하는 카테고리입니다',
      });
    } else {
      const category = await Category.findByIdAndUpdate(id, {
        title,
      }, {
        new: true,
        runValidators: true,
      });
      res.json(category);
    }
  } catch (error) {
    res.json(error);
  }
}));

// @desc    Delete a category
// @route   DELETE /api/category/:id
// @access  Private
export const deleteCategory = expressAsyncHandler((async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));
