import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import User from '../models/user';
import generateToken from '../config/token/generateToken';

export const userRegister = expressAsyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const userLogin = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Check if user exists
  const userFound = await User.findOne({ email });
  if (userFound && (await userFound.matchPassword(password))) {
    res.json({
      name: userFound.name,
      email: userFound.email,
      profilePhoto: userFound.profilePhoto,
      isAdmin: userFound.isAdmin,
      token: generateToken(userFound.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Login Credentials');
  }
});

export const fetchAllUser = (req: Request, res: Response) => {
  res.json({ user: 'Fetch All Users' });
};
