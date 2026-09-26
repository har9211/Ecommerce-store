import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../utils/image";
import "./ProductCard.css";

function getDiscount(product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}

export default function ProductCard({ product }) {
  const discount = getDiscount(product);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const original = product.compareAtPrice > product.price ? product.compareAtPrice : null;
  const openProduct = () => navigate(`/product/${product._id}`);

  return (
    <div className="product-card">
      <button className="product-image" onClick={openProduct} aria-label={`View ${product.name}`}>
        {discount && <span className="product-discount-badge">-{discount}%</span>}
        {product.image ? (
          <img src={resolveImageUrl(product.image)} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">📦</div>
        )}
      </button>
      <div className="product-info">
        <h3 className="product-name"><button onClick={openProduct}>{product.name}</button></h3>
        <span className="product-category">{product.category}</span>

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
