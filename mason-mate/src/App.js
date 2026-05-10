import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./styles/global.css";
import "./styles/components.css";

import Header from "./components/layout/Header";
import HomePage           from "./pages/HomePage";
import RegisterPage       from "./pages/RegisterPage";
import VerifyOtpPage      from "./pages/VerifyOtpPage";
import CreatePasswordPage from "./pages/CreatePasswordPage";
import LoginPage          from "./pages/LoginPage";
import DashboardPage      from "./pages/DashboardPage";
import WorkersPage        from "./pages/WorkersPage";
import ProjectPage from "./pages/ProjectsPage";
import PaymentPage from "./pages/PaymentPage";
import AttendancePage from "./pages/AttendancePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";

const Placeholder = ({ title }) => (
  <div style={{ padding: "2rem", maxWidth: 600 }}>
    <h1>{title}</h1>
    <p style={{ color: "var(--clr-text-secondary)", fontSize: 14 }}>Under construction.</p>
  </div>
);

// Catches any render crash inside a route and shows it instead of
// silently bouncing the URL
class RouteErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error("[RouteErrorBoundary]", e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", color: "red" }}>
          <h2>Page crashed — check console for details</h2>
          <pre style={{ fontSize: 12, marginTop: "1rem", whiteSpace: "pre-wrap" }}>
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function PrivateRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
}

function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public */}
        <Route path="/"        element={<HomePage />} />
        <Route path="/about"   element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />

        {/* Auth — no guards, LoginPage handles its own redirect */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/verify-otp"      element={<VerifyOtpPage />} />
        <Route path="/create-password" element={<CreatePasswordPage />} />

        {/* Private */}
        <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/workers"    element={<PrivateRoute><WorkersPage /></PrivateRoute>} />
        <Route path="/projects"   element={<PrivateRoute><ProjectPage/></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><AttendancePage/></PrivateRoute>} />
        <Route path="/payments"   element={<PrivateRoute><PaymentPage/></PrivateRoute>} />
        <Route path="/contacts"   element={<PrivateRoute><ContactPage/></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><Placeholder title="Profile" /></PrivateRoute>} />

        {/* No wildcard redirect — unknown paths just show nothing, no redirect loop */}
        <Route path="*" element={
          <div style={{ padding: "2rem" }}>
            <h2>404 — Page not found</h2>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}