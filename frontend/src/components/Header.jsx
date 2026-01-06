import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Check if we're on an auth page
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/signin';

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite Logo" />
        TastyBite
      </Link>
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        {!isAuthPage && (
          <>
            <a href="#home" onClick={() => setShowNav(false)}>Home</a>
            <a href="#about" onClick={() => setShowNav(false)}>About</a>
            <a href="#menu" onClick={() => setShowNav(false)}>Menu</a>
            <a href="#reservations" onClick={() => setShowNav(false)}>Reservations</a>
            <a href="#contact" onClick={() => setShowNav(false)}>Contact</a>
          </>
        )}
        
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
      <button id="navToggle" className="nav-toggle" onClick={toggleNav}>
        &#9776;
      </button>
    </header>
  );
}

export default Header;
