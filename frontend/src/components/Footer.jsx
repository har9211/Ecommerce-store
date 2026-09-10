import { useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";
export default function Footer() {
  const { categories } = useCategories();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    // NOTE: no email service is connected yet - this just confirms the
    // input works. Wiring this to a real provider (e.g. Mailchimp) is a
    // separate backend task for later.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3 className="footer-logo">
            Quick<span>Kart</span>
          </h3>
          <p className="footer-tagline">
            Everyday essentials, delivered fast.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            {categories.slice(0, 6).map((category) => <li key={category._id}><Link to={`/category/${encodeURIComponent(category.name)}`}>{category.name}</Link></li>)}
            {categories.length === 0 && <li><Link to="/category/all">All products</Link></li>}
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/returns">Returns & Replacement</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div>
          <h4>Newsletter</h4>
          <p className="footer-tagline">Get updates on new arrivals and offers.</p>
          {subscribed ? (
            <p className="newsletter-success">✅ Subscribed! Thanks for joining.</p>
          ) : (
            <form className="newsletter-row" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Join</button>
            </form>
          )}
          {error && <p className="newsletter-error">{error}</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} QuickKart. Built for learning — not a real store.
        </div>
      </div>
    </footer>
  );
}
