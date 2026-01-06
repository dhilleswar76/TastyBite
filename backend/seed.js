import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Read menu data from frontend
const menuDataPath = join(__dirname, '../frontend/src/data/menuData.js');
const menuDataContent = readFileSync(menuDataPath, 'utf-8');
const menuItemsMatch = menuDataContent.match(/export const menuItems = (\[[\s\S]*?\]);/);
const menuItems = menuItemsMatch ? eval(menuItemsMatch[1]) : [];

const seedMenu = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing menu items
    await MenuItem.deleteMany();
    console.log('Cleared existing menu items');

    // Transform menuData to match schema
    const transformedItems = menuItems.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      tag: item.tag,
      available: true,
    }));

    // Insert menu items
    await MenuItem.insertMany(transformedItems);
    console.log('Menu items seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedMenu();
