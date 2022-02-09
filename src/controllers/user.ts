import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import fs from 'fs';

import { ImageUploaded } from '../types';
import validateDB from '../utils/validateDB';
import User from '../models/user';
import generateToken from '../config/token/generateToken';
import cloudinaryImageUpload from '../utils/cloudinary';

export const userRegister = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        error: '이미 가입되어 있는 이메일 주소입니다',
      });
    }
    try {
      const user = await User.create({
        name,
        email,
        password,
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
    const user = await User.findById(id).populate('posts');
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

export const fetchUserProfile = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateDB(id);
  try {
    const profile = await User.findById(id);
    res.json(profile);
  } catch (error) {
    res.json(error);
  }
});

export const updateUserProfile = expressAsyncHandler(async (req: any, res: Response) => {
  const { _id } = req.user;
  validateDB(_id);
  const user = await User.findByIdAndUpdate(_id, {
    name: req.body.name,
    email: req.body.email,
  }, {
    new: true,
    runValidators: true,
  });
  res.json(user);
});

export const updateUserPassword = expressAsyncHandler(async (req: any, res: Response) => {
  // destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateDB(_id);
  // find the user by _id
  const user = await User.findById(_id);
  if (user && password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
});

export const followUser = expressAsyncHandler(async (req: any, res: Response) => {
  const { followId } = req.body;
  const { id: loginUserId } = req.user;

  // 0. Find the target user and check if the login id exist
  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers.find(
    (user) => user.toString() === loginUserId.toString(),
  );

  if (alreadyFollowing) throw new Error('You have already followed this user');

  // 1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(followId, {
    $push: { followers: loginUserId },
    isFollowing: true,
  }, {
    new: true,
  });

  // 2. Update the login user following field
  await User.findByIdAndUpdate(loginUserId, {
    $push: { following: followId },
  }, {
    new: true,
  });
  res.json('You have successfully followed this user');
});

export const unFollowUser = expressAsyncHandler(async (req: any, res: Response) => {
  const { unFollowId } = req.body;
  const { id: loginUserId } = req.user;

  await User.findByIdAndUpdate(unFollowId, {
    $pull: { followers: loginUserId },
    isFollowing: false,
  }, {
    new: true,
  });

  await User.findByIdAndUpdate(loginUserId, {
    $pull: { following: unFollowId },
  }, {
    new: true,
  });

  res.json('You have successfully unfollowed this user');
});

export const blockUser = expressAsyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);

  const user = await User.findByIdAndUpdate(id, {
    isBlocked: true,
  }, {
    new: true,
  });

  res.json(user);
});

export const unBlockUser = expressAsyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  validateDB(id);

  const user = await User.findByIdAndUpdate(id, {
    isBlocked: false,
  }, {
    new: true,
  });

  res.json(user);
});

// @desc    Generate Email Verification Token
// @route   POST /api/users/generate-verification-token
// @access  Private
export const generateVerificationToken = expressAsyncHandler(async (req: any, res: Response) => {
  sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);
  try {
    // Generate token
    const verificationToken = await user?.createAccountVerificationToken();
    // Save the user with newly created account verification token
    await user?.save();
    // Build your message
    const resetURL = `If you were requested to verify your account, verify now within 10 minutes,
      otherwise ignore this message
      <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>.`;
    const message = {
      to: 'dalgona92@gmail.com',
      from: 'mongryong.in.the.house@gmail.com',
      subject: 'Verify Account',
      html: resetURL,
    };

    await sgMail.send(message);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Account Verification
// @route   PUT /api/users/verify-account
// @access  Private
export const accountVerification = expressAsyncHandler(async (req: any, res: Response) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find this user by token
  // Update the property to true
  const user = await User.findOneAndUpdate({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  }, {
    $set: {
      isAccountVerified: true,
    },
    $unset: {
      accountVerificationToken: '',
      accountVerificationTokenExpires: '',
    },
  });

  if (!user) throw new Error('Token expired, try again later');

  await user.save();
  res.json(user);
});

// @desc    Generate token for forgot password functionality
// @route   PUT /api/users/generate-forgot-password-token
// @access  Private
export const generateForgotPasswordToken = expressAsyncHandler(async (req: any, res: Response) => {
  sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

  // Find the user by email address
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('User Not Found');

  try {
    const resetPasswordToken = await user.createPasswordResetToken();
    await user.save();

    // Build your message
    const resetURL = `A verification message is successfully sent to ${user.email}. Reset now within 10 minutes,
      otherwise ignore this message
      <a href="http://localhost:3000/reset-password/${resetPasswordToken}">Click to verify your account</a>.`;
    const message = {
      to: email,
      from: 'mongryong.in.the.house@gmail.com',
      subject: 'Reset Password',
      html: resetURL,
    };
    await sgMail.send(message);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

// @desc    Reset Password
// @route   PUT /api/users/generate-forgot-password-token
// @access  Private
export const resetPassword = expressAsyncHandler(async (req: any, res: Response) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // Find this user by token
  const user = await User.findOneAndUpdate({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: {
      $gt: Date.now(),
    },
  }, {
    $unset: {
      passwordResetToken: '',
      passwordResetTokenExpires: '',
    },
  });

  if (!user) throw new Error('Token Expired, try again later');

  // Update the password
  user.password = password;
  await user.save();
  res.json(user);
});

// @desc    Upload Profile
// @route   PUT /api/users/profile-photo
// @access  Private
export const uploadProfilePhoto = expressAsyncHandler(async (req: any, res: Response) => {
  // Find the login user
  const { _id } = req.user;
  // Get the oath to img
  const localPath = `public/images/profile/${req.file.filename}`;
  // Upload to cloudinary
  const imageUploaded = await cloudinaryImageUpload(localPath);
  await User.findByIdAndUpdate(_id, {
    profilePhoto: (imageUploaded as ImageUploaded)?.url,
  }, {
    new: true,
  });
  // Remove the saved image
  fs.unlinkSync(localPath);
  res.json(imageUploaded);
});
