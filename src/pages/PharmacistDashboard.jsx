// src/pages/PharmacistDashboard.jsx
import React, { useMemo, useState } from "react";

// LocalStorage keys (shared idea with other dashboards)
const LS_MEDICINES = "medicare_medicines";
const LS_PRESCRIPTIONS = "medicare_prescriptions";

// Helper: load JSON from LS
const loadFromLS = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Helper: save JSON to LS
const saveToLS = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export default function PharmacistDashboard({ user, onLogout }) {
  // 1) Medicines inventory (if none in LS, we create a sample list)
  const [medicines] = useState(() => {
    const existing = loadFromLS(LS_MEDICINES, []);
    if (existing && existing.length > 0) return existing;

    const sample = [
      { id: 1, name: "Paracetamol 500mg", stock: 120, type: "Tablet" },
      { id: 2, name: "Amoxicillin 250mg", stock: 60, type: "Capsule" },
      { id: 3, name: "Omeprazole 20mg", stock: 80, type: "Tablet" },
      { id: 4, name: "ORS Solution", stock: 35, type: "Liquid" },
    ];
    saveToLS(LS_MEDICINES, sample);
    return sample;
  });

  // 2) Prescriptions data – written by doctor / patient flows
  const [prescriptions] = useState(() =>
    loadFromLS(LS_PRESCRIPTIONS, [])
  );

  // Filter prescriptions for this pharmacist (matched by email or id)
  const myDispensations = useMemo(
    () =>
      prescriptions.filter(
        (p) =>
          p.pharmacistEmail === user.email ||
          p.pharmacistId === user.id
      ),
    [prescriptions, user]
  );

  const [selectedRecord, setSelectedRecord] = useState(null);

  return (
    <div className="page">
      <section className="card section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="section-title">Pharmacist Workspace</h2>
            <p className="section-subtitle">
              View medicine inventory and patients who received medicines from you.
            </p>
          </div>
          <button className="btn btn--ghost" onClick={onLogout}>
            Logout
          </button>
        </div>

        {/* Top: Pharmacist profile */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.2rem",
          }}
        >
          <article
            className="card"
            style={{ flex: "1 1 250px", margin: 0, padding: "1rem" }}
          >
            <h3 className="adv-title">Pharmacist Profile</h3>
            <p className="adv-description">
              <strong>Name:</strong> {user.fullName}
            </p>
            <p className="adv-description">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="adv-description">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="adv-description">
              <strong>Role:</strong> {user.role}
            </p>
          </article>

          {/* Medicines inventory */}
          <article
            className="card"
            style={{ flex: "2 1 320px", margin: 0, padding: "1rem" }}
          >
            <h3 className="adv-title">Available Medicines</h3>
            {medicines.length === 0 ? (
              <p className="adv-description">No medicines configured.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.85rem",
                    marginTop: "0.4rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.3rem 0.4rem" }}>
                        Name
                      </th>
                      <th style={{ textAlign: "left", padding: "0.3rem 0.4rem" }}>
                        Type
                      </th>
                      <th style={{ textAlign: "right", padding: "0.3rem 0.4rem" }}>
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((m) => (
                      <tr key={m.id}>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {m.name}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {m.type}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            textAlign: "right",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {m.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>

        {/* Bottom: Patients who took medicines from this pharmacist */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <article
            className="card"
            style={{ flex: "1.8 1 320px", margin: 0, padding: "1rem" }}
          >
            <h3 className="adv-title">Patients who received medicines</h3>
            {myDispensations.length === 0 ? (
              <p className="adv-description">
                No prescriptions linked to this pharmacist yet.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.85rem",
                    marginTop: "0.4rem",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.3rem 0.4rem" }}>
                        Patient
                      </th>
                      <th style={{ textAlign: "left", padding: "0.3rem 0.4rem" }}>
                        Medicine
                      </th>
                      <th style={{ textAlign: "left", padding: "0.3rem 0.4rem" }}>
                        Date
                      </th>
                      <th style={{ padding: "0.3rem 0.4rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDispensations.map((p) => (
                      <tr key={p.id}>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {p.patientName || "Unknown"}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {p.medicineName || "-"}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          {p.date || "-"}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.4rem",
                            borderTop: "1px solid rgba(148,163,184,0.3)",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn--ghost"
                            style={{ padding: "0.3rem 0.7rem", fontSize: "0.78rem" }}
                            onClick={() => setSelectedRecord(p)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          {/* Right: Selected patient details */}
          <article
            className="card"
            style={{ flex: "1.2 1 260px", margin: 0, padding: "1rem" }}
          >
            <h3 className="adv-title">Patient & medicine details</h3>
            {!selectedRecord ? (
              <p className="adv-description">
                Click “View” on any row to see patient details and the medicines given.
              </p>
            ) : (
              <>
                <p className="adv-description">
                  <strong>Patient name:</strong>{" "}
                  {selectedRecord.patientName || "Unknown"}
                </p>
                {selectedRecord.patientGender && (
                  <p className="adv-description">
                    <strong>Gender:</strong> {selectedRecord.patientGender}
                  </p>
                )}
                {selectedRecord.patientAge && (
                  <p className="adv-description">
                    <strong>Age:</strong> {selectedRecord.patientAge}
                  </p>
                )}
                {selectedRecord.patientEmail && (
                  <p className="adv-description">
                    <strong>Email:</strong> {selectedRecord.patientEmail}
                  </p>
                )}
                <hr
                  style={{
                    margin: "0.7rem 0",
                    borderColor: "rgba(148,163,184,0.35)",
                  }}
                />
                <p className="adv-description">
                  <strong>Medicine:</strong>{" "}
                  {selectedRecord.medicineName || "-"}
                </p>
                {selectedRecord.dosage && (
                  <p className="adv-description">
                    <strong>Dosage:</strong> {selectedRecord.dosage}
                  </p>
                )}
                {selectedRecord.instructions && (
                  <p className="adv-description">
                    <strong>Instructions:</strong> {selectedRecord.instructions}
                  </p>
                )}
                <p className="adv-description">
                  <strong>Dispensed on:</strong>{" "}
                  {selectedRecord.date || "Not specified"}
                </p>
              </>
            )}
          </article>
        </div>
      </section>
    </div>
  );
}
