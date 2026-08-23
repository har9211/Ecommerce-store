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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-top-inner">
          <Link to="/" className="logo">
            Quick<span>Kart</span>
          </Link>

          <div className="search-bar">
            <input type="text" placeholder="Search for products, brands and more" />
            <button aria-label="Search">🔍</button>
          </div>

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
