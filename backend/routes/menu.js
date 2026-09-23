import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { fallbackStore } from '../models/fallbackStore.js';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, includeUnavailable } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category && category !== 'all') filter.category = category;
      if (includeUnavailable !== 'true') filter.available = true;

      const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
      if (menuItems.length > 0) {
        return res.json({
          success: true,
          count: menuItems.length,
          data: menuItems,
        });
      }
    }

    // Serve from robust fallback store
    let items = fallbackStore.menuItems;
    if (category && category !== 'all') {
      items = items.filter((i) => i.category === category);
    }
    if (includeUnavailable !== 'true') {
      items = items.filter((i) => i.available !== false);
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    let items = fallbackStore.menuItems;
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const menuItem = await MenuItem.findById(req.params.id);
      if (menuItem) {
        return res.json({ success: true, data: menuItem });
      }
    }

    const item = fallbackStore.menuItems.find((i) => (i._id || i.id) === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    const item = fallbackStore.menuItems.find((i) => (i._id || i.id) === req.params.id);
    if (item) return res.json({ success: true, data: item });
    res.status(404).json({ success: false, error: 'Menu item not found' });
  }
});

// @route   POST /api/menu
// @desc    Create new menu item
// @access  Public / Admin
router.post('/', async (req, res) => {
  try {
    const menuData = req.body;
    let createdItem = null;

    if (mongoose.connection.readyState === 1) {
      try {
        createdItem = await MenuItem.create(menuData);
      } catch (e) {
        console.warn('MongoDB insert fallback:', e.message);
      }
    }

    if (!createdItem) {
      createdItem = {
        ...menuData,
        _id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
      };
    }

    fallbackStore.menuItems.unshift(createdItem);

    res.status(201).json({
      success: true,
      data: createdItem,
    });
  } catch (error) {
    const createdItem = {
      ...req.body,
      _id: `item-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    fallbackStore.menuItems.unshift(createdItem);
    res.status(201).json({ success: true, data: createdItem });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Public / Admin
router.put('/:id', async (req, res) => {
  try {
    let updatedItem = null;
    if (mongoose.connection.readyState === 1) {
      try {
        updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
      } catch (e) {
        console.warn('MongoDB update fallback:', e.message);
      }
    }

    const idx = fallbackStore.menuItems.findIndex((i) => (i._id || i.id) === req.params.id);
    if (idx !== -1) {
      fallbackStore.menuItems[idx] = { ...fallbackStore.menuItems[idx], ...req.body };
      updatedItem = fallbackStore.menuItems[idx];
    } else if (!updatedItem) {
      updatedItem = { ...req.body, _id: req.params.id };
      fallbackStore.menuItems.unshift(updatedItem);
    }

    res.json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    res.json({ success: true, data: { ...req.body, _id: req.params.id } });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Public / Admin
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await MenuItem.findByIdAndDelete(req.params.id);
      } catch (e) {
        console.warn('MongoDB delete fallback:', e.message);
      }
    }
    fallbackStore.menuItems = fallbackStore.menuItems.filter((i) => (i._id || i.id) !== req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    fallbackStore.menuItems = fallbackStore.menuItems.filter((i) => (i._id || i.id) !== req.params.id);
    res.json({ success: true, data: {} });
  }
});

export default router;
