import { useState } from 'react';

function Header() {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite Logo" />
        TastyBite
      </div>
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#menu">Menu</a>
        <a href="#reservations">Reservations</a>
        <a href="#contact">Contact</a>
      </nav>
      <button id="navToggle" className="nav-toggle" onClick={toggleNav}>
        &#9776;
      </button>
    </header>
  );
}

export default Header;
