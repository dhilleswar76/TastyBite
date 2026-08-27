import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  userEmail: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating (1-5)'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please provide your review message'],
    trim: true,
  },
  dishRecommended: {
    type: String,
    trim: true,
  },
  userAvatar: {
    type: String,
    default: '',
  },
  photos: {
    type: [String],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Review', reviewSchema);
