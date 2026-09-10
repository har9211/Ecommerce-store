import { useState } from "react";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../utils/image";
import "./ProductCard.css";

function getDiscount(product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}

function getRating(product) {
  const seed = product.name.length + (product._id?.charCodeAt(2) || 0);
  return {
    stars: (3.6 + (seed % 14) / 10).toFixed(1),
    count: 20 + (seed % 400),
  };
}

export default function ProductCard({ product }) {
  const discount = getDiscount(product);
  const rating = getRating(product);
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const original = product.compareAtPrice > product.price ? product.compareAtPrice : null;

  return (
    <div className="product-card">
      <div className="product-image">
        {discount && <span className="product-discount-badge">-{discount}%</span>}
        <button
          className={`product-wishlist-btn ${wishlisted ? "active" : ""}`}
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((w) => !w);
          }}
        >
          ♥
        </button>
        {product.image ? (
          <img src={resolveImageUrl(product.image)} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">📦</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-category">{product.category}</span>

        <div className="product-rating-row">
          <span className="product-rating-star">★</span>
          <span>{rating.stars}</span>
          <span className="product-rating-count">({rating.count})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          {original && <span className="product-price-original">₹{original.toLocaleString("en-IN")}</span>}
        </div>

        {product.stock === 0 ? (
          <span className="out-of-stock">Out of stock</span>
        ) : (
          <button
            className={`add-to-cart-btn ${justAdded ? "added" : ""}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {justAdded ? "✓" : "+"}
          </button>
        )}
      </div>
    </div>
  );
}
