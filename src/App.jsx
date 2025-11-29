// App.jsx
/**
 * FEDF-PS20: Create an online medical system for virtual consultations
 *
 * Develop a web application that allows users to book virtual medical appointments,
 * receive e-prescriptions, and access their medical records and lab reports.
 *
 * Roles:
 * - Admin: Manage platform settings, oversee user accounts, and ensure data security.
 * - Doctor: Conduct virtual consultations, provide e-prescriptions, and manage patient records.
 * - Patient: Book appointments, access medical records, and receive virtual consultations.
 * - Pharmacist: Manage e-prescriptions, track orders, and provide medication information.
 */

import React, { useState } from "react";
import "./app.css";

// --------- Inline SVG Icons (no external deps) ----------

const HomeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LogInIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);

const UserIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowLeftIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ActivityIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const ClipboardIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" />
  </svg>
);

const StethoscopeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 4v5a6 6 0 0 0 12 0V4" />
    <circle cx="6" cy="4" r="2" />
    <circle cx="18" cy="4" r="2" />
    <path d="M12 17v3a3 3 0 0 0 6 0v-3" />
  </svg>
);

const PillIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="9" height="18" rx="4.5" />
    <rect x="12" y="3" width="9" height="18" rx="4.5" />
    <path d="M3 12h9" />
  </svg>
);

// --------- Simple Dashboard Components (per role) ----------

const AdminDashboard = ({ user, onLogout }) => (
  <div className="page">
    <section className="card section">
      <h2 className="section-title">Admin Dashboard</h2>
      <p className="section-subtitle">
        Welcome {user?.username || "Admin"}! Manage platform users, roles and
        overall system security.
      </p>

      <div className="grid grid--advantages" style={{ marginTop: "1rem" }}>
        <article className="adv-card card">
          <h3 className="adv-title">User Management</h3>
          <p className="adv-description">
            View and manage all patients, doctors and pharmacists registered on the platform.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Access Control</h3>
          <p className="adv-description">
            Configure role-based permissions for secure access to medical data.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Platform Settings</h3>
          <p className="adv-description">
            Update consultation rules, availability windows and system policies.
          </p>
        </article>
      </div>

      <button className="btn btn--ghost" style={{ marginTop: "1.2rem" }} onClick={onLogout}>
        Logout
      </button>
    </section>
  </div>
);

const DoctorDashboard = ({ user, onLogout }) => (
  <div className="page">
    <section className="card section">
      <h2 className="section-title">Doctor Dashboard</h2>
      <p className="section-subtitle">
        Hello Dr. {user?.username || "User"} — review your upcoming appointments and issue e-prescriptions.
      </p>

      <div className="grid grid--advantages" style={{ marginTop: "1rem" }}>
        <article className="adv-card card">
          <h3 className="adv-title">Today&apos;s Appointments</h3>
          <p className="adv-description">
            List of scheduled virtual consultations (dummy data for now).
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Patient Records</h3>
          <p className="adv-description">
            Access patient histories, lab reports and previous prescriptions.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">E-Prescriptions</h3>
          <p className="adv-description">
            Create and send digital prescriptions directly to the patient and pharmacist.
          </p>
        </article>
      </div>

      <button className="btn btn--ghost" style={{ marginTop: "1.2rem" }} onClick={onLogout}>
        Logout
      </button>
    </section>
  </div>
);

const PatientDashboard = ({ user, onLogout }) => (
  <div className="page">
    <section className="card section">
      <h2 className="section-title">Patient Dashboard</h2>
      <p className="section-subtitle">
        Hi {user?.username || "Patient"} — book appointments and access your medical history.
      </p>

      <div className="grid grid--advantages" style={{ marginTop: "1rem" }}>
        <article className="adv-card card">
          <h3 className="adv-title">Book Appointment</h3>
          <p className="adv-description">
            Choose a doctor, date and time for your next virtual consultation.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Medical Records</h3>
          <p className="adv-description">
            View your diagnoses, treatment plans and uploaded lab reports.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">E-Prescriptions</h3>
          <p className="adv-description">
            Access prescriptions shared by your doctors and track medication status.
          </p>
        </article>
      </div>

      <button className="btn btn--ghost" style={{ marginTop: "1.2rem" }} onClick={onLogout}>
        Logout
      </button>
    </section>
  </div>
);

