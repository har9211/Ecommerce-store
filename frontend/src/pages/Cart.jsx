import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../utils/image";
import "./Cart.css";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container cart-page">
        <h2 className="section-title">Your Cart</h2>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h2 className="section-title">Your Cart</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                {item.image ? (
                  <img src={resolveImageUrl(item.image)} alt={item.name} />
                ) : (
                  <div className="cart-item-placeholder">📦</div>
                )}
              </div>

              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <span className="cart-item-category">{item.category}</span>
                <span className="cart-item-price">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="cart-item-qty">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </div>

              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item._id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{totalPrice >= 999 ? "Free" : "₹49"}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>
              ₹{(totalPrice + (totalPrice >= 999 ? 0 : 49)).toLocaleString("en-IN")}
            </span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
