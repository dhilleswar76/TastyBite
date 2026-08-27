import { Link } from 'react-router-dom';
import Menu from '../components/Menu';

function MenuPage() {
  return (
    <div className="page-wrapper menu-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">Our Menu</span>
          </div>
          <h1>Explore Our Authentic Menu</h1>
          <p>
            From royal handi dum biryanis to smoky clay-pot tandoor appetizers, artisanal curries, and handcrafted desserts.
          </p>
        </div>
      </div>

      {/* Full Interactive Menu Suite */}
      <Menu />
    </div>
  );
}

export default MenuPage;
