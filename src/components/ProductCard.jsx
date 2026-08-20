import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <h2>{product.name}</h2>

      <p>₹{product.price}</p>

      <p>{product.category}</p>

      <Link to={`/product/${product.id}`}>
        View Details
      </Link>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;