import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Helper to generate unique order number
const generateOrderNumber = () => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4);
  return `#TB-${timestamp}${randomDigits}`;
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { customer, items, pricing, payment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create an order without items',
      });
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer,
      items,
      pricing,
      payment,
      status: 'confirmed',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const { status, email } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (email) filter['customer.email'] = email;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID or orderNumber
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    let order;
    if (req.params.id.startsWith('#TB-')) {
      order = await Order.findOne({ orderNumber: req.params.id });
    } else {
      order = await Order.findById(req.params.id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Public / Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Public / Admin
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

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
