import { Link } from "react-router-dom";
import "./CategoryGrid.css";

const categories = [
  { name: "Electronics", icon: "🔌", color: "#EAF1FF" },
  { name: "Home & Kitchen", icon: "🍳", color: "#FFF1E8" },
  { name: "Fashion", icon: "👕", color: "#FDEAF3" },
  { name: "Health Care", icon: "💊", color: "#E9F9EE" },
  { name: "Accessories", icon: "🎒", color: "#F2EAFF" },
  { name: "Beauty", icon: "💄", color: "#FFEAEA" },
];

export default function CategoryGrid() {
  return (
    <section className="category-section container">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/category/${encodeURIComponent(cat.name)}`}
            className="category-tile"
          >
            <span className="category-icon" style={{ background: cat.color }}>
              {cat.icon}
            </span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
