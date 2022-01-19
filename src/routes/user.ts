import express from 'express';

import authMiddleware from '../middlewares/auth';
import {
  deleteUser,
  fetchAllUser,
  fetchUserDetails,
  userLogin,
  userRegister,
  fetchUserProfile,
  updateUserProfile,
  updateUserPassword,
  followUser,
  unFollowUser,
} from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUser);
userRoutes.post('/login', userLogin);
userRoutes.post('/register', userRegister);
userRoutes.put('/password', authMiddleware, updateUserPassword);
userRoutes.put('/follow', authMiddleware, followUser);
userRoutes.put('/unfollow', authMiddleware, unFollowUser);
userRoutes.get('/profile/:id', authMiddleware, fetchUserProfile);
userRoutes.get('/:id', authMiddleware, fetchUserDetails);
userRoutes.put('/:id', authMiddleware, updateUserProfile);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;
