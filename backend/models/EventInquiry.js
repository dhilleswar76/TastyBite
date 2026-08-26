import mongoose from 'mongoose';

const eventInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['birthday', 'corporate', 'wedding', 'anniversary', 'cocktail', 'other'],
    default: 'birthday',
  },
  guestCount: {
    type: Number,
    required: [true, 'Please specify guest count'],
    min: 5,
    max: 500,
  },
  eventDate: {
    type: Date,
    required: [true, 'Please specify event date'],
  },
  estimatedBudget: {
    type: Number,
    default: 0,
  },
  preferredMenu: {
    type: String,
    default: 'Premium Buffet',
  },
  specialRequirements: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'declined'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('EventInquiry', eventInquirySchema);
