import { useState } from 'react';
import { useCart } from '../context/CartContext';

function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    loyaltyPoints,
    pointsRedeemed,
    pointsDiscount,
    toggleRedeemPoints,
    totalItemsCount,
    subtotal,
    discount,
    taxAmount,
    deliveryFee,
    grandTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeDeliveryThreshold = 499;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-title-wrapper">
            <span className="cart-icon-header">🛒</span>
            <h3>Your Order</h3>
            <span className="cart-count-pill">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            &times;
          </button>
        </div>

        {/* Free delivery bar */}
        {cartItems.length > 0 && (
          <div className="free-delivery-banner">
            {amountNeededForFree > 0 ? (
              <p>Add <strong>₹{amountNeededForFree}</strong> more to unlock <strong>FREE Delivery</strong>! 🛵</p>
            ) : (
              <p className="free-unlocked">🎉 Congratulations! You unlocked <strong>FREE Delivery</strong>!</p>
            )}
            <div className="delivery-progress-bar">
              <div
                className="delivery-progress-fill"
                style={{ width: `${deliveryProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart items list */}
        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon">🍽️</div>
              <h4>Your Cart is Empty</h4>
              <p>Looks like you haven't added any delicious food yet.</p>
              <button
                className="explore-menu-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  const menuSection = document.getElementById('menu');
                  if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemKey = item.cartKey || item._id || item.id;
                return (
                  <div key={itemKey} className="cart-item-row">
                    <img
                      src={item.image || '/pictures-restaurant/restaurant-logo.png'}
                      alt={item.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <span className={`dish-badge ${item.tag === 'Veg' ? 'veg' : item.tag === 'Non-Veg' ? 'non-veg' : ''}`}>
                          {item.tag === 'Veg' ? '🟢 Veg' : item.tag === 'Non-Veg' ? '🔴 Non-Veg' : '⭐'}
                        </span>
                        <h4 className="cart-item-name">{item.name}</h4>
                      </div>

                      {/* Customization Details */}
                      {(item.spiceLevel !== 'Default' || (item.addOns && item.addOns.length > 0) || item.cookingNotes) && (
                        <div className="cart-item-custom-tags">
                          {item.spiceLevel !== 'Default' && (
                            <span className="cust-pill">🌶️ {item.spiceLevel}</span>
                          )}
                          {item.addOns?.map((a, idx) => (
                            <span key={idx} className="cust-pill add-on">+{a.name} (₹{a.price})</span>
                          ))}
                          {item.cookingNotes && (
                            <span className="cust-pill notes">📝 {item.cookingNotes}</span>
                          )}
                        </div>
                      )}

                      <div className="cart-item-price-unit">
                        ₹{item.price} each
                      </div>

                      <div className="cart-item-actions">
                        <div className="quantity-stepper">
                          <button
                            className="step-btn minus"
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="step-count">{item.quantity}</span>
                          <button
                            className="step-btn plus"
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-total-price">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          className="cart-delete-btn"
                          onClick={() => removeFromCart(itemKey)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* TastyPoints Loyalty Redemption */}
            <div className="loyalty-cart-card">
              <div className="loyalty-left">
                <span className="loyalty-icon">🎁</span>
                <div>
                  <strong>TastyPoints: {loyaltyPoints} pts</strong>
                  <p>100 pts = ₹50 instant discount</p>
                </div>
              </div>
              <button
                type="button"
                className={`redeem-toggle-btn ${pointsRedeemed > 0 ? 'redeemed' : ''}`}
                onClick={toggleRedeemPoints}
                disabled={loyaltyPoints < 100}
              >
                {pointsRedeemed > 0 ? '✓ Applied (-₹50)' : 'Redeem 100 pts'}
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="cart-coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <span>🎟️ <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
                  <button onClick={removeCoupon} className="remove-coupon-btn">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. WELCOME20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">Apply</button>
                </form>
              )}
              {couponError && <p className="coupon-error-msg">{couponError}</p>}
            </div>

            {/* Price breakdown */}
            <div className="cart-bill-summary">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="bill-row discount-row">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="bill-row discount-row points-discount">
                  <span>TastyPoints Reward (100 pts)</span>
                  <span>-₹{pointsDiscount}</span>
                </div>
              )}
              <div className="bill-row">
                <span>GST Tax (5%)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="free-tag">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="bill-divider"></div>
              <div className="bill-row bill-grand-total">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
              <div className="points-earn-note">
                🌟 You will earn <strong>+{Math.round(grandTotal / 10)} TastyPoints</strong> on this order!
              </div>
            </div>

            {/* Action button */}
            <button className="cart-checkout-action-btn" onClick={handleProceedCheckout}>
              Proceed to Checkout &bull; ₹{grandTotal} &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
