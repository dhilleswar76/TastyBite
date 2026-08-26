import { useState, useEffect, useMemo } from 'react';
import { menuItems as fallbackMenuItems } from '../data/menuData';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';

function Menu() {
  const [items, setItems] = useState(fallbackMenuItems);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'Veg', 'Non-Veg', 'vegan', 'gluten-free', 'halal', 'nut-free'
  const [spiceFilter, setSpiceFilter] = useState('all'); // 'all', '1', '2', '3'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-asc', 'price-desc', 'name-asc', 'rating-desc'

  // Daily Deal Countdown timer (e.g. resets every 6 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 18 });

  const { cartItems, addToCart, updateQuantity, openCustomizeModal, openNutritionModal } = useCart();

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

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (dietaryFilter === 'Veg' || dietaryFilter === 'Non-Veg') {
      result = result.filter((item) => item.tag === dietaryFilter);
    } else if (dietaryFilter === 'vegan') {
      result = result.filter((item) => item.dietary?.isVegan);
    } else if (dietaryFilter === 'gluten-free') {
      result = result.filter((item) => item.dietary?.isGlutenFree);
    } else if (dietaryFilter === 'halal') {
      result = result.filter((item) => item.dietary?.isHalal !== false);
    } else if (dietaryFilter === 'nut-free') {
      result = result.filter((item) => item.dietary?.isNutFree !== false);
    }

    // Spiciness filter
    if (spiceFilter !== 'all') {
      result = result.filter((item) => (item.spiceLevel || 2) === Number(spiceFilter));
    }

    // Search query (dish name, description, ingredients, allergens)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.allergens?.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return result;
  }, [items, activeCategory, dietaryFilter, spiceFilter, searchQuery, sortBy]);

  const getItemCartQty = (item) => {
    const id = item._id || item.id;
    const found = cartItems.filter((i) => (i._id || i.id) === id);
    return found.reduce((acc, f) => acc + f.quantity, 0);
  };

  const chefSpecials = items.filter((i) => i.isChefSpecial);
  const featuredDeal = chefSpecials[0] || items[7]; // Chicken Dum Biryani or first special

  return (
    <section id="menu" className="section menu-section-container">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Discover Our Menu <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Handcrafted dishes made with authentic spices, fresh farm ingredients, and passionate culinary artistry.
        </p>
      </div>

      {/* Chef's Specials Spotlight Deal Banner */}
      {featuredDeal && (
        <div className="chef-deal-spotlight-banner">
          <div className="deal-glow-badge">🔥 CHEF'S DAILY SPOTLIGHT DEAL</div>
          <div className="deal-content-grid">
            <div className="deal-img-wrap">
              <img src={featuredDeal.image} alt={featuredDeal.name} />
              <span className="deal-save-pill">SAVE 20%</span>
            </div>
            <div className="deal-info-wrap">
              <span className="deal-dish-cat">{featuredDeal.category.toUpperCase()} &bull; ⭐ 5.0 RATED</span>
              <h3 className="deal-dish-title">{featuredDeal.name}</h3>
              <p className="deal-dish-desc">{featuredDeal.description}</p>
              <div className="deal-pricing-timer-row">
                <div className="deal-price-block">
                  <span className="original-price">₹{featuredDeal.price + 60}</span>
                  <span className="deal-price">₹{featuredDeal.price}</span>
                </div>
                <div className="deal-countdown-box">
                  <span className="timer-lbl">Offer ends in:</span>
                  <div className="timer-digits">
                    <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                    <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                    <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="deal-action-wrap">
              <button
                className="claim-deal-btn"
                onClick={() => openCustomizeModal(featuredDeal)}
              >
                Claim Deal &bull; Customize &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls Toolbar */}
      <div className="menu-controls-wrapper">
        {/* Search Bar */}
        <div className="menu-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search dishes, ingredients, or allergens..."
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
          <button
            className={`dietary-btn ${dietaryFilter === 'vegan' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('vegan')}
          >
            🌿 Vegan
          </button>
          <button
            className={`dietary-btn ${dietaryFilter === 'gluten-free' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('gluten-free')}
          >
            🌾 Gluten-Free
          </button>
          <button
            className={`dietary-btn ${dietaryFilter === 'halal' ? 'active' : ''}`}
            onClick={() => setDietaryFilter('halal')}
          >
            🌙 Halal
          </button>
        </div>

        {/* Spiciness Meter Selector */}
        <div className="spice-meter-box">
          <label>Spiciness:</label>
          <select
            value={spiceFilter}
            onChange={(e) => setSpiceFilter(e.target.value)}
            className="menu-sort-select"
          >
            <option value="all">🌶️ All Spice</option>
            <option value="1">🌿 Mild</option>
            <option value="2">🌶️ Medium</option>
            <option value="3">🔥 Hot</option>
          </select>
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
            <option value="rating-desc">⭐ Top Rated</option>
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
          {spiceFilter !== 'all' && ` (Spice Level ${spiceFilter})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {(searchQuery || dietaryFilter !== 'all' || spiceFilter !== 'all' || activeCategory !== 'all') && (
          <button
            className="reset-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setDietaryFilter('all');
              setSpiceFilter('all');
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
              setSpiceFilter('all');
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
                    src={item.image || '/pictures-restaurant/restaurant-logo.webp'}
                    alt={item.name}
                    loading="lazy"
                  />
                  {item.tag && (
                    <span className={`tag-pill ${item.tag === 'Veg' ? 'veg-pill' : 'non-veg-pill'}`}>
                      {item.tag === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  )}
                  {item.isChefSpecial && (
                    <span className="chef-special-badge">⭐ Chef Pick</span>
                  )}
                  {item.available === false && (
                    <span className="sold-out-badge">Sold Out</span>
                  )}

                  {/* Info Trigger for Nutrition */}
                  <button
                    className="dish-info-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openNutritionModal(item);
                    }}
                    title="View Nutrition & Allergens"
                  >
                    ℹ️ Nutrition
                  </button>
                </div>

                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <span className="price">₹{item.price}</span>
                  </div>
                  <div className="dish-sub-metrics">
                    <span className="rating-star">⭐ {item.rating || 4.8}</span>
                    <span className="prep-time">⏱️ {item.prepTimeMinutes || 20}m</span>
                    <span className="spice-indicator">
                      {item.spiceLevel === 3 ? '🌶️🌶️🌶️' : item.spiceLevel === 1 ? '🌿' : '🌶️🌶️'}
                    </span>
                  </div>
                  <p className="menu-item-desc">{item.description}</p>

                  <div className="menu-item-bottom-action">
                    {item.available === false ? (
                      <button disabled className="out-of-stock-btn">
                        Currently Unavailable
                      </button>
                    ) : (
                      <div className="card-actions-duo">
                        <button
                          className="customize-btn"
                          onClick={() => openCustomizeModal(item)}
                          title="Customize spice level and add-ons"
                        >
                          ⚙️ Customize
                        </button>
                        <button
                          className="add-to-cart-btn-primary"
                          onClick={() => addToCart(item, 1)}
                        >
                          <span>+ Add (₹{item.price})</span>
                        </button>
                      </div>
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
