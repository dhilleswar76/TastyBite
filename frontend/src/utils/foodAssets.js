// ==========================================================================
// Complete registry of authentic restaurant food images stored in /pictures-restaurant/
// ==========================================================================

export const RESTAURANT_FOOD_ASSETS = [
  // --- STARTERS (VEG) ---
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    file: '/pictures-restaurant/Paneer-Tikka.webp',
    category: 'starters',
    tag: 'Veg',
    keywords: ['paneer tikka', 'tikka', 'paneer', 'cottage cheese', 'tandoori paneer', 'kebab', 'starter', 'paneer starter', 'malai paneer', 'achari paneer', 'hariyali paneer', 'paneer kebab'],
  },
  {
    id: 'paneer-65',
    name: 'Paneer 65',
    file: '/pictures-restaurant/paneer-65.webp',
    category: 'starters',
    tag: 'Veg',
    keywords: ['paneer 65', 'chilli paneer', 'spicy paneer', 'paneer fry', 'paneer chilli', 'crispy paneer', 'dry paneer'],
  },
  {
    id: 'veg-spring-rolls',
    name: 'Veg Spring Rolls',
    file: '/pictures-restaurant/vegetable-spring-rolls.webp',
    category: 'starters',
    tag: 'Veg',
    keywords: ['spring roll', 'spring rolls', 'veg roll', 'roll', 'crispy roll', 'chinese', 'appetizer', 'snack', 'dimsum', 'momos', 'wonton'],
  },
  {
    id: 'crispy-corn',
    name: 'Crispy Corn',
    file: '/pictures-restaurant/crispy-corn.webp',
    category: 'starters',
    tag: 'Veg',
    keywords: ['crispy corn', 'corn', 'sweet corn', 'fried corn', 'peri peri corn', 'pepper corn', 'starter', 'baby corn', 'crispy baby corn', 'corn fry'],
  },
  {
    id: 'gobi-manchurian',
    name: 'Gobi Manchurian',
    file: '/pictures-restaurant/gobi-manchurian.webp',
    category: 'starters',
    tag: 'Veg',
    keywords: ['gobi manchurian', 'gobi', 'manchurian', 'cauliflower', 'chilli gobi', 'chinese starter', 'veg manchurian', 'mushroom manchurian', 'chilli mushroom'],
  },

  // --- STARTERS (NON-VEG) ---
  {
    id: 'chicken-65',
    name: 'Chicken 65',
    file: '/pictures-restaurant/chicken-65.webp',
    category: 'starters',
    tag: 'Non-Veg',
    keywords: ['chicken 65', 'chilli chicken', 'chicken fry', 'hyderabadi 65', 'spicy chicken', 'chicken starter', 'chicken lollipop', 'crispy chicken', 'chicken pepper fry', 'dragon chicken'],
  },
  {
    id: 'tandoori-chicken',
    name: 'Tandoori Chicken',
    file: '/pictures-restaurant/tandoori-chicken.webp',
    category: 'starters',
    tag: 'Non-Veg',
    keywords: ['tandoori chicken', 'tandoori', 'chicken kebab', 'roast chicken', 'chicken leg', 'clay oven', 'tangdi kebab', 'murgh tandoori', 'chicken tikka', 'reshmi kebab', 'malai kebab', 'kebab', 'seekh kebab', 'chicken wings'],
  },

  // --- BIRYANIS ---
  {
    id: 'chicken-dum-biryani',
    name: 'Chicken Dum Biryani',
    file: '/pictures-restaurant/chicken-dum-biryani.webp',
    category: 'biryanis',
    tag: 'Non-Veg',
    keywords: ['chicken dum biryani', 'chicken biryani', 'biryani', 'dum biryani', 'hyderabadi biryani', 'handi biryani', 'spicy biryani', 'murgh biryani', 'special chicken biryani', 'awadhi biryani'],
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Dum Biryani',
    file: '/pictures-restaurant/MuttonBiryani.webp',
    category: 'biryanis',
    tag: 'Non-Veg',
    keywords: ['mutton biryani', 'mutton dum biryani', 'mutton', 'lamb biryani', 'gosht', 'shahi mutton', 'goat biryani', 'mutton handi', 'kacchi biryani', 'mutton pulao'],
  },
  {
    id: 'veg-biryani',
    name: 'Royal Veg Biryani',
    file: '/pictures-restaurant/veg-biryani.webp',
    category: 'biryanis',
    tag: 'Veg',
    keywords: ['veg biryani', 'vegetable biryani', 'pulao', 'dum rice', 'peas pulao', 'paneer biryani', 'mushroom biryani', 'jeera rice', 'steamed rice', 'ghee rice', 'basmati', 'veg pulao'],
  },

  // --- FRIED RICE & NOODLES ---
  {
    id: 'veg-fried-rice',
    name: 'Veg Fried Rice',
    file: '/pictures-restaurant/veg-fried-rice.webp',
    category: 'fried-rice-noodles',
    tag: 'Veg',
    keywords: ['veg fried rice', 'fried rice', 'schezwan rice', 'chinese rice', 'wok rice', 'noodles', 'hakka noodles', 'veg noodles', 'schezwan noodles', 'chowmein'],
  },
  {
    id: 'chicken-fried-rice',
    name: 'Chicken Fried Rice',
    file: '/pictures-restaurant/chicken-fried-rice.webp',
    category: 'fried-rice-noodles',
    tag: 'Non-Veg',
    keywords: ['chicken fried rice', 'egg fried rice', 'chicken rice', 'wok chicken rice', 'schezwan chicken rice', 'chicken noodles', 'egg noodles', 'mixed fried rice'],
  },

  // --- MAIN COURSE (CURRIES & GRAVIES) ---
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    file: '/pictures-restaurant/paneer-butter-masala.webp',
    category: 'main-course',
    tag: 'Veg',
    keywords: ['paneer butter masala', 'butter masala', 'shahi paneer', 'paneer gravy', 'curry', 'paneer curry', 'kadai paneer', 'paneer lababdar', 'palak paneer', 'dal makhani', 'dal tadka', 'dal', 'mixed veg curry', 'veg korma', 'malai kofta', 'navratan korma'],
  },
  {
    id: 'butter-chicken',
    name: 'Royal Butter Chicken',
    file: '/pictures-restaurant/butter-chicken.webp',
    category: 'main-course',
    tag: 'Non-Veg',
    keywords: ['butter chicken', 'murgh makhani', 'chicken curry', 'chicken gravy', 'tikka masala', 'chicken tikka masala', 'curry', 'chicken main', 'kadai chicken', 'mutton curry', 'rogan josh', 'chicken masala', 'fish curry', 'prawns curry'],
  },

  // --- INDIAN BREADS ---
  {
    id: 'butter-naan',
    name: 'Butter Naan',
    file: '/pictures-restaurant/Butter-Naan-3.webp',
    category: 'indian-breads',
    tag: 'Veg',
    keywords: ['butter naan', 'naan', 'roti', 'tandoori roti', 'bread', 'kulcha', 'plain naan', 'rumali roti', 'paratha', 'lachha paratha', 'butter roti'],
  },
  {
    id: 'garlic-naan',
    name: 'Garlic Herb Naan',
    file: '/pictures-restaurant/Homemade-Garlic-Naan-72-dpi.webp',
    category: 'indian-breads',
    tag: 'Veg',
    keywords: ['garlic naan', 'garlic bread', 'herb naan', 'coriander naan', 'cheese naan', 'chilli garlic naan', 'pudina paratha', 'stuffed naan'],
  },

  // --- BEVERAGES ---
  {
    id: 'punjabi-lassi',
    name: 'Punjabi Sweet Lassi',
    file: '/pictures-restaurant/Punjabi-Sweet-Lassi-Drink-Recipe.webp',
    category: 'beverages',
    tag: 'Veg',
    keywords: ['lassi', 'sweet lassi', 'mango lassi', 'curd drink', 'yogurt drink', 'beverage', 'drink', 'shake', 'smoothie', 'mango shake', 'mojito', 'mint cooler', 'lemonade', 'mocktail'],
  },
  {
    id: 'masala-chai',
    name: 'Royal Masala Chai',
    file: '/pictures-restaurant/Chai_Masala_Tea.webp',
    category: 'beverages',
    tag: 'Veg',
    keywords: ['chai', 'tea', 'masala chai', 'coffee', 'hot drink', 'kadak chai', 'beverage', 'filter coffee', 'cappuccino', 'green tea'],
  },

  // --- DESSERTS ---
  {
    id: 'gulab-jamun',
    name: 'Shahi Gulab Jamun',
    file: '/pictures-restaurant/gulab-jamun.webp',
    category: 'desserts',
    tag: 'Veg',
    keywords: ['gulab jamun', 'jamun', 'mithai', 'sweet', 'dessert', 'rabri', 'rasgulla', 'rasmalai', 'kheer', 'halwa', 'gajar halwa', 'motichoor'],
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    file: '/pictures-restaurant/chocolate-lava-cake.webp',
    category: 'desserts',
    tag: 'Veg',
    keywords: ['chocolate lava cake', 'lava cake', 'cake', 'chocolate', 'pastry', 'brownie', 'ice cream', 'dessert', 'sundae', 'chocolate mousse', 'pudding'],
  },
];

