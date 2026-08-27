import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';

function DishCustomizationModal() {
  const { customizingItem, closeCustomizeModal, addToCart } = useCart();

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cookingNotes, setCookingNotes] = useState('');
  const [qty, setQty] = useState(1);

  // Extract item-specific customization config
  const customConfig = useMemo(() => {
    if (!customizingItem) return null;
    return customizingItem.customization || null;
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
