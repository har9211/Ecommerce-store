function ProductCard({ product }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>₹{product.price}</p>
      <p>{product.category}</p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductCard;