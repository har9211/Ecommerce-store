import { useEffect, useState } from "react";
import "./PromoStrip.css";

const messages = [
  "🎉 Free delivery on orders above ₹999",
  "↩️ 7-day easy replacement on all products",
  "💵 Cash on delivery available",
  "⚡ New arrivals added every week",
];

export default function PromoStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="promo-strip">
      <span key={index} className="promo-message">
        {messages[index]}
      </span>
    </div>
  );
}
