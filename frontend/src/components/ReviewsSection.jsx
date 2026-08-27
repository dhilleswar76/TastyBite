import { useState, useEffect, useRef } from 'react';
import { reviewAPI } from '../services/api';
import { menuItems } from '../data/menuData';

// Generates a consistent, vibrant gradient based on the reviewer's name
export const getAvatarGradient = (name = '') => {
  const gradients = [
    'linear-gradient(135deg, #ff5722 0%, #d84315 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

// Extracts user initials (e.g. "Priya Sharma" -> "PS", "Vikram" -> "V")
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TB';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const PRESET_AVATARS = [
  { label: 'Chef', emoji: '👨‍🍳' },
  { label: 'Foodie', emoji: '👩‍🍳' },
  { label: 'Gourmet', emoji: '😋' },
  { label: 'Biryani Fan', emoji: '🍛' },
  { label: 'Tandoor Fan', emoji: '🍗' },
  { label: 'Dessert Lover', emoji: '🍨' },
  { label: 'VIP Diner', emoji: '👑' },
  { label: 'Star Foodie', emoji: '🌟' },
];

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    dishRecommended: 'Chicken Dum Biryani',
    comment: '',
    userAvatar: '',
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

  // Handle image upload with auto-compression via Canvas
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, userAvatar: compressedDataUrl }));
        setShowPresets(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (emoji) => {
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1c1611"/><text x="50%" y="54%" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
    setFormData((prev) => ({ ...prev, userAvatar: dataUri }));
    setShowPresets(false);
  };

  const handleResetToAlphabet = () => {
    setFormData((prev) => ({ ...prev, userAvatar: '' }));
    setShowPresets(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
        userAvatar: formData.userAvatar || '',
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
          userAvatar: '',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
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
              {rev.userAvatar ? (
                <img
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="reviewer-avatar"
                />
              ) : (
                <div
                  className="reviewer-avatar alphabet-avatar"
                  style={{ background: getAvatarGradient(rev.userName) }}
                  title={rev.userName}
                >
                  {getInitials(rev.userName)}
                </div>
              )}
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

                {/* Profile Avatar Selection & Alphabet Preview Section */}
                <div className="avatar-picker-section">
                  <label className="avatar-picker-title">Profile Picture / Avatar</label>
                  <div className="avatar-preview-row">
                    <div className="avatar-preview-box">
                      {formData.userAvatar ? (
                        <img
                          src={formData.userAvatar}
                          alt="Avatar Preview"
                          className="reviewer-avatar preview-img"
                        />
                      ) : (
                        <div
                          className="reviewer-avatar alphabet-avatar preview-badge"
                          style={{ background: getAvatarGradient(formData.userName || 'Guest') }}
                        >
                          {getInitials(formData.userName || 'Guest')}
                        </div>
                      )}
                    </div>
                    <div className="avatar-options-col">
                      <span className="avatar-mode-hint">
                        {formData.userAvatar
                          ? 'Custom photo/avatar selected'
                          : `Alphabet initials (${getInitials(formData.userName || 'Guest')})`}
                      </span>
                      <div className="avatar-action-buttons">
                        <button
                          type="button"
                          className="avatar-btn upload"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          📷 Upload Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                        <button
                          type="button"
                          className="avatar-btn presets"
                          onClick={() => setShowPresets(!showPresets)}
                        >
                          🎨 Choose Avatar
                        </button>
                        {formData.userAvatar && (
                          <button
                            type="button"
                            className="avatar-btn reset"
                            onClick={handleResetToAlphabet}
                            title="Reset to alphabet initials"
                          >
                            🔤 Use Initials
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preset Avatars Drawer */}
                  {showPresets && (
                    <div className="avatar-presets-drawer">
                      <div className="presets-header">
                        <span>Select a foodie icon:</span>
                        <button
                          type="button"
                          className="close-presets-btn"
                          onClick={() => setShowPresets(false)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="presets-grid">
                        {PRESET_AVATARS.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            className="preset-chip"
                            onClick={() => handleSelectPreset(p.emoji)}
                            title={p.label}
                          >
                            <span className="preset-emoji">{p.emoji}</span>
                            <span className="preset-name">{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
