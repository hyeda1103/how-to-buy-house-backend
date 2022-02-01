import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

// Storage
const multerStorage = multer.memoryStorage();

// Check File type
const multerFilter: multer.Options['fileFilter'] = (
  req,
  file,
  cb,
) => {
  // Check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    // Rejected files
    cb(new Error('지원하지 않는 파일 형식입니다'));
  }
};

export const imageUploadMiddleware = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// Image Resizing
export const imageResizeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  return next();
};

// Pist Image Resizing
export const PostImageResizeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));

  return next();
};
