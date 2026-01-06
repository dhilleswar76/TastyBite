function Contact() {
  return (
    <section id="contact" className="section section-alt">
      <h2 className="section-title">
        <span className="sym">&mdash;</span> Contact us <span className="sym">&mdash;</span>
      </h2>
      <p className="contact-content">We&apos;d love to hear from you. Reach out anytime!</p>
      <div className="contact-grid">
        <div className="contact-div">
          <br />
          <div className="contact-symbols">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7s"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="12" cy="9" r="2.5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h3 id="contact-head">Visit Us</h3>
          <p>Ambeerupeta village, Srikakulam dist, Andhra Pradesh 532429</p>
        </div>
        <div className="contact-div">
          <div className="contact-symbols">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
              <path d="M12 7v5l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 id="contact-head">Opening Hours</h3>
          <p>
            Mon-Fri: 09:00 - 22:00
            <br />
            Sat-Sun: 06:00 - 24:00
          </p>
        </div>
        <div className="contact-div">
          <div className="contact-symbols">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2
            A19.86 19.86 0 0 1 3 5.18
            2 2 0 0 1 5 3h3
            a2 2 0 0 1 2 1.72
            c.12.9.32 1.76.6 2.58
            a2 2 0 0 1-.45 2.11L9 10.91
            a16 16 0 0 0 6 6l1.5-1.5
            a2 2 0 0 1 2.11-.45
            c.82.28 1.68.48 2.58.6
            a2 2 0 0 1 1.81 1.76z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 id="contact-head">Get in Touch</h3>
          <br />
          <a className="link-style" href="tel:+918885636899" aria-label="Call +91 88856 36899">
            &#9742; Click to Call
          </a>
          <a className="link-style" href="mailto:dilleswararaomalla410@gmail.com" aria-label="Mail dilleswararaomalla410@gmail.com">
            ✉ Email us
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
