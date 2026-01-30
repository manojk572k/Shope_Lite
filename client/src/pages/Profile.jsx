
import { useEffect, useMemo, useState } from "react";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../auth/AuthContext";
import "./Profile.css";

export default function Profile() {
  useTitle("Profile | ShopLite");
  const {
    user,
    loading,
    refreshProfile,
    updateUsername,
    updateEmail,
    updatePassword,
  } = useAuth();

  const [tab, setTab] = useState("account"); // account | security

  const [uName, setUName] = useState("");
  const [uEmail, setUEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [busy, setBusy] = useState({ username: false, email: false, password: false });
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setUName(user.username || "");
      setUEmail(user.email || "");
    }
  }, [user]);

  const rolePill = useMemo(() => (user?.role || "user").toUpperCase(), [user]);

  const isUsernameValid = useMemo(() => {
    const v = String(uName || "").trim();
    if (!v) return false;
    if (v.length < 3 || v.length > 20) return false;
    if (!/^[a-zA-Z0-9_]+$/.test(v)) return false;
    return true;
  }, [uName]);

  const isEmailValid = useMemo(() => {
    const v = String(uEmail || "").trim().toLowerCase();
    if (!v) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [uEmail]);

  const usernameChanged = useMemo(() => {
    return String(uName || "").trim() !== String(user?.username || "").trim();
  }, [uName, user?.username]);

  const emailChanged = useMemo(() => {
    return String(uEmail || "").trim().toLowerCase() !== String(user?.email || "").trim().toLowerCase();
  }, [uEmail, user?.email]);

  const canSaveUsername = isUsernameValid && usernameChanged && !busy.username;
  const canSaveEmail = isEmailValid && emailChanged && !busy.email;

  const canSavePassword = useMemo(() => {
    if (busy.password) return false;
    if (!currentPassword || !newPassword) return false;
    if (newPassword.length < 6) return false;
    return true;
  }, [busy.password, currentPassword, newPassword]);

  function flashMessage(type, text) {
    setMsg({ type, text });
    window.clearTimeout(flashMessage._t);
    flashMessage._t = window.setTimeout(() => setMsg({ type: "", text: "" }), 4500);
  }

  async function saveUsername() {
    setMsg({ type: "", text: "" });

    if (!isUsernameValid) {
      flashMessage("error", "Username must be 3–20 chars and use letters/numbers/underscore only.");
      return;
    }
    if (!usernameChanged) {
      flashMessage("error", "No changes to save.");
      return;
    }

    try {
      setBusy((p) => ({ ...p, username: true }));
      const res = await updateUsername(String(uName).trim());
      flashMessage("success", res?.message || "Username updated.");
      await refreshProfile();
    } catch (e) {
      flashMessage("error", e?.response?.data?.message || "Failed to update username.");
    } finally {
      setBusy((p) => ({ ...p, username: false }));
    }
  }

  async function saveEmail() {
    setMsg({ type: "", text: "" });

    if (!isEmailValid) {
      flashMessage("error", "Enter a valid email.");
      return;
    }
    if (!emailChanged) {
      flashMessage("error", "No changes to save.");
      return;
    }

    try {
      setBusy((p) => ({ ...p, email: true }));
      const res = await updateEmail(String(uEmail).trim());
      flashMessage("success", res?.message || "Email updated.");
      await refreshProfile();
    } catch (e) {
      flashMessage("error", e?.response?.data?.message || "Failed to update email.");
    } finally {
      setBusy((p) => ({ ...p, email: false }));
    }
  }

  async function savePassword() {
    setMsg({ type: "", text: "" });

    if (!currentPassword || !newPassword) {
      flashMessage("error", "Both passwords are required.");
      return;
    }
    if (newPassword.length < 6) {
      flashMessage("error", "New password must be at least 6 characters.");
      return;
    }

    try {
      setBusy((p) => ({ ...p, password: true }));
      const res = await updatePassword(currentPassword, newPassword);
      flashMessage("success", res?.message || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      flashMessage("error", e?.response?.data?.message || "Failed to update password.");
    } finally {
      setBusy((p) => ({ ...p, password: false }));
    }
  }

  function onKeySubmit(e, fn) {
    if (e.key === "Enter") {
      e.preventDefault();
      fn?.();
    }
  }

  if (loading) {
    return (
      <div className="profileWrap">
        <div className="profileCard">
          <div className="profileSkeleton">
            <div className="skLine w40" />
            <div className="skLine w70" />
            <div className="skGrid">
              <div className="skBox" />
              <div className="skBox" />
              <div className="skBox" />
            </div>
            <div className="skLine w60" />
            <div className="skLine w80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profileWrap">
      <div className="profileCard">
        <div className="profileHead">
          <div>
            <h2 className="profileTitle">Profile</h2>
            <p className="profileSub">Manage account settings and security</p>
          </div>
          <span className="rolePill">{rolePill}</span>
        </div>

        <div className="summaryGrid">
          <div className="summaryItem">
            <div className="summaryLabel">Username</div>
            <div className="summaryValue">{user?.username || "-"}</div>
          </div>
          <div className="summaryItem">
            <div className="summaryLabel">Email</div>
            <div className="summaryValue">{user?.email || "-"}</div>
          </div>
          <div className="summaryItem">
            <div className="summaryLabel">Member since</div>
            <div className="summaryValue">
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            type="button"
            className={`tabBtn ${tab === "account" ? "active" : ""}`}
            onClick={() => setTab("account")}
          >
            Account
          </button>
          <button
            type="button"
            className={`tabBtn ${tab === "security" ? "active" : ""}`}
            onClick={() => setTab("security")}
          >
            Security
          </button>
        </div>

        {msg.text && (
          <div className={`msg ${msg.type === "error" ? "err" : "ok"}`} role="status">
            {msg.text}
          </div>
        )}

        {tab === "account" ? (
          <div className="panel">
            <div className="fieldRow">
              <label className="label">Username</label>
              <div className="field">
                <input
                  className={`input ${!isUsernameValid && uName ? "bad" : ""}`}
                  value={uName}
                  onChange={(e) => setUName(e.target.value)}
                  onKeyDown={(e) => onKeySubmit(e, saveUsername)}
                  placeholder="Username"
                />
                <button className="btn primary" disabled={!canSaveUsername} onClick={saveUsername}>
                  {busy.username ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="hint">
                Use 3–20 characters. Allowed: letters, numbers, underscore.
              </div>
            </div>

            <div className="fieldRow">
              <label className="label">Email</label>
              <div className="field">
                <input
                  className={`input ${!isEmailValid && uEmail ? "bad" : ""}`}
                  value={uEmail}
                  onChange={(e) => setUEmail(e.target.value)}
                  onKeyDown={(e) => onKeySubmit(e, saveEmail)}
                  placeholder="Email"
                />
                <button className="btn primary" disabled={!canSaveEmail} onClick={saveEmail}>
                  {busy.email ? "Saving..." : "Save"}
                </button>
              </div>
              <div className="hint">Changing email affects login email.</div>
            </div>
          </div>
        ) : (
          <div className="panel">
            <div className="fieldRow">
              <label className="label">Current password</label>
              <input
                className="input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                onKeyDown={(e) => onKeySubmit(e, savePassword)}
                placeholder="••••••••"
              />
            </div>

            <div className="fieldRow">
              <label className="label">New password</label>
              <input
                className={`input ${newPassword && newPassword.length < 6 ? "bad" : ""}`}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => onKeySubmit(e, savePassword)}
                placeholder="••••••••"
              />
              <div className="hint">Minimum 6 characters.</div>
            </div>

            <button className="btn primary" disabled={!canSavePassword} onClick={savePassword}>
              {busy.password ? "Updating..." : "Update password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
