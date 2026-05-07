import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerSupervisor, sendOtp } from "../api/auth.api";
import "../components/auth/AuthLayout.css";
import "../styles/components.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await registerSupervisor(form);
      localStorage.setItem("email",form.email);
      localStorage.setItem("company",form.company);
      localStorage.setItem("phone",form.phone);
      localStorage.setItem("username",form.name);
      console.log("called");
      // await sendOtp(form.email);
      const res=navigate("/verify-otp", { state: { email: form.email, flow: "register" } });
    } catch (err) {
       console.log(err);
        console.log(err.response);
        alert(err.response?.data);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">M</div>
          <span className="auth-brand-name">Mason-Mate</span>
        </div>
        <div className="auth-progress">
          {[1,2,3,4].map(i => <div key={i} className={`auth-progress-seg ${i <= 1 ? "active" : ""}`} />)}
        </div>
        <p className="auth-step">Step 1 of 4</p>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Register as a supervisor to manage your team and projects.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Full name</label>
            <input className="form-input" name="name" placeholder="Ravi Kumar" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label className="form-label">Email address</label>
            <input className="form-input" name="email" type="email" placeholder="ravi@company.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label className="form-label">Phone number</label>
            <input className="form-input" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label className="form-label">Company / Site name</label>
            <input className="form-input" name="company" placeholder="Krishna Constructions" value={form.company} onChange={handleChange} required />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Sending OTP..." : "Continue →"}
          </button>
        </form>
        <div className="auth-link-row">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
