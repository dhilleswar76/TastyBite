import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { totalItemsCount, setIsCartOpen } = useCart();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [location]);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/signup' || location.pathname === '/signin';
  const isAdminPage = location.pathname === '/admin';

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite Logo" />
        TastyBite
      </Link>
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        {!isAuthPage && !isAdminPage && (
          <>
            <a href="#home" onClick={() => setShowNav(false)}>Home</a>
            <a href="#about" onClick={() => setShowNav(false)}>About</a>
            <a href="#menu" onClick={() => setShowNav(false)}>Menu</a>
            <a href="#reservations" onClick={() => setShowNav(false)}>Reservations</a>
            <a href="#contact" onClick={() => setShowNav(false)}>Contact</a>
          </>
        )}

        <Link to="/admin" className="admin-nav-link" onClick={() => setShowNav(false)}>
          ⚙️ Admin
        </Link>
        
        {isAuthenticated ? (
          <>
            <span className="user-name">Hello, {user?.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin" onClick={() => setShowNav(false)}>Sign In</Link>
            <Link to="/signup" onClick={() => setShowNav(false)}>Sign Up</Link>
          </>
        )}
      </nav>

      {/* Cart button in header */}
      <div className="header-actions-group">
        <button
          className="header-cart-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Shopping Cart"
          title="Open Cart"
        >
          <span className="cart-btn-icon">🛒</span>
          <span className="cart-btn-text">Cart</span>
          <span className="cart-badge-count">{totalItemsCount}</span>
        </button>

        <button id="navToggle" className="nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
          &#9776;
        </button>
      </div>
    </header>
  );
}

export default Header;
