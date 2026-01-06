function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <img src="/pictures-restaurant/restaurant-logo.png" alt="TastyBite Logo" className="footer-logo" />
      <span className="footer-logo1">TastyBite</span>
      <p className="footer-content1">&copy; {currentYear} TastyBite Restaurant. All rights reserved.</p>
      <p className="footer-content2">Made with love for food enthusiasts</p>
    </footer>
  );
}

export default Footer;
