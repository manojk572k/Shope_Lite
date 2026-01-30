import { useState } from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../auth/AuthContext";


export default function ForgotPassword() {
  useTitle("Forgot Password | ShopLite");
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetLink("");

    if (!email) return setError("Email is required.");

    try {
      setBusy(true);
      const res = await forgotPassword(email);
      setSuccess(res?.message || "Reset link generated.");
      if (res?.data?.resetLink) setResetLink(res.data.resetLink); // demo mode
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Forgot password</h2>
        <p className="subtitle">Enter the email for the account. In demo mode, I will show the reset link.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@gmail.com"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : "Generate reset link"}
          </button>
        </form>

        {resetLink && (
          <div style={{ marginTop: 12, wordBreak: "break-word" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo reset link:</div>
            <a href={resetLink} style={{ color: "#a5b4fc" }}>
              {resetLink}
            </a>
          </div>
        )}

        <div className="switch" style={{ justifyContent: "center" }}>
          <Link to="/login" className="link-btn">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
