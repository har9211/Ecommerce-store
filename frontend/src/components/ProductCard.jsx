import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

// Simple deterministic badge logic based on stock/price - gives cards personality
// without needing extra backend fields yet.
function getBadge(product) {
  if (product.stock === 0) return null;
  if (product.price < 500) return { label: "Free Delivery", tone: "green" };
  if (product.stock < 10) return { label: "Almost Gone", tone: "red" };
  return { label: "Bestseller", tone: "gold" };
}

export default function ProductCard({ product }) {
  const badge = getBadge(product);
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500); // brief confirmation, then reset
  };

  return (
    <div className="product-card">
      {badge && <span className={`product-badge badge-${badge.tone}`}>{badge.label}</span>}
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">📦</div>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          {product.stock === 0 && <span className="out-of-stock">Out of stock</span>}
        </div>
        <button
          className="add-to-cart-btn"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          {product.stock === 0 ? "Unavailable" : justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
