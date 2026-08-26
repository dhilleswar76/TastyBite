import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const AVAILABLE_ADD_ONS = [
  { name: 'Extra Cheese', price: 40, icon: '🧀' },
  { name: 'Garlic Butter Glaze', price: 25, icon: '🧄' },
  { name: 'Crispy Fried Onions', price: 20, icon: '🧅' },
  { name: 'Rich Creamy Extra Gravy', price: 35, icon: '🍲' },
  { name: 'Spiced Mint Chutney', price: 15, icon: '🌿' },
];

function DishCustomizationModal() {
  const { customizingItem, closeCustomizeModal, addToCart } = useCart();

  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [cookingNotes, setCookingNotes] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (customizingItem) {
      setSpiceLevel(customizingItem.spiceLevel === 3 ? 'Hot' : customizingItem.spiceLevel === 1 ? 'Mild' : 'Medium');
      setSelectedAddOns([]);
      setCookingNotes('');
      setQty(1);
    }
  }, [customizingItem]);

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

  const addOnsTotal = selectedAddOns.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = Number(customizingItem.price) + addOnsTotal;
  const totalPrice = unitPrice * qty;

  const handleAddToCart = () => {
    addToCart(customizingItem, qty, {
      spiceLevel,
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

        <div className="custom-dish-hero">
          <img
            src={customizingItem.image || '/pictures-restaurant/restaurant-logo.png'}
            alt={customizingItem.name}
            className="custom-dish-img"
          />
          <div className="custom-dish-info">
            <span className={`dish-badge ${customizingItem.tag === 'Veg' ? 'veg' : 'non-veg'}`}>
              {customizingItem.tag === 'Veg' ? '🟢 Pure Veg' : '🔴 Non-Veg'}
            </span>
            <h3>{customizingItem.name}</h3>
            <p className="custom-dish-desc">{customizingItem.description}</p>
            <div className="custom-base-price">Base: ₹{customizingItem.price}</div>
          </div>
        </div>

        <div className="custom-options-scroll">
          {/* Spice Level Option */}
          <div className="custom-section">
            <label className="custom-section-title">
              <span>🌶️</span> Select Spice Level
            </label>
            <div className="spice-selector-grid">
              {[
                { label: 'Mild', icon: '🌿', desc: 'Subtle & Gentle' },
                { label: 'Medium', icon: '🌶️', desc: 'Chef Recommended' },
                { label: 'Hot', icon: '🔥', desc: 'Fiery & Bold' },
                { label: 'Extra Hot', icon: '💥', desc: 'Extreme Heat' },
              ].map((sp) => (
                <button
                  key={sp.label}
                  type="button"
                  className={`spice-btn ${spiceLevel === sp.label ? 'selected' : ''}`}
                  onClick={() => setSpiceLevel(sp.label)}
                >
                  <span className="sp-icon">{sp.icon}</span>
                  <strong className="sp-label">{sp.label}</strong>
                  <span className="sp-desc">{sp.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons Checklist */}
          <div className="custom-section">
            <label className="custom-section-title">
              <span>✨</span> Delicious Add-ons
            </label>
            <div className="addons-list">
              {AVAILABLE_ADD_ONS.map((addon) => {
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
                      <span className="addon-icon">{addon.icon}</span>
                      <span className="addon-name">{addon.name}</span>
                    </div>
                    <span className="addon-price">+₹{addon.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="custom-section">
            <label className="custom-section-title">
              <span>📝</span> Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Less oil, extra lemon wedges, no chopped onions..."
              value={cookingNotes}
              onChange={(e) => setCookingNotes(e.target.value)}
              className="custom-notes-input"
            />
          </div>
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
