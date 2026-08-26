import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';

function DishCustomizationModal() {
  const { customizingItem, closeCustomizeModal, addToCart } = useCart();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cookingNotes, setCookingNotes] = useState('');
  const [qty, setQty] = useState(1);

  // Extract or generate tailored customization config
  const customConfig = useMemo(() => {
    if (!customizingItem) return null;

    if (customizingItem.customization && customizingItem.customization.addOns) {
      return customizingItem.customization;
    }

    // Default fallback by category if not explicitly set
    const cat = customizingItem.category;
    if (cat === 'beverages') {
      return {
        type: 'sweet',
        options: ['Low Sugar', 'Normal Sweet', 'Extra Sweet', 'Sugar-Free (Stevia)'],
        addOns: [
          { id: 'dry-fruits', name: 'Crushed Almonds & Pistachios', price: 35, icon: '🌰' },
          { id: 'malai', name: 'Thick Fresh Malai', price: 25, icon: '🥛' },
          { id: 'kesar', name: 'Kashmiri Saffron Strands', price: 30, icon: '✨' },
        ],
        allowsNotes: true,
      };
    }

    if (cat === 'desserts') {
      return {
        type: 'temperature',
        options: ['Served Piping Hot', 'Warm', 'Room Temperature'],
        addOns: [
          { id: 'vanilla-icecream', name: 'Vanilla Ice Cream Scoop', price: 50, icon: '🍨' },
          { id: 'choco-fudge', name: 'Hot Chocolate Fudge Drizzle', price: 35, icon: '🍫' },
          { id: 'roasted-nuts', name: 'Roasted Nuts & Cashews', price: 30, icon: '🌰' },
        ],
        allowsNotes: true,
      };
    }

    if (cat === 'indian-breads') {
      return {
        type: 'none',
        options: ['Crispy Well-Done', 'Soft & Fluffy'],
        addOns: [
          { id: 'desi-ghee', name: 'Brushed Pure Desi Ghee', price: 20, icon: '🧈' },
          { id: 'cheese-stuffed', name: 'Stuffed Molten Cheese', price: 45, icon: '🧀' },
        ],
        allowsNotes: true,
      };
    }

    // Default spicy for starters, biryani, rice, main-course
    return {
      type: 'spicy',
      options: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { id: 'extra-cheese', name: 'Extra Melted Cheese', price: 40, icon: '🧀' },
        { id: 'garlic-butter', name: 'Garlic Butter Tadka', price: 25, icon: '🧄' },
        { id: 'mint-chutney', name: 'Spiced Mint Chutney Dip', price: 20, icon: '🌿' },
        { id: 'crispy-onions', name: 'Caramelized Birista Onions', price: 25, icon: '🧅' },
      ],
      allowsNotes: true,
    };
  }, [customizingItem]);

  useEffect(() => {
    if (customConfig && customConfig.options && customConfig.options.length > 0) {
      setSelectedOption(customConfig.options[1] || customConfig.options[0]);
    } else {
      setSelectedOption('');
    }
    setSelectedAddOns([]);
    setCookingNotes('');
    setQty(1);
  }, [customizingItem, customConfig]);

  if (!customizingItem) return null;

  const handleToggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + (Number(a.price) || 0), 0);
  const unitPrice = Number(customizingItem.price) + addOnsTotal;
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    addToCart(customizingItem, qty, {
      selectedOption,
      spiceLevel: customConfig?.type === 'spicy' ? selectedOption : undefined,
      sweetness: customConfig?.type === 'sweet' ? selectedOption : undefined,
      servingStyle: customConfig?.type === 'temperature' || customConfig?.type === 'none' ? selectedOption : undefined,
      addOns: selectedAddOns,
      cookingNotes: cookingNotes.trim(),
    });
    closeCustomizeModal();
  };

  return (
    <div className="custom-modal-overlay" onClick={closeCustomizeModal}>
      <div className="custom-modal-card" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="custom-modal-close" onClick={closeCustomizeModal} aria-label="Close">
          &times;
        </button>

        {/* Dish Hero Info */}
        <div className="custom-dish-hero">
          <img
            src={customizingItem.image || '/pictures-restaurant/restaurant-logo.webp'}
            alt={customizingItem.name}
            className="custom-dish-img"
          />
          <div className="custom-dish-info">
            {customizingItem.tag && (
              <span className={`dish-badge ${customizingItem.tag === 'Veg' ? 'veg' : 'non-veg'}`}>
                {customizingItem.tag === 'Veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}
              </span>
            )}
            <h3>{customizingItem.name}</h3>
            <p className="custom-dish-desc">{customizingItem.description}</p>
            <div className="custom-base-price">Base: ₹{customizingItem.price}</div>
          </div>
        </div>

        <div className="custom-options-scroll">
          {/* 1. Dynamic Primary Option Selector (Spiciness / Sweetness / Temperature / Style) */}
          {customConfig?.options && customConfig.options.length > 0 && (
            <div className="custom-section">
              <label className="custom-section-title">
                <span>
                  {customConfig.type === 'spicy'
                    ? '🌶️ Select Spice Level'
                    : customConfig.type === 'sweet'
                    ? '🍯 Select Sweetness Level'
                    : customConfig.type === 'temperature'
                    ? '🌡️ Serving Temperature'
                    : '✨ Preparation Style'}
                </span>
              </label>

              <div className="spice-selector-grid">
                {customConfig.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`spice-btn ${selectedOption === opt ? 'selected' : ''}`}
                    onClick={() => setSelectedOption(opt)}
                  >
                    <span className="sp-icon">
                      {customConfig.type === 'spicy'
                        ? opt.toLowerCase().includes('mild')
                          ? '🌿'
                          : opt.toLowerCase().includes('hot')
                          ? '🔥'
                          : '🌶️'
                        : customConfig.type === 'sweet'
                        ? opt.toLowerCase().includes('free')
                          ? '🌿'
                          : opt.toLowerCase().includes('low')
                          ? '🍃'
                          : '🍯'
                        : customConfig.type === 'temperature'
                        ? opt.toLowerCase().includes('hot')
                          ? '♨️'
                          : opt.toLowerCase().includes('cold') || opt.toLowerCase().includes('chilled')
                          ? '🧊'
                          : '✨'
                        : '⭐'}
                    </span>
                    <strong className="sp-label">{opt}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Specific Add-ons Checklist */}
          {customConfig?.addOns && customConfig.addOns.length > 0 && (
            <div className="custom-section">
              <label className="custom-section-title">
                <span>✨</span> Recommended Add-ons & Sides
              </label>
              <div className="addons-list">
                {customConfig.addOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <label
                      key={addon.name}
                      className={`addon-item-row ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="addon-left">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleAddOn(addon)}
                        />
                        <span className="addon-icon">{addon.icon || '✨'}</span>
                        <span className="addon-name">{addon.name}</span>
                      </div>
                      <span className="addon-price">
                        {addon.price > 0 ? `+₹${addon.price}` : 'Free'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Special Instructions */}
          {customConfig?.allowsNotes !== false && (
            <div className="custom-section">
              <label className="custom-section-title">
                <span>📝</span> Special Chef Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Less oil, extra lemon wedges, packing instructions..."
                value={cookingNotes}
                onChange={(e) => setCookingNotes(e.target.value)}
                className="custom-notes-input"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="custom-modal-footer">
          <div className="custom-qty-wrapper">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="qty-btn"
              disabled={qty <= 1}
            >
              -
            </button>
            <span className="qty-val">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="qty-btn">
              +
            </button>
          </div>

          <button className="custom-submit-btn" onClick={handleAddToCart}>
            Add to Cart &bull; ₹{totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DishCustomizationModal;
