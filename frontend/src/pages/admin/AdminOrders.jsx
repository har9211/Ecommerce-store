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

  const handleFulfill = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/fulfill`);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, fulfillmentStatus: res.data.fulfillmentStatus, fulfilledAt: res.data.fulfilledAt }
            : o
        )
      );
    } catch {
      setError("Could not mark order as fulfilled.");
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
              <th>Payment status</th>
              <th>Fulfillment</th>
              <th>Order status</th>
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
                  <span className={`pill ${order.isPaid ? "pill-green" : "pill-gray"}`}>
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td>
                  {order.fulfillmentStatus === "Fulfilled" ? (
                    <span className="pill pill-green">✓ Fulfilled</span>
                  ) : (
                    <button
                      className="admin-btn-secondary fulfill-btn"
                      disabled={updatingId === order._id}
                      onClick={() => handleFulfill(order._id)}
                    >
                      Mark Fulfilled
                    </button>
                  )}
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
