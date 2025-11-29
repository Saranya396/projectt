// src/pages/PharmacistDashboard.jsx
export default function PharmacistDashboard({ logout }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pharmacist Dashboard</h1>
      <p>Manage e-prescription requests & track medicine orders.</p>

      <button onClick={logout} className="btn btn--primary">Logout</button>
    </div>
  );
}
