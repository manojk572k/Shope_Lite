import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function clearSession() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  // Always fetch latest profile from server (uses interceptor Authorization header)
  async function refreshProfile() {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return null;

    const res = await api.get("/auth/profile");
    setUser(res.data.data);
    return res.data.data;
  }

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (e) {
        // Token invalid/expired
        if (mounted) clearSession();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
    // token state change should re-run
  }, [token]);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const newToken = res.data?.data?.token;

    if (!newToken) {
      throw new Error("Token missing in login response");
    }

    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Set quick user from login response first (fast UI)
    const loginUser = res.data?.data?.user || null;
    if (loginUser) setUser(loginUser);

    // Then pull full profile (createdAt/updatedAt etc)
    try {
      await refreshProfile();
    } catch {
      // If profile fails for some reason, keep login user
    }

    return res.data;
  }

  function logout() {
    clearSession();
  }

  // ---- Settings APIs ----
  async function updateUsername(username) {
    const res = await api.patch("/auth/username", { username });

    // Some controllers return updated user in res.data.data
    const updated = res.data?.data;
    if (updated) {
      setUser(updated);
    } else {
      // fallback: refresh full profile
      await refreshProfile();
    }

    return res.data;
  }

  async function updateEmail(email) {
    const res = await api.patch("/auth/email", { email });

    const updated = res.data?.data;
    if (updated) {
      setUser(updated);
    } else {
      await refreshProfile();
    }

    return res.data;
  }

  async function updatePassword(currentPassword, newPassword) {
    const res = await api.patch("/auth/password", { currentPassword, newPassword });
    // Do not overwrite user here. Password change usually returns only success message.
    return res.data;
  }

  // ---- Forgot / Reset password ----
  async function forgotPassword(email) {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data; // includes resetLink in demo mode
  }

  async function resetPassword(tokenParam, newPassword) {
    const res = await api.post(`/auth/reset-password/${tokenParam}`, { newPassword });
    return res.data;
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,

      refreshProfile,
      updateUsername,
      updateEmail,
      updatePassword,

      forgotPassword,
      resetPassword,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
