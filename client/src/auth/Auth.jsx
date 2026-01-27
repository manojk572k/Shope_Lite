import { useState }from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import useTitle from "../hooks/useTitle";
import "./Auth.css";

export default function Auth() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const isLogin = mode === "login";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  useTitle(mode === "login" ? "Login | ShopLite" : "Register | ShopLite");


  function switchMode(nextMode) {
    setError("");
    setSuccess("");
    setMode(nextMode);

    // reset password fields when switching
    setPassword("");
    setConfirmPassword("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // basic validation
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
        nav("/app/shop");
        return;
      }

      // REGISTER
      await api.post("/auth/register", { username, email, password });

      // ✅ After register, go to login mode (NOT auto-login)
      setSuccess("Account created successfully. Please login.");
      switchMode("login");
      setEmail(email); // keep email filled for convenience
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);

      // If user already exists, move to login mode
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

          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="switch">
          {isLogin ? (
            <>
              <span>Don’t have an account?</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => switchMode("login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
