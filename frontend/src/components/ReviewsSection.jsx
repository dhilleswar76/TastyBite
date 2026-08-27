import { useState, useEffect, useRef } from 'react';
import { reviewAPI } from '../services/api';
import { menuItems } from '../data/menuData';
import { getAvatarGradient, getInitials } from '../utils/avatar';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 5,
    dishRecommended: 'Chicken Dum Biryani',
    comment: '',
    photos: [], // Food/dish photos related to the review
  });

  const loadCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        setCurrentUser(parsed);
        if (parsed.name) {
          setFormData((prev) => ({
            ...prev,
            userName: prev.userName || parsed.name,
            userEmail: prev.userEmail || parsed.email || '',
          }));
        }
      }
    } catch {
      setCurrentUser(null);
    }
  };

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
    loadCurrentUser();

    const handleProfileUpdate = () => {
      loadCurrentUser();
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  // Handle food / dining photos upload (multiple photos supported, client-side compressed)
  const handleFoodPhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 4 - (formData.photos?.length || 0);
    if (remainingSlots <= 0) {
      alert('You can upload up to 4 photos per review.');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds 8MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800; // Crisp food photo resolution
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setFormData((prev) => ({
            ...prev,
            photos: [...(prev.photos || []), compressedDataUrl],
          }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFoodPhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.comment) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        userAvatar: currentUser?.avatar || '', // Uses profile picture if set in profile
      };

      const res = await reviewAPI.create(payload);
      const created = res.data || {
        ...payload,
        isVerified: true,
        createdAt: new Date(),
      };

      setReviews([created, ...reviews]);
      setSuccessMsg('Thank you for sharing your review & food photos! ⭐');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
        setFormData({
          userName: currentUser?.name || '',
          userEmail: currentUser?.email || '',
          rating: 5,
          dishRecommended: 'Chicken Dum Biryani',
          comment: '',
          photos: [],
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
          Real stories, food photos, and authentic dining moments from our community.
        </p>

        {/* Global Rating Badge */}
        <div className="overall-rating-card">
          <div className="rating-score">4.9</div>
          <div className="stars-and-count">
            <div className="stars-row">⭐⭐⭐⭐⭐</div>
            <span>Based on 1,480+ verified guest reviews</span>
          </div>
          <button
            className="write-review-cta-btn"
            onClick={() => {
              loadCurrentUser();
              setShowModal(true);
            }}
          >
            ✍️ Leave a Review &amp; Photos
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

            {/* Food/Dish Review Photos Gallery */}
            {rev.photos && rev.photos.length > 0 && (
              <div className="review-photos-gallery">
                {rev.photos.map((photoUrl, photoIdx) => (
                  <button
                    key={photoIdx}
                    type="button"
                    className="review-photo-thumb-btn"
                    onClick={() => setSelectedLightboxPhoto(photoUrl)}
                    title="Click to view full photo"
                  >
                    <img
                      src={photoUrl}
                      alt={`Dining photo ${photoIdx + 1}`}
                      className="review-photo-thumb"
                      loading="lazy"
                    />
                    <span className="thumb-zoom-icon">🔍</span>
                  </button>
                ))}
              </div>
            )}

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
            <p className="modal-sub">Tell fellow foodies how your meal and dishes were at TastyBite!</p>

            {successMsg ? (
              <div className="review-success-box">{successMsg}</div>
            ) : (
              <form onSubmit={handleSubmit} className="review-form">
                {/* Reviewer Header Info Banner */}
                <div className="reviewer-posting-as-row">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="Your profile"
                      className="reviewer-avatar mini"
                    />
                  ) : (
                    <div
                      className="reviewer-avatar alphabet-avatar mini"
                      style={{ background: getAvatarGradient(formData.userName || currentUser?.name || 'Guest') }}
                    >
                      {getInitials(formData.userName || currentUser?.name || 'Guest')}
                    </div>
                  )}
                  <span className="posting-as-txt">
                    Posting review as <strong>{formData.userName || currentUser?.name || 'Guest Diner'}</strong>
                  </span>
                </div>

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
                    placeholder="Describe the flavors, ambiance, service, and dishes you enjoyed..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  ></textarea>
                </div>

                {/* Dish / Dining Photos Attachment Section */}
                <div className="review-photo-upload-section">
                  <div className="photo-upload-header-row">
                    <label>📸 Add Food / Dish Photos (Optional)</label>
                    <span className="photo-count-pill">{formData.photos.length}/4 Photos</span>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="review-upload-previews-grid">
                      {formData.photos.map((imgSrc, pIdx) => (
                        <div key={pIdx} className="upload-preview-card">
                          <img src={imgSrc} alt={`Dish preview ${pIdx + 1}`} className="preview-dish-img" />
                          <button
                            type="button"
                            className="remove-preview-photo-btn"
                            onClick={() => removeFoodPhoto(pIdx)}
                            title="Remove photo"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.photos.length < 4 && (
                    <div className="upload-trigger-row">
                      <button
                        type="button"
                        className="add-dish-photo-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span>+ Attach Dish Photos</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFoodPhotosUpload}
                      />
                      <span className="upload-hint-txt">Showcase biryanis, curries, or your dining table snapshots</span>
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-review-btn" disabled={submitting}>
                  {submitting ? 'Posting Review...' : 'Post Review & Photos ⭐'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {selectedLightboxPhoto && (
        <div className="custom-modal-overlay photo-lightbox-overlay" onClick={() => setSelectedLightboxPhoto(null)}>
          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedLightboxPhoto(null)}
            >
              ✕
            </button>
            <img src={selectedLightboxPhoto} alt="Enlarged Food Snapshot" className="lightbox-img" />
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewsSection;
