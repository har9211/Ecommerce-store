import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./Cart.css";
import "./Orders.css";

const statusColors = {
  Placed: "gray",
  Processing: "blue",
  Shipped: "purple",
  Delivered: "green",
  Cancelled: "red",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    api
      .get("/orders/myorders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container orders-page page-enter">
      <h2 className="section-title">My Orders</h2>

      {location.state?.justPlaced && (
        <div className="order-success-banner">✅ Order placed successfully!</div>
      )}
      {location.state?.justPaid && (
        <div className="order-success-banner">✅ Payment successful!</div>
      )}

      {loading && <p className="status-text">Loading orders...</p>}
      {error && <p className="status-text error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-cart">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Start Shopping
          </Link>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <span className={`order-status status-${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="order-card-items">
              {order.orderItems.map((item) => (
                <div key={item.product} className="order-item-row">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span>
                Payment: {order.paymentMethod} ·{" "}
                {order.isPaid ? "Paid" : order.paymentMethod === "COD" ? "Pay on delivery" : "Unpaid"}
              </span>
              <span className="order-total">
                Total: ₹{order.totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {order.paymentMethod === "Card" && !order.isPaid && (
              <Link to={`/payment/${order._id}`} className="pay-now-link">
                Complete Payment →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
