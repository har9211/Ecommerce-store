import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./TopBar.css";

export default function TopBar({ onOpenSidebar, onOpenCart }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const closeMenu = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeMenu);
    return () => document.removeEventListener("pointerdown", closeMenu);
  }, []);

  return (
    <header className="topbar">
      <button className="topbar-drawer-btn" onClick={onOpenSidebar} aria-label="Open navigation">☰</button>
      <form className="topbar-search" onSubmit={handleSearch}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="text"
          placeholder="Search for products, brands and more..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Link to="/" className="topbar-brand" aria-label="QuickKart home">QuickKart</Link>

      <div className="topbar-actions">
        <Link to="/wishlist" className="topbar-icon-btn" aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5s-7.5-4.6-9.8-9.2C.6 7.7 2.6 4 6.3 4c2 0 3.6 1.1 4.7 2.8C12.1 5.1 13.7 4 15.7 4c3.7 0 5.7 3.7 4.1 7.3-2.3 4.6-9.8 9.2-9.8 9.2Z" />
          </svg>
        </Link>
        <button className="topbar-cart-btn" onClick={onOpenCart} aria-label="Open cart">🛒 Cart</button>

        <Link to="/notifications" className="topbar-icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 12 6 8Z" />
            <path d="M10 19.5a2 2 0 0 0 4 0" />
          </svg>
          <span className="topbar-icon-dot" />
        </Link>

        {isAuthenticated ? (
          <div className="topbar-account" ref={accountMenuRef}>
            <button className="topbar-account-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-haspopup="menu">
              <span className="topbar-avatar">{user.name?.[0]?.toUpperCase() || "U"}</span>
              <span className="topbar-name">{user.name?.split(" ")[0]}</span>
            </button>
            {menuOpen && (
              <div className="topbar-dropdown">
                <Link to="/account" onClick={() => setMenuOpen(false)}>Account settings</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="topbar-login-btn">Login</Link>
        )}
      </div>
    </header>
  );
}
