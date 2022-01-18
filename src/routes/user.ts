import express from 'express';

import { fetchAllUser, userLogin, userRegister } from '../controllers/user';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUser);
userRoutes.post('/register', userRegister);
userRoutes.post('/login', userLogin);

export default userRoutes;
