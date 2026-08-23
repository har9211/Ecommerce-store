import "./TrustBadges.css";

const badges = [
  { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹999" },
  { icon: "↩️", title: "7-Day Replacement", desc: "No questions asked" },
  { icon: "💵", title: "Cash on Delivery", desc: "Pay when it arrives" },
  { icon: "🔒", title: "Secure Payments", desc: "100% protected checkout" },
];

export default function TrustBadges() {
  return (
    <section className="trust-section">
      <div className="container trust-grid">
        {badges.map((b) => (
          <div key={b.title} className="trust-item">
            <span className="trust-icon">{b.icon}</span>
            <div>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
