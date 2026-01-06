import { useState } from 'react';
import { menuItems } from '../data/menuData';

function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'starters', label: 'Starters' },
    { id: 'biryanis', label: 'Biryanis' },
    { id: 'fried-rice-noodles', label: 'Fried Rice & Noodles' },
    { id: 'main-course', label: 'Main Course' },
    { id: 'indian-breads', label: 'Indian Breads' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="section">
      <h2 className="section-title">
        <span className="symbol">&mdash;</span> Our Menu <span className="symbol">&mdash;</span>
      </h2>

      <div className="menu-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <article key={item.id} className="menu-item" data-category={item.category}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <span className="price">₹{item.price}</span>
            {item.tag && (
              <span className="tag" id={item.tag === 'Veg' ? 'veg' : 'Non-Veg'}>
                {item.tag}
              </span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Menu;
