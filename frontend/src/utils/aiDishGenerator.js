// ==========================================================================
// Google Gemini AI Culinary Engine & Dynamic Image Synthesis
// Uses Google Gemini AI with automatic multi-model failover & dynamic photo rendering
// ==========================================================================

/**
 * Built-in Food Science Calorie & Nutrition Heuristics
 */
const CULINARY_KNOWLEDGE_BASE = [
  {
    pattern: /mutton|lamb|gosht|goat/i,
    category: 'biryanis',
    tag: 'Non-Veg',
    spiceLevel: 2,
    basePrice: 380,
    calories: 580,
    protein: '32g',
    carbs: '58g',
    fats: '24g',
    desc: (name) => `Tender succulent pieces of meat slow-cooked with aromatic basmati rice, saffron, and royal Awadhi spices in sealed clay handi.`
  },
  {
    pattern: /chicken biryani|dum biryani|handi biryani/i,
    category: 'biryanis',
    tag: 'Non-Veg',
    spiceLevel: 2,
    basePrice: 320,
    calories: 520,
    protein: '30g',
    carbs: '56g',
    fats: '18g',
    desc: (name) => `Authentic Dum-cooked chicken layered with long-grain aged basmati rice, caramelized birista onions, and fragrant desi ghee.`
  },
  {
    pattern: /veg biryani|pulao|rice|jeera rice/i,
    category: 'biryanis',
    tag: 'Veg',
    spiceLevel: 1,
    basePrice: 240,
    calories: 360,
    protein: '10g',
    carbs: '62g',
    fats: '8g',
    desc: (name) => `Garden-fresh vegetables and fragrant spices slow-steamed with aged basmati rice and royal whole garam masala.`
  },
  {
    pattern: /fried rice|noodles|manchurian rice|schezwan/i,
    category: 'fried-rice-noodles',
    tag: 'Veg',
    spiceLevel: 2,
    basePrice: 220,
    calories: 380,
    protein: '9g',
    carbs: '64g',
    fats: '10g',
    desc: (name) => `Wok-tossed long grain rice with crunchy bell peppers, spring onions, and oriental savory seasoning.`
  },
  {
    pattern: /butter chicken|murgh makhani|tikka masala/i,
    category: 'main-course',
    tag: 'Non-Veg',
    spiceLevel: 1,
    basePrice: 349,
    calories: 460,
    protein: '28g',
    carbs: '14g',
    fats: '32g',
    desc: (name) => `Charcoal-grilled tandoori chicken simmered in a velvety, satin-smooth tomato, cashew, and butter gravy with fenugreek.`
  },
  {
    pattern: /tandoori chicken|chicken kebab|tangdi|tikka/i,
    category: 'starters',
    tag: 'Non-Veg',
    spiceLevel: 2,
    basePrice: 299,
    calories: 340,
    protein: '36g',
    carbs: '6g',
    fats: '18g',
    desc: (name) => `Marinated in spiced Greek yogurt and freshly ground Kashmiri chilies, roasted over burning charcoal embers.`
  },
  {
    pattern: /paneer butter|shahi paneer|kadai paneer|paneer lababdar|paneer tikka masala/i,
    category: 'main-course',
    tag: 'Veg',
    spiceLevel: 2,
    basePrice: 280,
    calories: 410,
    protein: '18g',
    carbs: '16g',
    fats: '30g',
    desc: (name) => `Farm-fresh cottage cheese cubes bathed in a rich, velvety tomato cream gravy infused with roasted cumin and kasuri methi.`
  },
  {
    pattern: /naan|garlic naan|butter naan|roti|kulcha|paratha/i,
    category: 'indian-breads',
    tag: 'Veg',
    spiceLevel: 1,
    basePrice: 60,
    calories: 220,
    protein: '6g',
    carbs: '38g',
    fats: '6g',
    desc: (name) => `Hand-stretched leavened flatbread freshly baked on the inner walls of our high-heat clay tandoor oven.`
  },
  {
    pattern: /lassi|mango lassi|shake|smoothie/i,
    category: 'beverages',
    tag: 'Veg',
    spiceLevel: 1,
    basePrice: 110,
    calories: 210,
    protein: '7g',
    carbs: '34g',
    fats: '5g',
    desc: (name) => `Thick, traditional churned sweet yogurt blended with saffron, cardamom, and topped with malai.`
  },
  {
    pattern: /gulab jamun|rasgulla|halwa|kheer|rabri|cake|lava cake|brownie/i,
    category: 'desserts',
    tag: 'Veg',
    spiceLevel: 1,
    basePrice: 130,
    calories: 290,
    protein: '5g',
    carbs: '48g',
    fats: '9g',
    desc: (name) => `Golden authentic gourmet dessert prepared with rich cardamom and royal sweet flavors.`
  },
];

/**
 * Generates photorealistic AI food photography URL tailored specifically to the dish
 */
