import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { menuItems } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { getAvatarGradient, getInitials } from '../utils/avatar';

function HomePage() {
  const { addToCart, updateQuantity, cartItems } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  // Countdown timer for daily special
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const chefSpecials = menuItems.filter((m) => m.isChefSpecial).slice(0, 4);

  const getItemQty = (itemId) => {
    const found = cartItems.find((i) => (i._id || i.id) === itemId);
    return found ? found.quantity : 0;
  };

  const sampleReviews = [
    {
      name: 'Ananya Deshmukh',
      rating: 5,
      comment: 'The Hyderabadi Dum Biryani and Garlic Naan were out of this world! Incredible aroma and royal flavors.',
      dish: 'Chicken Dum Biryani',
    },
    {
      name: 'Vikramaditya Roy',
      rating: 5,
      comment: 'Celebrated our anniversary in the VIP room. Outstanding hospitality and the Paneer Butter Masala was creamy perfection.',
      dish: 'Paneer Butter Masala',
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Love the QR table ordering! Food arrived in 15 minutes piping hot. The Chocolate Lava Cake is a must-try!',
      dish: 'Chocolate Lava Cake',
    },
  ];

  return (
    <div className="page-wrapper home-page">
      {/* 1. Cinematic Hero */}
      <Hero />

      {/* 2. Chef's Daily Special Deal Banner */}
      <section className="section daily-deal-section">
        <div className="daily-deal-card">
          <div className="deal-badge">🔥 TODAY'S SIGNATURE SPECIAL &bull; 20% OFF</div>
          <div className="deal-content-grid">
            <div className="deal-img-wrap">
              <img
                src="/pictures-restaurant/chicken-dum-biryani.webp"
                alt="Chicken Dum Biryani Daily Deal"
                className="deal-img"
              />
              <span className="deal-discount-tag">Save 20%</span>
            </div>
            <div className="deal-info">
              <h2>Royal Hyderabadi Dum Biryani Handi</h2>
              <p>
                Aged long-grain basmati rice, tender farm chicken marinated in saffron &amp; 18 secret hand-ground spices, slow-steamed in a sealed earthen pot.
              </p>

              <div className="deal-countdown-box">
                <span className="countdown-label">Special Offer Ends In:</span>
                <div className="countdown-timer">
                  <span className="time-block">
                    <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>h
                  </span>
                  <span className="colon">:</span>
                  <span className="time-block">
                    <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>m
                  </span>
                  <span className="colon">:</span>
                  <span className="time-block">
                    <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>s
                  </span>
                </div>
              </div>

              <div className="deal-price-row">
                <span className="deal-current-price">₹299</span>
                <span className="deal-original-price">₹375</span>
                <span className="deal-savings">Save ₹76</span>
              </div>

              <div className="deal-action-buttons">
                <button
                  className="deal-order-btn"
                  onClick={() => addToCart(menuItems[7], 1)}
                >
                  🛒 Claim Deal &amp; Order Now
                </button>
                <Link to="/menu" className="deal-explore-link">
                  Browse All 20+ Dishes &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Chef's Picks */}
      <section className="section featured-dishes-section">
        <div className="section-header-wrap">
          <h2 className="section-title">
            <span className="symbol">&mdash;</span> Chef's Signature Highlights <span className="symbol">&mdash;</span>
          </h2>
          <p className="section-subtitle">
            Most-loved royal recipes crafted with centuries-old cooking techniques and fresh ingredients.
          </p>
        </div>

        <div className="featured-cards-grid">
          {chefSpecials.map((dish) => {
            const qty = getItemQty(dish.id);
            return (
              <article key={dish.id} className="featured-dish-card">
                <div className="dish-img-holder">
                  <img src={dish.image} alt={dish.name} loading="lazy" />
                  <span className={`tag-pill ${dish.tag === 'Veg' ? 'veg-pill' : 'non-veg-pill'}`}>
                    {dish.tag === 'Veg' ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className="chef-star-tag">⭐ Chef Pick</span>
                </div>

                <div className="dish-body">
                  <div className="dish-title-row">
                    <h3>{dish.name}</h3>
                    <span className="dish-price">₹{dish.price}</span>
                  </div>
                  <div className="dish-sub-info">
                    <span>⭐ {dish.rating}</span>
                    <span>⏱️ {dish.prepTimeMinutes} mins</span>
                    <span>{dish.category}</span>
                  </div>
                  <p className="dish-desc-text">{dish.description}</p>

                  <div className="dish-card-bottom">
                    {qty > 0 ? (
                      <div className="card-qty-stepper">
                        <button
                          onClick={() => {
                            const found = cartItems.find((i) => (i._id || i.id) === dish.id);
                            if (found) updateQuantity(found.cartKey || dish.id, found.quantity - 1);
                          }}
                          className="card-step-btn minus"
                        >
                          -
                        </button>
                        <span className="card-step-val">{qty} in Cart</span>
                        <button
                          onClick={() => addToCart(dish, 1)}
                          className="card-step-btn plus"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="add-to-cart-btn-primary full-width-action"
                        onClick={() => addToCart(dish, 1)}
                      >
                        + Add to Cart (₹{dish.price})
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="view-full-menu-cta">
          <Link to="/menu" className="btn btn-primary large-cta">
            View Complete Menu Catalog (20+ Dishes) &rarr;
          </Link>
        </div>
      </section>

      {/* 4. Heritage Story Teaser */}
      <section className="section section-alt home-heritage-teaser">
        <div className="heritage-teaser-grid">
          <div className="heritage-text-side">
            <span className="gold-subhead">OUR CULINARY HERITAGE</span>
            <h2>Authentic Traditions, Hand-Crafted Spices</h2>
            <p>
              TastyBite was born with one ambition: to preserve the authentic royal heritage of slow-steamed Dum Biryanis and fragrant clay-oven tandoori specialties. Every single spice blend is hand-ground daily.
            </p>
            <div className="heritage-bullets">
              <div className="bullet-item">
                <span className="bullet-icon">🏺</span>
                <div>
                  <strong>Clay Pot Dum Cooking</strong>
                  <p>Slow-cooked in sealed earthen handis to preserve every drop of aroma.</p>
                </div>
              </div>
              <div className="bullet-item">
                <span className="bullet-icon">🌿</span>
                <div>
                  <strong>Pure Farm Sourcing</strong>
                  <p>100% natural, freshly sourced ingredients with zero artificial flavorings.</p>
                </div>
              </div>
            </div>
            <Link to="/about" className="btn btn-secondary">
              Read Our Full Story &amp; Philosophy &rarr;
            </Link>
          </div>
          <div className="heritage-image-side">
            <img
              src="/pictures-restaurant/restaurant-entrance.webp"
              alt="TastyBite Restaurant Entrance"
              className="heritage-photo"
            />
          </div>
        </div>
      </section>

      {/* 5. Luxury Dining & Table Reservation CTA */}
      <section className="section home-reservations-cta">
        <div className="reserve-cta-banner">
          <div className="reserve-cta-content">
            <span className="gold-badge">FINE DINING RESERVATIONS</span>
            <h2>Book Your Table For An Unforgettable Evening</h2>
            <p>
              Whether it is a romantic candlelit dinner, rooftop celebration, or family gathering, we have the perfect table prepared for you.
            </p>
            <div className="reserve-cta-btns">
              <Link to="/reservations" className="btn btn-primary">
                📅 Reserve a Table Online
              </Link>
              <Link to="/events" className="btn btn-secondary">
                🎉 Host Private Events &amp; Catering
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Testimonials Spotlight */}
      <section className="section home-reviews-spotlight">
        <div className="section-header-wrap">
          <h2 className="section-title">
            <span className="symbol">&mdash;</span> What Our Diners Say <span className="symbol">&mdash;</span>
          </h2>
          <p className="section-subtitle">
            Join thousands of food lovers who call TastyBite their favorite dining destination.
          </p>
        </div>

        <div className="reviews-cards-grid">
          {sampleReviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-card-top">
                <div
                  className="reviewer-avatar alphabet-avatar"
                  style={{ background: getAvatarGradient(r.name) }}
                >
                  {getInitials(r.name)}
                </div>
                <div className="reviewer-info">
                  <h4>{r.name}</h4>
                  <div className="review-stars-row">
                    {'⭐'.repeat(r.rating)}
                    <span className="verified-badge">✓ Verified Diner</span>
                  </div>
                </div>
              </div>
              <p className="review-comment-text">"{r.comment}"</p>
              <div className="review-dish-tag">
                <span>Recommended: </span>
                <strong>{r.dish}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="view-reviews-cta">
          <Link to="/reviews" className="btn btn-secondary">
            Read All Reviews &amp; Add Food Photos &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
