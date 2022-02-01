import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/category';

export const createCategory = expressAsyncHandler((async (req: any, res: Response) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
}));

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
