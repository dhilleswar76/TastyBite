function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">
        <span className="symbol">&mdash;</span> About Us <span className="symbol">&mdash;</span>
      </h2>
      <div className="about-section">
        <div className="about-image">
          <img src="/pictures-restaurant/chicken-dum-biryani.jpg" alt="Recipe" />
        </div>

        <div className="about-content">
          <p className="about-info1">
            At TastyBite, we believe in simple, honest food made with love. Our chefs
            use fresh, seasonal ingredients to create dishes inspired by classic
            Italian cuisine with a modern twist.
          </p>
          <br />
          <p className="about-info2">
            Whether you&apos;re looking for a romantic dinner, a family celebration, or a
            casual meal with friends, our warm and welcoming atmosphere is perfect
            for every occasion.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
