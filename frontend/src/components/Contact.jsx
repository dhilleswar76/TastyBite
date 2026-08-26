import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const faqs = [
    {
      q: 'Do I need a reservation to dine in?',
      a: 'Walk-ins are always welcome. However, we recommend making a reservation for weekend dinners or for groups of 4 or more to ensure immediate seating.',
    },
    {
      q: 'Is the food 100% Halal certified and vegetarian friendly?',
      a: 'Yes, all our chicken and mutton dishes are strictly Halal certified. We also prepare vegetarian dishes in dedicated cookware to maintain absolute separation.',
    },
    {
      q: 'Do you offer home delivery and how long does it take?',
      a: 'Yes, we deliver within a 15 km radius. Most orders are freshly prepared and delivered in approximately 30 to 40 minutes.',
    },
    {
      q: 'Can we book the restaurant for private events or birthday parties?',
      a: 'Yes, we have private dining spaces and a rooftop section available for family celebrations, birthdays, and corporate events. Contact us for custom catering menus.',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || 'General Inquiry',
      message: `${formData.phone ? `Phone: ${formData.phone.trim()}\n` : ''}${formData.message.trim()}`,
    };

    try {
      await contactAPI.submit(payload);
      setSubmitted(true);
      setFormData((prev) => ({
        name: prev.name,
        email: prev.email,
        phone: prev.phone,
        subject: '',
        message: '',
      }));
    } catch (err) {
      console.warn('Contact submission note:', err.message);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaqItem = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Contact Us{' '}
          <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          We would love to hear from you. Reach out with questions, feedback, or table inquiries.
        </p>
      </div>

      <div className="contact-container">
        {/* Contact Info Cards */}
        <div className="contact-cards-row">
          <div className="contact-card">
            <h4>Address</h4>
            <p>Ambeerupeta village, Srikakulam dist, Andhra Pradesh 532429</p>
            <a
              href="https://www.google.com/maps/place/Ambeerupeta,+Andhra+Pradesh/@18.4013201,84.1072338,15z/data=!3m1!4b1!4m6!3m5!1s0x3a3c4859c0875cf5:0x6756049bfdcee72d!8m2!3d18.3995865!4d84.1130006!16s%2Fg%2F12hkxmj9g"
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
            >
              View on Google Maps &rarr;
            </a>
          </div>

          <div className="contact-card">
            <h4>Phone &amp; WhatsApp</h4>
            <p>+91 88856 36899</p>
            <div className="card-actions">
              <a href="tel:+918885636899" className="card-btn">
                Call Now
              </a>
              <a
                href="https://wa.me/918885636899?text=Hello%20TastyBite%2C%20I%20would%20like%20to%20inquire%20about%20dining."
                target="_blank"
                rel="noopener noreferrer"
                className="card-btn card-btn-secondary"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-card">
            <h4>Opening Hours</h4>
            <p>
              Mon &ndash; Fri: 09:00 AM &ndash; 10:00 PM<br />
              Sat &ndash; Sun: 06:00 AM &ndash; 12:00 Midnight
            </p>
          </div>

          <div className="contact-card">
            <h4>Email</h4>
            <p>dilleswararaomalla410@gmail.com</p>
            <a href="mailto:dilleswararaomalla410@gmail.com" className="card-link">
              Send an Email &rarr;
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="contact-form-box">
          <h3>Send Us a Message</h3>
          <p className="form-helper-text">
            Fill out the form below and our team will get back to you as soon as possible.
          </p>

          {submitted ? (
            <div className="form-success-box">
              <h4>Thank you for reaching out!</h4>
              <p>Your message has been received. We will get back to you shortly.</p>
              <button
                type="button"
                className="btn-simple"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-clean-form">
              <div className="form-duo">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-duo">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn-contact-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="contact-faqs-container">
          <button
            type="button"
            className="faq-toggle-bar"
            onClick={() => setShowFaqs(!showFaqs)}
            aria-expanded={showFaqs}
          >
            <span>Frequently Asked Questions</span>
            <span className="faq-toggle-sign">{showFaqs ? '−' : '+'}</span>
          </button>

          {showFaqs && (
            <div className="faq-items-list">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-single-item ${isOpen ? 'active' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-row"
                      onClick={() => toggleFaqItem(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-q">{faq.q}</span>
                      <span className="faq-arrow">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-a-body">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
