import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import { menuItems } from '../data/menuData';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    dishRecommended: 'Chicken Dum Biryani',
    comment: '',
  });

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.getAll();
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (e) {
      console.warn('Reviews fetch fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) return;
    setSubmitting(true);
    try {
      const res = await reviewAPI.create(formData);
      const created = res.data || {
        ...formData,
        isVerified: true,
        createdAt: new Date(),
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      };
      setReviews([created, ...reviews]);
      setSuccessMsg('Thank you for your valuable feedback! ⭐');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
        setFormData({
          userName: '',
          userEmail: '',
          rating: 5,
          dishRecommended: 'Chicken Dum Biryani',
          comment: '',
        });
      }, 2000);
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="section reviews-section-wrap">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Guest Experiences <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Real stories and authentic dining moments from our food-loving community.
        </p>

        {/* Global Rating Badge */}
        <div className="overall-rating-card">
          <div className="rating-score">4.9</div>
          <div className="stars-and-count">
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <span>Based on 1,480+ verified guest reviews</span>
          </div>
          <button className="write-review-cta-btn" onClick={() => setShowModal(true)}>
            ✍️ Leave a Review
          </button>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="reviews-cards-grid">
        {reviews.map((rev, idx) => (
          <div key={rev._id || idx} className="review-card">
            <div className="review-card-top">
              <img
                src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={rev.userName}
                className="reviewer-avatar"
              />
              <div className="reviewer-info">
                <h4>{rev.userName}</h4>
                <div className="review-stars-row">
                  {'⭐'.repeat(rev.rating || 5)}
                  <span className="verified-badge">✓ Verified Diner</span>
                </div>
              </div>
            </div>

            <p className="review-comment-text">"{rev.comment}"</p>

            {rev.dishRecommended && (
              <div className="review-dish-tag">
                <span>Recommended: </span>
                <strong>{rev.dishRecommended}</strong>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="custom-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="custom-modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>

            <h3>Share Your Dining Experience</h3>
            <p className="modal-sub">How was your meal, service, and atmosphere at TastyBite?</p>

            {successMsg ? (
              <div className="review-success-box">{successMsg}</div>
            ) : (
              <form onSubmit={handleSubmit} className="review-form">
                <div className="rating-picker-row">
                  <label>Your Overall Rating:</label>
                  <div className="star-select-btns">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-pick-btn ${formData.rating >= star ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. priya@gmail.com"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Favorite Dish Recommended</label>
                  <select
                    value={formData.dishRecommended}
                    onChange={(e) => setFormData({ ...formData, dishRecommended: e.target.value })}
                  >
                    {menuItems.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Your Review Message *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tell us what you enjoyed most..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="submit-review-btn" disabled={submitting}>
                  {submitting ? 'Posting Review...' : 'Post Review ⭐'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewsSection;
