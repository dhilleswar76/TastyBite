import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import reservationsRouter from './routes/reservations.js';
import menuRouter from './routes/menu.js';
import contactRouter from './routes/contact.js';
import authRouter from './routes/auth.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database on request (cached in serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection error in middleware:', err.message);
  }
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/menu', menuRouter);
app.use('/api/contact', contactRouter);

// Health check routes
app.get('/api', (req, res) => {
  res.json({ message: 'TastyBite API is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'TastyBite API is running' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

export default app;
