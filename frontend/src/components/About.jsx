function About() {
  return (
    <section id="about" className="section section-alt">
      <div className="section-header-wrap">
        <h2 className="section-title">
          <span className="symbol">&mdash;</span> Our Culinary Heritage <span className="symbol">&mdash;</span>
        </h2>
        <p className="section-subtitle">
          Crafting unforgettable dining memories with authentic slow-cooking traditions and royal Indian hospitality.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-img-frame">
          <img src="/pictures-restaurant/chicken-dum-biryani.webp" alt="TastyBite Culinary Heritage" />
        </div>

        <div className="about-content">
          <h3>Passionate Chefs. Hand-Ground Spices.</h3>
          <p>
            Founded on a passion for culinary excellence, TastyBite is celebrated for bringing authentic flavors alive. From royal Hyderabadi sealed-pot Dum Biryanis to smoky clay-oven tandoori kebabs, every dish is an ode to traditional recipes.
          </p>
          <p>
            Whether you are joining us for an intimate rooftop dinner, a family anniversary, or placing an express order to your doorstep, we guarantee mouthwatering perfection in every single bite.
          </p>

          <div className="about-features-grid">
            <div className="about-feat-box">
              <strong>🔥 Traditional Clay Tandoors</strong>
              <span>Smoky charred perfection</span>
            </div>
            <div className="about-feat-box">
              <strong>🌿 100% Fresh Farm Sourcing</strong>
              <span>Zero artificial preservatives</span>
            </div>
            <div className="about-feat-box">
              <strong>👑 Royal Hand-Ground Spices</strong>
              <span>Authentic whole spice blends</span>
            </div>
            <div className="about-feat-box">
              <strong>⭐ 5-Star Hospitality</strong>
              <span>Dedicated dining concierges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
