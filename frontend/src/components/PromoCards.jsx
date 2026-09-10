import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PromoCards.css";

function useCountdown(hours = 2) {
  const [target] = useState(() => Date.now() + hours * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(target - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(target - Date.now(), 0)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const h = String(Math.floor(remaining / 3600000)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function PromoCards() {
  const countdown = useCountdown();

  return (
    <section className="promo-cards container">
      <Link to="/search?deals=1" className="promo-card promo-flash">
        <span className="promo-card-eyebrow">Flash Sale</span>
        <h4>Limited time deals</h4>
        <p>Up to 70% Off</p>
        <span className="promo-card-timer">⏱ {countdown}</span>
      </Link>

      <Link to="/search" className="promo-card promo-shipping">
        <span className="promo-card-eyebrow">Free Shipping</span>
        <h4>On orders over ₹999</h4>
        <p>Shop Now</p>
      </Link>

      <Link to="/search?sort=new" className="promo-card promo-arrivals">
        <span className="promo-card-eyebrow">New Arrivals</span>
        <h4>Check out the latest trends</h4>
        <p>Shop Now</p>
      </Link>
    </section>
  );
}
