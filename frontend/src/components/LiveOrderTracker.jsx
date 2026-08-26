import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

const ORDER_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: '📋', desc: 'Received & sent to kitchen' },
  { key: 'preparing', label: 'In the Kitchen', icon: '👨‍🍳', desc: 'Freshly cooking with authentic spices' },
  { key: 'ready', label: 'Ready / On the Way', icon: '🛵', desc: 'Packed hot & dispatched' },
  { key: 'delivered', label: 'Delivered / Served', icon: '🎉', desc: 'Bon Appétit! Enjoy your food' },
];

function LiveOrderTracker() {
  const { isTrackerOpen, closeOrderTracker, trackingOrderNumber } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrderDetails = async (code) => {
    if (!code) return;
    setLoading(true);
    setErrorMsg('');
    try {
      // Find orders matching code
      const cleanCode = code.trim().toUpperCase();
      const res = await orderAPI.getAll('all');
      if (res && res.data) {
        const found = res.data.find(
          (o) => o.orderNumber?.toUpperCase() === cleanCode || o._id === cleanCode
        );
        if (found) {
          setActiveOrder(found);
        } else {
          setErrorMsg(`No order found with code "${cleanCode}".`);
          setActiveOrder(null);
        }
      }
    } catch (e) {
      setErrorMsg('Failed to fetch order status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingOrderNumber) {
      setInputCode(trackingOrderNumber);
      fetchOrderDetails(trackingOrderNumber);
    }
  }, [trackingOrderNumber, isTrackerOpen]);

  if (!isTrackerOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      fetchOrderDetails(inputCode);
    }
  };

  const getStepIndex = (status) => {
    if (status === 'pending' || status === 'confirmed') return 0;
    if (status === 'preparing') return 1;
    if (status === 'ready') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="custom-modal-overlay" onClick={closeOrderTracker}>
      <div className="tracker-modal-card" onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="custom-modal-close" onClick={closeOrderTracker} aria-label="Close">
          &times;
        </button>

        <div className="tracker-header">
          <div className="tracker-title-wrap">
            <span className="tracker-radar-icon">📡</span>
            <div>
              <h3>Live Order Tracker</h3>
              <p>Real-time visual tracking from our kitchen to your table or doorstep.</p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="tracker-search-form">
            <input
              type="text"
              placeholder="Enter Order # (e.g. #TB-1042)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="tracker-input"
            />
            <button type="submit" className="tracker-search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {errorMsg && <div className="tracker-error-alert">{errorMsg}</div>}

        {activeOrder ? (
          <div className="tracker-content-body">
            {/* Top Order Card */}
            <div className="tracker-summary-badge">
              <div>
                <span className="lbl">Order Number</span>
                <strong className="order-num-text">{activeOrder.orderNumber}</strong>
              </div>
              <div>
                <span className="lbl">Estimated Delivery</span>
                <strong className="time-est">
                  {activeOrder.status === 'delivered'
                    ? 'Delivered ✅'
                    : `~${activeOrder.estimatedPrepMinutes || 25} Mins`}
                </strong>
              </div>
              <div>
                <span className="lbl">Type</span>
                <span className="type-pill">
                  {activeOrder.customer?.orderType === 'delivery' && '🛵 Home Delivery'}
                  {activeOrder.customer?.orderType === 'takeaway' && '🥡 Takeaway'}
                  {activeOrder.customer?.orderType === 'dine-in' && `🍽️ Table #${activeOrder.customer?.tableNumber}`}
                </span>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="timeline-stepper">
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.key}
                    className={`step-item ${isPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                  >
                    <div className="step-node">
                      <span className="step-icon">{step.icon}</span>
                      {isCurrent && <span className="pulse-ring"></span>}
                    </div>
                    <div className="step-label-group">
                      <h4>{step.label}</h4>
                      <p>{step.desc}</p>
                    </div>
                    {idx < ORDER_STEPS.length - 1 && (
                      <div className={`step-connector ${idx < currentStepIdx ? 'filled' : ''}`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order Items & Customer Details */}
            <div className="tracker-order-details-grid">
              <div className="tracker-card-sub">
                <h4>Ordered Dishes ({activeOrder.items?.length})</h4>
                <div className="tracker-items-list">
                  {activeOrder.items?.map((item, i) => (
                    <div key={i} className="tracker-item-row">
                      <div className="item-name-notes">
                        <strong>{item.quantity}x {item.name}</strong>
                        {item.spiceLevel && item.spiceLevel !== 'Default' && (
                          <span className="spice-tag">({item.spiceLevel} Spice)</span>
                        )}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="item-addons-sub">
                            + {item.addOns.map((a) => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <span className="item-price-val">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="tracker-total-row">
                  <span>Grand Total Paid:</span>
                  <strong>₹{activeOrder.pricing?.totalAmount}</strong>
                </div>
              </div>

              <div className="tracker-card-sub">
                <h4>Recipient Details</h4>
                <p><strong>Name:</strong> {activeOrder.customer?.name}</p>
                <p><strong>Contact:</strong> {activeOrder.customer?.phone}</p>
                {activeOrder.customer?.address && (
                  <p><strong>Address:</strong> {activeOrder.customer?.address}</p>
                )}
                {activeOrder.customer?.notes && (
                  <p><strong>Special Notes:</strong> 📝 {activeOrder.customer?.notes}</p>
                )}
                <div className="tracker-refresh-wrap">
                  <button
                    className="refresh-status-btn"
                    onClick={() => fetchOrderDetails(activeOrder.orderNumber)}
                  >
                    ↻ Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !loading ? (
          <div className="tracker-empty-state">
            <span className="empty-icon">🔍</span>
            <h4>Track Your TastyBite Order</h4>
            <p>Enter your 6-character order code above (found in your order receipt) to view live progress.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default LiveOrderTracker;
