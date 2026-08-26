import { useState } from 'react';
import { eventAPI } from '../services/api';

const EVENT_TYPES = [
  { id: 'birthday', label: '🎂 Birthday Party', desc: 'Decorations, cake table & celebratory music' },
  { id: 'corporate', label: '💼 Corporate Dinner', desc: 'AV projector, formal dining & presentation setups' },
  { id: 'wedding', label: '💍 Wedding Banquet', desc: 'Royal floral decor, multi-course feast & grand stage' },
  { id: 'anniversary', label: '🥂 Anniversary Gala', desc: 'Candlelight ambiance, personalized champagne menu' },
  { id: 'cocktail', label: '🍾 Cocktail & Networking', desc: 'Standing cocktail tables, artisanal finger food' },
];

const PACKAGES = [
  { id: 'silver', name: 'Silver Buffet', pricePerPerson: 799, includes: '3 Starters, 4 Mains, 2 Breads, 2 Desserts, Welcome Drink' },
  { id: 'gold', name: 'Gold Royal Feast', pricePerPerson: 1199, isPopular: true, includes: '5 Starters, 6 Mains, Live Naan Counter, 3 Desserts, Mocktail Bar' },
  { id: 'platinum', name: 'Platinum Grand Luxury', pricePerPerson: 1699, includes: 'Chef Tasting Menu, Unlimited Kebabs & Biryanis, Live Cooking Stalls, Artisanal Desserts & Dedicated Staff' },
];

function EventBooking() {
  const [eventType, setEventType] = useState('birthday');
  const [guestCount, setGuestCount] = useState(25);
  const [selectedPkg, setSelectedPkg] = useState('gold');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    specialRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentPkg = PACKAGES.find((p) => p.id === selectedPkg) || PACKAGES[1];
  const estimatedTotal = guestCount * currentPkg.pricePerPerson;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your contact details.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      eventType,
      guestCount,
      eventDate: formData.eventDate,
      estimatedBudget: estimatedTotal,
      preferredMenu: `${currentPkg.name} (₹${currentPkg.pricePerPerson}/head)`,
      specialRequirements: formData.specialRequirements.trim(),
    };

    try {
      const res = await eventAPI.create(payload);
      setSubmittedInquiry(res.data || payload);
    } catch (err) {
      console.error('Event inquiry error:', err);
      setErrorMessage(err.message || 'Failed to submit event inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="events" className="section event-booking-section-wrap">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Private Events & Catering <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Host your milestone birthdays, corporate dinners, and wedding banquets with customized gourmet catering.
        </p>
      </div>

      {submittedInquiry ? (
        <div className="event-success-card">
          <div className="event-succ-icon">🎉</div>
          <h3>Event Inquiry Received!</h3>
          <p className="event-succ-sub">
            Thank you, <strong>{submittedInquiry.name}</strong>! Our master event planner will contact you within 2 hours to finalize your customized banquet menu and seating arrangement.
          </p>

          <div className="event-inquiry-receipt">
            <div><span>Event Type:</span> <strong>{submittedInquiry.eventType?.toUpperCase()}</strong></div>
            <div><span>Estimated Guests:</span> <strong>{submittedInquiry.guestCount} Guests</strong></div>
            <div><span>Date:</span> <strong>{new Date(submittedInquiry.eventDate).toLocaleDateString()}</strong></div>
            <div><span>Selected Package:</span> <strong>{submittedInquiry.preferredMenu}</strong></div>
            <div><span>Estimated Budget:</span> <strong className="event-price-tag">₹{submittedInquiry.estimatedBudget?.toLocaleString()}</strong></div>
          </div>

          <button className="reset-event-btn" onClick={() => setSubmittedInquiry(null)}>
            Plan Another Event
          </button>
        </div>
      ) : (
        <div className="event-planner-container">
          {/* Left: Interactive Configurator */}
          <div className="event-configurator-panel">
            <h3 className="panel-sub-title">1. Event Details & Live Estimator</h3>

            {/* Event Type Grid */}
            <div className="event-types-list">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`event-type-card ${eventType === type.id ? 'active' : ''}`}
                  onClick={() => setEventType(type.id)}
                >
                  <strong>{type.label}</strong>
                  <p>{type.desc}</p>
                </button>
              ))}
            </div>

            {/* Guest Count Slider */}
            <div className="guest-slider-box">
              <div className="slider-header-row">
                <label>Expected Guest Count:</label>
                <span className="guest-count-pill">{guestCount} Guests</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="guest-range-slider"
              />
              <div className="range-minmax">
                <span>10 Guests (Intimate)</span>
                <span>300 Guests (Grand Banquet)</span>
              </div>
            </div>

            {/* Banquet Packages */}
            <div className="packages-selection-group">
              <label>Select Catering Menu Package:</label>
              <div className="packages-grid">
                {PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`package-card ${selectedPkg === pkg.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPkg(pkg.id)}
                  >
                    {pkg.isPopular && <span className="pop-badge">★ MOST POPULAR</span>}
                    <h4>{pkg.name}</h4>
                    <div className="pkg-price">₹{pkg.pricePerPerson} <small>/ guest</small></div>
                    <p className="pkg-includes">{pkg.includes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Total Calculator Box */}
            <div className="live-budget-summary-box">
              <div className="budget-left">
                <span>Estimated Event Total ({guestCount} guests &bull; {currentPkg.name}):</span>
                <strong className="calc-total-val">₹{estimatedTotal.toLocaleString()}</strong>
              </div>
              <span className="tax-inclusive-tag">* Includes service staff & basic table setup</span>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="event-form-panel">
            <h3 className="panel-sub-title">2. Contact & Reserve Date</h3>
            {errorMessage && <div className="event-error-box">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="event-inquiry-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Mahindra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. anand@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Target Event Date *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Special Requests or Custom Theme Requirements</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Vegetarian only, live DJ setup, floral backdrop, projector for slides..."
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="submit-inquiry-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Inquiry...' : `Request Event Booking (₹${estimatedTotal.toLocaleString()})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default EventBooking;
