// src/pages/DoctorDashboard.jsx
export default function DoctorDashboard({ logout }) {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Doctor Dashboard</h1>
      <p>View patient history, start consultations & provide e-prescriptions.</p>

      <button onClick={logout} className="btn btn--primary">Logout</button>
    </div>
  );
}
