import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import Reveal from "./Reveal";
import "./FeaturedProducts.css";

// Reuses the same /api/products endpoint (already sorted newest-first by
// the backend) but only shows the most recent few, under a different heading.
export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="featured-section container">
      <Reveal>
        <h2 className="section-title">New Arrivals</h2>
      </Reveal>

      <div className="product-grid">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}

        {!loading &&
          products.map((product) => (
            <div key={product._id} className="stagger-item">
              <ProductCard product={product} />
            </div>
          ))}
      </div>
    </section>
  );
}
