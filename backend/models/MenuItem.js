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
  nutrition: {
    calories: { type: Number, default: 320 },
    protein: { type: String, default: '14g' },
    carbs: { type: String, default: '38g' },
    fats: { type: String, default: '12g' },
  },
  allergens: {
    type: [String],
    default: [],
  },
  dietary: {
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: true },
    isNutFree: { type: Boolean, default: true },
  },
  spiceLevel: {
    type: Number,
    min: 1,
    max: 3,
    default: 2,
  },
  isChefSpecial: {
    type: Boolean,
    default: false,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  prepTimeMinutes: {
    type: Number,
    default: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('MenuItem', menuItemSchema);
