import { Link } from "react-router-dom";
import "./CategoryGrid.css";

const categories = [
  { name: "Electronics", icon: "🔌" },
  { name: "Home & Kitchen", icon: "🍳" },
  { name: "Fashion", icon: "👕" },
  { name: "Health Care", icon: "💊" },
  { name: "Accessories", icon: "🎒" },
  { name: "Beauty", icon: "💄" },
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
            <span className="category-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
