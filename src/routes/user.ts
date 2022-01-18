import express from 'express';

import { userRegister } from '../controllers/user';

const userRoutes = express.Router();

userRoutes.post('/register', userRegister);

export default userRoutes;
