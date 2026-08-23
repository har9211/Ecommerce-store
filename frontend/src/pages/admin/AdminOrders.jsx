import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../Auth.css";
import "../../components/FeaturedProducts.css";
import "./Admin.css";

const statuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch {
      setError("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="admin-content-header">
        <h3>Orders ({orders.length})</h3>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {loading && <p className="status-text">Loading orders...</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  {order.user?.name || "Unknown"}
                  <br />
                  <span className="admin-table-subtext">{order.user?.email}</span>
                </td>
                <td>{order.orderItems.length} item(s)</td>
                <td>₹{order.totalPrice.toLocaleString("en-IN")}</td>
                <td>
                  {order.paymentMethod} · {order.isPaid ? "Paid" : "Unpaid"}
                </td>
                <td>
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
