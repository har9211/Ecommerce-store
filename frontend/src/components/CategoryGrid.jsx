import { Link } from "react-router-dom";
import "./CategoryGrid.css";

const categories = [
  { name: "Electronics",   icon: "🔌", gradient: "linear-gradient(135deg,#635BFF,#8B5CF6)", light: "#EEF0FF" },
  { name: "Home & Kitchen",icon: "🍳", gradient: "linear-gradient(135deg,#F97316,#FB923C)", light: "#FFF7ED" },
  { name: "Fashion",       icon: "👕", gradient: "linear-gradient(135deg,#EC4899,#F472B6)", light: "#FDF2F8" },
  { name: "Health Care",   icon: "💊", gradient: "linear-gradient(135deg,#22C55E,#4ADE80)", light: "#F0FDF4" },
  { name: "Accessories",   icon: "🎒", gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)", light: "#F0F9FF" },
  { name: "Beauty",        icon: "💄", gradient: "linear-gradient(135deg,#E11D48,#FB7185)", light: "#FFF1F2" },
];

export default function CategoryGrid() {
  return (
    <section className="category-section container">
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Find exactly what you're looking for</p>
      </div>
      <div className="category-grid">
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            to={`/category/${encodeURIComponent(cat.name)}`}
            className="category-tile"
            style={{ "--cat-gradient": cat.gradient, "--cat-light": cat.light, animationDelay: `${i * 0.06}s` }}
          >
            <div className="category-icon-wrap">
              <span className="category-icon">{cat.icon}</span>
            </div>
            <span className="category-name">{cat.name}</span>
            <span className="category-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
