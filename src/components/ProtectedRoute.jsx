// src/components/ProtectedRoute.jsx
export default function ProtectedRoute({ role, allowed, children }) {
  if (allowed.includes(role)) return children;
  return <h2 style={{ padding: "2rem", color: "#f88" }}>Access Denied ❌</h2>;
}
