import { Link } from 'react-router-dom';
import EventBooking from '../components/EventBooking';

function EventsPage() {
  return (
    <div className="page-wrapper events-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">Events &amp; Catering</span>
          </div>
          <h1>Host Your Celebrations With Us</h1>
          <p>
            Private banquets, corporate dinners, birthday celebrations, and live clay pot catering tailored to your guest list.
          </p>
        </div>
      </div>

      {/* Full Event Booking Suite */}
      <EventBooking />
    </div>
  );
}

export default EventsPage;
