import express, {
  Application, Request, Response,
} from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db/dbConnect';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello World' });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));
