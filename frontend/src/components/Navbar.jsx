import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PromoStrip from "./PromoStrip";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Adds a subtle shadow once the page has scrolled a bit, so the navbar
  // feels "lifted" above the content instead of blending flat into it.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <PromoStrip />
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="logo">
            Quick<span>Kart</span>
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <nav className="navbar-actions">
            {isAuthenticated ? (
              <div className="account-menu">
                <button
                  className="account-trigger"
                  onClick={() => setMenuOpen((open) => !open)}
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
              Cart ({totalItems})
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
