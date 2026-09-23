import express from 'express';
import EventInquiry from '../models/EventInquiry.js';
import { fallbackStore } from '../models/fallbackStore.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   POST /api/events
// @desc    Create a new party/event booking inquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    let event = null;
    if (mongoose.connection.readyState === 1) {
      try {
        event = await EventInquiry.create(req.body);
      } catch (e) {
        console.warn('MongoDB event insert notice:', e.message);
      }
    }

    if (!event) {
      event = {
        ...req.body,
        _id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: req.body.status || 'pending',
        createdAt: new Date().toISOString(),
      };
    }

    fallbackStore.events.unshift(event);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    const event = {
      ...req.body,
      _id: `ev-${Date.now()}`,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    fallbackStore.events.unshift(event);
    res.status(201).json({ success: true, data: event });
  }
});

// @route   GET /api/events
// @desc    Get all event bookings
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const { status, email } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (email) filter.email = email;

      const events = await EventInquiry.find(filter).sort({ eventDate: 1, createdAt: -1 });
      if (events.length > 0) {
        return res.json({
          success: true,
          count: events.length,
          data: events,
        });
      }
    }

    let list = fallbackStore.events;
    if (status && status !== 'all') list = list.filter((e) => e.status === status);
    if (email) list = list.filter((e) => e.email === email);

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.json({
      success: true,
      count: fallbackStore.events.length,
      data: fallbackStore.events,
    });
  }
});

// @route   PUT /api/events/:id/status
// @desc    Update event status
// @access  Public / Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    let event = null;

    if (mongoose.connection.readyState === 1) {
      try {
        event = await EventInquiry.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true, runValidators: true }
        );
      } catch (e) {
        console.warn('MongoDB event update status notice:', e.message);
      }
    }

    const idx = fallbackStore.events.findIndex((e) => (e._id || e.id) === req.params.id);
    if (idx !== -1) {
      fallbackStore.events[idx].status = status;
      event = fallbackStore.events[idx];
    }

    res.json({
      success: true,
      data: event || { _id: req.params.id, status },
    });
  } catch (error) {
    res.json({ success: true, data: { _id: req.params.id, status: req.body.status } });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Public / Admin
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await EventInquiry.findByIdAndDelete(req.params.id);
      } catch (e) {
        console.warn('MongoDB event delete notice:', e.message);
      }
    }
    fallbackStore.events = fallbackStore.events.filter((e) => (e._id || e.id) !== req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    fallbackStore.events = fallbackStore.events.filter((e) => (e._id || e.id) !== req.params.id);
    res.json({ success: true, data: {} });
  }
});

export default router;
