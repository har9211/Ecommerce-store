import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminAnalytics from "./AdminAnalytics";
import AdminCategories from "./AdminCategories";
import "./Admin.css";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container admin-page page-enter">
      <div className="admin-page-header">
        <h2 className="section-title">Admin Dashboard</h2>
        <button className="admin-btn-secondary" onClick={handleLogout}>Log out</button>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <NavLink to="/admin/analytics" className="admin-nav-link">
            📊 Analytics
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link">
            📦 Products
          </NavLink>
          <NavLink to="/admin/categories" className="admin-nav-link">
            🗂️ Categories
          </NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link">
            🧾 Orders
          </NavLink>
          <NavLink to="/admin/customers" className="admin-nav-link">
            👤 Customers
          </NavLink>
        </nav>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="analytics" replace />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
