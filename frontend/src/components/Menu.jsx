import { useState, useEffect, useMemo } from 'react';
import { menuItems as fallbackMenuItems } from '../data/menuData';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';

function Menu() {
  const [items, setItems] = useState(fallbackMenuItems);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'Veg', 'Non-Veg'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'name-asc'

  const { cartItems, addToCart, updateQuantity } = useCart();

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'starters', label: 'Starters' },
    { id: 'biryanis', label: 'Biryanis' },
    { id: 'fried-rice-noodles', label: 'Fried Rice & Noodles' },
    { id: 'main-course', label: 'Main Course' },
    { id: 'indian-breads', label: 'Breads' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' },
  ];

  // Fetch live menu items from database
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuAPI.getAll('all');
        if (res && res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems(fallbackMenuItems);
        }
      } catch (err) {
        console.warn('Using fallback menu data:', err.message);
        setItems(fallbackMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Dietary filter
    if (dietaryFilter !== 'all') {
      result = result.filter((item) => item.tag === dietaryFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, activeCategory, dietaryFilter, searchQuery, sortBy]);

  const getItemCartQty = (item) => {
    const id = item._id || item.id;
    const found = cartItems.find((i) => (i._id || i.id) === id);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu" className="section menu-section-container">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Discover Our Menu <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Handcrafted dishes made with authentic spices, fresh ingredients, and passionate culinary artistry.
        </p>
      </div>

      {/* Search and Filter Controls Toolbar */}
      <div className="menu-controls-wrapper">
        {/* Search Bar */}
        <div className="menu-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search appetizers, biryanis, desserts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dietary Switch Buttons */}
        <div className="dietary-toggle-group">
          <button
            className={`dietary-btn ${dietaryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('all')}
          >
            🍽️ All
          </button>
          <button
            className={`dietary-btn veg ${dietaryFilter === 'Veg' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('Veg')}
          >
            🟢 Pure Veg
          </button>
          <button
            className={`dietary-btn non-veg ${dietaryFilter === 'Non-Veg' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('Non-Veg')}
          >
            🔴 Non-Veg
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="menu-sort-box">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="menu-sort-select"
          >
            <option value="featured">✨ Featured</option>
            <option value="price-asc">💵 Price: Low to High</option>
            <option value="price-desc">💎 Price: High to Low</option>
            <option value="name-asc">🔤 Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="menu-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count Bar */}
      <div className="menu-results-bar">
        <span>
          Showing <strong>{filteredAndSortedItems.length}</strong> {filteredAndSortedItems.length === 1 ? 'dish' : 'dishes'}
          {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
          {dietaryFilter !== 'all' && ` (${dietaryFilter})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(searchQuery || dietaryFilter !== 'all' || activeCategory !== 'all') && (
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setDietaryFilter('all');
              setActiveCategory('all');
              setSortBy('featured');
            }}
          >
            Reset All Filters ↺
          </button>
        )}
      </div>

      {/* Menu Grid */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="menu-no-results">
          <div className="no-dish-icon">🍲</div>
          <h3>No matching dishes found</h3>
          <p>Try searching for a different item or clear your active filters.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setDietaryFilter('all');
              setActiveCategory('all');
            }}
          >
            View Full Menu
          </button>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredAndSortedItems.map((item) => {
            const itemId = item._id || item.id;
            const currentQty = getItemCartQty(item);

            return (
              <article key={itemId} className="menu-item" data-category={item.category}>
                <div className="menu-item-img-wrap">
                  <img
                    src={item.image || '/pictures-restaurant/restaurant-logo.png'}
                    alt={item.name}
                    loading="lazy"
                  />
                  {item.tag && (
                    <span className={`tag-pill ${item.tag === 'Veg' ? 'veg-pill' : 'non-veg-pill'}`}>
                      {item.tag === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  )}
                  {item.available === false && (
                    <span className="sold-out-badge">Sold Out</span>
                  )}
                </div>

                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <span className="price">₹{item.price}</span>
                  </div>
                  <p className="menu-item-desc">{item.description}</p>

                  <div className="menu-item-bottom-action">
                    {item.available === false ? (
                      <button disabled className="out-of-stock-btn">
                        Currently Unavailable
                      </button>
                    ) : currentQty > 0 ? (
                      <div className="card-qty-stepper">
                        <button
                          onClick={() => updateQuantity(itemId, currentQty - 1)}
                          className="card-step-btn minus"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="card-step-val">{currentQty} in Cart</span>
                        <button
                          onClick={() => updateQuantity(itemId, currentQty + 1)}
                          className="card-step-btn plus"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item, 1)}
                      >
                        <span>+ Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Menu;
