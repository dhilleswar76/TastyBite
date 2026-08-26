import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
  },
  time: {
    type: String,
    required: [true, 'Please add a time'],
  },
  guests: {
    type: Number,
    required: [true, 'Please add number of guests'],
    min: 1,
    max: 30,
  },
  seatingZone: {
    type: String,
    enum: ['rooftop', 'patio', 'booth', 'window', 'private-dining', 'main-hall'],
    default: 'main-hall',
  },
  preOrderItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Reservation', reservationSchema);
