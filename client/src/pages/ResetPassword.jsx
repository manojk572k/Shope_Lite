import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../auth/AuthContext";


export default function ResetPassword() {
  useTitle("Reset Password | ShopLite");
  const { token } = useParams();
  const nav = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setBusy(true);
      const res = await resetPassword(token, newPassword);
      setSuccess(res?.message || "Password reset successfully.");
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setError(err?.response?.data?.message || "Token invalid or expired");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Reset password</h2>
        <p className="subtitle">Set a new password for the account.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>New password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : "Update password"}
          </button>
        </form>

        <div className="switch" style={{ justifyContent: "center" }}>
          <Link to="/login" className="link-btn">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
