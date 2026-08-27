import { Link } from 'react-router-dom';
import About from '../components/About';
import AmbianceGallery from '../components/AmbianceGallery';

function AboutPage() {
  return (
    <div className="page-wrapper about-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">About Our Heritage</span>
          </div>
          <h1>Our Story, Craft &amp; Ambiance</h1>
          <p>
            Dedicated to the time-honored traditions of slow earthen pot cooking, fresh spices, and royal hospitality.
          </p>
        </div>
      </div>

      {/* Culinary Heritage Story */}
      <About />

      {/* Ambiance & Dining Rooms Photo Gallery */}
      <AmbianceGallery />

      {/* Call to action */}
      <section className="section about-bottom-cta">
        <div className="reserve-cta-banner">
          <div className="reserve-cta-content">
            <span className="gold-badge">EXPERIENCE TASTYBITE</span>
            <h2>Ready To Taste Royal Flavors?</h2>
            <p>Visit us in person or have your favorite dishes delivered hot and fresh.</p>
            <div className="reserve-cta-btns">
              <Link to="/menu" className="btn btn-primary">
                Explore The Menu &rarr;
              </Link>
              <Link to="/reservations" className="btn btn-secondary">
                Book a Table &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
