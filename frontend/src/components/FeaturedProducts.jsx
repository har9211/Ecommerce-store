import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products. Is your backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="featured-section container">
      <h2 className="section-title">Featured Products</h2>

      {loading && <p className="status-text">Loading products...</p>}
      {error && <p className="status-text error">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="status-text">
          No products yet — add some via POST /api/products as an admin.
        </p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="stagger-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
