import express from 'express';

import authMiddleware from '../middlewares/auth';
import {
  generateVerificationToken,
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
  blockUser,
  unBlockUser,
} from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUser);
userRoutes.post('/login', userLogin);
userRoutes.post('/register', userRegister);
userRoutes.post('/send-mail', generateVerificationToken);
userRoutes.put('/password', authMiddleware, updateUserPassword);
userRoutes.put('/follow', authMiddleware, followUser);
userRoutes.put('/unfollow', authMiddleware, unFollowUser);
userRoutes.put('/block/:id', authMiddleware, blockUser);
userRoutes.put('/unblock/:id', authMiddleware, unBlockUser);
userRoutes.get('/profile/:id', authMiddleware, fetchUserProfile);
userRoutes.get('/:id', authMiddleware, fetchUserDetails);
userRoutes.put('/:id', authMiddleware, updateUserProfile);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;
