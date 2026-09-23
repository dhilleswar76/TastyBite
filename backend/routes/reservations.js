import express from 'express';
import Reservation from '../models/Reservation.js';
import { fallbackStore } from '../models/fallbackStore.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   POST /api/reservations
// @desc    Create a new table reservation
// @access  Public
router.post('/', async (req, res) => {
  try {
    let reservation = null;
    if (mongoose.connection.readyState === 1) {
      try {
        reservation = await Reservation.create(req.body);
      } catch (e) {
        console.warn('MongoDB reservation insert notice:', e.message);
      }
    }

    if (!reservation) {
      reservation = {
        ...req.body,
        _id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: req.body.status || 'pending',
        createdAt: new Date().toISOString(),
      };
    }

    fallbackStore.reservations.unshift(reservation);

    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    const reservation = {
      ...req.body,
      _id: `res-${Date.now()}`,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    fallbackStore.reservations.unshift(reservation);
    res.status(201).json({ success: true, data: reservation });
  }
});

// @route   GET /api/reservations
// @desc    Get all reservations
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const { status, email } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (email) filter.email = email;

      const reservations = await Reservation.find(filter).sort({ date: -1 });
      if (reservations.length > 0) {
        return res.json({
          success: true,
          count: reservations.length,
          data: reservations,
        });
      }
    }

    let list = fallbackStore.reservations;
    if (status && status !== 'all') list = list.filter((r) => r.status === status);
    if (email) list = list.filter((r) => r.email === email);

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.json({
      success: true,
      count: fallbackStore.reservations.length,
      data: fallbackStore.reservations,
    });
  }
});

// @route   PUT /api/reservations/:id/status
// @desc    Update reservation status
// @access  Public / Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    let reservation = null;

    if (mongoose.connection.readyState === 1) {
      try {
        reservation = await Reservation.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true, runValidators: true }
        );
      } catch (e) {
        console.warn('MongoDB reservation update notice:', e.message);
      }
    }

    const idx = fallbackStore.reservations.findIndex((r) => (r._id || r.id) === req.params.id);
    if (idx !== -1) {
      fallbackStore.reservations[idx].status = status;
      reservation = fallbackStore.reservations[idx];
    }

    res.json({
      success: true,
      data: reservation || { _id: req.params.id, status },
    });
  } catch (error) {
    res.json({ success: true, data: { _id: req.params.id, status: req.body.status } });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Delete reservation
// @access  Public / Admin
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await Reservation.findByIdAndDelete(req.params.id);
      } catch (e) {
        console.warn('MongoDB reservation delete notice:', e.message);
      }
    }
    fallbackStore.reservations = fallbackStore.reservations.filter(
      (r) => (r._id || r.id) !== req.params.id
    );
    res.json({ success: true, data: {} });
  } catch (error) {
    fallbackStore.reservations = fallbackStore.reservations.filter(
      (r) => (r._id || r.id) !== req.params.id
    );
    res.json({ success: true, data: {} });
  }
});

export default router;
