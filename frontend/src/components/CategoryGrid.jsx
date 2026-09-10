import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import "./CategoryGrid.css";

const categoryArtwork = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 4 4 7l2 3 2-1.5V20h8V8.5L18 10l2-3-4-3-2 2h-4z" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v4H9z" />
        <path d="M8 7h8l1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11.5 12 5l8 6.5" />
        <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
        <path d="M9.5 20v-5h5v5" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5v17M3.5 12h17M6 6.2c2 1.6 4 2.2 6 2.2s4-.6 6-2.2M6 17.8c2-1.6 4-2.2 6-2.2s4 .6 6 2.2" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

export default function CategoryGrid() {
  const { categories, loading } = useCategories();

  return (
    <section className="category-section container">
      <div className="category-row">
        {loading && <span className="category-loading">Loading categories...</span>}
        {!loading && categories.length === 0 && <Link to="/category/all" className="category-tile"><span className="category-icon">▦</span><span>All Products</span></Link>}
        {categories.map((cat, index) => (
          <Link
            key={cat._id}
            to={`/category/${encodeURIComponent(cat.name)}`}
            className="category-tile"
          >
            <span className="category-icon">{categoryArtwork[index % categoryArtwork.length].icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
