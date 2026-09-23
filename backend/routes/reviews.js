import express from 'express';
import Review from '../models/Review.js';
import { fallbackStore } from '../models/fallbackStore.js';
import mongoose from 'mongoose';

const router = express.Router();

export const INITIAL_REVIEWS = [
  {
    _id: 'rev-1',
    name: 'Aarav Sharma',
    avatar: '👨‍💼',
    rating: 5,
    comment: 'The Chicken Dum Biryani and Garlic Naan are unmatched in flavor! Truly fine dining hospitality.',
    dishName: 'Chicken Dum Biryani',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'rev-2',
    name: 'Pooja Reddy',
    avatar: '👩‍⚕️',
    rating: 5,
    comment: 'Paneer Butter Masala was creamy, velvety and melt-in-mouth. The ambiance is breathtaking.',
    dishName: 'Paneer Butter Masala',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'rev-3',
    name: 'Vikram Mehta',
    avatar: '👨‍🍳',
    rating: 5,
    comment: 'Instant billing and delicious desserts! The Chocolate Lava Cake and Gulab Jamun are sensational.',
    dishName: 'Chocolate Lava Cake',
    createdAt: new Date().toISOString(),
  }
];

if (fallbackStore.reviews.length === 0) {
  fallbackStore.reviews = [...INITIAL_REVIEWS];
}

// @route   POST /api/reviews
// @desc    Create / Submit a customer review
// @access  Public
router.post('/', async (req, res) => {
  try {
    let review = null;
    if (mongoose.connection.readyState === 1) {
      try {
        review = await Review.create(req.body);
      } catch (e) {
        console.warn('MongoDB review insert notice:', e.message);
      }
    }

    if (!review) {
      review = {
        ...req.body,
        _id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
    }

    fallbackStore.reviews.unshift(review);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    const review = {
      ...req.body,
      _id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    fallbackStore.reviews.unshift(review);
    res.status(201).json({ success: true, data: review });
  }
});

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      if (reviews.length > 0) {
        return res.json({
          success: true,
          count: reviews.length,
          data: reviews,
        });
      }
    }

    res.json({
      success: true,
      count: fallbackStore.reviews.length,
      data: fallbackStore.reviews,
    });
  } catch (error) {
    res.json({
      success: true,
      count: fallbackStore.reviews.length,
      data: fallbackStore.reviews,
    });
  }
});

export default router;
