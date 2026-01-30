import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../layouts/CartContext";
import { useSearch } from "../layouts/SearchContext";
import { useEffect, useRef, useState } from "react";
import "./AppLayout.css";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { query, setQuery } = useSearch();

  const quantity = items.reduce((total, item) => total + item.qty, 0);

  // bubble behavior
  const [showBadge, setShowBadge] = useState(true);
  const prevQtyRef = useRef(quantity);

  useEffect(() => {
    if (quantity > prevQtyRef.current) setShowBadge(true);
    prevQtyRef.current = quantity;
  }, [quantity]);

  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login");
  }

  return (
    <div className="app-shell">
      <header className="app-nav">
        <div className="brand">ShopLite</div>

        <div className="navCenter">
          <nav className="links">
            <NavLink to="/app/shop" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
              Shop
            </NavLink>

            <NavLink
              to="/app/cart"
              className={({ isActive }) => `navItem cart ${isActive ? "active" : ""}`}
              onClick={() => setShowBadge(false)}
            >
              Cart
              {showBadge && quantity > 0 && (
                <span className="badge">{quantity > 99 ? "99+" : quantity}</span>
              )}
            </NavLink>

            <NavLink to="/app/profile" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
              Profile
            </NavLink>

            {user?.role === "admin" && (
              <NavLink to="/app/admin" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="searchWrap">
            <input
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>

        <div className="right">
          <span className="badgeUser">{user?.role || "user"}</span>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
