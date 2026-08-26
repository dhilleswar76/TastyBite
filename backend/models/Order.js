import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
  },
  tag: {
    type: String,
  },
  spiceLevel: {
    type: String,
    enum: ['Mild', 'Medium', 'Hot', 'Extra Hot', 'Default'],
    default: 'Default',
  },
  addOns: [
    {
      name: String,
      price: Number,
    },
  ],
  cookingNotes: {
    type: String,
    trim: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide customer email'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide customer phone number'],
      trim: true,
    },
    orderType: {
      type: String,
      enum: ['delivery', 'takeaway', 'dine-in'],
      default: 'delivery',
    },
    address: {
      type: String,
      trim: true,
    },
    tableNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    pointsDiscount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  loyalty: {
    pointsEarned: {
      type: Number,
      default: 0,
    },
    pointsRedeemed: {
      type: Number,
      default: 0,
    },
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'card', 'upi'],
      default: 'cod',
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'confirmed',
  },
  estimatedPrepMinutes: {
    type: Number,
    default: 30,
  },
  timeline: {
    placedAt: {
      type: Date,
      default: Date.now,
    },
    preparingAt: Date,
    readyAt: Date,
    deliveredAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);

