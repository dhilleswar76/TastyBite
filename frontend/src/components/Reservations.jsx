import { useState } from 'react';
import { reservationAPI } from '../services/api';
import { menuItems } from '../data/menuData';

const SEATING_ZONES = [
  { id: 'rooftop', name: 'Rooftop Starlight', icon: '🌌', desc: 'Open sky panoramic views & fairy lights' },
  { id: 'patio', name: 'Outdoor Garden Patio', icon: '🌿', desc: 'Breezy greenery & peaceful ambiance' },
  { id: 'booth', name: 'Cozy Plush Booth', icon: '🛋️', desc: 'Intimate curved booths for groups & dates' },
  { id: 'window', name: 'Window City View', icon: '🪟', desc: 'Bright natural lighting by glass facade' },
  { id: 'private-dining', name: 'VIP Private Dining', icon: '👑', desc: 'Luxurious private room with dedicated server' },
];

const TIME_SLOTS = [
  { time: '12:30 PM', tablesLeft: 4 },
  { time: '01:30 PM', tablesLeft: 2 },
  { time: '07:00 PM', tablesLeft: 3 },
  { time: '07:30 PM', tablesLeft: 1, isHot: true },
  { time: '08:00 PM', tablesLeft: 1, isHot: true },
  { time: '08:30 PM', tablesLeft: 2 },
  { time: '09:15 PM', tablesLeft: 5 },
];

