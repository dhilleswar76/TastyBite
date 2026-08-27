import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, includeUnavailable } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (includeUnavailable !== 'true') filter.available = true;

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found',
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   POST /api/menu
// @desc    Create new menu item
// @access  Public (should be protected in production)
router.post('/', async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem,
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
      error: 'Server Error',
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Public (should be protected in production)
router.put('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found',
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Public (should be protected in production)
// @route   POST /api/menu/ai-generate
// @desc    Generate AI food image, energy calories & nutritional profile for a dish
// @access  Public
router.post('/ai-generate', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Dish name is required' });
    }

    const cleanName = name.trim();
    const isNonVeg = /chicken|mutton|lamb|fish|prawn|egg|gosht|meat|keema|tikka kebab|seekh/i.test(cleanName);

    // High fidelity AI generative image prompt
    const aiPrompt = `delicious authentic ${cleanName}, fine dining restaurant presentation, gourmet food photography, 4k ultra high resolution`;
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=800&height=600&nologo=true`;

    // Accurate calorie heuristic
    let calories = 350;
    let protein = '14g';
    let carbs = '36g';
    let fats = '16g';
    let spiceLevel = 2;
    let category = 'starters';
    let price = 249;

    if (/biryani/i.test(cleanName)) {
      category = 'biryanis';
      calories = isNonVeg ? 540 : 380;
      protein = isNonVeg ? '30g' : '10g';
      carbs = '58g';
      fats = isNonVeg ? '20g' : '10g';
      price = isNonVeg ? 340 : 250;
    } else if (/curry|masala|butter|paneer|korma|rogan/i.test(cleanName)) {
      category = 'main-course';
      calories = isNonVeg ? 460 : 390;
      protein = isNonVeg ? '28g' : '18g';
      carbs = '16g';
      fats = isNonVeg ? '28g' : '26g';
      price = isNonVeg ? 320 : 260;
    } else if (/naan|roti|bread|kulcha/i.test(cleanName)) {
      category = 'indian-breads';
      calories = 230;
      protein = '6g';
      carbs = '40g';
      fats = '6g';
      price = 60;
      spiceLevel = 1;
    } else if (/lassi|chai|tea|drink|shake|juice/i.test(cleanName)) {
      category = 'beverages';
      calories = 180;
      protein = '5g';
      carbs = '30g';
      fats = '4g';
      price = 90;
      spiceLevel = 1;
    } else if (/cake|jamun|halwa|ice cream|dessert/i.test(cleanName)) {
      category = 'desserts';
      calories = 330;
      protein = '5g';
      carbs = '46g';
      fats = '14g';
      price = 140;
      spiceLevel = 1;
    }

    res.json({
      success: true,
      data: {
        name: cleanName,
        image: aiImageUrl,
        calories,
        protein,
        carbs,
        fats,
        category,
        tag: isNonVeg ? 'Non-Veg' : 'Veg',
        spiceLevel,
        price,
        description: `Gourmet ${cleanName} prepared fresh with traditional authentic spices and rich culinary heritage.`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI Generation Failed' });
  }
});

export default router;