/**
 * Intelligent Multi-Token Semantic Matching Algorithm
 * Returns top-scored local restaurant photo
 */
export const smartMatchDishImage = (dishName = '', category = '', tag = '') => {
  const choices = getMatchingFoodPhotoChoices(dishName, category, tag);
  return choices[0]?.file || RESTAURANT_FOOD_ASSETS[0].file;
};

/**
 * Returns Top 3-4 High-Resolution Food Photo Choices
 * Allows 1-click thumbnail selection in the Admin Modal
 */
export const getMatchingFoodPhotoChoices = (dishName = '', category = '', tag = '') => {
  const query = (dishName || '').toLowerCase().trim();
  const queryWords = query.split(/[\s,_\-]+/).filter((w) => w.length > 1);

  const scored = RESTAURANT_FOOD_ASSETS.map((asset) => {
    let score = 0;
    const assetNameLower = asset.name.toLowerCase();

    // Direct name matching
    if (query && query === assetNameLower) {
      score += 200;
    } else if (query && (query.includes(assetNameLower) || assetNameLower.includes(query))) {
      score += 100;
    }

    // Keyword matching
    for (const kw of asset.keywords) {
      const kwLower = kw.toLowerCase();
      if (query && query === kwLower) {
        score += 120;
      } else if (query && query.includes(kwLower)) {
        score += kwLower.length * 8;
      } else if (query && kwLower.includes(query)) {
        score += query.length * 6;
      } else {
        for (const word of queryWords) {
          if (kwLower.split(' ').includes(word)) {
            score += word.length * 4;
          }
        }
      }
    }

    // Category matching
    if (category && asset.category === category) {
      score += 20;
    }

    // Tag matching (Veg vs Non-Veg)
    if (tag && asset.tag === tag) {
      score += 10;
    }

    return { ...asset, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Return top 4 distinct choices
  const topChoices = scored.slice(0, 4);

  // If score is 0, provide top category choices
  if (topChoices[0].score <= 0 && category) {
    const categoryMatches = RESTAURANT_FOOD_ASSETS.filter((a) => a.category === category);
    if (categoryMatches.length > 0) {
      return categoryMatches.slice(0, 4);
    }
  }

  return topChoices;
};
