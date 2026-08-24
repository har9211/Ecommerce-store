import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./CategoryPage.css";

const categoryIcons = {
  Electronics: "🔌",
  "Home & Kitchen": "🍳",
  Fashion: "👕",
  "Health Care": "💊",
  Accessories: "🎒",
  Beauty: "💄",
  Other: "📦",
};

export default function CategoryPage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/products", { params: { category: decodedName } })
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products. Is your backend running?"))
      .finally(() => setLoading(false));
  }, [decodedName]);

  return (
    <div className="category-page page-enter">
      {/* Breadcrumb */}
      <div className="category-page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span>{decodedName}</span>
          </nav>
          <div className="category-hero-content">
            <span className="category-hero-icon">
              {categoryIcons[decodedName] ?? "📦"}
            </span>
            <div>
              <h1 className="category-hero-title">{decodedName}</h1>
              {!loading && !error && (
                <p className="category-hero-count">
                  {products.length} product{products.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="container category-grid-section">
        {loading && (
          <div className="cat-status">
            <div className="loading-spinner" />
            <p>Loading products…</p>
          </div>
        )}
        {error && <p className="cat-status error">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="cat-empty">
            <div className="cat-empty-icon">🛍️</div>
            <h2>No products in this category yet</h2>
            <p>Check back soon, or browse other categories.</p>
            <Link to="/" className="cat-back-btn">← Back to Home</Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product, i) => (
              <div
                key={product._id}
                className="stagger-item"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
