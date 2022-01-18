import { Request, Response } from 'express';

import User from '../models/user';

export const userRegister = async (req: Request, res: Response) => {
  // Check if user exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new Error('이미 가입한 계정입니다');
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};

export const userLogin = (req: Request, res: Response) => {
  res.json({ user: 'User Login' });
};

export const fetchAllUser = (req: Request, res: Response) => {
  res.json({ user: 'Fetch All Users' });
};
