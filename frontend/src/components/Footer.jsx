import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState("idle"); // idle | success | error

  const handleSubscribe = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setSubStatus("error");
      return;
    }
    setSubStatus("success");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div>
          <h3 className="footer-logo">
            Quick<span>Kart</span>
          </h3>
          <p className="footer-tagline">
            Everyday essentials, delivered fast.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter" className="social-icon">𝕏</a>
            <a href="#" aria-label="Instagram" className="social-icon">📸</a>
            <a href="#" aria-label="Facebook" className="social-icon">f</a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/category/Electronics">Electronics</Link></li>
            <li><Link to="/category/Home%20%26%20Kitchen">Home &amp; Kitchen</Link></li>
            <li><Link to="/category/Fashion">Fashion</Link></li>
            <li><Link to="/category/Health%20Care">Health Care</Link></li>
            <li><Link to="/category/Beauty">Beauty</Link></li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns &amp; Replacement</a></li>
            <li><a href="#">FAQs</a></li>
            <li><Link to="/orders">Track Order</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4>Newsletter</h4>
          <p className="footer-tagline">Get updates on new arrivals and offers.</p>
          {subStatus === "success" ? (
            <div className="newsletter-success">
              🎉 You're subscribed! Thanks for joining.
            </div>
          ) : (
            <form className="newsletter-row" onSubmit={handleSubscribe} noValidate>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subStatus === "error") setSubStatus("idle");
                }}
                aria-label="Email address for newsletter"
              />
              <button type="submit">Join</button>
            </form>
          )}
          {subStatus === "error" && (
            <p className="newsletter-error">Please enter a valid email address.</p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} QuickKart. Built for learning — not a real store.</span>
          <span className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
