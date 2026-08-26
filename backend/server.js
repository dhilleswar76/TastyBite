import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRouter from './routes/auth.js';
import reservationsRouter from './routes/reservations.js';
import menuRouter from './routes/menu.js';
import contactRouter from './routes/contact.js';
import ordersRouter from './routes/orders.js';
import reviewsRouter from './routes/reviews.js';
import eventsRouter from './routes/events.js';

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

// Routes (support both /api/* and direct routes)
app.use(['/api/auth', '/auth'], authRouter);
app.use(['/api/reservations', '/reservations'], reservationsRouter);
app.use(['/api/menu', '/menu'], menuRouter);
app.use(['/api/orders', '/orders'], ordersRouter);
app.use(['/api/reviews', '/reviews'], reviewsRouter);
app.use(['/api/events', '/events'], eventsRouter);
app.use(['/api/contact', '/contact'], contactRouter);

// Health check routes
app.all(['/api', '/'], (req, res) => {
  res.json({ message: 'TastyBite API is running' });
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Start listening immediately on non-serverless environments (Render, local, VPS)
if (!process.env.VERCEL) {
  const host = '0.0.0.0';
  const server = app.listen(PORT, host, () => {
    console.log(`🚀 Server running on http://${host}:${PORT}`);
    // Connect to database in the background
    connectDB().catch((err) => {
      console.error('Database connection error on start:', err.message);
    });
  });

  server.on('error', (err) => {
    console.error('Server error on listen:', err.message);
  });
}

export default app;
