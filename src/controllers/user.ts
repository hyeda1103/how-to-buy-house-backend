import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import validateDB from '../utils/validateDB';
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
    const {
      _id, name, email, profilePhoto, isAdmin,
    } = userFound;
    res.json({
      _id,
      name,
      email,
      profilePhoto,
      isAdmin,
      token: generateToken(userFound.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Login Credentials');
  }
});

export const fetchAllUser = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

export const deleteUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check if user id is valid
  validateDB(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

export const fetchUserDetails = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check if user id is valid
  validateDB(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});
