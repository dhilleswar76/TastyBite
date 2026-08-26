import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';

dotenv.config();

// Menu data with item-specific customizations
const menuItems = [
  {
    category: 'starters',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled in tandoor.',
    price: 249,
    image: '/pictures-restaurant/Paneer-Tikka.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { id: 'mint-chutney', name: 'Extra Mint Chutney Dip', price: 20, icon: '🌿' },
        { id: 'cheese-grate', name: 'Grated Amul Cheese', price: 40, icon: '🧀' },
        { id: 'lemon-wedges', name: 'Spiced Masala Lemon Wedges', price: 15, icon: '🍋' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Veg Spring Rolls',
    description: 'Crispy rolls stuffed with spiced vegetables.',
    price: 199,
    image: '/pictures-restaurant/vegetable-spring-rolls.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Crisp', 'Medium Spicy', 'Extra Crispy & Hot'],
      addOns: [
        { id: 'sweet-chili', name: 'Extra Sweet Chili Sauce', price: 20, icon: '🌶️' },
        { id: 'mayo-dip', name: 'Garlic Mayo Dip', price: 25, icon: '🧄' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Crispy Corn',
    description: 'Golden fried corn tossed with herbs & spices.',
    price: 189,
    image: '/pictures-restaurant/crispy-corn.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Tangy', 'Classic Medium', 'Peri-Peri Extra Hot'],
      addOns: [
        { id: 'cheese-dust', name: 'Cheese Seasoning Dust', price: 30, icon: '🧀' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Gobi Manchurian',
    description: 'Crispy cauliflower florets in Indo-Chinese sauce.',
    price: 199,
    image: '/pictures-restaurant/gobi-manchurian.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Glaze', 'Medium Tangy', 'Hot Chili Style'],
      addOns: [
        { id: 'extra-gravy-m', name: 'Extra Manchurian Gravy', price: 35, icon: '🍲' },
        { id: 'fried-garlic', name: 'Crunchy Fried Garlic Chips', price: 20, icon: '🧄' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Paneer 65',
    description: 'South-Indian style spicy paneer starter.',
    price: 229,
    image: '/pictures-restaurant/paneer-65.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Medium', 'Hot', 'Fiery Andhra Style'],
      addOns: [
        { id: 'curry-tadka', name: 'Extra Fried Curry Leaves Tadka', price: 15, icon: '🍃' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken with curry leaves.',
    price: 249,
    image: '/pictures-restaurant/chicken-65.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Medium', 'Hot', 'Gunpowder Spicy'],
      addOns: [
        { id: 'boneless-extra', name: 'Extra Boneless Chicken Chunks', price: 60, icon: '🍗' },
        { id: 'curry-tadka', name: 'Extra Fried Curry Leaves Tadka', price: 15, icon: '🍃' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'starters',
    name: 'Tandoori Chicken',
    description: 'Classic tandoor roasted chicken with spices.',
    price: 329,
    image: '/pictures-restaurant/tandoori-chicken.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Roasted', 'Medium Classic', 'Extra Smoky & Spiced'],
      addOns: [
        { id: 'tandoor-butter', name: 'Brushed Garlic Butter', price: 30, icon: '🧈' },
        { id: 'mint-sauce', name: 'Royal Green Mint Chutney', price: 20, icon: '🌿' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'biryanis',
    name: 'Chicken Dum Biryani',
    description: 'Hyderabadi style slow cooked biryani.',
    price: 299,
    image: '/pictures-restaurant/chicken-dum-biryani.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Flavorful', 'Medium Spiced', 'Hot Hyderabadi', 'Extra Spicy Zaffrani'],
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
    description: 'Tender mutton cooked with aromatic rice.',
    price: 349,
    image: '/pictures-restaurant/MuttonBiryani.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Medium', 'Hot', 'Royal Lucknowi Dum', 'Fiery Hyderabadi'],
      addOns: [
        { id: 'extra-mutton-cut', name: 'Extra Tender Mutton Chunk', price: 110, icon: '🥩' },
        { id: 'boiled-egg', name: 'Boiled Spiced Egg', price: 25, icon: '🥚' },
        { id: 'salan-gravy', name: 'Extra Mirchi Ka Salan Gravy', price: 40, icon: '🍲' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'biryanis',
    name: 'Veg Biryani',
    description: 'Spiced basmati rice with vegetables.',
    price: 239,
    image: '/pictures-restaurant/veg-biryani.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild', 'Medium', 'Spicy Dum'],
      addOns: [
        { id: 'paneer-cubes', name: 'Extra Roasted Paneer Cubes', price: 50, icon: '🧀' },
        { id: 'salan-gravy', name: 'Mirchi Ka Salan Gravy', price: 40, icon: '🍲' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'fried-rice-noodles',
    name: 'Veg Fried Rice',
    description: 'Stir-fried rice with vegetables.',
    price: 199,
    image: '/pictures-restaurant/veg-fried-rice.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Non-Spicy', 'Medium Szechuan', 'Fiery Red Chili'],
      addOns: [
        { id: 'mushrooms', name: 'Stir-Fried Button Mushrooms', price: 45, icon: '🍄' },
        { id: 'schezwan-sauce', name: 'House Schezwan Sauce', price: 25, icon: '🌶️' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'fried-rice-noodles',
    name: 'Chicken Fried Rice',
    description: 'Fried rice tossed with chicken.',
    price: 249,
    image: '/pictures-restaurant/chicken-fried-rice.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild', 'Medium Classic', 'Extra Spicy Dragon Style'],
      addOns: [
        { id: 'fried-egg', name: 'Sunny Side Fried Egg on Top', price: 30, icon: '🍳' },
        { id: 'extra-chicken-wok', name: 'Extra Shredded Chicken', price: 55, icon: '🍗' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'main-course',
    name: 'Paneer Butter Masala',
    description: 'Rich creamy tomato gravy with paneer.',
    price: 269,
    image: '/pictures-restaurant/paneer-butter-masala.webp',
    tag: 'Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Sweet-Rich', 'Medium Spiced', 'Extra Spicy Masala'],
      addOns: [
        { id: 'butter-dollop', name: 'Extra Dollop of Amul Butter', price: 20, icon: '🧈' },
        { id: 'extra-cream', name: 'Fresh Malai Cream Swirl', price: 25, icon: '🥛' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'main-course',
    name: 'Butter Chicken',
    description: 'Smoky chicken in buttery tomato gravy.',
    price: 329,
    image: '/pictures-restaurant/butter-chicken.webp',
    tag: 'Non-Veg',
    customizable: true,
    customization: {
      type: 'spicy',
      options: ['Mild Creamy', 'Medium Royal', 'Spicy Delhi Style'],
      addOns: [
        { id: 'extra-boneless-bc', name: 'Extra Tandoori Chicken Tikka', price: 75, icon: '🍗' },
        { id: 'butter-dollop', name: 'Extra Dollop of Amul Butter', price: 20, icon: '🧈' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'indian-breads',
    name: 'Butter Naan',
    description: 'Soft tandoor baked naan.',
    price: 49,
    image: '/pictures-restaurant/Butter-Naan-3.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'none',
      options: ['Crispy Well-Done', 'Soft & Fluffy'],
      addOns: [
        { id: 'desi-ghee', name: 'Brushed with Pure Desi Ghee', price: 20, icon: '🧈' },
        { id: 'cheese-stuffed', name: 'Stuffed Molten Cheese', price: 45, icon: '🧀' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'indian-breads',
    name: 'Garlic Naan',
    description: 'Naan topped with garlic & coriander.',
    price: 69,
    image: '/pictures-restaurant/Homemade-Garlic-Naan-72-dpi.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'none',
      options: ['Crispy Well-Done', 'Soft & Fluffy'],
      addOns: [
        { id: 'chili-garlic', name: 'Extra Green Chili & Garlic', price: 20, icon: '🌶️' },
        { id: 'cheese-stuffed', name: 'Stuffed Molten Cheese', price: 45, icon: '🧀' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'beverages',
    name: 'Sweet Lassi',
    description: 'Traditional yogurt based drink.',
    price: 99,
    image: '/pictures-restaurant/Punjabi-Sweet-Lassi-Drink-Recipe.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'sweet',
      options: ['Low Sugar', 'Standard Sweet', 'Extra Sweet', 'Sugar-Free (Stevia)'],
      addOns: [
        { id: 'dry-fruits-crush', name: 'Crushed Almonds & Pistachios', price: 35, icon: '🌰' },
        { id: 'malai-layer', name: 'Thick Fresh Malai Top', price: 25, icon: '🥛' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'beverages',
    name: 'Masala Tea',
    description: 'Indian spiced milk tea.',
    price: 49,
    image: '/pictures-restaurant/Chai_Masala_Tea.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'sweet',
      options: ['Without Sugar', 'Mild Sweet', 'Normal Sweet', 'Extra Sweet'],
      addOns: [
        { id: 'kadak-ginger', name: 'Extra Kadak Crushed Ginger', price: 10, icon: '🫚' },
        { id: 'cardamom-boost', name: 'Crushed Green Cardamom (Elaichi)', price: 15, icon: '🌿' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'desserts',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings in sugar syrup.',
    price: 99,
    image: '/pictures-restaurant/gulab-jamun.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'temperature',
      options: ['Served Piping Hot', 'Warm', 'Room Temperature'],
      addOns: [
        { id: 'icecream-vanilla', name: 'Scoop of Vanilla Ice Cream', price: 50, icon: '🍨' },
        { id: 'pista-slivers', name: 'Roasted Pistachio Slivers', price: 25, icon: '🌰' }
      ],
      allowsNotes: true
    }
  },
  {
    category: 'desserts',
    name: 'Chocolate Lava Cake',
    description: 'Warm cake with molten chocolate center.',
    price: 149,
    image: '/pictures-restaurant/chocolate-lava-cake.webp',
    tag: '',
    customizable: true,
    customization: {
      type: 'temperature',
      options: ['Served Fresh & Warm', 'Standard Warm'],
      addOns: [
        { id: 'icecream-vanilla', name: 'Creamy Vanilla Ice Cream Scoop', price: 50, icon: '🍨' },
        { id: 'chocolate-fudge', name: 'Hot Chocolate Fudge Drizzle', price: 35, icon: '🍫' }
      ],
      allowsNotes: true
    }
  },
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