function Reservations() {
  const [selectedZone, setSelectedZone] = useState('rooftop');
  const [selectedTime, setSelectedTime] = useState('07:30 PM');
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [preOrders, setPreOrders] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    guests: 2,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePreOrderItem = (dish) => {
    setPreOrders((prev) => {
      const exists = prev.find((p) => p.name === dish.name);
      if (exists) {
        return prev.filter((p) => p.name !== dish.name);
      } else {
        return [...prev, { name: dish.name, price: dish.price, quantity: 1 }];
      }
    });
  };

  const handleUpdatePreOrderQty = (dishName, delta) => {
    setPreOrders((prev) =>
      prev
        .map((p) => (p.name === dishName ? { ...p, quantity: p.quantity + delta } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const generateGoogleCalendarUrl = (booking) => {
    const title = encodeURIComponent(`Dinner Reservation at TastyBite (${booking.seatingZone?.toUpperCase()} Zone)`);
    const details = encodeURIComponent(
      `Table reserved for ${booking.guests} guests under ${booking.name}.\nZone: ${booking.seatingZone}\nSpecial Requests: ${booking.message || 'None'}`
    );
    const location = encodeURIComponent('TastyBite Fine Dining Restaurant, Gourmet Street');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.date || !selectedTime) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      time: selectedTime,
      guests: parseInt(formData.guests, 10),
      seatingZone: selectedZone,
      preOrderItems: preOrders,
      message: formData.message.trim(),
    };

    try {
      const res = await reservationAPI.create(payload);
      const bookingData = res.data || payload;
      setConfirmedBooking(bookingData);
    } catch (err) {
      console.error('Reservation error:', err);
      setErrorMessage(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservations" className="section section-alt reservation-section-wrap">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Reserve Your Table <span className="symbol">&mdash;</span>
        </h2>
        <p className="reservation-description">
          Select your favorite seating ambiance, check live slot availability, and pre-order dishes for instant seating.
        </p>
      </div>

      {confirmedBooking ? (
        <div className="reservation-confirmed-card">
          <div className="conf-icon">🎉</div>
          <h3>Table Reservation Confirmed!</h3>
          <p className="conf-sub">
            We are excited to host you, <strong>{confirmedBooking.name}</strong>. A confirmation email has been dispatched.
          </p>

          <div className="conf-details-box">
            <div className="conf-row">
              <span>📅 Date & Time:</span>
              <strong>{new Date(confirmedBooking.date).toLocaleDateString()} at {confirmedBooking.time}</strong>
            </div>
            <div className="conf-row">
              <span>👥 Party Size:</span>
              <strong>{confirmedBooking.guests} Guests</strong>
            </div>
            <div className="conf-row">
              <span>🌌 Seating Zone:</span>
              <strong className="zone-pill-tag">{confirmedBooking.seatingZone?.toUpperCase()}</strong>
            </div>
            {confirmedBooking.preOrderItems && confirmedBooking.preOrderItems.length > 0 && (
              <div className="conf-preorders">
                <span>🍽️ Pre-Ordered Dishes:</span>
                <ul>
                  {confirmedBooking.preOrderItems.map((it, idx) => (
                    <li key={idx}>
                      {it.quantity}x {it.name} (₹{it.price * it.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="conf-actions-group">
            <a
              href={generateGoogleCalendarUrl(confirmedBooking)}
              target="_blank"
              rel="noopener noreferrer"
              className="add-calendar-btn"
            >
              📅 Add to Google Calendar
            </a>
            <button className="new-booking-btn" onClick={() => setConfirmedBooking(null)}>
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        <form id="reservationForm" className="reservation-pro-form" onSubmit={handleSubmit}>
          {errorMessage && <div className="reservation-error-box">{errorMessage}</div>}

          {/* 1. Visual Seating Zone Selector */}
          <div className="zone-selector-container">
            <label className="field-label">1. Choose Your Preferred Ambiance & Seating Zone</label>
            <div className="seating-zones-grid">
              {SEATING_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  className={`zone-card ${selectedZone === zone.id ? 'active' : ''}`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <span className="zone-icon">{zone.icon}</span>
                  <h4>{zone.name}</h4>
                  <p>{zone.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Real-Time Slot Availability Selector */}
          <div className="timeslot-selector-container">
            <label className="field-label">2. Select Real-Time Available Time Slot</label>
            <div className="time-slots-grid">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`time-slot-pill ${selectedTime === slot.time ? 'active' : ''}`}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <span className="slot-time">{slot.time}</span>
                  <span className={`slot-tag ${slot.isHot ? 'hot' : ''}`}>
                    {slot.isHot ? `🔥 Only ${slot.tablesLeft} left!` : `${slot.tablesLeft} tables open`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Guest & Contact Inputs */}
          <div className="reservation-inputs-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g. Vikramaditya Roy"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="e.g. vikram@gmail.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Reservation Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests">Number of Guests *</label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="select-guests"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    👥 {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Special Requests / Occasion</label>
              <input
                type="text"
                id="message"
                name="message"
                placeholder="e.g. Birthday celebration, high chair needed, candle light..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 4. Pre-Order Dishes Option (Accordion) */}
          <div className="preorder-accordion-wrapper">
            <button
              type="button"
              className="preorder-toggle-header"
              onClick={() => setShowPreOrder(!showPreOrder)}
            >
              <span>🍽️ Pre-Order Food for Express Serving Upon Arrival</span>
              <span className="toggle-chevron">{showPreOrder ? '▲ Close' : '▼ Select Dishes (Optional)'}</span>
            </button>

            {showPreOrder && (
              <div className="preorder-dishes-panel">
                <p className="preorder-tip">
                  Select starters or popular dishes to have the chef prepare them right before you arrive:
                </p>
                <div className="preorder-items-selection-grid">
                  {menuItems.slice(0, 8).map((dish) => {
                    const isSelected = preOrders.some((p) => p.name === dish.name);
                    const currentPre = preOrders.find((p) => p.name === dish.name);

                    return (
                      <div key={dish.id} className={`preorder-dish-card ${isSelected ? 'selected' : ''}`}>
                        <img src={dish.image} alt={dish.name} />
                        <div className="dish-summary">
                          <strong>{dish.name}</strong>
                          <span>₹{dish.price}</span>
                        </div>
                        {isSelected ? (
                          <div className="preorder-stepper">
                            <button
                              type="button"
                              onClick={() => handleUpdatePreOrderQty(dish.name, -1)}
                            >
                              -
                            </button>
                            <span>{currentPre.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdatePreOrderQty(dish.name, 1)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="preorder-add-btn"
                            onClick={() => handleTogglePreOrderItem(dish)}
                          >
                            + Pre-Order
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="reservation-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Confirming Table...' : `Confirm Table Reservation (${selectedZone.toUpperCase()})`}
          </button>
        </form>
      )}
    </section>
  );
}

export default Reservations;
