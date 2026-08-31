import Reveal from "./Reveal";
import "./Testimonials.css";

// NOTE: these are placeholder/sample reviews for design purposes, not real
// customer submissions. Swap these out (or connect a real reviews API) once
// you have actual orders and feedback coming in.
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Jaipur",
    text: "Delivery was faster than promised and the packaging was solid. Will definitely shop here again.",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    location: "Pune",
    text: "Good range of products and the prices are fair. Customer support responded quickly when I had a question.",
    rating: 4,
  },
  {
    name: "Sneha Kulkarni",
    location: "Indore",
    text: "Easy checkout process and the order tracking kept me updated the whole way through.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section container">
      <Reveal>
        <h2 className="section-title">What Customers Say</h2>
      </Reveal>

      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} className={`testimonial-wrap delay-${i}`}>
            <div className="testimonial-card">
              <div className="testimonial-stars">{"⭐".repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-location">{t.location}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
