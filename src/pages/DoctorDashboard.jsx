// src/pages/DoctorDashboard.jsx
import React, { useMemo, useState } from "react";

/* ----- localStorage helpers ----- */

const LS_USERS = "medicare_users";
const LS_APPOINTMENTS = "medicare_appointments";

const safeLoad = (key) => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadUsers = () => safeLoad(LS_USERS);

/* ----- Doctor Dashboard ----- */

export default function DoctorDashboard({ user, onLogout }) {
  // All users (to fetch patient details)
  const allUsers = useMemo(() => loadUsers(), []);

  // All appointments where this doctor is selected
  const appointments = useMemo(() => {
    const all = safeLoad(LS_APPOINTMENTS);
    const mine = all.filter((a) => a.doctorEmail === user.email);

    // sort by date + time
    return mine.sort((a, b) =>
      (a.date + " " + a.time).localeCompare(b.date + " " + b.time)
    );
  }, [user.email]);

  // Map patient email -> patient info from users
  const patientUsers = useMemo(
    () => allUsers.filter((u) => u.role === "patient"),
    [allUsers]
  );

  const patientMap = useMemo(() => {
    const map = {};
    patientUsers.forEach((p) => {
      map[p.email] = p;
    });
    return map;
  }, [patientUsers]);

  // Unique patients under this doctor (based on appointments)
  const patientsUnderDoctor = useMemo(() => {
    const emails = Array.from(
      new Set(appointments.map((a) => a.patientEmail))
    );

    return emails.map((email) => {
      const fromUsers = patientMap[email];
      const fromAppt = appointments.find((a) => a.patientEmail === email);

      return {
        email,
        name: fromUsers?.fullName || fromAppt?.patientName || email,
        gender: fromUsers?.gender || "-",
        age: fromUsers?.age ?? "-",
        phone: fromUsers?.phone || "-",
      };
    });
  }, [appointments, patientMap]);

  const [showPatients, setShowPatients] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);

  // Simple profile data (dummy experience / qualification / rating)
  const experience = "7+ years";
  const qualification = "MBBS, MD (General Medicine)";
  const rating = "4.7 / 5";

  const initials =
    (user.fullName || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "DR";

  return (
    <div className="page">
      <section className="card section">
        {/* Header with profile icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "1.2rem",
          }}
        >
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
                Doctor Workspace
              </h2>
              <p className="section-subtitle">
                {user.fullName} · {user.gender} · {experience}
              </p>
              <p className="section-subtitle">
                Qualification: {qualification}
              </p>
              <p className="section-subtitle">
                Rating: ⭐ {rating}
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

        {/* Two main cards: patients & schedule */}
        <div className="grid grid--advantages">
          {/* Patients under this doctor */}
          <article className="adv-card card">
            <h3 className="adv-title">Patients under your care</h3>
            <p className="adv-description">
              Number of unique patients assigned to you through appointments.
            </p>

            <p
              className="hero-title-highlight"
              style={{ fontSize: "1.6rem", margin: "0.6rem 0" }}
            >
              {patientsUnderDoctor.length}
            </p>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => setShowPatients((prev) => !prev)}
            >
              {showPatients ? "Hide patient details" : "View patient details"}
            </button>

            {showPatients && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: "0.8rem",
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {patientsUnderDoctor.length === 0 && (
                  <li className="adv-description">
                    No patients are assigned yet.
                  </li>
                )}
                {patientsUnderDoctor.map((p) => (
                  <li
                    key={p.email}
                    style={{
                      padding: "0.55rem 0.6rem",
                      borderRadius: "0.6rem",
                      border: "1px solid rgba(148,163,184,0.4)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {p.name}
                    </div>
                    <div className="adv-description">
                      {p.gender} · {p.age} years
                    </div>
                    <div className="adv-description">
                      {p.email} · {p.phone}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>

          {/* Appointment schedule */}
          <article className="adv-card card">
            <h3 className="adv-title">Upcoming schedule</h3>
            <p className="adv-description">
              Appointments booked by your patients for virtual consultations.
            </p>

            <p
              className="hero-title-highlight"
              style={{ fontSize: "1.6rem", margin: "0.6rem 0" }}
            >
              {appointments.length}
            </p>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => setShowSchedule((prev) => !prev)}
            >
              {showSchedule ? "Hide schedule" : "View schedule"}
            </button>

            {showSchedule && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginTop: "0.8rem",
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {appointments.length === 0 && (
                  <li className="adv-description">
                    No appointments scheduled yet.
                  </li>
                )}
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
                      Patient:{" "}
                      <strong>{a.patientName || a.patientEmail}</strong>
                    </div>
                    <div className="adv-description">{a.patientEmail}</div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
