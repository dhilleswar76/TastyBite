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
    totalAmount: {
      type: Number,
      required: true,
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
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Order', orderSchema);
