import { useState } from 'react';

function Reservations() {
  const [formMessage, setFormMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const date = formData.get('date');
    const time = formData.get('time');
    const guests = formData.get('guests');

    if (!name || !email || !date || !time || !guests) {
      setFormMessage('Please fill in all required fields.');
      setMessageColor('red');
      return;
    }

    setFormMessage(`Thanks, ${name}! Your reservation for ${guests} guest(s) on ${date} at ${time} has been received.`);
    setMessageColor('green');

    e.target.reset();
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

        <button type="submit" className="btn">
          Submit Reservation
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
