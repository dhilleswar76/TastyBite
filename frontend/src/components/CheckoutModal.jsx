import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

function CheckoutModal() {
  const {
    cartItems,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    subtotal,
    discount,
    taxAmount,
    deliveryFee,
    grandTotal,
    appliedCoupon,
  } = useCart();

  const [orderType, setOrderType] = useState('delivery');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tableNumber: '',
    notes: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const u = JSON.parse(userData);
        setFormData((prev) => ({
          ...prev,
          name: u.name || '',
          email: u.email || '',
        }));
      }
    } catch {
      // ignore
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setPlacedOrder(null);
    setErrorMessage('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in all required contact details.');
      return;
    }

    if (orderType === 'delivery' && !formData.address.trim()) {
      setErrorMessage('Please provide a delivery address.');
      return;
    }

    if (orderType === 'dine-in' && !formData.tableNumber.trim()) {
      setErrorMessage('Please provide your table number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          orderType,
          address: orderType === 'delivery' ? formData.address.trim() : '',
          tableNumber: orderType === 'dine-in' ? formData.tableNumber.trim() : '',
          notes: formData.notes.trim(),
        },
        items: cartItems.map((item) => ({
          menuItemId: item._id || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          tag: item.tag,
        })),
        pricing: {
          subtotal,
          tax: taxAmount,
          deliveryFee: orderType === 'delivery' ? deliveryFee : 0,
          discount,
          totalAmount: grandTotal,
        },
        payment: {
          method: formData.paymentMethod,
          status: 'pending',
        },
      };

      const response = await orderAPI.create(orderPayload);
      const createdOrder = response.data || response;
      setPlacedOrder(createdOrder);
      clearCart();
    } catch (err) {
      console.error('Order creation failed:', err);
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-modal-overlay" onClick={handleClose}>
      <div
        className="checkout-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Checkout"
      >
        {/* Close Button */}
        <button className="checkout-modal-close" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>

        {placedOrder ? (
          /* Order Confirmation Screen */
          <div className="order-success-view">
            <div className="success-icon-anim">🎉</div>
            <h3 className="success-heading">Order Placed Successfully!</h3>
            <p className="success-subheading">
              Thank you, <strong>{placedOrder.customer?.name}</strong>! Your food is being prepared with love.
            </p>

            <div className="order-receipt-card">
              <div className="receipt-row">
                <span>Order Number</span>
                <strong className="order-number-tag">{placedOrder.orderNumber}</strong>
              </div>
              <div className="receipt-row">
                <span>Order Type</span>
                <span className="receipt-pill">
                  {placedOrder.customer?.orderType === 'delivery' && '🛵 Home Delivery'}
                  {placedOrder.customer?.orderType === 'takeaway' && '🥡 Takeaway / Pickup'}
                  {placedOrder.customer?.orderType === 'dine-in' && `🍽️ Table #${placedOrder.customer?.tableNumber}`}
                </span>
              </div>
              <div className="receipt-row">
                <span>Payment</span>
                <span>{placedOrder.payment?.method?.toUpperCase()} &bull; ₹{placedOrder.pricing?.totalAmount}</span>
              </div>
              <div className="receipt-row">
                <span>Status</span>
                <span className="status-badge status-confirmed">Confirmed 👨‍🍳</span>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-items-mini">
                <h4>Ordered Dishes ({placedOrder.items?.length}):</h4>
                <ul>
                  {placedOrder.items?.map((item, idx) => (
                    <li key={idx}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="order-success-actions">
              <button className="done-btn" onClick={handleClose}>
                Back to TastyBite
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="checkout-form-container">
            <h2 className="checkout-title">
              <span>🍽️</span> Complete Your Order
            </h2>

            {/* Order Type Tabs */}
            <div className="order-type-tabs">
              <button
                type="button"
                className={`type-tab ${orderType === 'delivery' ? 'active' : ''}`}
                onClick={() => setOrderType('delivery')}
              >
                🛵 Delivery
              </button>
              <button
                type="button"
                className={`type-tab ${orderType === 'takeaway' ? 'active' : ''}`}
                onClick={() => setOrderType('takeaway')}
              >
                🥡 Pickup / Takeaway
              </button>
              <button
                type="button"
                className={`type-tab ${orderType === 'dine-in' ? 'active' : ''}`}
                onClick={() => setOrderType('dine-in')}
              >
                🍽️ Table Dine-In
              </button>
            </div>

            {errorMessage && <div className="checkout-error-box">{errorMessage}</div>}

            <form onSubmit={handleSubmitOrder} className="checkout-form-grid">
              {/* Customer Info */}
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. rahul@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Conditional Location */}
              {orderType === 'delivery' && (
                <div className="form-group full-width">
                  <label>Delivery Address *</label>
                  <textarea
                    name="address"
                    required
                    rows="2"
                    placeholder="House/Flat No, Street, Landmark, City..."
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              )}

              {orderType === 'dine-in' && (
                <div className="form-group">
                  <label>Table Number *</label>
                  <input
                    type="text"
                    name="tableNumber"
                    required
                    placeholder="e.g. Table 5"
                    value={formData.tableNumber}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Cooking / Delivery instructions */}
              <div className="form-group full-width">
                <label>Special Instructions (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  placeholder="e.g. Extra spicy, no onions, leave at door..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Method */}
              <div className="form-group full-width">
                <label>Select Payment Option</label>
                <div className="payment-options-grid">
                  <label className={`payment-radio-label ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <span>💵 {orderType === 'dine-in' ? 'Pay at Table' : 'Cash on Delivery'}</span>
                  </label>
                  <label className={`payment-radio-label ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                    />
                    <span>📱 UPI / Google Pay / PhonePe</span>
                  </label>
                  <label className={`payment-radio-label ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <span>💳 Credit / Debit Card</span>
                  </label>
                </div>
              </div>

              {/* Order total preview */}
              <div className="checkout-footer-summary full-width">
                <div className="summary-pill">
                  <span>{cartItems.length} Dishes</span>
                  <strong>Total: ₹{grandTotal}</strong>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="place-order-submit-btn"
                >
                  {isSubmitting ? 'Placing Order...' : `Confirm & Place Order (₹${grandTotal})`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutModal;
