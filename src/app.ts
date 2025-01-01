import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes';
import { authenticate } from './middleware/authMiddleware';

dotenv.config();

const app: any = express();
app.use(express.json());
app.use(authenticate);
app.use(movieRoutes);
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/movielobby';

mongoose.connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
export default app
