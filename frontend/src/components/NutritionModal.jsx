import { useCart } from '../context/CartContext';

function NutritionModal() {
  const { nutritionItem, closeNutritionModal, openCustomizeModal, addToCart } = useCart();

  if (!nutritionItem) return null;

  const n = nutritionItem.nutrition || {
    calories: 320,
    protein: '14g',
    carbs: '38g',
    fats: '12g',
  };

  const allergens = nutritionItem.allergens || [];
  const dietary = nutritionItem.dietary || {
    isVegan: false,
    isGlutenFree: false,
    isHalal: true,
    isNutFree: true,
  };

  return (
    <div className="custom-modal-overlay" onClick={closeNutritionModal}>
      <div className="nutrition-modal-card" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="custom-modal-close" onClick={closeNutritionModal} aria-label="Close">
          &times;
        </button>

        <div className="nutrition-hero-header">
          <img
            src={nutritionItem.image || '/pictures-restaurant/restaurant-logo.png'}
            alt={nutritionItem.name}
            className="nutrition-dish-img"
          />
          <div className="nutrition-dish-header-info">
            <span className={`dish-badge ${nutritionItem.tag === 'Veg' ? 'veg' : 'non-veg'}`}>
              {nutritionItem.tag === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
            </span>
            <h3>{nutritionItem.name}</h3>
            <p className="nutrition-desc">{nutritionItem.description}</p>
            <div className="nutrition-sub-info">
              <span>⏱️ Prep Time: ~{nutritionItem.prepTimeMinutes || 20} mins</span>
              <span>⭐ Rating: {nutritionItem.rating || 4.8} / 5.0</span>
            </div>
          </div>
        </div>

        <div className="nutrition-body-content">
          {/* Macronutrients Grid */}
          <h4 className="nutri-section-title">📊 Nutritional Facts (Per Serving)</h4>
          <div className="macro-cards-grid">
            <div className="macro-card cal">
              <span className="macro-icon">🔥</span>
              <strong className="macro-val">{n.calories}</strong>
              <span className="macro-lbl">Calories (kcal)</span>
            </div>
            <div className="macro-card prot">
              <span className="macro-icon">🥩</span>
              <strong className="macro-val">{n.protein}</strong>
              <span className="macro-lbl">Protein</span>
            </div>
            <div className="macro-card carb">
              <span className="macro-icon">🌾</span>
              <strong className="macro-val">{n.carbs}</strong>
              <span className="macro-lbl">Carbohydrates</span>
            </div>
            <div className="macro-card fat">
              <span className="macro-icon">🥑</span>
              <strong className="macro-val">{n.fats}</strong>
              <span className="macro-lbl">Fats</span>
            </div>
          </div>

          {/* Dietary Badges */}
          <h4 className="nutri-section-title">🌱 Dietary Suitability</h4>
          <div className="dietary-tags-list">
            {dietary.isVegan && <span className="dietary-pill vegan">🌿 100% Vegan</span>}
            {dietary.isGlutenFree && <span className="dietary-pill gluten-free">🌾 Gluten-Free</span>}
            {dietary.isHalal && <span className="dietary-pill halal">🌙 Halal Certified</span>}
            {dietary.isNutFree && <span className="dietary-pill nut-free">🥜 Nut-Free</span>}
            <span className="dietary-pill spice">
              {nutritionItem.spiceLevel === 3 ? '🌶️🌶️🌶️ Hot Spiced' : nutritionItem.spiceLevel === 1 ? '🌿 Mild Spiced' : '🌶️ Medium Spiced'}
            </span>
          </div>

          {/* Allergen Warning */}
          <h4 className="nutri-section-title">⚠️ Allergen Information</h4>
          {allergens.length > 0 ? (
            <div className="allergen-alert-box">
              <span>Contains: </span>
              {allergens.map((a, i) => (
                <strong key={i} className="allergen-tag">{a}</strong>
              ))}
            </div>
          ) : (
            <div className="allergen-safe-box">
              ✅ No major allergens detected in standard preparation.
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="nutrition-modal-footer">
          <button
            className="nutri-customize-btn"
            onClick={() => {
              closeNutritionModal();
              openCustomizeModal(nutritionItem);
            }}
          >
            ⚙️ Customize Ingredients
          </button>
          <button
            className="nutri-add-btn"
            onClick={() => {
              addToCart(nutritionItem, 1);
              closeNutritionModal();
            }}
          >
            + Add to Order (₹{nutritionItem.price})
          </button>
        </div>
      </div>
    </div>
  );
}

export default NutritionModal;
