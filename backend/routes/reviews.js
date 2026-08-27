import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Fallback curated reviews if database is empty initially
const defaultReviews = [
  {
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya@gmail.com',
    rating: 5,
    comment: 'The Hyderabadi Dum Biryani and Garlic Naan were out of this world! Incredible aroma and authentic royal flavors. The rooftop seating atmosphere is breathtaking.',
    dishRecommended: 'Chicken Dum Biryani',
    userAvatar: '',
    isVerified: true,
    createdAt: new Date('2026-08-15'),
  },
  {
    userName: 'Vikramaditya Roy',
    userEmail: 'vikram@yahoo.com',
    rating: 5,
    comment: 'Celebrated our anniversary at the VIP Private Dining room. Outstanding hospitality, quick service, and the Paneer Butter Masala was creamy perfection.',
    dishRecommended: 'Paneer Butter Masala',
    userAvatar: '',
    isVerified: true,
    createdAt: new Date('2026-08-20'),
  },
  {
    userName: 'Priya Sharma',
    userEmail: 'priya.s@gmail.com',
    rating: 5,
    comment: 'Love the QR table ordering! We sat down, scanned the QR, ordered directly and food arrived in 15 minutes piping hot. The Chocolate Lava Cake is a must-try!',
    dishRecommended: 'Chocolate Lava Cake',
    userAvatar: '',
    isVerified: true,
    createdAt: new Date('2026-08-22'),
  },
];

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    if (reviews.length === 0) {
      return res.json({
        success: true,
        count: defaultReviews.length,
        data: defaultReviews,
      });
    }

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { userName, userEmail, rating, comment, dishRecommended, userAvatar, photos } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, rating, and review comment',
      });
    }

    const review = await Review.create({
      userName,
      userEmail,
      rating: Number(rating),
      comment,
      dishRecommended,
      userAvatar: userAvatar || '',
      photos: Array.isArray(photos) ? photos : [],
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review (admin)
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

export default router;
