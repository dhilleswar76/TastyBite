import { useState } from 'react';
import { reservationAPI } from '../services/api';

function Reservations() {
  const [formMessage, setFormMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage('');

    const formData = new FormData(e.target);
    const reservationData = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: parseInt(formData.get('guests')),
      message: formData.get('message')?.trim() || '',
    };

    if (!reservationData.name || !reservationData.email || !reservationData.date || !reservationData.time || !reservationData.guests) {
      setFormMessage('Please fill in all required fields.');
      setMessageColor('red');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await reservationAPI.create(reservationData);
      setFormMessage(`Thanks, ${reservationData.name}! Your reservation for ${reservationData.guests} guest(s) on ${reservationData.date} at ${reservationData.time} has been confirmed.`);
      setMessageColor('green');
      e.target.reset();
    } catch (error) {
      setFormMessage(error.message || 'Failed to submit reservation. Please try again.');
      setMessageColor('red');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservations" className="section section-alt">
      <h2 className="section-title">
        <span className="symbol">&mdash;</span> Reservations <span className="symbol">&mdash;</span>
      </h2>
      <p className="reservation-description">
        Book your table and enjoy an unforgettable dining experience.
      </p>
      <form id="reservationForm" className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input type="date" id="date" name="date" required />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time *</label>
          <input type="time" id="time" name="time" required />
        </div>

        <div className="form-group">
          <label htmlFor="guests">Number of Guests *</label>
          <input type="number" id="guests" name="guests" min="1" max="20" defaultValue="2" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Special Requests</label>
          <textarea id="message" name="message" rows="3"></textarea>
        </div>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
        </button>
        {formMessage && (
          <p id="formMessage" className="form-message" style={{ color: messageColor }}>
            {formMessage}
          </p>
        )}
      </form>
    </section>
  );
}

export default Reservations;
