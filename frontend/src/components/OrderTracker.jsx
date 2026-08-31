import "./OrderTracker.css";

const steps = ["Placed", "Processing", "Shipped", "Delivered"];

export default function OrderTracker({ status }) {
  if (status === "Cancelled") {
    return <div className="tracker-cancelled">❌ This order was cancelled</div>;
  }

  const currentIndex = steps.indexOf(status);

  return (
    <div className="order-tracker">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step} className={`tracker-step ${isDone ? "done" : ""}`}>
            <div className={`tracker-dot ${isCurrent ? "current" : ""}`}>
              {isDone ? "✓" : index + 1}
            </div>
            <span className="tracker-label">{step}</span>
            {index < steps.length - 1 && (
              <div className={`tracker-line ${index < currentIndex ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
