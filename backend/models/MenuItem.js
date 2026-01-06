import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'starters',
      'biryanis',
      'fried-rice-noodles',
      'main-course',
      'indian-breads',
      'beverages',
      'desserts',
    ],
  },
  image: {
    type: String,
    required: [true, 'Please add an image'],
  },
  tag: {
    type: String,
    enum: ['Veg', 'Non-Veg', ''],
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MenuItem', menuItemSchema);
