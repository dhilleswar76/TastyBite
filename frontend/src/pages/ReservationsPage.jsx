import { Link } from 'react-router-dom';
import Reservations from '../components/Reservations';

function ReservationsPage() {
  return (
    <div className="page-wrapper reservations-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">Table Reservations</span>
          </div>
          <h1>Book a Table at TastyBite</h1>
          <p>
            Reserve your preferred dining area &mdash; Main Dining Hall, Romantic Rooftop Starlit Seating, or VIP Private Lounge.
          </p>
        </div>
      </div>

      {/* Full Reservations Suite */}
      <Reservations />
    </div>
  );
}

export default ReservationsPage;
