// src/pages/PatientDashboard.jsx
export default function PatientDashboard({ logout }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Patient Dashboard</h1>
      <p>Book appointments, view prescriptions & access lab reports.</p>

      <button onClick={logout} className="btn btn--primary">Logout</button>
    </div>
  );
}
