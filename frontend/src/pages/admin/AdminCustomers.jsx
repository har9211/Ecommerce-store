import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../Auth.css";
import "./Admin.css";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // We don't have a separate "profile" with saved phone/address yet -
    // so we pull each customer's most recent order and use its shipping
    // details as their contact info. If they've never ordered, we just
    // show name/email/joined-date.
    Promise.all([api.get("/auth/users"), api.get("/orders")])
      .then(([usersRes, ordersRes]) => {
        const users = usersRes.data;
        const orders = ordersRes.data;

        const merged = users.map((user) => {
          const userOrders = orders.filter((o) => o.user?._id === user._id);
          const mostRecent = userOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];

          return {
            ...user,
            orderCount: userOrders.length,
            totalSpent: userOrders.reduce((sum, o) => sum + o.totalPrice, 0),
            phone: mostRecent?.shippingAddress?.phone || "—",
            address: mostRecent
              ? `${mostRecent.shippingAddress.address}, ${mostRecent.shippingAddress.city} ${mostRecent.shippingAddress.postalCode}`
              : "—",
          };
        });

        setCustomers(merged);
      })
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-content-header">
        <h3>Customers ({customers.length})</h3>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {loading && <p className="status-text">Loading customers...</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.name}
                  {c.role === "admin" && <span className="pill pill-green admin-pill">Admin</span>}
                </td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td className="admin-address-cell">{c.address}</td>
                <td>{c.orderCount}</td>
                <td>₹{c.totalSpent.toLocaleString("en-IN")}</td>
                <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