const PharmacistDashboard = ({ user, onLogout }) => (
  <div className="page">
    <section className="card section">
      <h2 className="section-title">Pharmacist Dashboard</h2>
      <p className="section-subtitle">
        Welcome {user?.username || "Pharmacist"} — manage incoming e-prescriptions and dispense medicines.
      </p>

      <div className="grid grid--advantages" style={{ marginTop: "1rem" }}>
        <article className="adv-card card">
          <h3 className="adv-title">E-Prescription Queue</h3>
          <p className="adv-description">
            View prescriptions waiting to be processed and verified.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Order Tracking</h3>
          <p className="adv-description">
            Track medication orders and update their status for patients.
          </p>
        </article>
        <article className="adv-card card">
          <h3 className="adv-title">Medication Info</h3>
          <p className="adv-description">
            Provide dosage and safety information to patients (counselling).
          </p>
        </article>
      </div>

      <button className="btn btn--ghost" style={{ marginTop: "1.2rem" }} onClick={onLogout}>
        Logout
      </button>
    </section>
  </div>
);

const AccessDenied = ({ navigate }) => (
  <div className="page">
    <section className="card section">
      <h2 className="section-title">Access Denied</h2>
      <p className="section-subtitle">
        You are not authorised to view this dashboard. Please login with the correct role.
      </p>
      <button
        className="btn btn--primary"
        style={{ marginTop: "1rem" }}
        onClick={() => navigate("login")}
      >
        <LogInIcon className="btn-icon" />
        Go to Login
      </button>
    </section>
  </div>
);

// --------- Page Components: Home ----------

