# MediCare Virtual Health Hub - Copilot Instructions

## Project Overview
**MediCare** is a role-based healthcare web application (FEDF-PS20 demo) built with React + Vite. It enables virtual consultations, e-prescriptions, and medical record management for four user roles: **Patient**, **Doctor**, **Pharmacist**, and **Admin**. The app uses **localStorage** for data persistence (no backend).

## Architecture & Component Structure

### Single-Page App (SPA) with State Machine
- **`App.jsx`** is the root container that manages three page states:
  - `"home"` - Landing page with system overview
  - `"auth"` - Sign up / Login form
  - `"dashboard"` - Post-login profile view (role-specific stubs)
- State flows: **home** ↔ **auth** → **dashboard** → **home** (via logout)

### Core Components
1. **HomePage** - Marketing/overview page with advantages, testimonials, stats, and coverage map
2. **AuthPage** - Unified sign-up and login forms with role selection (`patient`/`doctor`/`pharmacist`/`admin`)
3. **Dashboard** - Post-login profile display (shows user data from localStorage)
4. **ProtectedRoute** - Authorization wrapper for role-based access (in `src/components/`)

### Data Persistence
- **localStorage key**: `"medicare_users"` - stores array of user objects
- **User schema**: `{ id, fullName, role, gender, age, email, phone, password }`
- **Validation rules**:
  - Email must be Gmail (`@gmail.com`)
  - Phone: exactly 10 digits
  - Password: 6 characters with letters + numbers
  - Age: positive number
  - Role must be one of: `patient`, `doctor`, `pharmacist`, `admin`

## Styling Conventions

### Design System (CSS Variables in `index.css`)
```css
/* Color palette */
--color-bg: #020617 (dark navy base)
--color-accent: #6366f1 (indigo primary)
--color-accent-soft: rgba(99, 102, 241, 0.12) (indigo subtle)
--color-text-main: #e5e7eb (light gray text)
--color-text-muted: #9ca3af (medium gray text)

/* Spacing & sizing */
--radius-lg: 1.25rem
--radius-xl: 1.5rem
--shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.65)
--transition-fast: 160ms ease-out
--transition-med: 220ms ease-out
```

### Class Naming Patterns (BEM-inspired)
- **Buttons**: `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--full`
- **Cards**: `.card`, `.adv-card` (advantage card), `.hero-visual-card`
- **Sections**: `.section`, `.section-title`, `.section-subtitle`
- **Forms**: `.form`, `.form-field`, `.field-label`, `.field-input`, `.field-input--select`
- **Messages**: `.message`, `.message--success`, `.message--error`
- **Layout**: `.page`, `.page--home`, `.page--login`, `.hero`, `.hero-text`, `.hero-visual`
- **Grid**: `.grid`, `.grid--advantages`, `.grid--roles`
- **Utility**: `.dot--green`, `.dot--blue`, `.dot--purple`, `.dot--amber` (colored indicators)

### Responsive Breakpoints
- **900px**: Hero goes 2-col → 2-col (tighter), advantages 3-col → 2-col
- **720px**: Full single-column layout, login form reorders, hero visual stacks below

## Developer Workflow

### Running the App
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (HMR enabled)
npm run build        # Production build to /dist
npm run preview      # Preview production build
npm run lint         # Run ESLint (flat config)
```

### ESLint Configuration
- **File**: `eslint.config.js` (flat config, not `.eslintrc`)
- **Rules**:
  - React Hooks: recommended rules enforced
  - React Refresh: required for Vite HMR
  - No unused vars (but caps/underscores ignored, e.g., `_unused`, `UNUSED`)
- **Ignored**: `/dist` folder

### Key Files to Modify
| Task | File(s) |
|------|---------|
| Add new page/component | Create in `src/pages/` or `src/components/` then import in `App.jsx` |
| Change styling | `src/App.css` (component level), `src/index.css` (global/variables) |
| Add user fields to form | Update validation in `AuthPage.handleSignup()` + form JSX |
| Modify dashboard after login | Edit `Dashboard` component or role-specific page in `src/pages/` |
| Add protected routes | Use `ProtectedRoute` wrapper + role check in `allowed` array |

## Critical Patterns & Conventions

### Sign-up & Login Flow
1. User enters details (email, role, password) → `AuthPage` validates
2. Sign-up: stores new user to localStorage via `saveUsers()`
3. Login: checks email + role + password match
4. Success: triggers `onLoginSuccess()` → page changes to `"dashboard"`
5. **Important**: Email + role combination must be unique; same email allowed for different roles

### SVG Icon Pattern
All icons (HomeIcon, LogInIcon, etc.) are inline SVG components:
```jsx
const IconName = (props) => (
  <svg xmlns="..." viewBox="..." {...props}>
    {/* paths */}
  </svg>
);
```
Use `className` prop to style (color, size inherited from parent).

### State Management
- Simple `useState` hooks in each component (no Redux/Context)
- Parent-child communication via callback props: `onBackHome`, `onLoginSuccess`, `onLogout`
- Users list passed down to `HomePage` to calculate stats

### Form Validation
- **Real-time feedback**: Message div appears below form with `.message--error` or `.message--success` class
- **No inline validation**: Validation only on form submit
- Validation logic in `validateSignup()` function; reuse for frontend + backend when scaling

## Adding New Features

### To add a new role-specific dashboard:
1. Create `src/pages/NewRoleDashboard.jsx` (reference `PatientDashboard.jsx`)
2. Import in `App.jsx`
3. Add case in `Dashboard` render logic or extend state to route by role
4. Update `AuthPage` role dropdown if adding new role

### To extend sign-up fields:
1. Add state variable in `AuthPage` (e.g., `const [medicalLicense, setMedicalLicense] = useState("")`)
2. Add form field with label + input
3. Update `validateSignup()` with new validation
4. Add field to `newUser` object before `saveUsers()`
5. Update user schema comment in code

### To change form styling:
- Modify `.field-*` classes in `App.css`
- Update button classes (`.btn--primary`, `.btn--ghost`) for consistency
- Test on mobile (720px viewport) to ensure responsive layout

## Known Limitations & Future Considerations
- **No backend**: All data in localStorage (local browser only, not synced)
- **No authentication**: Passwords stored plain-text (demo only; never in production)
- **Single-device only**: Users must sign up on each device separately
- **No real dashboards**: Role dashboards (doctor, patient, pharmacist, admin) are placeholder stubs
- **TypeScript not enabled**: Project uses .jsx/.js (can add if needed)

## Project Structure Quick Reference
```
healthconnect-app/
├── src/
│   ├── App.jsx          ← Main app shell (state + page routing)
│   ├── App.css          ← Component-level styles
│   ├── index.css        ← Global styles + CSS variables
│   ├── main.jsx         ← React DOM entry point
│   ├── components/
│   │   └── ProtectedRoute.jsx  ← Auth guard component
│   └── pages/
│       ├── AdminDashboard.jsx
│       ├── DoctorDashboard.jsx
│       ├── PatientDashboard.jsx
│       └── PharmacistDashboard.jsx
├── index.html           ← HTML template
├── vite.config.js       ← Vite config (React plugin enabled)
├── eslint.config.js     ← ESLint flat config
├── package.json         ← Dependencies + scripts
└── .gitignore
```

## Questions or Gaps?
This document covers the discoverable patterns as of the current state. If you find sections unclear or incomplete, flag them for iteration.
