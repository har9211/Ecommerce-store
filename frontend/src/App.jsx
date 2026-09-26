import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import CartSidebar from "./components/CartSidebar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import ProductListing from "./pages/ProductListing";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryPage from "./pages/CategoryPage";
import Account from "./pages/Account";
import InfoPage from "./pages/InfoPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";

// Routes where the persistent right-hand cart panel doesn't make sense
// (auth screens, checkout/payment flow already show cart details inline,
// and the admin dashboard has its own internal layout).
const HIDE_CART_PANEL_PREFIXES = ["/login", "/register", "/checkout", "/payment", "/admin"];

function AppShell() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const adminRoute = location.pathname.startsWith("/admin");
  const cartAvailable = !HIDE_CART_PANEL_PREFIXES.some((p) => location.pathname.startsWith(p));
  const [isCompact, setIsCompact] = useState(() => typeof window !== "undefined" && window.innerWidth <= 860);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const showBackdrop = sidebarOpen || cartOpen;

  // Close drawers whenever navigation moves to a flow that does not use them.
  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth <= 860);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setSidebarOpen(false);
    setCartOpen(false);
  }, [location.pathname, cartAvailable, isCompact]);

  if (isAdmin && !adminRoute) return <Navigate to="/admin" replace />;

  if (adminRoute) {
    return (
      <div className="admin-only-shell">
        <Routes>
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </div>
    );
  }

  return (
    <div className={`app-shell ${sidebarOpen ? "has-sidebar" : "sidebar-closed"} ${cartOpen ? "has-cart-panel" : "cart-closed"}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {showBackdrop && <button className="drawer-backdrop" aria-label="Close panels" onClick={() => { setSidebarOpen(false); setCartOpen(false); }} />}

      <div className="app-main">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} onOpenCart={() => setCartOpen(true)} />

        <div className="app-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<ProductListing />} />
            <Route path="/coupons" element={<InfoPage />} />
            <Route path="/notifications" element={<InfoPage />} />
            <Route path="/contact" element={<InfoPage />} />
            <Route path="/shipping" element={<InfoPage />} />
            <Route path="/returns" element={<InfoPage />} />
            <Route path="/faqs" element={<InfoPage />} />

            {/* Logged-in users only */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:orderId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route path="/addresses" element={<ProtectedRoute><Account /></ProtectedRoute>} />

            {/* Admins only - nested routes handled inside AdminDashboard itself */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>

      {cartAvailable && cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
