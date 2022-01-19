import express from 'express';

import authMiddleware from '../middlewares/auth';
import {
  deleteUser, fetchAllUser, fetchUserDetails, userLogin, userRegister,
} from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUser);
userRoutes.delete('/:id', deleteUser);
userRoutes.get('/:id', authMiddleware, fetchUserDetails);
userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);

export default userRoutes;
