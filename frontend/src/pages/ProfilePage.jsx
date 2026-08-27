import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import ProfileEditModal from '../components/ProfileEditModal';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const { loyaltyPoints, openOrderTracker } = useCart();

  const loadUserData = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserData();

    const handleProfileUpdate = () => {
      loadUserData();
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.dispatchEvent(new Event('user-profile-updated'));
    navigate('/');
  };

  return (
    <div className="page-wrapper profile-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">User Profile</span>
          </div>
          <h1>My Account &amp; Rewards</h1>
          <p>
            Manage your personal profile photo, view your loyalty rewards balance, and track orders.
          </p>
        </div>
      </div>

      <div className="profile-page-container">
        {/* Main Profile Card */}
        <div className="profile-hero-card">
          <div className="profile-hero-avatar-side">
            <div className="profile-large-avatar-wrap">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="profile-large-avatar-img" />
              ) : isAuthenticated && user?.name ? (
                <div
                  className="profile-large-avatar-initials"
                  style={{ background: getAvatarGradient(user.name) }}
                >
                  {getInitials(user.name)}
                </div>
              ) : (
                <div className="profile-large-avatar-guest">👤</div>
              )}
            </div>
            {isAuthenticated && (
              <button
                type="button"
                className="profile-change-avatar-btn"
                onClick={() => setShowEditModal(true)}
              >
                📷 Edit Photo / Initials
              </button>
            )}
          </div>

          <div className="profile-hero-info-side">
            <div className="profile-name-tier-row">
              <h2>{isAuthenticated && user?.name ? user.name : 'Guest Gourmet'}</h2>
              {isAuthenticated ? (
                <span className="profile-tier-badge">👑 VIP Diner Member</span>
              ) : (
                <span className="profile-guest-badge">Guest Account</span>
              )}
            </div>
            <p className="profile-email-txt">
              {isAuthenticated && user?.email ? user.email : 'Log in to sync your orders, points, and reservations.'}
            </p>

            {isAuthenticated ? (
              <div className="profile-quick-meta-grid">
                <div className="meta-card">
                  <span className="meta-label">Member Since</span>
                  <strong>August 2026</strong>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Account Role</span>
                  <strong className="capitalize-txt">{user?.role || 'user'}</strong>
                </div>
                <div className="meta-card">
                  <span className="meta-label">Verification</span>
                  <strong className="verified-green-txt">✓ Verified</strong>
                </div>
              </div>
            ) : (
              <div className="profile-login-prompt">
                <Link to="/signin" className="btn btn-primary">
                  Sign In to Account
                </Link>
                <Link to="/signup" className="btn btn-secondary">
                  Create Free Account
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Loyalty Wallet Card */}
        <div className="profile-loyalty-wallet-card">
          <div className="wallet-card-header">
            <div className="wallet-icon-title">
              <span className="wallet-symbol">🎁</span>
              <div>
                <h3>TastyPoints Loyalty Wallet</h3>
                <p>Earn points on every order and redeem for instant checkout discounts.</p>
              </div>
            </div>
            <div className="wallet-points-badge">
              <strong>{loyaltyPoints}</strong>
              <span>TastyPoints</span>
            </div>
          </div>

          <div className="wallet-metrics-row">
            <div className="wallet-metric-box">
              <span>Redeemable Discount</span>
              <strong>₹{(loyaltyPoints / 2).toFixed(0)} OFF</strong>
            </div>
            <div className="wallet-metric-box">
              <span>Earning Multiplier</span>
              <strong>10 pts / ₹100</strong>
            </div>
            <div className="wallet-metric-box">
              <span>Current Status</span>
              <strong>Active &bull; VIP Tier</strong>
            </div>
          </div>

          <div className="wallet-progress-bar-wrap">
            <div className="progress-labels">
              <span>Tier Progress (to next ₹100 voucher)</span>
              <span>{Math.min(100, Math.round((loyaltyPoints / 500) * 100))}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (loyaltyPoints / 500) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Account Navigation Grid */}
        <div className="profile-actions-grid">
          <button
            type="button"
            className="profile-action-tile"
            onClick={openOrderTracker}
          >
            <span className="tile-icon">📍</span>
            <div className="tile-content">
              <h4>Live Order Tracker</h4>
              <p>Check the live preparation and delivery status of your orders.</p>
            </div>
            <span className="tile-arrow">&rarr;</span>
          </button>

          <Link to="/reservations" className="profile-action-tile">
            <span className="tile-icon">📅</span>
            <div className="tile-content">
              <h4>Table Reservations</h4>
              <p>Book a table for fine dining, rooftop views, or private lounges.</p>
            </div>
            <span className="tile-arrow">&rarr;</span>
          </Link>

          <Link to="/menu" className="profile-action-tile">
            <span className="tile-icon">🍲</span>
            <div className="tile-content">
              <h4>Explore Our Menu</h4>
              <p>Browse signature biryanis, tandoor specials, and desserts.</p>
            </div>
            <span className="tile-arrow">&rarr;</span>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" className="profile-action-tile admin-tile">
              <span className="tile-icon">⚙️</span>
              <div className="tile-content">
                <h4>Restaurant Operations (Admin)</h4>
                <p>Live Kitchen Display (KDS), menu manager, analytics &amp; orders.</p>
              </div>
              <span className="tile-arrow">&rarr;</span>
            </Link>
          )}
        </div>

        {/* Sign Out Row */}
        {isAuthenticated && (
          <div className="profile-footer-actions">
            <button
              type="button"
              className="profile-signout-btn"
              onClick={handleLogout}
            >
              🚪 Sign Out of Account
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={(updated) => setUser(updated)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
