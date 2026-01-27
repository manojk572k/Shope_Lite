import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./AppLayout.css";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/login");
  }

  return (
    <div className="app-shell">
      <header className="app-nav">
        <div className="brand">ShopLite</div>

        <nav className="links">
          <NavLink to="/app/shop">Shop</NavLink>
          <NavLink to="/app/cart">Cart</NavLink>
          <NavLink to="/app/profile">Profile</NavLink>
          {user?.role === "admin" && <NavLink to="/app/admin">Admin</NavLink>}
        </nav>

        <div className="right">
          <span className="badge">{user?.role || "user"}</span>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
