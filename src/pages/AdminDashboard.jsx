// src/pages/AdminDashboard.jsx
export default function AdminDashboard({ logout }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Manage platform settings, security & user roles.</p>

      <button onClick={logout} className="btn btn--primary">Logout</button>
    </div>
  );
}
