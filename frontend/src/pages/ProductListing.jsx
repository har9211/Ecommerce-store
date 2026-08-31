import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import "../components/FeaturedProducts.css";
import "./ProductListing.css";

export default function ProductListing() {
  const { categoryName } = useParams(); // present on /category/:categoryName
  const [searchParams] = useSearchParams(); // present on /search?keyword=...
  const keyword = searchParams.get("keyword");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = {};
    if (categoryName) params.category = categoryName;
    if (keyword) params.keyword = keyword;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setError("Could not load products. Is your backend running?"))
      .finally(() => setLoading(false));
  }, [categoryName, keyword]);

  const heading = categoryName ? categoryName : keyword ? `Results for "${keyword}"` : "Products";

  return (
    <div className="container listing-page page-enter">
      <h2 className="section-title">{heading}</h2>

      {error && <p className="status-text error">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="status-text">
          No products found{categoryName ? ` in ${categoryName}` : ""}. Try another category or
          search term.
        </p>
      )}

      <div className="product-grid">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}

        {!loading &&
          products.map((product) => (
            <div key={product._id} className="stagger-item">
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </div>
  );
}
