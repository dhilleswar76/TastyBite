import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const { totalItemsCount, setIsCartOpen, loyaltyPoints, openOrderTracker } = useCart();

  useEffect(() => {
    // Check if user is logged in
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
  }, [location]);

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

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="header">
      {/* Brand Logo */}
      <Link to="/" className="logo">
        <img src="/pictures-restaurant/restaurant-logo.webp" alt="TastyBite Logo" />
        <span>TastyBite</span>
      </Link>

      {/* Main Navigation Bar */}
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        {!isAuthPage && !isAdminPage && (
          <>
            <a href="#home" onClick={() => setShowNav(false)}>Home</a>
            <a href="#about" onClick={() => setShowNav(false)}>About</a>
            <a href="#menu" onClick={() => setShowNav(false)}>Menu</a>
            <a href="#ambiance" onClick={() => setShowNav(false)}>Ambiance</a>
            <a href="#reservations" onClick={() => setShowNav(false)}>Reservations</a>
            <a href="#events" onClick={() => setShowNav(false)}>Events</a>
            <a href="#reviews" onClick={() => setShowNav(false)}>Reviews</a>
            <a href="#contact" onClick={() => setShowNav(false)}>Contact</a>
          </>
        )}
      </nav>

      {/* Header Actions (Track, Cart Icon, Profile Icon) */}
      <div className="header-actions-group">
        {/* Track Order Quick Action */}
        <button
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

        {/* Profile Avatar / Icon (Rightmost) */}
        <div className="profile-dropdown-container" ref={profileRef}>
          <button
            type="button"
            className={`profile-icon-btn ${showProfileDropdown ? 'active' : ''}`}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            title="My Profile & Loyalty Rewards"
            aria-label="User Profile"
          >
            {isAuthenticated && user?.name ? (
              <span className="profile-initials">{getInitials(user.name)}</span>
            ) : (
              <span className="profile-icon-guest">👤</span>
            )}
          </button>

          {/* Profile Dropdown Popover (Compact Window) */}
          {showProfileDropdown && (
            <div className="profile-popover-card">
              {/* User Header Card */}
              <div className="profile-popover-header">
                <div className="popover-avatar">
                  {isAuthenticated && user?.name ? (
                    <span className="popover-avatar-initials">{getInitials(user.name)}</span>
                  ) : (
                    <span className="popover-avatar-icon">👤</span>
                  )}
                </div>
                <div className="popover-user-details">
                  <h4>{isAuthenticated && user?.name ? user.name : 'Guest Gourmet'}</h4>
                  <p>{isAuthenticated && user?.email ? user.email : 'Welcome to TastyBite!'}</p>
                  {isAuthenticated && (
                    <span className="member-tier-pill">⭐ VIP Foodie</span>
                  )}
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

                <a
                  href="#reservations"
                  className="popover-menu-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <span>📅 Table Reservations</span>
                  <span className="item-arrow">&rarr;</span>
                </a>

                <a
                  href="#events"
                  className="popover-menu-item"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <span>🎉 Event Inquiries</span>
                  <span className="item-arrow">&rarr;</span>
                </a>

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
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="profile-logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout Account
                  </button>
                ) : (
                  <div className="profile-auth-dual-btns">
                    <Link
                      to="/signin"
                      className="popover-signin-btn"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="popover-signup-btn"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer Toggle */}
        <button
          id="navToggle"
          className="nav-toggle"
          onClick={toggleNav}
          aria-label="Toggle navigation"
        >
          &#9776;
        </button>
      </div>
    </header>
  );
}

export default Header;
