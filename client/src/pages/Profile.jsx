import { useAuth } from "../auth/AuthContext";
export default function Profile() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Profile</h2>
      <div style={card}>
        <div><b>Username:</b> {user?.username}</div>
        <div><b>Email:</b> {user?.email}</div>
        <div><b>Role:</b> {user?.role}</div>
      </div>
    </div>
  );
}

const card = {
  marginTop: 12,
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)"
};


// Gave all naming starts with Uppercase