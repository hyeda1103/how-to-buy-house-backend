import express, { Application } from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db/dbConnect';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import commentRoutes from './routes/comment';
import { errorHandler, notFound } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());

// Route
// Users route
app.use('/api/users', userRoutes);
// Post route
app.use('/api/posts', postRoutes);
// Comment route
app.use('/api/comments', commentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
