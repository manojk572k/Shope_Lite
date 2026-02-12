import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../layouts/CartContext";
import { useSearch } from "../layouts/SearchContext";
import { useEffect, useRef, useState } from "react";
import About from "../pages/About.jsx";
import "./AppLayout.css";

export default function AppLayout() {
  const { user, logout, token } = useAuth();
  const { items } = useCart();
  const { query, setQuery } = useSearch();
  const nav = useNavigate();

  const quantity = items.reduce((total, item) => total + item.qty, 0);

  // Bubble badge animation
  const [showBadge, setShowBadge] = useState(true);
  const prevQtyRef = useRef(quantity);
  useEffect(() => {
    if (quantity > prevQtyRef.current) setShowBadge(true);
    prevQtyRef.current = quantity;
  }, [quantity]);

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

            <NavLink to="/shop" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
              Shop
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `navItem cart ${isActive ? "active" : ""}`} onClick={() => setShowBadge(false)}>
              Cart
              {showBadge && quantity > 0 && <span className="badge">{quantity > 99 ? "99+" : quantity}</span>}
            </NavLink>

            {!token && (
                <>
                <NavLink
                to="/about"
                className={({ isActive }) => `navItem ${!isActive ? "active" : ""}`}
              >
                About
              </NavLink>
                </>
              )
              }

            {token && (
              <>
                <NavLink to="/profile" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
                  Profile
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink to="/admin" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
                    Admin
                  </NavLink>
                )}
              </>
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
          {!token ? (
            <>
              <NavLink to="/login" state={{ mode: "login" }} className="navItem">Login</NavLink>
              <NavLink to="/login" state={{ mode: "register" }} className="navItem">Register</NavLink>
            </>
          ) : (
            <>
              <span className="badgeUser">{user?.role || "user"}</span>
              <button className="logout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
