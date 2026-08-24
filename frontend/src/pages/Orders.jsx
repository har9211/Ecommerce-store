import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./Orders.css";

const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Delivered"];

const STATUS_ICONS = {
  Placed: "📋",
  Processing: "⚙️",
  Shipped: "🚚",
  Delivered: "✅",
  Cancelled: "❌",
};

function OrderTracker({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="tracker-cancelled">
        <span className="tracker-cancelled-icon">❌</span>
        <span className="tracker-cancelled-text">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="order-tracker" aria-label="Order tracking progress">
      {STATUS_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isPending = idx > currentIndex;

        return (
          <div key={step} className="tracker-step-wrapper">
            <div
              className={`tracker-step ${isCompleted ? "step-done" : ""} ${isCurrent ? "step-current" : ""} ${isPending ? "step-pending" : ""}`}
            >
              <div className="tracker-circle">
                {isCompleted ? "✓" : STATUS_ICONS[step]}
              </div>
              <span className="tracker-label">{step}</span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`tracker-line ${idx < currentIndex ? "line-done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api
      .get("/orders/myorders")
      .then((res) => setOrders(res.data))
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="container orders-page page-enter">
      <div className="orders-header">
        <h2 className="section-title">My Orders</h2>
        <p className="orders-subtext">Track and manage all your orders</p>
      </div>

      {location.state?.justPlaced && (
        <div className="order-success-banner">
          🎉 Order placed successfully! Track your progress below.
        </div>
      )}
      {location.state?.justPaid && (
        <div className="order-success-banner">✅ Payment successful!</div>
      )}

      {loading && (
        <div className="orders-loading">
          <div className="loading-spinner-orders" />
          <p>Loading your orders…</p>
        </div>
      )}
      {error && <p className="status-text error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-orders">
          <div className="empty-orders-icon">🛍️</div>
          <h3>No orders yet</h3>
          <p>Looks like you haven't placed any orders. Start shopping!</p>
          <Link to="/" className="start-shopping-btn">
            Start Shopping →
          </Link>
        </div>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const isOpen = expanded === order._id;
          return (
            <div key={order._id} className={`order-card ${isOpen ? "order-card-open" : ""}`}>
              {/* Card Header */}
              <button
                className="order-card-header"
                onClick={() => toggleExpand(order._id)}
                aria-expanded={isOpen}
              >
                <div className="order-header-left">
                  <span className="order-id">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="order-header-right">
                  <span className={`order-status-pill status-${order.status.toLowerCase()}`}>
                    {STATUS_ICONS[order.status]} {order.status}
                  </span>
                  <span className="order-total-header">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="order-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="order-card-body">
                  {/* Tracking stepper */}
                  <div className="order-tracker-section">
                    <h4 className="tracker-title">Order Tracking</h4>
                    <OrderTracker status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="order-items-section">
                    <h4>Items Ordered</h4>
                    <div className="order-card-items">
                      {order.orderItems.map((item) => (
                        <div key={item.product} className="order-item-row">
                          <div className="order-item-info">
                            <div className="order-item-img">
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <span>📦</span>
                              )}
                            </div>
                            <div>
                              <span className="order-item-name">{item.name}</span>
                              <span className="order-item-qty">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="order-item-price">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Payment */}
                  <div className="order-meta-row">
                    <div className="order-meta-block">
                      <h4>Shipping Address</h4>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p>📞 {order.shippingAddress.phone}</p>
                    </div>
                    <div className="order-meta-block">
                      <h4>Payment</h4>
                      <p>Method: <strong>{order.paymentMethod}</strong></p>
                      <p>
                        Status:{" "}
                        <strong className={order.isPaid ? "paid-text" : "unpaid-text"}>
                          {order.isPaid
                            ? "Paid"
                            : order.paymentMethod === "COD"
                            ? "Pay on Delivery"
                            : "Unpaid"}
                        </strong>
                      </p>
                      <div className="order-price-breakdown">
                        <span>Items: ₹{order.itemsPrice?.toLocaleString("en-IN") ?? "—"}</span>
                        <span>Delivery: ₹{order.deliveryPrice?.toLocaleString("en-IN") ?? "0"}</span>
                        <span className="order-price-total">Total: ₹{order.totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {order.paymentMethod === "Card" && !order.isPaid && (
                    <Link to={`/payment/${order._id}`} className="pay-now-link">
                      Complete Payment →
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
