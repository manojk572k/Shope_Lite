import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation(); // track where the user tried to go

  if (loading) return <p>Loading...</p>;

  if (!token) {
    // Redirect to login, pass where user came from and suggested mode
    return (
      <Navigate
        to="/login"
        state={{ from: location, suggestedMode: "register" }}
        replace
      />
    );
  }

  return children;
}
