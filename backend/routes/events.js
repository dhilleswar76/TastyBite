import express from 'express';
import EventInquiry from '../models/EventInquiry.js';

const router = express.Router();

// @route   POST /api/events
// @desc    Submit an event / party inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const inquiry = await EventInquiry.create(req.body);
    res.status(201).json({
      success: true,
      data: inquiry,
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

// @route   GET /api/events
// @desc    Get all event bookings (admin)
// @access  Admin
router.get('/', async (req, res) => {
  try {
    const inquiries = await EventInquiry.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   PUT /api/events/:id/status
// @desc    Update inquiry status
// @access  Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await EventInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found',
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event inquiry
// @access  Admin
router.delete('/:id', async (req, res) => {
  try {
    await EventInquiry.findByIdAndDelete(req.params.id);
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
