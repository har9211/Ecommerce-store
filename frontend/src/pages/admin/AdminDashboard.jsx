import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import "./Admin.css";

export default function AdminDashboard() {
  return (
    <div className="container admin-page page-enter">
      <h2 className="section-title">Admin Dashboard</h2>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <NavLink to="/admin/products" className="admin-nav-link">
            📦 Products
          </NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link">
            🧾 Orders
          </NavLink>
        </nav>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Navigate to="products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
