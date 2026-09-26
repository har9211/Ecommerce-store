import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PhoneInput from "../components/PhoneInput";
import api from "../api/axios";
import { calculateDeliveryPrice } from "../constants/commerce";
import "./Cart.css";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    address: user?.address?.line1 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    phone: user?.phone || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const deliveryPrice = calculateDeliveryPrice(totalPrice);
  const grandTotal = totalPrice + deliveryPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "postalCode" && /^\d{6}$/.test(value)) {
      fetch(`https://api.postalpincode.in/pincode/${value}`)
        .then((response) => response.json())
        .then(([result]) => {
          const office = result?.Status === "Success" ? result.PostOffice?.[0] : null;
          if (office) setForm((previous) => ({ ...previous, postalCode: value, city: office.District || office.Block || "", state: office.State || "" }));
        })
        .catch(() => {});
    }
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
      const normalizedPhone = form.phone.replace(/[\s()-]/g, "");
      if (!/^\+\d{1,3}\d{10}$/.test(normalizedPhone)) {
        setError("Choose a country code and enter exactly 10 mobile digits.");
        setLoading(false);
        return;
      }
      const orderItems = cartItems.map((item) => ({ product: item._id, quantity: item.quantity }));

      await api.post("/orders", {
        orderItems,
        shippingAddress: { ...form, phone: normalizedPhone },
        paymentMethod,
      });

      clearCart();

      navigate("/orders", { state: { justPlaced: true } });
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
            <input name="fullName" autoComplete="name" value={form.fullName} onChange={handleChange} required />
          </label>

          <label>
            Address
            <input name="address" autoComplete="street-address" value={form.address} onChange={handleChange} required />
          </label>

          <div className="form-row">
            <label>
              City
              <input name="city" autoComplete="address-level2" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              State
              <input name="state" autoComplete="address-level1" value={form.state} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input
                name="postalCode"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label>
            Phone Number
            <PhoneInput value={form.phone} required onChange={(value) => setForm((previous) => ({ ...previous, phone: value }))} />
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
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
