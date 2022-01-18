import express, { Application } from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db/dbConnect';
import userRoutes from './routes/user';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());

// Route
app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
