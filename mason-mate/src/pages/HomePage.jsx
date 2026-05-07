import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";
import "../styles/components.css";

const FEATURES = [
  { icon: "⬡", title: "Worker management",    desc: "Add or remove workers instantly. Set daily wages, roles, and send login credentials automatically." },
  { icon: "◫", title: "Project tracking",     desc: "Create and manage multiple site projects with all the details your team needs in one place." },
  { icon: "◷", title: "Daily attendance",     desc: "Mark present, absent, or half-day for every worker. Attendance resets fresh at 12:00 PM each day." },
  { icon: "◈", title: "Wage & payments",      desc: "Calculate weekly wages and pay by cash or UPI. Track partial vs cleared payments per worker." },
  { icon: "✎", title: "Supervisor profile",   desc: "Manage your account, update company details and control your team all from one dashboard." },
  { icon: "◉", title: "Secure & fast",        desc: "JWT-based authentication keeps your data safe. Works on any device — phone, tablet, or desktop." },
];

const STEPS = [
  { num: "01", title: "Register as supervisor",  desc: "Create your account with OTP email verification and set your password." },
  { num: "02", title: "Add your workers",        desc: "Enter worker details. If no email, default credentials are set automatically." },
  { num: "03", title: "Mark attendance daily",   desc: "Every morning mark present, absent, or half-day for each worker on site." },
  { num: "04", title: "Pay at end of week",      desc: "Review auto-calculated wages and log cash or UPI payments as partial or cleared." },
];

export default function HomePage() {
  const { token } = useAuth();
  // const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Built for construction site supervisors
        </div>

        <h1 className="hero-title">
          Manage your site team<br />
          <span className="hero-title-accent">without the paperwork.</span>
        </h1>

        <p className="hero-sub">
          Mason-Mate handles worker records, daily attendance, and weekly wage payments —
          all from your phone or browser, anywhere on site.
        </p>
        <div className="hero-cta">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary">Go to dashboard →</Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Get started free →</Link>
              <Link to="/login"    className="btn btn-outline">Sign in</Link>
            </>
          )}
        </div>

        <div className="hero-stats">
          {[
            { value: "4 modules",   label: "workers · projects · attendance · payments" },
            { value: "12:00 PM",    label: "daily attendance auto-reset" },
            { value: "Cash & UPI",  label: "payment modes supported" },
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <p className="hero-stat-value">{s.value}</p>
              <p className="hero-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Features ── */}
      <section className="features">
        <p className="features-label">What's included</p>
        <h2 className="features-heading">Everything a site supervisor needs.</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-cell">
              <span className="feature-icon">{f.icon}</span>
              <p className="feature-title">{f.title}</p>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ── How it works ── */}
      <section className="how-it-works">
        <div className="how-inner">
          <p className="how-label">How it works</p>
          <h2 className="how-heading">Up and running in minutes.</h2>
          <div className="how-steps">
            {STEPS.map(s => (
              <div key={s.num} className="how-step">
                <div className="how-step-num">{s.num}</div>
                <p className="how-step-title">{s.title}</p>
                <p className="how-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!token && (
        <section className="cta-banner">
          <h2>Ready to run your site smarter?</h2>
          <p>Join supervisors using Mason-Mate to replace notebooks, WhatsApp groups, and manual wage sheets.</p>
          <Link to="/register" className="btn btn-primary">Create free account →</Link>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer-brand">
          <span style={{
            width:24, height:24, background:"var(--clr-text-primary)", color:"#fff",
            borderRadius:6, display:"inline-flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:500
          }}>M</span>
          Mason·Mate
        </div>
        <p className="home-footer-copy">© {new Date().getFullYear()} Mason-Mate. Built for the site.</p>
      </footer>
    </div>
  );
}
