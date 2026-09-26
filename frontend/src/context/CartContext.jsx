import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Custom hook - lets any component do `const { cartItems, addToCart } = useCart()`
// instead of importing useContext + CartContext everywhere.
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const cartKey = user?._id ? `cart:${user._id}` : null;
  const activeKey = useRef(cartKey);
  const skipWrite = useRef(true);
  const [cartItems, setCartItems] = useState(() => {
    const initialUser = JSON.parse(sessionStorage.getItem("user") || "null");
    const initialKey = initialUser?._id ? `cart:${initialUser._id}` : null;
    const saved = initialKey ? localStorage.getItem(initialKey) : null;
    return saved ? JSON.parse(saved) : [];
  });

  // Each signed-in user gets an isolated cart. Load their cart when the
  // identity changes, then save only after that load has completed.
  useEffect(() => {
    // A cart belongs to a signed-in account. Never show or retain a guest cart.
    if (!cartKey) {
      activeKey.current = null;
      skipWrite.current = true;
      setCartItems([]);
      return;
    }

    if (activeKey.current === cartKey) return;
    activeKey.current = cartKey;
    skipWrite.current = true;
    const saved = localStorage.getItem(cartKey);
    setCartItems(saved ? JSON.parse(saved) : []);
  }, [cartKey]);

  useEffect(() => {
    if (!cartKey) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (product) => {
    if (!user) return false;
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        // already in cart - just bump the quantity (don't exceed stock)
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }

      // new item - add with quantity 1
      return [...prev, { ...product, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
