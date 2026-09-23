import express from 'express';
import Contact from '../models/Contact.js';
import { fallbackStore } from '../models/fallbackStore.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message
// @access  Public
router.post('/', async (req, res) => {
  try {
    let contact = null;
    if (mongoose.connection.readyState === 1) {
      try {
        contact = await Contact.create(req.body);
      } catch (e) {
        console.warn('MongoDB contact insert notice:', e.message);
      }
    }

    if (!contact) {
      contact = {
        ...req.body,
        _id: `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: req.body.status || 'unread',
        createdAt: new Date().toISOString(),
      };
    }

    fallbackStore.contacts.unshift(contact);

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    const contact = {
      ...req.body,
      _id: `con-${Date.now()}`,
      status: req.body.status || 'unread',
      createdAt: new Date().toISOString(),
    };
    fallbackStore.contacts.unshift(contact);
    res.status(201).json({ success: true, data: contact });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Public / Admin
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;

      const contacts = await Contact.find(filter).sort({ createdAt: -1 });
      if (contacts.length > 0) {
        return res.json({
          success: true,
          count: contacts.length,
          data: contacts,
        });
      }
    }

    let list = fallbackStore.contacts;
    if (status && status !== 'all') list = list.filter((c) => c.status === status);

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.json({
      success: true,
      count: fallbackStore.contacts.length,
      data: fallbackStore.contacts,
    });
  }
});

export default router;
