import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import Auth from "./auth/Auth";
import AppLayout from "./layouts/AppLayout";
import { CartProvider } from "./layouts/CartContext";
import { SearchProvider } from "./layouts/SearchContext";

import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function Forbidden() {
  return (
    <div style={{ padding: 18 }}>
      <h2>Forbidden</h2>
      <p style={{ color: "rgba(248,250,252,0.70)" }}>
        I don’t have access to this page.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <Routes>

              {/* Layout wraps navbar and main content */}
              <Route path="/" element={<AppLayout />}>

                {/* Public pages */}
                <Route index element={<Shop />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />

                {/* Protected pages */}
                <Route
                  path="/app/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/app/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />

              </Route>

              {/* Auth pages outside layout */}
              <Route path="/login" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/forbidden" element={<Forbidden />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
