import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api
      .get("/products", { params: { keyword: query } })
      .then((res) => setProducts(res.data))
      .catch(() => setError("Search failed. Is your backend running?"))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-page page-enter">
      <div className="search-page-header">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span>Search</span>
          </nav>
          <h1 className="search-page-title">
            {query ? (
              <>
                Results for <span className="search-query-highlight">"{query}"</span>
              </>
            ) : (
              "Search Products"
            )}
          </h1>
          {!loading && !error && query && (
            <p className="search-result-count">
              {products.length} result{products.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="container search-grid-section">
        {loading && (
          <div className="search-status">
            <div className="loading-spinner" />
            <p>Searching…</p>
          </div>
        )}
        {error && <p className="search-status error">{error}</p>}

        {!query && !loading && (
          <div className="search-empty">
            <div className="search-empty-icon">🔍</div>
            <h2>What are you looking for?</h2>
            <p>Type a product name in the search bar above.</p>
          </div>
        )}

        {!loading && !error && query && products.length === 0 && (
          <div className="search-empty">
            <div className="search-empty-icon">😕</div>
            <h2>No results for "{query}"</h2>
            <p>Try a different keyword or browse categories below.</p>
            <Link to="/" className="cat-back-btn">← Browse Home</Link>
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
