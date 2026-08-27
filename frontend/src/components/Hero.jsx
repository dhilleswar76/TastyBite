import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <span className="hero-badge">✨ ROYAL FLAVORS &amp; LUXURY DINING</span>
        <h1>Authentic Flavors. Unforgettable Memories.</h1>
        <p>
          Experience handcrafted dum biryanis, clay oven tandoori delicacies, and artisanal desserts prepared with royal spices and pure culinary passion.
        </p>
        <div className="hero-btn-group">
          <Link to="/menu" className="btn-hero-primary">
            Explore Menu &amp; Order 🛒
          </Link>
          <Link to="/reservations" className="btn-hero-secondary">
            Reserve a Table 📅
          </Link>
        </div>
        <div className="hero-highlights-strip">
          <div className="highlight-item">⭐ 4.9/5 (1,480+ Diners)</div>
          <div className="highlight-item">🌙 100% Halal Certified</div>
          <div className="highlight-item">🛵 ~30 Min Express Delivery</div>
          <div className="highlight-item">👑 Master Chefs</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
