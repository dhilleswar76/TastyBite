import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top-container">
        {/* Col 1: Brand & Tagline */}
        <div className="footer-col footer-brand-col">
          <div className="footer-logo-row">
            <img
              src="/pictures-restaurant/restaurant-logo.webp"
              alt="TastyBite Logo"
              className="footer-logo-img"
            />
            <span className="footer-brand-title">TastyBite</span>
          </div>
          <p className="footer-tagline">
            Authentic Indian fine-dining, slow-cooked clay pot biryanis, and traditional tandoori specialties crafted with fresh spices and culinary care.
          </p>
          <div className="footer-social-links">
            <a
              href="https://wa.me/918885636899"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              title="Chat on WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href="https://www.google.com/maps/place/Ambeerupeta,+Andhra+Pradesh/@18.4013201,84.1072338,15z/data=!3m1!4b1!4m6!3m5!1s0x3a3c4859c0875cf5:0x6756049bfdcee72d!8m2!3d18.3995865!4d84.1130006!16s%2Fg%2F12hkxmj9g"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              title="Google Maps"
            >
              Location
            </a>
            <a
              href="tel:+918885636899"
              className="footer-social-icon"
              title="Call Us"
            >
              Phone
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="footer-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links-list">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Our Heritage</a></li>
            <li><a href="#menu">Our Menu</a></li>
            <li><a href="#reservations">Table Booking</a></li>
            <li><a href="#events">Events &amp; Catering</a></li>
            <li><a href="#reviews">Guest Reviews</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        {/* Col 3: Hours */}
        <div className="footer-col">
          <h4 className="footer-col-title">Opening Hours</h4>
          <ul className="footer-hours-list">
            <li>
              <span className="day-name">Monday &ndash; Friday</span>
              <span className="hours-time">09:00 AM &ndash; 10:00 PM</span>
            </li>
            <li>
              <span className="day-name">Saturday &ndash; Sunday</span>
              <span className="hours-time">06:00 AM &ndash; 12:00 AM</span>
            </li>
            <li className="delivery-note">
              <span>Express Delivery Available</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Address */}
        <div className="footer-col">
          <h4 className="footer-col-title">Get In Touch</h4>
          <address className="footer-address">
            <p>Ambeerupeta village, Srikakulam dist,<br />Andhra Pradesh 532429</p>
            <p>
              Phone: <a href="tel:+918885636899">+91 88856 36899</a>
            </p>
            <p>
              Email: <a href="mailto:dilleswararaomalla410@gmail.com">dilleswararaomalla410@gmail.com</a>
            </p>
          </address>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>&copy; {currentYear} TastyBite Restaurant. All rights reserved.</p>
        <p className="footer-sub-text">Prepared with dedication to authentic Indian taste &amp; hospitality.</p>
      </div>
    </footer>
  );
}

export default Footer;
