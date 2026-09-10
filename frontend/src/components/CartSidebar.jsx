import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../utils/image";
import "./CartSidebar.css";

export default function CartSidebar({ onClose }) {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [promo, setPromo] = useState("");
  const navigate = useNavigate();

  const shippingFree = totalPrice >= 999 || totalPrice === 0;
  const shipping = shippingFree ? 0 : 99;
  const total = totalPrice + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate(isAuthenticated ? "/checkout" : "/login");
  };

  return (
    <aside className="cart-panel">
      <div className="cart-panel-inner">
        <div className="cart-panel-header">
          <h3>My Cart ({totalItems})</h3>
          <button className="cart-panel-close" onClick={onClose} aria-label="Close cart">×</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-panel-empty">
            <span>🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="cart-panel-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-panel-item">
                <div className="cart-panel-item-img">
                  {item.image ? (
                    <img src={resolveImageUrl(item.image)} alt={item.name} />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
                <div className="cart-panel-item-info">
                  <p className="cart-panel-item-name">{item.name}</p>
                  <span className="cart-panel-item-category">{item.category}</span>
                  <span className="cart-panel-item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  <div className="cart-panel-item-qty">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button
                  className="cart-panel-item-remove"
                  aria-label="Remove"
                  onClick={() => removeFromCart(item._id)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="cart-panel-promo">
          <input
            type="text"
            placeholder="Promo Code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button>Apply</button>
        </div>

        <div className="cart-panel-summary">
          <div className="cart-panel-summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="cart-panel-summary-row">
            <span>Shipping</span>
            <span className={shippingFree ? "cart-panel-free" : ""}>
              {shippingFree ? "Free" : `₹${shipping}`}
            </span>
          </div>
          <div className="cart-panel-summary-row cart-panel-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <button
          className="cart-panel-checkout"
          disabled={cartItems.length === 0}
          onClick={handleCheckout}
        >
          Checkout ({totalItems}) →
        </button>

        <div className="cart-panel-payments">
          <span>We accept</span>
          <div>VISA&nbsp;&nbsp;●●&nbsp;&nbsp;Pay</div>
        </div>
      </div>
    </aside>
  );
}
