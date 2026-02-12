import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../layouts/CartContext";
import useTitle from "../hooks/useTitle";
import "./Auth.css"; // we will reuse AppLayout.css styles here

export default function Auth() {
  const nav = useNavigate();
  const { login,token } = useAuth();
  const { items } = useCart();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const isLogin = mode === "login";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useTitle(isLogin ? "Login | ShopLite" : "Register | ShopLite");

  // Cart badge quantity
  const quantity = items.reduce((total, item) => total + item.qty, 0);
  const [showBadge, setShowBadge] = useState(true);
  const prevQtyRef = useRef(quantity);
  useEffect(() => {
    if (quantity > prevQtyRef.current) setShowBadge(true);
    prevQtyRef.current = quantity;
  }, [quantity]);

  function switchMode(nextMode) {
    setError("");
    setSuccess("");
    setMode(nextMode);
    setPassword("");
    setConfirmPassword("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill all required fields.");
      return;
    }

    if (!isLogin) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setBusy(true);

      if (isLogin) {
        await login(email, password);
        nav("/app/shop"); // redirect after login
        return;
      }

      await api.post("/auth/register", { username, email, password });
      setSuccess("Account created successfully. Please login.");
      switchMode("login");
      setEmail(email);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);

      if (err?.response?.status === 409) {
        setSuccess("Account already exists. Please login.");
        switchMode("login");
        setEmail(email);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">

      {/* ---------- NAVBAR SAME AS APPLAYOUT ---------- */}
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
            
          </nav>
        </div>
      </header>
      {/* ---------- END NAVBAR ---------- */}

      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Create account"}</h2>
        <p className="subtitle">
          {isLogin ? "Sign in to continue" : "Register to create a new account"}
        </p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Manoj"
                autoComplete="username"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manoj@gmail.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm password</label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {isLogin && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <Link to="/forgot-password" className="link-btn" style={{ padding: 0 }}>
                Forgot password?
              </Link>
            </div>
          )}

          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="switch">
          {isLogin ? (
            <>
              <span>Don’t have an account?</span>
              <button type="button" className="link-btn" onClick={() => switchMode("register")}>
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
