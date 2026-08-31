import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminAnalytics from "./AdminAnalytics";
import "./Admin.css";

export default function AdminDashboard() {
  return (
    <div className="container admin-page page-enter">
      <h2 className="section-title">Admin Dashboard</h2>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <NavLink to="/admin/analytics" className="admin-nav-link">
            📊 Analytics
          </NavLink>
          <NavLink to="/admin/products" className="admin-nav-link">
            📦 Products
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
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
