import { Link } from "react-router-dom";
import "./Cart.css";
import "./Checkout.css";
import "./Payment.css";

export default function Payment() {
  return (
    <div className="container payment-page page-enter">
      <h2 className="section-title">Online payments are unavailable</h2>
      <p className="payment-demo-note">This store does not collect card details until a verified payment gateway is configured.</p>
      <Link className="checkout-btn" to="/cart">Return to cart</Link>
    </div>
  );
}
