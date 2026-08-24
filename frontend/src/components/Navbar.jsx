import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Fashion",
  "Health Care",
  "Accessories",
  "Beauty",
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="logo">
            Quick<span>Kart</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch} role="search">
            <input
              type="text"
              placeholder="Search products, brands and more…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="submit" aria-label="Search">🔍</button>
          </form>

          <nav className="navbar-actions">
            {isAuthenticated ? (
              <div className="account-menu">
                <button
                  className="account-trigger"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  Hi, {user.name.split(" ")[0]} ▾
                </button>
                {menuOpen && (
                  <div className="account-dropdown">
                    <Link to="/orders" onClick={() => setMenuOpen(false)}>
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <Link to="/cart" className="cart-link">
              🛒 Cart
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
          </nav>
        </div>
      </div>

      <div className="navbar-categories">
        <div className="container categories-inner">
          {categories.map((cat) => (
            <Link key={cat} to={`/category/${encodeURIComponent(cat)}`}>
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
