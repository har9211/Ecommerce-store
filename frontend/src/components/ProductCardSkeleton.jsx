import "./ProductCardSkeleton.css";

export default function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" />
      <div className="skeleton-line skeleton-line-short" />
      <div className="skeleton-line skeleton-line-long" />
      <div className="skeleton-line skeleton-line-medium" />
    </div>
  );
}
