import { NextFunction, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/user';

const authMiddleware = expressAsyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
        // Find the user by id
        const user = await User.findById(decoded.id).select('-password');
        // Attach the user to the request object
        req.user = user;
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized, no token');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token expired, login again');
    }
  }
});

export default authMiddleware;
