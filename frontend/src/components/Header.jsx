import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAvatarGradient, getInitials } from '../utils/avatar';
import ProfileEditModal from './ProfileEditModal';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const { totalItemsCount, setIsCartOpen, loyaltyPoints, openOrderTracker } = useCart();

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
  }, [location]);

  // Listen to profile updates across the app
  useEffect(() => {
    const handleProfileUpdate = () => {
      loadUserData();
    };
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/signup' || location.pathname === '/signin';
  const isAdminPage = location.pathname === '/admin';

  return (
    <header className="header">
      {/* Brand Logo (Left) */}
      <Link to="/" className="logo">
        <img src="/pictures-restaurant/restaurant-logo.webp" alt="TastyBite Logo" />
        <span>TastyBite</span>
      </Link>

      {/* Header Actions (Right: Track, Cart, Profile, 3-Lines Toggle Menu) */}
      <div className="header-actions-group">
        {/* Track Order Quick Action */}
        <button
          type="button"
          className="nav-tracker-btn"
          onClick={() => {
            setShowNav(false);
            openOrderTracker();
          }}
          title="Track Live Order Status"
        >
          📍 Track Order
        </button>

        {/* Cart Icon Button (Symbol Only + Badge) */}
        <button
          type="button"
          className="header-cart-icon-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Shopping Cart"
          title="Open Shopping Cart"
        >
          <span className="cart-symbol">🛒</span>
          {totalItemsCount > 0 && (
            <span className="cart-badge-dot">{totalItemsCount}</span>
          )}
        </button>

        {/* Profile Avatar / Icon */}
        <div className="profile-dropdown-container" ref={profileRef}>
          <button
            type="button"
            className={`profile-icon-btn ${showProfileDropdown ? 'active' : ''}`}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            title="My Profile & Loyalty Rewards"
            aria-label="User Profile"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="header-profile-avatar-img" />
            ) : isAuthenticated && user?.name ? (
              <span
                className="profile-initials"
                style={{ background: getAvatarGradient(user.name) }}
              >
                {getInitials(user.name)}
              </span>
            ) : (
              <span className="profile-icon-guest">👤</span>
            )}
          </button>

          {/* Profile Dropdown Popover */}
          {showProfileDropdown && (
            <div className="profile-popover-card">
              {isAuthenticated ? (
                <>
                  {/* User Header Card */}
                  <div className="profile-popover-header">
                    <div className="popover-avatar-wrap">
                      <div className="popover-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Profile" className="popover-avatar-img" />
                        ) : (
                          <div
                            className="popover-avatar-initials"
                            style={{ background: getAvatarGradient(user?.name || 'User') }}
                          >
                            {getInitials(user?.name || 'User')}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="popover-edit-avatar-icon-btn"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setShowProfileEditModal(true);
                        }}
                        title="Edit Profile Picture"
                      >
                        📷
                      </button>
                    </div>

                    <div className="popover-user-details">
                      <h4>{user?.name || 'Valued Diner'}</h4>
                      <p>{user?.email || 'TastyBite Member'}</p>
                      <span className="member-tier-pill">👑 VIP Diner</span>
                    </div>
                  </div>

                  {/* TastyPoints Loyalty Wallet Section */}
                  <div className="profile-loyalty-section">
                    <div className="loyalty-box-top">
                      <span className="loyalty-title">🎁 TastyPoints Wallet</span>
                      <strong className="loyalty-pts-tag">{loyaltyPoints} pts</strong>
                    </div>
                    <p className="loyalty-worth-txt">
                      Equivalent to <strong>₹{(loyaltyPoints / 2).toFixed(0)} discount</strong> at checkout.
                    </p>
                    <div className="loyalty-progress-track">
                      <div
                        className="loyalty-progress-fill"
                        style={{ width: `${Math.min(100, (loyaltyPoints / 500) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="loyalty-tip-txt">Earn 10 points on every ₹100 spent!</span>
                  </div>

                  {/* Quick Navigation Links */}
                  <div className="profile-popover-menu">
                    <Link
                      to="/profile"
                      className="popover-menu-item view-profile-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span>👤 My Account &amp; Rewards Page</span>
                      <span className="item-arrow">&rarr;</span>
                    </Link>

                    <button
                      type="button"
                      className="popover-menu-item edit-profile-item"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setShowProfileEditModal(true);
                      }}
                    >
                      <span>🖼️ Edit Profile &amp; Picture</span>
                      <span className="item-arrow">&rarr;</span>
                    </button>

                    <button
                      type="button"
                      className="popover-menu-item"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        openOrderTracker();
                      }}
                    >
                      <span>📍 Track Active Order</span>
                      <span className="item-arrow">&rarr;</span>
                    </button>

                    <Link
                      to="/reservations"
                      className="popover-menu-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span>📅 Table Reservations</span>
                      <span className="item-arrow">&rarr;</span>
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="popover-menu-item admin-item"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <span>⚙️ Operations Control (Admin)</span>
                        <span className="item-arrow">&rarr;</span>
                      </Link>
                    )}
                  </div>

                  {/* Authentication Footer Action */}
                  <div className="profile-popover-footer">
                    <button
                      type="button"
                      className="profile-logout-btn"
                      onClick={handleLogout}
                    >
                      🚪 Logout Account
                    </button>
                  </div>
                </>
              ) : (
                /* Unauthenticated Popover: Direct Sign In / Sign Up Gate */
                <div className="popover-guest-auth-box">
                  <div className="popover-guest-header">
                    <span className="guest-icon-badge">🔐</span>
                    <h4>Account Access</h4>
                    <p>Sign in or create an account to view your profile, rewards wallet &amp; order history.</p>
                  </div>

                  <div className="popover-auth-action-buttons">
                    <Link
                      to="/signin"
                      className="popover-signin-primary-btn"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      🔑 Sign In to Account
                    </Link>
                    <Link
                      to="/signup"
                      className="popover-signup-secondary-btn"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      ✨ Create Free Account (Sign Up)
                    </Link>
                  </div>

                  <div className="popover-quick-guest-links">
                    <button
                      type="button"
                      className="popover-menu-item"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        openOrderTracker();
                      }}
                    >
                      <span>📍 Track Live Order</span>
                      <span className="item-arrow">&rarr;</span>
                    </button>
                    <Link
                      to="/reservations"
                      className="popover-menu-item"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <span>📅 Table Reservations</span>
                      <span className="item-arrow">&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3-Lines Toggle Menu Button (Right-most End of Nav Bar) */}
        <button
          id="navToggle"
          type="button"
          className={`nav-toggle ${showNav ? 'active' : ''}`}
          onClick={toggleNav}
          aria-label="Toggle navigation menu"
          aria-expanded={showNav}
          title="Open Menu"
        >
          <span className="nav-toggle-icon">{showNav ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Slide-out Navigation Drawer (Holds ALL menu items & quick actions) */}
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        {!isAuthPage && !isAdminPage && (
          <>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">✨ Explore TastyBite</span>
              <button
                type="button"
                className="mobile-nav-close-btn"
                onClick={() => setShowNav(false)}
                aria-label="Close menu"
                title="Close Navigation"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              className="mobile-drawer-tracker-btn"
              onClick={() => {
                setShowNav(false);
                openOrderTracker();
              }}
            >
              <span>📍 Track Live Order</span>
              <span className="drawer-badge">Live Status</span>
            </button>

            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>🏠 Home</span>
            </NavLink>
            <NavLink
              to="/menu"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>🍲 Menu &amp; Order</span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>📖 Our Story &amp; Heritage</span>
            </NavLink>
            <NavLink
              to="/reservations"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>📅 Table Reservations</span>
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>🎉 Events &amp; Catering</span>
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>⭐ Guest Reviews</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setShowNav(false)}
            >
              <span>📞 Contact &amp; Location</span>
            </NavLink>

            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <NavLink
                  to="/profile"
                  className="mobile-drawer-profile-btn"
                  onClick={() => setShowNav(false)}
                >
                  <span>👤 My Profile &amp; Rewards ({loyaltyPoints} pts)</span>
                </NavLink>
              ) : (
                <div className="mobile-drawer-auth-btns">
                  <Link
                    to="/signin"
                    className="drawer-signin-btn"
                    onClick={() => setShowNav(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="drawer-signup-btn"
                    onClick={() => setShowNav(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Nav Backdrop Overlay */}
      {showNav && (
        <div
          className="nav-backdrop"
          onClick={() => setShowNav(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowProfileEditModal(false)}
          onUserUpdated={(updated) => setUser(updated)}
        />
      )}
    </header>
  );
}

export default Header;
