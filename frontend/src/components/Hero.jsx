import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      {/* Decorative blobs */}
      <div className="hero-blob hero-blob-1" aria-hidden="true" />
      <div className="hero-blob hero-blob-2" aria-hidden="true" />
      <div className="hero-blob hero-blob-3" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">🚚 Delivered in as fast as 2 days</span>
          <h1>
            Everything you need,
            <br />
            <span className="hero-highlight">at QuickKart speed.</span>
          </h1>
          <p>
            Electronics, home essentials, fashion and more — all in one place,
            with <strong>free delivery</strong> on orders over ₹999.
          </p>
          <div className="hero-cta-row">
            <Link to="/category/Electronics" className="hero-cta hero-cta-primary">
              Shop Now →
            </Link>
            <Link to="/category/Fashion" className="hero-cta hero-cta-secondary">
              View Fashion
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-stack">
            <div className="hero-promo-card hero-promo-card-1">
              <span className="hero-promo-icon">🔌</span>
              <div>
                <div className="hero-promo-title">Electronics</div>
                <div className="hero-promo-sub">Up to 40% off</div>
              </div>
            </div>
            <div className="hero-promo-card hero-promo-card-2">
              <span className="hero-promo-icon">👕</span>
              <div>
                <div className="hero-promo-title">Fashion</div>
                <div className="hero-promo-sub">New arrivals daily</div>
              </div>
            </div>
            <div className="hero-promo-card hero-promo-card-3">
              <span className="hero-promo-icon">🍳</span>
              <div>
                <div className="hero-promo-title">Home & Kitchen</div>
                <div className="hero-promo-sub">Free delivery ₹999+</div>
              </div>
            </div>
          </div>
          <div className="hero-trust-row">
            <span className="hero-trust-badge">✓ Free Returns</span>
            <span className="hero-trust-badge">✓ COD Available</span>
            <span className="hero-trust-badge">✓ Secure Checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
}
