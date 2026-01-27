import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { token, user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== "admin") return <Navigate to="/forbidden" />;
  return children;
}
