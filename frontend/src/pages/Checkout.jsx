import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import "./Cart.css";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryPrice = totalPrice >= 999 ? 0 : 49;
  const grandTotal = totalPrice + deliveryPrice;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders", {
        orderItems,
        shippingAddress: form,
        paymentMethod,
        itemsPrice: totalPrice,
        deliveryPrice,
        totalPrice: grandTotal,
      });

      clearCart();

      if (paymentMethod === "COD") {
        // Cash on delivery - order is placed, nothing to pay online now
        navigate(`/orders`, { state: { justPlaced: true } });
      } else {
        // Card - send them to the payment page to complete payment
        navigate(`/payment/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container checkout-page page-enter">
        <p className="status-text">Your cart is empty — nothing to check out.</p>
      </div>
    );
  }

  return (
    <div className="container checkout-page page-enter">
      <h2 className="section-title">Checkout</h2>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <div className="checkout-form-card">
          <h3>Shipping Address</h3>

          {error && <div className="auth-error">{error}</div>}

          <label>
            Full Name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>

          <label>
            Address
            <input name="address" value={form.address} onChange={handleChange} required />
          </label>

          <div className="form-row">
            <label>
              City
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Phone Number
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </label>

          <h3 className="payment-heading">Payment Method</h3>
          <div className="payment-options">
            <label className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              💵 Cash on Delivery
            </label>
            <label className={`payment-option ${paymentMethod === "Card" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={() => setPaymentMethod("Card")}
              />
              💳 Card / Online Payment
            </label>
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} className="summary-row summary-item-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{deliveryPrice === 0 ? "Free" : `₹${deliveryPrice}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
          <button type="submit" className="checkout-btn" disabled={loading}>
            {loading
              ? "Placing order..."
              : paymentMethod === "COD"
              ? "Place Order"
              : "Continue to Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
