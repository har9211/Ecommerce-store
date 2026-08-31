import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import api from "../../api/axios";
import "../Auth.css";
import "./Admin.css";

const statusColors = {
  Placed: "#8B87A3",
  Processing: "#1D5DBF",
  Shipped: "#7B3FE4",
  Delivered: "#2E9E5B",
  Cancelled: "#D64545",
};

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/orders/stats/summary"),
      api.get("/products"),
      api.get("/auth/users"),
    ])
      .then(([summaryRes, productsRes, usersRes]) => {
        setData(summaryRes.data);
        setProductCount(productsRes.data.length);
        setCustomerCount(usersRes.data.length);
      })
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status-text">Loading analytics...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (!data) return null;

  const revenueTrend = Object.entries(data.revenueByDay).map(([date, revenue]) => ({
    date: date.slice(5), // show "MM-DD" instead of full year
    revenue,
  }));

  const statusBreakdown = Object.entries(data.ordersByStatus).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div>
      <div className="admin-content-header">
        <h3>Analytics</h3>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <span className="analytics-label">Total Revenue</span>
          <span className="analytics-value">₹{data.totalRevenue.toLocaleString("en-IN")}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-label">Total Orders</span>
          <span className="analytics-value">{data.totalOrders}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-label">Products</span>
          <span className="analytics-value">{productCount}</span>
        </div>
        <div className="analytics-card">
          <span className="analytics-label">Customers</span>
          <span className="analytics-value">{customerCount}</span>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="analytics-chart-card">
          <h4>Revenue — Last 14 Days</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1E1B4B"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics-chart-card">
          <h4>Orders by Status</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECE8E0" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusBreakdown.map((entry) => (
                  <Cell key={entry.status} fill={statusColors[entry.status] || "#8B87A3"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
