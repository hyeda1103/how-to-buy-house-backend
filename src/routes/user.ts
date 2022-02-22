import express from 'express';

import authMiddleware from '../middlewares/auth';
import { imageUploadMiddleware, imageResizeMiddleware } from '../middlewares/imageUpload';
import {
  generateVerificationToken,
  generateForgotPasswordToken,
  resetPassword,
  accountVerification,
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
  uploadProfilePhoto,
} from '../controllers/user';

const userRoutes = express.Router();

userRoutes.post('/login', userLogin);
userRoutes.post('/register', userRegister);
userRoutes.put('/profile-photo', authMiddleware, imageUploadMiddleware.single('image'), imageResizeMiddleware, uploadProfilePhoto);
userRoutes.get('/', authMiddleware, fetchAllUser);
userRoutes.post('/generate-verification-token', authMiddleware, generateVerificationToken);
userRoutes.post('/generate-forgot-password-token', authMiddleware, generateForgotPasswordToken);
userRoutes.post('/reset-password', authMiddleware, resetPassword);
userRoutes.put('/verify-account', authMiddleware, accountVerification);
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
