import React, { useState } from "react";
import { useNavigate, Link, useLocation, Navigate } from "react-router-dom";
import { loginSupervisor } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import "../components/auth/AuthLayout.css";
import "../styles/components.css";
// import Toast  from "../components/common/Toast";

export default function LoginPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { login, token } = useAuth();
  const registered = location.state?.registered;

  const [form, setForm]       = useState({ identifier: "", password: "" });
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  //  const [toast, setToast] = useState(null);

  // If already logged in, redirect away immediately — no route guard needed
  if (token){
    console.log("here it navigates::"+token);
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginSupervisor(form);
      console.log(res.data);
      console.log("FULL RESPONSE:", JSON.stringify(res.data));
      if (res.data.success) {
        // localStorage.setItem("token", res.data.jwt);
        login(res.data.jwt, res.data.supervisor);
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">M</div>
          <span className="auth-brand-name">Mason-Mate</span>
        </div>

        {registered && (
          <div className="auth-info-box" style={{ color: "var(--clr-success)", marginBottom: "1.25rem" }}>
            Account created successfully. Please sign in.
          </div>
        )}

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your supervisor account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input className="form-input" name="identifier" type="text"
              placeholder="name@gmail.com" value={form.identifier}
              onChange={handleChange} required />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input className="form-input" name="password"
                type={show ? "text" : "password"} placeholder="Your password"
                value={form.password} onChange={handleChange}
                required style={{ paddingRight: 52 }} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position:"absolute", right:12, top:"50%",
                  transform:"translateY(-50%)", background:"none", border:"none",
                  fontSize:11, fontFamily:"var(--font-mono)",
                  color:"var(--clr-text-muted)", letterSpacing:"0.05em" }}>
                {show ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        <div className="auth-link-row">
          New supervisor? <Link to="/register" className="auth-link">Create account</Link>
        </div>
      </div>
    </div>
  );
}