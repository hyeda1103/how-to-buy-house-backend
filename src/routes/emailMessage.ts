import express from 'express';

import sendEmailMessage from '../controllers/emailMessage';
import authMiddleware from '../middlewares/auth';

const emailRoutes = express.Router();

emailRoutes.post('/', authMiddleware, sendEmailMessage);

export default emailRoutes;