const HomePage = ({ navigate }) => {
  const advantages = [
    {
      title: "Real-time Access",
      description:
        "Instantly view appointments, e-prescriptions, lab reports and records in one secure dashboard.",
      Icon: ActivityIcon,
    },
    {
      title: "Secure & Compliant",
      description:
        "End-to-end encryption and strict access control keep patient data safe and private.",
      Icon: ShieldIcon,
    },
    {
      title: "Truly Virtual Care",
      description:
        "From booking to consultation to medication – everything happens online, from anywhere.",
      Icon: ClipboardIcon,
    },
  ];

  const roles = [
    {
      label: "Admin",
      Icon: ShieldIcon,
      tag: "Platform governance",
      description:
        "Configure the platform, manage users and roles, and monitor system security.",
    },
    {
      label: "Doctor",
      Icon: StethoscopeIcon,
      tag: "Virtual consultations",
      description:
        "Attend appointments, update patient histories, and issue e-prescriptions.",
    },
    {
      label: "Patient",
      Icon: UserIcon,
      tag: "Care on demand",
      description:
        "Book slots, join video consultations, and access your complete medical journey.",
    },
    {
      label: "Pharmacist",
      Icon: PillIcon,
      tag: "Medication management",
      description:
        "Process e-prescriptions, track orders, and provide medication counselling.",
    },
  ];

  return (
    <div className="page page--home">
      <section className="hero card">
        <div className="hero-text">
          <div className="hero-pill">
            FEDF-PS20 • Online Medical System for Virtual Consultations
          </div>
          <h1 className="hero-title">
            MediCare
            <span className="hero-title-highlight"> Virtual Health Hub</span>
          </h1>
          <p className="hero-subtitle">
            Book appointments, meet doctors online, receive e-prescriptions, and
            access medical records — all in one intuitive, secure web
            application.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate("login")}
            >
              <LogInIcon className="btn-icon" />
              Access your account
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                const section = document.getElementById("roles-section");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore roles
            </button>
          </div>
          <ul className="hero-meta">
            <li>Virtual consultations</li>
            <li>E-prescriptions</li>
            <li>Medical records & lab reports</li>
          </ul>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="hero-visual-row">
              <span className="pill pill--green">Live</span>
              <span className="hero-visual-label">Dr. Mehra · Cardiology</span>
            </div>
            <div className="hero-avatar-row">
              <div className="hero-avatar hero-avatar--doctor">DR</div>
              <div className="hero-avatar hero-avatar--patient">PT</div>
            </div>
            <p className="hero-visual-caption">
              “Your lab reports look good. I’ll adjust the dosage and send an
              updated e-prescription.”
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Why choose MediCare?</h2>
        <div className="grid grid--advantages">
          {advantages.map((adv, idx) => (
            <article key={idx} className="adv-card card">
              <div className="adv-icon-wrap">
                <adv.Icon className="adv-icon" />
              </div>
              <h3 className="adv-title">{adv.title}</h3>
              <p className="adv-description">{adv.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="roles-section">
        <h2 className="section-title">Platform roles</h2>
        <p className="section-subtitle">
          The system is designed around four key stakeholders. Each
          role-specific workspace is optimised for clarity and speed.
        </p>
        <div className="grid grid--roles">
          {roles.map((role, idx) => (
            <article key={idx} className="role-card card">
              <div className="role-icon-badge">
                <role.Icon className="role-icon" />
              </div>
              <h3 className="role-title">{role.label}</h3>
              <span className="role-tag">{role.tag}</span>
              <p className="role-description">{role.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

// --------- Login Page (now notifies App on success) ----------

const LoginPage = ({ navigate, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("patient");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    // Simulated login
    setMessage(`Login successful as ${role.toUpperCase()} (simulated).`);

    // Inform parent (App) so it can navigate to correct dashboard
    onLoginSuccess(role, username);
  };

  return (
    <div className="page page--login">
      <div className="login-layout card">
        <div className="login-left">
          <button
            onClick={() => navigate("home")}
            className="back-link"
            type="button"
          >
            <ArrowLeftIcon className="back-icon" />
            Back to Home
          </button>

          <h2 className="login-title">Sign in to MediCare</h2>
          <p className="login-subtitle">
            Choose your role, sign in, and continue where you left off.
          </p>

          <form className="form" onSubmit={handleLogin}>
            <div className="form-field">
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <div className="field-input-wrapper">
                <UserIcon className="field-icon" />
                <input
                  id="username"
                  type="text"
                  className="field-input"
                  placeholder="e.g. saranya.p"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setMessage("");
                  }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                className="field-input field-input--select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setMessage("");
                }}
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="field-input-wrapper">
                <LockIcon className="field-icon" />
                <input
                  id="password"
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn--primary btn--full">
              <LogInIcon className="btn-icon" />
              Sign in
            </button>
          </form>

          {message && (
            <div
              className={
                "message " +
                (message.toLowerCase().includes("successful")
                  ? "message--success"
                  : "message--error")
              }
            >
              {message}
            </div>
          )}

          <p className="login-hint">
            This demo focuses on front-end UI. Authentication is simulated for
            FEDF-PS20.
          </p>
        </div>

        <aside className="login-right">
          <h3 className="panel-title">Designed for remote care</h3>
          <ul className="panel-list">
            <li>
              <span className="dot dot--green" />
              Patients book, reschedule, and join video consultations.
            </li>
            <li>
              <span className="dot dot--blue" />
              Doctors review medical history and issue e-prescriptions.
            </li>
            <li>
              <span className="dot dot--purple" />
              Pharmacists fulfil orders and provide medication guidance.
            </li>
            <li>
              <span className="dot dot--amber" />
              Admin oversees roles, permissions, and platform health.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

// --------- Main App Shell ----------

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null); // { role, username }

  const navigateTo = (page) => setCurrentPage(page);

  const handleLoginSuccess = (role, username) => {
    const userInfo = { role, username };
    setUser(userInfo);
    setCurrentPage(`${role}-dashboard`); // admin-dashboard / doctor-dashboard etc.
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const renderPage = () => {
    if (currentPage === "login") {
      return <LoginPage navigate={navigateTo} onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentPage === "admin-dashboard") {
      if (!user || user.role !== "admin") {
        return <AccessDenied navigate={navigateTo} />;
      }
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    if (currentPage === "doctor-dashboard") {
      if (!user || user.role !== "doctor") {
        return <AccessDenied navigate={navigateTo} />;
      }
      return <DoctorDashboard user={user} onLogout={handleLogout} />;
    }

    if (currentPage === "patient-dashboard") {
      if (!user || user.role !== "patient") {
        return <AccessDenied navigate={navigateTo} />;
      }
      return <PatientDashboard user={user} onLogout={handleLogout} />;
    }

    if (currentPage === "pharmacist-dashboard") {
      if (!user || user.role !== "pharmacist") {
        return <AccessDenied navigate={navigateTo} />;
      }
      return <PharmacistDashboard user={user} onLogout={handleLogout} />;
    }

    // default: home
    return <HomePage navigate={navigateTo} />;
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-mark">
              <HomeIcon className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-name">MediCare</span>
              <span className="brand-tagline">Virtual Care Platform</span>
            </div>
          </div>
          <nav className="header-nav">
            <button
              className={
                "header-link " +
                (currentPage === "home" ? "header-link--active" : "")
              }
              onClick={() => navigateTo("home")}
            >
              Home
            </button>
            <button
              className={
                "header-link " +
                (currentPage === "login" ? "header-link--active" : "")
              }
              onClick={() => navigateTo("login")}
            >
              <LogInIcon className="header-link-icon" />
              Login
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;
