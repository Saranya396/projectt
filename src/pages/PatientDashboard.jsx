// src/pages/PatientDashboard.jsx
import React, { useMemo, useState } from "react";

/* ---- localStorage helpers for patient-related data ---- */

const LS_USERS = "medicare_users";
const LS_APPOINTMENTS = "medicare_appointments";
const LS_HISTORY = "medicare_history";
const LS_PRESCRIPTIONS = "medicare_prescriptions";

const safeLoad = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const safeSave = (key, data) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(data));
};

const loadUsers = () => safeLoad(LS_USERS);

const getPatientItems = (key, email) =>
  safeLoad(key).filter((item) => item.patientEmail === email);

/* ---- Patient Dashboard ---- */

export default function PatientDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" | "history" | "prescriptions"

  // Doctors list from localStorage (role = 'doctor')
  const doctors = useMemo(
    () => loadUsers().filter((u) => u.role === "doctor"),
    []
  );

  // Appointments
  const [appointments, setAppointments] = useState(() =>
    getPatientItems(LS_APPOINTMENTS, user.email)
  );
  const [apptDate, setApptDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [apptDoctorEmail, setApptDoctorEmail] = useState(
    doctors[0]?.email || ""
  );
  const [apptMsg, setApptMsg] = useState("");

  // Medical history
  const [historyList, setHistoryList] = useState(() =>
    getPatientItems(LS_HISTORY, user.email)
  );
  const [historyTitle, setHistoryTitle] = useState("");
  const [historyNotes, setHistoryNotes] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyMsg, setHistoryMsg] = useState("");

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState(() =>
    getPatientItems(LS_PRESCRIPTIONS, user.email)
  );
  const [rxMedicine, setRxMedicine] = useState("");
  const [rxDosage, setRxDosage] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [rxDate, setRxDate] = useState("");
  const [rxMsg, setRxMsg] = useState("");

  /* ---- Handlers ---- */

  const handleAddAppointment = (e) => {
    e.preventDefault();
    setApptMsg("");

    if (!apptDate || !apptTime || !apptDoctorEmail) {
      setApptMsg("Please select date, time and doctor.");
      return;
    }

    const doctor = doctors.find((d) => d.email === apptDoctorEmail);

    const newAppt = {
      id: Date.now(),
      patientEmail: user.email,
      patientName: user.fullName,
      doctorEmail: apptDoctorEmail,
      doctorName: doctor ? doctor.fullName : "Unknown doctor",
      date: apptDate,
      time: apptTime,
    };

    const all = safeLoad(LS_APPOINTMENTS);
    const updated = [...all, newAppt];
    safeSave(LS_APPOINTMENTS, updated);
    setAppointments(updated.filter((a) => a.patientEmail === user.email));
    setApptMsg("Appointment booked successfully.");

    setApptDate("");
    setApptTime("");
  };

  const handleAddHistory = (e) => {
    e.preventDefault();
    setHistoryMsg("");

    if (!historyTitle.trim()) {
      setHistoryMsg("Please enter a title for this medical record.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      patientEmail: user.email,
      title: historyTitle.trim(),
      notes: historyNotes.trim(),
      date: historyDate || new Date().toISOString().slice(0, 10),
    };

    const all = safeLoad(LS_HISTORY);
    const updated = [...all, newEntry];
    safeSave(LS_HISTORY, updated);
    setHistoryList(updated.filter((h) => h.patientEmail === user.email));
    setHistoryMsg("Medical record added.");

    setHistoryTitle("");
    setHistoryNotes("");
    setHistoryDate("");
  };

  const handleAddPrescription = (e) => {
    e.preventDefault();
    setRxMsg("");

    if (!rxMedicine.trim()) {
      setRxMsg("Please enter medicine name.");
      return;
    }

    const newRx = {
      id: Date.now(),
      patientEmail: user.email,
      medicine: rxMedicine.trim(),
      dosage: rxDosage.trim(),
      notes: rxNotes.trim(),
      date: rxDate || new Date().toISOString().slice(0, 10),
    };

    const all = safeLoad(LS_PRESCRIPTIONS);
    const updated = [...all, newRx];
    safeSave(LS_PRESCRIPTIONS, updated);
    setPrescriptions(updated.filter((p) => p.patientEmail === user.email));
    setRxMsg("Prescription added.");

    setRxMedicine("");
    setRxDosage("");
    setRxNotes("");
    setRxDate("");
  };

  /* ---- Render helpers ---- */

  const initials =
    (user.fullName || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "PT";

  const renderAppointmentsTab = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr", gap: "1rem" }}>
      <div className="card">
        <h3 className="adv-title">Book Appointment</h3>
        <p className="adv-description">
          Choose a date, time and doctor to schedule a virtual consultation.
        </p>

        <form className="form" onSubmit={handleAddAppointment}>
          <div className="form-field">
            <label className="field-label">Date</label>
            <input
              type="date"
              className="field-input"
              value={apptDate}
              onChange={(e) => setApptDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Time</label>
            <input
              type="time"
              className="field-input"
              value={apptTime}
              onChange={(e) => setApptTime(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Doctor</label>
            <select
              className="field-input field-input--select"
              value={apptDoctorEmail}
              onChange={(e) => setApptDoctorEmail(e.target.value)}
            >
              {doctors.length === 0 && (
                <option value="">No doctors registered yet</option>
              )}
              {doctors.map((d) => (
                <option key={d.id} value={d.email}>
                  {d.fullName} ({d.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Book appointment
          </button>
        </form>

        {apptMsg && <div className="message message--success">{apptMsg}</div>}
      </div>

      <div className="card">
        <h3 className="adv-title">Your booked appointments</h3>
        {appointments.length === 0 ? (
          <p className="adv-description">
            No appointments booked yet. Use the form to schedule one.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginTop: "0.6rem" }}>
            {appointments.map((a) => (
              <li
                key={a.id}
                style={{
                  padding: "0.55rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid rgba(148,163,184,0.4)",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {a.date} · {a.time}
                </div>
                <div className="adv-description">
                  Doctor: <strong>{a.doctorName}</strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr", gap: "1rem" }}>
      <div className="card">
        <h3 className="adv-title">Medical history</h3>
        {historyList.length === 0 ? (
          <p className="adv-description">
            No medical history records added yet.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {historyList.map((h) => (
              <li
                key={h.id}
                style={{
                  padding: "0.55rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid rgba(148,163,184,0.4)",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {h.title}{" "}
                  <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    · {h.date}
                  </span>
                </div>
                {h.notes && (
                  <div className="adv-description" style={{ marginTop: "0.2rem" }}>
                    {h.notes}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="adv-title">Add medical record</h3>
        <form className="form" onSubmit={handleAddHistory}>
          <div className="form-field">
            <label className="field-label">Title</label>
            <input
              className="field-input"
              value={historyTitle}
              onChange={(e) => setHistoryTitle(e.target.value)}
              placeholder="e.g. Diabetes check-up"
            />
          </div>
          <div className="form-field">
            <label className="field-label">Date</label>
            <input
              type="date"
              className="field-input"
              value={historyDate}
              onChange={(e) => setHistoryDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Notes</label>
            <textarea
              className="field-input"
              style={{ minHeight: "80px", paddingLeft: "0.85rem" }}
              value={historyNotes}
              onChange={(e) => setHistoryNotes(e.target.value)}
              placeholder="Summary, diagnosis, doctor comments..."
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Add record
          </button>
        </form>

        {historyMsg && (
          <div className="message message--success" style={{ marginTop: "0.5rem" }}>
            {historyMsg}
          </div>
        )}
      </div>
    </div>
  );

  const renderPrescriptionsTab = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr", gap: "1rem" }}>
      <div className="card">
        <h3 className="adv-title">Your prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p className="adv-description">
            No prescriptions added yet.
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {prescriptions.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "0.55rem 0.6rem",
                  borderRadius: "0.6rem",
                  border: "1px solid rgba(148,163,184,0.4)",
                  marginBottom: "0.5rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {p.medicine}{" "}
                  <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    · {p.date}
                  </span>
                </div>
                {p.dosage && (
                  <div className="adv-description">
                    Dosage: <strong>{p.dosage}</strong>
                  </div>
                )}
                {p.notes && (
                  <div className="adv-description" style={{ marginTop: "0.2rem" }}>
                    {p.notes}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h3 className="adv-title">Add prescription</h3>
        <form className="form" onSubmit={handleAddPrescription}>
          <div className="form-field">
            <label className="field-label">Medicine</label>
            <input
              className="field-input"
              value={rxMedicine}
              onChange={(e) => setRxMedicine(e.target.value)}
              placeholder="e.g. Paracetamol"
            />
          </div>
          <div className="form-field">
            <label className="field-label">Dosage</label>
            <input
              className="field-input"
              value={rxDosage}
              onChange={(e) => setRxDosage(e.target.value)}
              placeholder="e.g. 500mg, twice a day"
            />
          </div>
          <div className="form-field">
            <label className="field-label">Date</label>
            <input
              type="date"
              className="field-input"
              value={rxDate}
              onChange={(e) => setRxDate(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Notes / Instructions</label>
            <textarea
              className="field-input"
              style={{ minHeight: "80px", paddingLeft: "0.85rem" }}
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
              placeholder="When to take, precautions, etc."
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full">
            Add prescription
          </button>
        </form>

        {rxMsg && (
          <div className="message message--success" style={{ marginTop: "0.5rem" }}>
            {rxMsg}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page">
      <section className="card section">
        {/* Profile header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", gap: "0.9rem", alignItems: "center" }}>
            <div
              style={{
                width: "3.2rem",
                height: "3.2rem",
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 0, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              {initials}
            </div>
            <div>
              <h2 className="section-title" style={{ marginBottom: "0.3rem" }}>
                Patient Workspace
              </h2>
              <p className="section-subtitle">
                {user.fullName} · {user.gender} · {user.age} years
              </p>
              <p className="section-subtitle">
                {user.email} · {user.phone}
              </p>
            </div>
          </div>

          <button className="btn btn--ghost" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Tab buttons */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
          <button
            className={
              "header-link " +
              (activeTab === "appointments" ? "header-link--active" : "")
            }
            onClick={() => setActiveTab("appointments")}
          >
            Booking appointments
          </button>
          <button
            className={
              "header-link " +
              (activeTab === "history" ? "header-link--active" : "")
            }
            onClick={() => setActiveTab("history")}
          >
            Medical history
          </button>
          <button
            className={
              "header-link " +
              (activeTab === "prescriptions" ? "header-link--active" : "")
            }
            onClick={() => setActiveTab("prescriptions")}
          >
            Prescriptions
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "appointments" && renderAppointmentsTab()}
        {activeTab === "history" && renderHistoryTab()}
        {activeTab === "prescriptions" && renderPrescriptionsTab()}
      </section>
    </div>
  );
}
