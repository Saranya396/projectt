// src/App.jsx
/**
 * FEDF-PS20: Online medical system (Home + Sign up/Login with localStorage)
 */

import React, { useState, useMemo } from "react";
import "./App.css";

// Role dashboards (separate files under /pages)
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PharmacistDashboard from "./pages/PharmacistDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

/* ---------------- LocalStorage helpers ---------------- */

const LS_USERS = "medicare_users";

const loadUsers = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LS_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_USERS, JSON.stringify(users));
};

/* ---------------- Small SVG icons ---------------- */

const HomeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

/* ---------------- Home page ---------------- */

const HomePage = ({ onGoAuth, users }) => {
  const stats = useMemo(() => {
    const counts = { admin: 0, doctor: 0, patient: 0, pharmacist: 0 };
    users.forEach((u) => {
      if (counts[u.role] !== undefined) counts[u.role] += 1;
    });
    const totalUsers =
      counts.admin + counts.doctor + counts.patient + counts.pharmacist;

    // If no real data yet, show sample numbers instead of 0s
    if (totalUsers === 0) {
      return {
        patient: 128,
        doctor: 42,
        pharmacist: 18,
        admin: 6,
        totalUsers: 194,
      };
    }

    return { ...counts, totalUsers };
  }, [users]);

  const advantages = [
    {
      title: "24x7 virtual care",
      description:
        "Book online consultations, receive e-prescriptions and view lab reports from anywhere.",
      Icon: ActivityIcon,
    },
    {
      title: "Secure health records",
      description:
        "Role-based access and encryption make sure your data stays safe.",
      Icon: ShieldIcon,
    },
    {
      title: "All roles connected",
      description:
        "Admin, doctors, patients and pharmacists work in one unified system.",
      Icon: ClipboardIcon,
    },
  ];

  const feedbacks = [
    {
      name: "Rahul, 21",
      role: "Patient",
      text: "“I booked a consultation in 2 minutes and got my e-prescription instantly.”",
    },
    {
      name: "Dr. Priya",
      role: "Doctor",
      text: "“Seeing previous history and reports in one place saves a lot of time.”",
    },
    {
      name: "Karthik",
      role: "Pharmacist",
      text: "“E-prescriptions reduce errors and make dispensing very clear.”",
    },
  ];

  const locations = ["Hyderabad", "Chennai", "Bengaluru", "Mumbai", "Delhi"];

  return (
    <div className="page page--home">
      {/* Hero + map visual */}
      <section className="hero card">
        <div className="hero-text">
          <div className="hero-pill">
            FEDF-PS20 · Online Medical System for Virtual Consultations
          </div>
          <h1 className="hero-title">
            MediCare
            <span className="hero-title-highlight"> Virtual Health Hub</span>
          </h1>
          <p className="hero-subtitle">
            Book appointments, meet doctors online, receive e-prescriptions and
            access medical records — all inside one secure web app.
          </p>
          <div className="hero-actions">
            <button className="btn btn--primary" onClick={onGoAuth}>
              <LogInIcon className="btn-icon" />
              Sign up / Login
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                const el = document.getElementById("how-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              How it works
            </button>
          </div>
          <ul className="hero-meta">
            <li>Virtual consultations</li>
            <li>E-prescriptions</li>
            <li>Medical records & lab reports</li>
          </ul>
        </div>

        {/* “Map” – image + locations list */}
        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="hero-visual-row">
              <span className="pill pill--green">Coverage</span>
              <span className="hero-visual-label">MediCare Hospitals</span>
            </div>
            <p className="hero-visual-caption">
              Locations where the MediCare web app is actively used:
            </p>

            {/* MAP IMAGE */}
            <img
              src="/medicare-map.png"
              alt="Map with markers showing MediCare hospital locations"
              className="map-image"
            />

            <p className="hero-visual-caption" style={{ marginTop: "0.4rem" }}>
              Currently serving:
            </p>
            <ul className="panel-list">
              {locations.map((city) => (
                <li key={city}>
                  <span className="dot dot--blue" />
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section">
        <h2 className="section-title">Advantages of using MediCare</h2>
        <div className="grid grid--advantages">
          {advantages.map((adv) => (
            <article key={adv.title} className="adv-card card">
              <div className="adv-icon-wrap">
                <adv.Icon className="adv-icon" />
              </div>
              <h3 className="adv-title">{adv.title}</h3>
              <p className="adv-description">{adv.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How to sign up / login – horizontal linked steps */}
      <section className="section" id="how-section">
        <h2 className="section-title">How to sign up / login</h2>
        <p className="section-subtitle">
          A simple 4-step flow to reach your role-based dashboard.
        </p>
        <div className="card section">
          <div className="steps-row">
            <div className="step-chip">
              <span className="step-number-circle">1</span>
              <span className="step-text">Choose your role</span>
            </div>
            <span className="step-arrow">➜</span>
            <div className="step-chip">
              <span className="step-number-circle">2</span>
              <span className="step-text">Enter details</span>
            </div>
            <span className="step-arrow">➜</span>
            <div className="step-chip">
              <span className="step-number-circle">3</span>
              <span className="step-text">Sign up (account created)</span>
            </div>
            <span className="step-arrow">➜</span>
            <div className="step-chip">
              <span className="step-number-circle">4</span>
              <span className="step-text">
                Login with email + role + password
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feedbacks */}
      <section className="section">
        <h2 className="section-title">Feedback from users</h2>
        <div className="grid grid--advantages">
          {feedbacks.map((f) => (
            <article key={f.name} className="adv-card card">
              <h3 className="adv-title">{f.name}</h3>
              <p className="role-tag" style={{ marginBottom: "0.4rem" }}>
                {f.role}
              </p>
              <p className="adv-description">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats / overview */}
      <section className="section">
        <h2 className="section-title">MediCare Network Overview</h2>
        <p className="section-subtitle">
          Quick overview of how many users are currently connected to the
          MediCare virtual care platform.
        </p>
        <div className="grid grid--advantages">
          <article className="adv-card card">
            <h3 className="adv-title">Patients</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {stats.patient}
            </p>
          </article>
          <article className="adv-card card">
            <h3 className="adv-title">Doctors</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {stats.doctor}
            </p>
          </article>
          <article className="adv-card card">
            <h3 className="adv-title">Pharmacists</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {stats.pharmacist}
            </p>
          </article>
          <article className="adv-card card">
            <h3 className="adv-title">Admins</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {stats.admin}
            </p>
          </article>
          <article className="adv-card card">
            <h3 className="adv-title">Total registered users</h3>
            <p className="hero-title-highlight" style={{ fontSize: "1.5rem" }}>
              {stats.totalUsers}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

/* ---------------- Sign up / Login page ---------------- */

const AuthPage = ({ onBackHome, onLoginSuccess, onUsersChange }) => {
  const [mode, setMode] = useState("signup"); // "signup" | "login"

  // --- signup state
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("patient");
  const [gender, setGender] = useState("female");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [signupMsg, setSignupMsg] = useState("");

  // --- login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginRole, setLoginRole] = useState("patient");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const validateSignup = () => {
    if (!fullName.trim()) return "Full name is required.";
    if (!gender) return "Gender is required.";
    const ageNum = Number(age);
    if (!age || Number.isNaN(ageNum) || ageNum <= 0)
      return "Age must be a valid positive number.";
    if (!email.includes("@gmail.com"))
      return "Email must be a Gmail address (example@gmail.com).";
    if (!/^\d{10}$/.test(phone))
      return "Phone number must be exactly 10 digits.";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6}$/.test(password))
      return "Password must be 6 characters and contain letters and numbers.";
    return "";
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupMsg("");

    const error = validateSignup();
    if (error) {
      setSignupMsg(error);
      return;
    }

    const users = loadUsers();
    const exists = users.some(
      (u) => u.email === email.trim() && u.role === role
    );
    if (exists) {
      setSignupMsg("User with this email and role already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      role, // admin | doctor | patient | pharmacist
      gender,
      age: Number(age),
      email: email.trim(),
      phone,
      password,
      status: "active", // default status
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    onUsersChange(updated);

    setSignupMsg("Sign up successful! You can now login.");
    setMode("login");
    setLoginEmail(newUser.email);
    setLoginRole(newUser.role);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginMsg("");

    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email === loginEmail.trim() &&
        u.role === loginRole &&
        u.password === loginPassword
    );

    if (!found) {
      setLoginMsg("Invalid email / type of user / password.");
      return;
    }

    // If admin has denied this user, block login
    if (found.status === "denied") {
      setLoginMsg("Your access has been denied by the admin.");
      return;
    }

    setLoginMsg("Login successful.");
    onLoginSuccess(found);
  };

  return (
    <div className="page page--login">
      <div className="login-layout card">
        <div className="login-left">
          <button type="button" className="back-link" onClick={onBackHome}>
            <ArrowLeftIcon className="back-icon" />
            Back to Home
          </button>

          {/* tabs: signup / login */}
          <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem" }}>
            <button
              type="button"
              className={
                "header-link " +
                (mode === "signup" ? "header-link--active" : "")
              }
              onClick={() => {
                setMode("signup");
                setSignupMsg("");
              }}
            >
              Sign up
            </button>
            <button
              type="button"
              className={
                "header-link " +
                (mode === "login" ? "header-link--active" : "")
              }
              onClick={() => {
                setMode("login");
                setLoginMsg("");
              }}
            >
              Login
            </button>
          </div>

          {mode === "signup" ? (
            <>
              <h2 className="login-title">Create a MediCare account</h2>
              <p className="login-subtitle">
                Fill the details below to create your account.
              </p>

              <form className="form" onSubmit={handleSignup}>
                <div className="form-field">
                  <label className="field-label">Full name</label>
                  <div className="field-input-wrapper">
                    <UserIcon className="field-icon" />
                    <input
                      className="field-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Saranya P T"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">Role / Type of user</label>
                  <select
                    className="field-input field-input--select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Gender</label>
                  <select
                    className="field-input field-input--select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Age</label>
                  <input
                    type="number"
                    min="1"
                    className="field-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 20"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Email (@gmail.com)</label>
                  <input
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@gmail.com"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Phone number (10 digits)</label>
                  <input
                    type="tel"
                    className="field-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Password (6-digit alpha numeric)
                  </label>
                  <div className="field-input-wrapper">
                    <LockIcon className="field-icon" />
                    <input
                      type="password"
                      className="field-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. ab12cd"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                  Sign up
                </button>
              </form>

              {signupMsg && (
                <div
                  className={
                    "message " +
                    (signupMsg.toLowerCase().includes("successful")
                      ? "message--success"
                      : "message--error")
                  }
                >
                  {signupMsg}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="login-title">Login to MediCare</h2>
              <p className="login-subtitle">
                Only users who have already signed up in this browser can login.
              </p>

              <form className="form" onSubmit={handleLogin}>
                <div className="form-field">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    className="field-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@gmail.com"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Type of user</label>
                  <select
                    className="field-input field-input--select"
                    value={loginRole}
                    onChange={(e) => setLoginRole(e.target.value)}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Password</label>
                  <div className="field-input-wrapper">
                    <LockIcon className="field-icon" />
                    <input
                      type="password"
                      className="field-input"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                  <LogInIcon className="btn-icon" />
                  Login
                </button>
              </form>

              {loginMsg && (
                <div
                  className={
                    "message " +
                    (loginMsg.toLowerCase().includes("successful")
                      ? "message--success"
                      : "message--error")
                  }
                >
                  {loginMsg}
                </div>
              )}
            </>
          )}

          <p className="login-hint">
            Note: This is a front-end demo. No real backend.
          </p>
        </div>

        <aside className="login-right">
          <h3 className="panel-title">Roles that can sign in</h3>
          <ul className="panel-list">
            <li>
              <span className="dot dot--green" />
              Patients book appointments and view their medical history.
            </li>
            <li>
              <span className="dot dot--blue" />
              Doctors see patient details and consultations.
            </li>
            <li>
              <span className="dot dot--purple" />
              Pharmacists see prescriptions and dispense medicines.
            </li>
            <li>
              <span className="dot dot--amber" />
              Admin manages all user accounts and access.
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

/* ---------------- Main App shell ---------------- */

const App = () => {
  const [page, setPage] = useState("home"); // "home" | "auth" | "dashboard"
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => loadUsers());

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
  };

  const renderPage = () => {
    if (page === "auth") {
      return (
        <AuthPage
          onBackHome={() => setPage("home")}
          onLoginSuccess={handleLoginSuccess}
          onUsersChange={setUsers}
        />
      );
    }

    if (page === "dashboard") {
      if (!currentUser) return null;

      // Route by role to separate page components
      if (currentUser.role === "patient") {
        return (
          <PatientDashboard
            user={currentUser}
            onLogout={handleLogout}
            logout={handleLogout}
          />
        );
      }

      if (currentUser.role === "doctor") {
        return (
          <DoctorDashboard
            user={currentUser}
            onLogout={handleLogout}
            logout={handleLogout}
          />
        );
      }

      if (currentUser.role === "pharmacist") {
        return (
          <PharmacistDashboard
            user={currentUser}
            onLogout={handleLogout}
            logout={handleLogout}
          />
        );
      }

      if (currentUser.role === "admin") {
        return (
          <AdminDashboard
            user={currentUser}
            users={users}
            onUsersChange={setUsers}
            onLogout={handleLogout}
            logout={handleLogout}
          />
        );
      }

      // Fallback (unknown role)
      return (
        <div className="page">
          <section className="card section">
            <h2 className="section-title">Unknown role</h2>
            <p className="section-subtitle">
              Your role is not recognised. Please log out and login again.
            </p>
            <button
              className="btn btn--ghost"
              style={{ marginTop: "1.2rem" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>
        </div>
      );
    }

    // default: home
    return <HomePage onGoAuth={() => setPage("auth")} users={users} />;
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
                "header-link " + (page === "home" ? "header-link--active" : "")
              }
              onClick={() => setPage("home")}
            >
              Home
            </button>
            <button
              className={
                "header-link " + (page === "auth" ? "header-link--active" : "")
              }
              onClick={() => setPage("auth")}
            >
              <LogInIcon className="header-link-icon" />
              Sign up / Login
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;
