import express from 'express';

import {
  deleteUser, fetchAllUser, userLogin, userRegister,
} from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUser);
userRoutes.delete('/:id', deleteUser);
userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);

export default userRoutes;
