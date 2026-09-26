import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../utils/image";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${id}`).then((res) => setProduct(res.data)).catch((err) => {
      setError(err.response?.status === 404 ? "This product is no longer available." : "Could not load this product.");
    });
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) return navigate("/login", { state: { from: `/product/${id}` } });
    addToCart(product);
    setAdded(true);
  };

  if (error) return <div className="container product-detail-page"><p className="status-text error">{error}</p><Link to="/">Continue shopping</Link></div>;
  if (!product) return <div className="container product-detail-page"><p className="status-text">Loading product...</p></div>;

  const hasDiscount = product.compareAtPrice > product.price;
  return (
    <main className="container product-detail-page page-enter">
      <Link className="product-back-link" to="/">← Continue shopping</Link>
      <div className="product-detail-layout">
        <div className="product-detail-image">
          {product.image ? <img src={resolveImageUrl(product.image)} alt={product.name} /> : <span>📦</span>}
        </div>
        <section className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="product-detail-price">₹{product.price.toLocaleString("en-IN")}</div>
          {hasDiscount && <p className="product-detail-original">MRP ₹{product.compareAtPrice.toLocaleString("en-IN")}</p>}
          <p className="product-detail-description">{product.description}</p>
          <p className={product.stock > 0 ? "product-in-stock" : "out-of-stock"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
          {product.stock > 0 && <button className="product-detail-add" onClick={handleAddToCart}>{added ? "Added to cart" : "Add to cart"}</button>}
        </section>
      </div>
    </main>
  );
}
