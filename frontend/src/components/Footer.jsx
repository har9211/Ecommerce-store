import "./Footer.css";

export default function Footer() {
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
            <li>Electronics</li>
            <li>Home & Kitchen</li>
            <li>Fashion</li>
            <li>Health Care</li>
          </ul>
        </div>

        <div>
          <h4>Support</h4>
          <ul>
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Returns & Replacement</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div>
          <h4>Newsletter</h4>
          <p className="footer-tagline">Get updates on new arrivals and offers.</p>
          <div className="newsletter-row">
            <input type="email" placeholder="Your email" />
            <button>Join</button>
          </div>
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
