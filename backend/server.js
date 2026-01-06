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

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/menu', menuRouter);
app.use('/api/contact', contactRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'TastyBite API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
