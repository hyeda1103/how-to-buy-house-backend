import { Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/category';

const createCategory = expressAsyncHandler((async (req: any, res: Response) => {
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

export default createCategory;
