import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Cart.css";
import "./Checkout.css";
import "./Payment.css";

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Could not load this order."));
  }, [orderId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);

    try {
      // NOTE: this is a placeholder flow. No real card processing happens here.
      // When we integrate a real gateway (Razorpay/Stripe) later, this is the
      // exact spot where we'll redirect to or open their checkout widget instead.
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate processing
      await api.put(`/orders/${orderId}/pay`);
      navigate("/orders", { state: { justPaid: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (error && !order) {
    return (
      <div className="container payment-page page-enter">
        <p className="status-text error">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container payment-page page-enter">
        <p className="status-text">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="container payment-page page-enter">
      <h2 className="section-title">Complete Payment</h2>
      <p className="payment-demo-note">
        ⚠️ Demo mode — no real payment gateway is connected yet. This screen simulates a
        successful card payment so the order flow works end-to-end.
      </p>

      <div className="payment-layout">
        <form className="checkout-form-card" onSubmit={handlePay}>
          <h3>Card Details</h3>

          {error && <div className="auth-error">{error}</div>}

          <label>
            Card Number
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              required
              maxLength={19}
            />
          </label>

          <div className="form-row">
            <label>
              Expiry
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
                maxLength={5}
              />
            </label>
            <label>
              CVV
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
                maxLength={3}
              />
            </label>
          </div>

          <button type="submit" className="checkout-btn" disabled={processing}>
            {processing ? "Processing..." : `Pay ₹${order.totalPrice.toLocaleString("en-IN")}`}
          </button>
        </form>

        <div className="cart-summary">
          <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
          <div className="summary-row">
            <span>Items</span>
            <span>₹{order.itemsPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{order.deliveryPrice === 0 ? "Free" : `₹${order.deliveryPrice}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total Due</span>
            <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
