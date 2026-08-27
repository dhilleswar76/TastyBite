import { Link } from 'react-router-dom';
import Contact from '../components/Contact';

function ContactPage() {
  return (
    <div className="page-wrapper contact-page">
      {/* Page Header Banner */}
      <div className="page-hero-banner">
        <div className="page-hero-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">&bull;</span>
            <span className="current">Contact Us</span>
          </div>
          <h1>Get in Touch &amp; Find Us</h1>
          <p>
            We are here to assist with reservations, large event orders, feedback, and special requests.
          </p>
        </div>
      </div>

      {/* Full Contact Suite */}
      <Contact />
    </div>
  );
}

export default ContactPage;