export function generateDynamicAIFoodImage(dishName, visualPrompt) {
  const cleanName = (dishName || '').trim();
  if (!cleanName) return '/pictures-restaurant/restaurant-logo.webp';

  const promptText = visualPrompt
    ? `gourmet restaurant food photography of ${visualPrompt}, 4k ultra high resolution, delicious fine dining master chef presentation`
    : `gourmet fine dining restaurant food photography of authentic ${cleanName}, master chef plating on luxury tableware, 4k ultra resolution, appetizing culinary lighting`;

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=800&height=600&nologo=true&seed=${Date.now()}`;
}

/**
 * Robust Google Gemini API caller with multi-model failover
 */
async function callGeminiAPI(dishName, apiKey) {
  const prompt = `You are an expert executive chef and master food scientist.
Analyze the dish: "${dishName}".
Provide exact nutritional energy, macros, category, and restaurant menu specifications in strict JSON format:
{
  "calories": (integer, estimated energy in kcal for standard single serving),
  "protein": "(string with 'g', e.g. '24g')",
  "carbs": "(string with 'g', e.g. '38g')",
  "fats": "(string with 'g', e.g. '18g')",
  "category": "one of: 'starters', 'biryanis', 'fried-rice-noodles', 'main-course', 'indian-breads', 'beverages', 'desserts'",
  "tag": "one of: 'Veg', 'Non-Veg'",
  "spiceLevel": (integer 1 for mild, 2 for medium, 3 for hot),
  "price": (integer estimated price in INR ₹ between 60 and 450),
  "description": "(enticing, appetizing 2-sentence restaurant menu description)",
  "visualPrompt": "(detailed 1-sentence visual description of this exact plated dish for photorealistic culinary food rendering)"
}
Output ONLY raw JSON, no markdown backticks.`;

  const keyToUse = apiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  if (!keyToUse) throw new Error('No Gemini API key provided.');

  const geminiModels = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];

  for (const model of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(keyToUse)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': keyToUse,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) {
          text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(text);
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`Gemini model ${model} attempt notice:`, err.message);
    }
  }

  throw new Error('Gemini API call could not be completed at this time.');
}

/**
 * Built-in Food Science Calorie Calculator
 */
function callBuiltinEngine(dishName) {
  const query = dishName.trim();
  let match = CULINARY_KNOWLEDGE_BASE.find((k) => k.pattern.test(query));
  const isNonVeg = /chicken|mutton|lamb|fish|prawn|egg|gosht|meat|keema|tikka kebab|seekh/i.test(query);

  if (!match) {
    const defaultTag = isNonVeg ? 'Non-Veg' : 'Veg';
    match = {
      category: isNonVeg ? 'main-course' : 'starters',
      tag: defaultTag,
      spiceLevel: 2,
      basePrice: isNonVeg ? 280 : 190,
      calories: isNonVeg ? 420 : 310,
      protein: isNonVeg ? '26g' : '12g',
      carbs: isNonVeg ? '24g' : '42g',
      fats: isNonVeg ? '22g' : '14g',
      desc: () => `Chef's special ${query} prepared with traditional spices, slow-cooked to perfection with rich aromatic flavors.`
    };
  }

  return {
    calories: match.calories,
    protein: match.protein,
    carbs: match.carbs,
    fats: match.fats,
    category: match.category,
    tag: match.tag,
    spiceLevel: match.spiceLevel,
    price: match.basePrice,
    description: typeof match.desc === 'function' ? match.desc(query) : match.desc,
    visualPrompt: `authentic ${query} fine dining restaurant presentation`,
  };
}

/**
 * Main Gemini AI Profile Dispatcher
 * Pure dynamic AI image generation & precise calorie calculation
 */
export const generateDishAIProfile = async (dishName, customApiKey = '') => {
  const query = (dishName || '').trim();
  if (!query) {
    throw new Error('Please enter a dish name to generate with AI.');
  }

  const activeKey = (
    customApiKey ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' && localStorage.getItem('tastybite_gemini_key')) ||
    ''
  ).trim();

  let result = null;

  try {
    if (activeKey) {
      result = await callGeminiAPI(query, activeKey);
    } else {
      result = callBuiltinEngine(query);
    }
  } catch (err) {
    console.warn(`Falling back to built-in culinary science engine:`, err.message);
    result = callBuiltinEngine(query);
  }

  // Generate 100% dynamic AI image
  const dishImage = generateDynamicAIFoodImage(query, result.visualPrompt);

  return {
    name: query,
    description: result.description || `Special ${query} cooked with authentic spices.`,
    price: Number(result.price) || 249,
    category: result.category || 'starters',
    tag: result.tag === 'Non-Veg' ? 'Non-Veg' : 'Veg',
    spiceLevel: Number(result.spiceLevel) || 2,
    calories: Number(result.calories) || 350,
    protein: result.protein || '15g',
    carbs: result.carbs || '35g',
    fats: result.fats || '15g',
    image: dishImage,
  };
};
