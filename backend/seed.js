import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';

dotenv.config();

// Menu data mirrored from frontend/src/data/menuData.js
const menuItems = [
  { category: 'starters', name: 'Paneer Tikka', description: 'Marinated cottage cheese cubes grilled in tandoor.', price: 249, image: '/pictures-restaurant/Paneer-Tikka.png', tag: 'Veg' },
  { category: 'starters', name: 'Veg Spring Rolls', description: 'Crispy rolls stuffed with spiced vegetables.', price: 199, image: '/pictures-restaurant/vegetable-spring-rolls.png', tag: 'Veg' },
  { category: 'starters', name: 'Crispy Corn', description: 'Golden fried corn tossed with herbs & spices.', price: 189, image: '/pictures-restaurant/crispy-corn.png', tag: 'Veg' },
  { category: 'starters', name: 'Gobi Manchurian', description: 'Crispy cauliflower florets in Indo-Chinese sauce.', price: 199, image: '/pictures-restaurant/gobi-manchurian.png', tag: 'Veg' },
  { category: 'starters', name: 'Paneer 65', description: 'South-Indian style spicy paneer starter.', price: 229, image: '/pictures-restaurant/paneer-65.png', tag: 'Veg' },
  { category: 'starters', name: 'Chicken 65', description: 'Spicy deep-fried chicken with curry leaves.', price: 249, image: '/pictures-restaurant/chicken-65.png', tag: 'Non-Veg' },
  { category: 'starters', name: 'Tandoori Chicken', description: 'Classic tandoor roasted chicken with spices.', price: 329, image: '/pictures-restaurant/tandoori-chicken.png', tag: 'Non-Veg' },
  { category: 'biryanis', name: 'Chicken Dum Biryani', description: 'Hyderabadi style slow cooked biryani.', price: 299, image: '/pictures-restaurant/chicken-dum-biryani.webp', tag: 'Non-Veg' },
  { category: 'biryanis', name: 'Mutton Biryani', description: 'Tender mutton cooked with aromatic rice.', price: 349, image: '/pictures-restaurant/MuttonBiryani.webp', tag: 'Non-Veg' },
  { category: 'biryanis', name: 'Veg Biryani', description: 'Spiced basmati rice with vegetables.', price: 239, image: '/pictures-restaurant/veg-biryani.webp', tag: 'Veg' },
  { category: 'fried-rice-noodles', name: 'Veg Fried Rice', description: 'Stir-fried rice with vegetables.', price: 199, image: '/pictures-restaurant/veg-fried-rice.webp', tag: 'Veg' },
  { category: 'fried-rice-noodles', name: 'Chicken Fried Rice', description: 'Fried rice tossed with chicken.', price: 249, image: '/pictures-restaurant/chicken-fried-rice.webp', tag: 'Non-Veg' },
  { category: 'main-course', name: 'Paneer Butter Masala', description: 'Rich creamy tomato gravy with paneer.', price: 269, image: '/pictures-restaurant/paneer-butter-masala.webp', tag: 'Veg' },
  { category: 'main-course', name: 'Butter Chicken', description: 'Smoky chicken in buttery tomato gravy.', price: 329, image: '/pictures-restaurant/butter-chicken.webp', tag: 'Non-Veg' },
  { category: 'indian-breads', name: 'Butter Naan', description: 'Soft tandoor baked naan.', price: 49, image: '/pictures-restaurant/Butter-Naan-3.webp', tag: '' },
  { category: 'indian-breads', name: 'Garlic Naan', description: 'Naan topped with garlic & coriander.', price: 69, image: '/pictures-restaurant/Homemade-Garlic-Naan-72-dpi.webp', tag: '' },
  { category: 'beverages', name: 'Sweet Lassi', description: 'Traditional yogurt based drink.', price: 99, image: '/pictures-restaurant/Punjabi-Sweet-Lassi-Drink-Recipe.webp', tag: '' },
  { category: 'beverages', name: 'Masala Tea', description: 'Indian spiced milk tea.', price: 49, image: '/pictures-restaurant/Chai_Masala_Tea.webp', tag: '' },
  { category: 'desserts', name: 'Gulab Jamun', description: 'Soft milk dumplings in sugar syrup.', price: 99, image: '/pictures-restaurant/gulab-jamun.webp', tag: '' },
  { category: 'desserts', name: 'Chocolate Lava Cake', description: 'Warm cake with molten chocolate center.', price: 149, image: '/pictures-restaurant/chocolate-lava-cake.webp', tag: '' },
];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing menu items
    await MenuItem.deleteMany();
    console.log('Cleared existing menu items');

    // Insert menu items with available: true
    const itemsToInsert = menuItems.map(item => ({ ...item, available: true }));
    await MenuItem.insertMany(itemsToInsert);
    console.log(`Seeded ${itemsToInsert.length} menu items successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedMenu();
