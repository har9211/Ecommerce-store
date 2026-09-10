import { Link, useLocation } from "react-router-dom";
import "./InfoPage.css";

const pages = {
  wishlist: ["Wishlist", "Save products you love here for easy access on your next visit.", "Browse products"],
  coupons: ["Coupons", "Your eligible offers and coupon codes will appear here when available.", "Shop deals"],
  notifications: ["Notifications", "You are all caught up. New order and offer updates will appear here.", "Continue shopping"],
  contact: ["Contact us", "Need a hand with an order or product? Email support@quickkart.example and we’ll be happy to help.", "Browse products"],
  shipping: ["Shipping policy", "Orders over ₹999 qualify for free standard delivery. Delivery estimates are shown during checkout.", "Continue shopping"],
  returns: ["Returns & replacement", "If an item arrives damaged or incorrect, contact us within 7 days of delivery for help with a replacement.", "My orders"],
  faqs: ["Frequently asked questions", "You can review orders, update your delivery address, and manage account details from your account area.", "Account settings"],
};

export default function InfoPage() {
  const key = useLocation().pathname.split("/")[1];
  const [title, text, action] = pages[key] || ["Page not found", "The page you requested is not available.", "Go home"];
  const actionTarget = key === "returns" ? "/orders" : key === "faqs" ? "/account" : key === "shipping" || key === "coupons" ? "/search?deals=1" : "/search";
  return <div className="container info-page page-enter"><div className="info-card"><h2 className="section-title">{title}</h2><p>{text}</p><Link to={actionTarget} className="info-action">{action}</Link></div></div>;
}
