import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">Delivered in as fast as 2 days</span>
          <h1>
            Everything you need,
            <br />
            at QuickKart speed.
          </h1>
          <p>
            Electronics, home essentials, fashion and more — all in one place,
            with free delivery on orders over ₹999.
          </p>
          <button
            className="hero-cta"
            onClick={() =>
              document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop Now
          </button>
        </div>
        <div className="hero-badge-stack">
          <div className="hero-badge">🚚 Free Delivery ₹999+</div>
          <div className="hero-badge">↩️ 7-Day Easy Replacement</div>
          <div className="hero-badge">💵 Cash on Delivery</div>
        </div>
      </div>
    </section>
  );
}
