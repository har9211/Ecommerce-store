import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const icon = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.12 0l-6.38-6.38a1.5 1.5 0 0 1 0-2.12L11.5 4h6a2.5 2.5 0 0 1 2.5 2.5z" />
      <circle cx="15.5" cy="8.5" r="1.25" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3-4.8-4.3 6.4-.6z" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 12.5-1.7 7.5L12 17l5.2 3-1.7-7.5" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 7.5 8.5-4 8.5 4-8.5 4z" />
      <path d="M3.5 7.5v9l8.5 4 8.5-4v-9" />
      <path d="M12 11.5v9" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5s-7.5-4.6-9.8-9.2C.6 7.7 2.6 4 6.3 4c2 0 3.6 1.1 4.7 2.8C12.1 5.1 13.7 4 15.7 4c3.7 0 5.7 3.7 4.1 7.3-2.3 4.6-9.8 9.2-9.8 9.2Z" />
    </svg>
  ),
  ticket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5a2 2 0 0 1 0-3.9V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v.6a2 2 0 0 1 0 3.9V13a2 2 0 0 1 0 3.9v.6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-.6a2 2 0 0 1 0-3.9z" />
      <path d="M10 4.5v15" strokeDasharray="2 2.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1.5Z" />
    </svg>
  ),
};

const navItems = [
  { to: "/", label: "Home", icon: icon.home, end: true },
  { to: "/category/all", label: "Categories", icon: icon.grid },
  { to: "/search?deals=1", label: "Deals", icon: icon.tag, badge: "Hot" },
  { to: "/search?view=collections", label: "Collections", icon: icon.layers },
];

const accountItems = [
  { to: "/orders", label: "My Orders", icon: icon.box, auth: true },
  { to: "/account", label: "Account Settings", icon: icon.gear, auth: true },
];

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // NavLink matches pathname only. Deals and Collections intentionally share
  // `/search`, so include the query string to keep only one item highlighted.
  const linkClass = (item) => ({ isActive }) => {
    const query = item.to.includes("?") ? item.to.slice(item.to.indexOf("?")) : "";
    const active = isActive && (!query || location.search === query);
    return `sidebar-link ${active ? "active" : ""}`;
  };

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="sidebar-inner">
        <NavLink to="/" className="sidebar-logo">
          <span className="sidebar-logo-mark">🛍️</span>
          Quick<span>Kart</span>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={linkClass(item)}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          {accountItems.map((item) =>
            item.auth && !isAuthenticated ? null : (
              <NavLink
                key={item.label}
                to={item.auth ? item.to : "/login"}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-promo">
          <span className="sidebar-promo-eyebrow">Special Offer</span>
          <h4>Summer Sale
             <br />
            Up to 50% Off</h4>
          <NavLink to="/search?deals=1" className="sidebar-promo-btn">
            Shop Now
          </NavLink>
          <span className="sidebar-promo-emoji" aria-hidden="true">🛍️</span>
        </div>
      </div>
    </aside>
  );
}
