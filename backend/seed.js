import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';

dotenv.config();

// Menu seed data
const menuItems = [
  {
    category: 'starters',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled in tandoor.',
    price: 249,
    image: '/pictures-restaurant/Paneer-Tikka.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Veg Spring Rolls',
    description: 'Crispy rolls stuffed with spiced vegetables.',
    price: 199,
    image: '/pictures-restaurant/vegetable-spring-rolls.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Crispy Corn',
    description: 'Golden fried corn tossed with herbs & spices.',
    price: 189,
    image: '/pictures-restaurant/crispy-corn.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Gobi Manchurian',
    description: 'Crispy cauliflower florets in Indo-Chinese sauce.',
    price: 199,
    image: '/pictures-restaurant/gobi-manchurian.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Paneer 65',
    description: 'Spicy South-Indian style crispy fried paneer.',
    price: 229,
    image: '/pictures-restaurant/paneer-65.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Chicken 65',
    description: 'Iconic deep-fried spiced chicken with curry leaves.',
    price: 249,
    image: '/pictures-restaurant/chicken-65.webp',
    tag: 'Non-Veg',
    customizable: false,
  },
  {
    category: 'starters',
    name: 'Tandoori Chicken',
    description: 'Whole chicken leg pieces marinated in spiced yogurt.',
    price: 329,
    image: '/pictures-restaurant/tandoori-chicken.webp',
    tag: 'Non-Veg',
    customizable: false,
  },
  {
    category: 'biryanis',
    name: 'Chicken Dum Biryani',
    description: 'Authentic Hyderabadi dum biryani with fragrant basmati rice.',
    price: 299,
    image: '/pictures-restaurant/chicken-dum-biryani.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Flavorful', 'Medium Spiced', 'Hot Hyderabadi'],
      addOns: [
        { id: 'boiled-egg', name: 'Boiled Spiced Egg', price: 25, icon: '🥚' },
        { id: 'salan-gravy', name: 'Extra Mirchi Ka Salan Gravy', price: 40, icon: '🍲' },
        { id: 'raita-pot', name: 'Thick Spiced Onion Raita', price: 30, icon: '🥣' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'biryanis',
    name: 'Mutton Biryani',
    description: 'Slow-cooked tender mutton layered with aromatic basmati rice.',
    price: 349,
    image: '/pictures-restaurant/MuttonBiryani.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Medium Spiced', 'Royal Dum Hot', 'Fiery Hyderabadi'],
      addOns: [
        { id: 'extra-mutton-cut', name: 'Extra Tender Mutton Chunk', price: 110, icon: '🥩' },
        { id: 'boiled-egg', name: 'Boiled Spiced Egg', price: 25, icon: '🥚' },
        { id: 'raita-pot', name: 'Cucumber Mint Raita', price: 30, icon: '🥣' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'biryanis',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with spiced garden vegetables.',
    price: 239,
    image: '/pictures-restaurant/veg-biryani.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'fried-rice-noodles',
    name: 'Veg Fried Rice',
    description: 'Wok-tossed rice with vegetables and Asian spices.',
    price: 199,
    image: '/pictures-restaurant/veg-fried-rice.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'fried-rice-noodles',
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with juicy chicken and egg.',
    price: 249,
    image: '/pictures-restaurant/chicken-fried-rice.webp',
    tag: 'Non-Veg',
    customizable: false,
  },
  {
    category: 'main-course',
    name: 'Paneer Butter Masala',
    description: 'Paneer cubes in a rich, creamy tomato and butter gravy.',
    price: 269,
    image: '/pictures-restaurant/paneer-butter-masala.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'main-course',
    name: 'Butter Chicken',
    description: 'Tandoori chicken in a silky smooth tomato makhani gravy.',
    price: 329,
    image: '/pictures-restaurant/butter-chicken.webp',
    tag: 'Non-Veg',
    customizable: false,
  },
  {
    category: 'indian-breads',
    name: 'Butter Naan',
    description: 'Soft leavened tandoor bread brushed with pure butter.',
    price: 49,
    image: '/pictures-restaurant/Butter-Naan-3.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'indian-breads',
    name: 'Garlic Naan',
    description: 'Tandoor naan topped with minced garlic and fresh herbs.',
    price: 69,
    image: '/pictures-restaurant/Homemade-Garlic-Naan-72-dpi.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'beverages',
    name: 'Sweet Lassi',
    description: 'Thick, chilled sweet yogurt drink with cardamom.',
    price: 99,
    image: '/pictures-restaurant/Punjabi-Sweet-Lassi-Drink-Recipe.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'beverages',
    name: 'Masala Chai',
    description: 'Aromatic Indian spiced tea with ginger and cardamom.',
    price: 49,
    image: '/pictures-restaurant/Chai_Masala_Tea.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'desserts',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings soaked in aromatic rose syrup.',
    price: 99,
    image: '/pictures-restaurant/gulab-jamun.webp',
    tag: 'Veg',
    customizable: false,
  },
  {
    category: 'desserts',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten chocolate center.',
    price: 149,
    image: '/pictures-restaurant/chocolate-lava-cake.webp',
    tag: 'Veg',
    customizable: false,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('No MONGODB_URI found in environment, skipping database seed.');
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');
    await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${menuItems.length} menu items!`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

seedDB();
