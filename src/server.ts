import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db/dbConnect';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';
import emailRoutes from './routes/emailMessage';
import categoryRoutes from './routes/category';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());
// cors
app.use(cors());

// Route
// Users route
app.use('/api/users', userRoutes);
// Post route
app.use('/api/posts', postRoutes);
// Comment route
app.use('/api/comments', commentRoutes);
// Email Message route
app.use('/api/email', emailRoutes);
// Category route
app.use('/api/category', categoryRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
