// src/pages/AdminDashboard.jsx
import React, { useState } from "react";

const LS_USERS = "medicare_users";

const updateUsersInStorage = (updatedUsers) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_USERS, JSON.stringify(updatedUsers));
};

export default function AdminDashboard({
  user,
  users = [],
  onUsersChange,
  onLogout,
  logout,
}) {
  const [settings, setSettings] = useState({
    allowSelfSignUp: true,
    maintenanceMode: false,
    requireGmail: true,
  });

  const handleStatusChange = (userId, newStatus) => {
    const updated = users.map((u) =>
      u.id === userId ? { ...u, status: newStatus } : u
    );
    updateUsersInStorage(updated);
    if (onUsersChange) onUsersChange(updated);
  };

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalUsers = users.length;
  const byRole = users.reduce(
    (acc, u) => {
      if (acc[u.role] !== undefined) acc[u.role] += 1;
      return acc;
    },
    { admin: 0, doctor: 0, patient: 0, pharmacist: 0 }
  );

  const activeUsers = users.filter((u) => u.status !== "denied").length;
  const deniedUsers = users.filter((u) => u.status === "denied").length;

  return (
    <div className="page">
      <section className="card section">
        {/* Header */}
        <h2 className="section-title">Admin Control Center</h2>
        <p className="section-subtitle">
          Welcome <strong>{user?.fullName || "Admin"}</strong>. From this
          dashboard you can review all user profiles, allow or deny access and
          adjust platform settings for MediCare.
        </p>

        {/* Admin profile summary */}
        <div
          className="card"
          style={{
            marginTop: "1rem",
            marginBottom: "1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          <h3 className="adv-title">Your admin profile</h3>
          <p className="adv-description">
            <strong>Name:</strong> {user?.fullName || "Admin user"}
          </p>
          <p className="adv-description">
            <strong>Email:</strong> {user?.email || "-"} · <strong>Role:</strong>{" "}
            {user?.role || "admin"}
          </p>
        </div>

        {/* Feature overview cards (like your reference image) */}
        <div
          className="grid grid--advantages"
          style={{ marginBottom: "1.2rem" }}
        >
          <article className="adv-card card">
            <h3 className="adv-title">User directory</h3>
            <p className="adv-description">
              View all registered patients, doctors, pharmacists and admins with
              their basic details.
            </p>
            <p className="adv-description">
              Use this to quickly search who is using the MediCare platform.
            </p>
          </article>

          <article className="adv-card card">
            <h3 className="adv-title">Access control</h3>
            <p className="adv-description">
              Approve or deny users in a single click. Denied users will not be
              able to log in.
            </p>
            <p className="adv-description">
              Helpful when you want to temporarily stop access for a specific
              account.
            </p>
          </article>

          <article className="adv-card card">
            <h3 className="adv-title">Platform settings</h3>
            <p className="adv-description">
              Toggle sign-up rules, maintenance mode and email policies to
              control how the app behaves.
            </p>
            <p className="adv-description">
              Represents the admin’s ability to configure the system in your
              project.
            </p>
          </article>
        </div>

        {/* Snapshot cards (like a “platform snapshot” section) */}
        <div
          className="grid grid--advantages"
          style={{ marginBottom: "1.2rem" }}
        >
          <article className="adv-card card">
            <h3 className="adv-title">Total users</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {totalUsers}
            </p>
            <p className="adv-description">
              Combined count of all patients, doctors, pharmacists and admins.
            </p>
          </article>

          <article className="adv-card card">
            <h3 className="adv-title">Active users</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {activeUsers}
            </p>
            <p className="adv-description">
              Users whose status is set to <strong>Active</strong>.
            </p>
          </article>

          <article className="adv-card card">
            <h3 className="adv-title">Access denied</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {deniedUsers}
            </p>
            <p className="adv-description">
              Users that the admin has restricted from logging in.
            </p>
          </article>

          <article className="adv-card card">
            <h3 className="adv-title">By role</h3>
            <p className="adv-description">
              Patients: <strong>{byRole.patient}</strong> · Doctors:{" "}
              <strong>{byRole.doctor}</strong> · Pharmacists:{" "}
              <strong>{byRole.pharmacist}</strong> · Admins:{" "}
              <strong>{byRole.admin}</strong>
            </p>
          </article>
        </div>

        {/* User management table */}
        <div className="card" style={{ marginBottom: "1.2rem" }}>
          <h3 className="adv-title">All user profiles</h3>
          <p className="adv-description" style={{ marginBottom: "0.6rem" }}>
            The list below shows every user who has signed up. Use{" "}
            <strong>Allow</strong> or <strong>Deny</strong> to control their
            access to the platform.
          </p>

          {users.length === 0 ? (
            <p className="adv-description">No users have signed up yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const status = u.status || "active"; // default if old user has no status
                    return (
                      <tr key={u.id}>
                        <td>{u.fullName}</td>
                        <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                        <td>{u.gender}</td>
                        <td>{u.age}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td>
                          <span
                            className={
                              "status-pill " +
                              (status === "denied"
                                ? "status-pill--denied"
                                : "status-pill--active")
                            }
                          >
                            {status === "denied" ? "Denied" : "Active"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn btn--ghost admin-action-btn"
                            type="button"
                            onClick={() => handleStatusChange(u.id, "active")}
                          >
                            Allow
                          </button>
                          <button
                            className="btn btn--primary admin-action-btn"
                            type="button"
                            onClick={() => handleStatusChange(u.id, "denied")}
                          >
                            Deny
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Platform settings */}
        <div className="card">
          <h3 className="adv-title">Platform settings</h3>
          <p className="adv-description" style={{ marginBottom: "0.6rem" }}>
            These toggles represent the admin&apos;s ability to modify system
            behaviour (for your project explanation).
          </p>

          <div className="settings-row">
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.allowSelfSignUp}
                onChange={() => toggleSetting("allowSelfSignUp")}
              />
              <span>Allow self sign-up for new users</span>
            </label>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.requireGmail}
                onChange={() => toggleSetting("requireGmail")}
              />
              <span>Require Gmail address during registration</span>
            </label>

            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={() => toggleSetting("maintenanceMode")}
              />
              <span>Maintenance mode (only admins can log in)</span>
            </label>
          </div>
        </div>

        <button
          onClick={onLogout || logout}
          className="btn btn--ghost"
          style={{ marginTop: "1.4rem" }}
        >
          Logout
        </button>
      </section>
    </div>
  );
}
