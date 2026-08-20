import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart } = useCart();

  return (
    <main>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>

            <p>₹{product.price}</p>

            <button
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </main>
  );
}

export default Cart;