import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const PUBLIC_LINKS = [
  { to: "/",        label: "Home"    },
  { to: "/about",   label: "About"   },
  { to: "/contact", label: "Contact" },
];

const PRIVATE_LINKS = [
  { to: "/dashboard",  label: "Home"       },
  { to: "/workers",    label: "Workers"    },
  { to: "/projects",   label: "Projects"   },
  { to: "/attendance", label: "Attendance" },
  { to: "/payments",   label: "Payments"   },
  { to: "/contact",    label: "Contact"      },
  { to: "/about",      label: "About"      },
];

const PROFILE_ITEMS = [
  { to: "/profile", label: "Change Password", icon: "✎" },
];

export default function Header() {
  const { supervisor, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ use location, NOT navigate, to detect route changes
  const isLoggedIn = !!token;

  const [dropOpen, setDropOpen]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropRef = useRef(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ✅ FIXED: depend on location.pathname, not navigate
     navigate is a new reference every render → caused infinite re-render loop */
  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = supervisor?.sup_name
    ? supervisor.sup_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "SV";

  const firstName = supervisor?.sup_name?.split(" ")[0] || "Supervisor";

  return (
    <>
      <header className="header">
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="header-brand">
          <div className="header-brand-icon">M</div>
          <span className="header-brand-name">Mason<span className="header-brand-dot">·</span>Mate</span>
        </Link>

        <nav className="header-nav">
          {(isLoggedIn ? PRIVATE_LINKS : PUBLIC_LINKS).map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `header-nav-link ${isActive ? "active" : ""}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        {!isLoggedIn ? (
          <div className="header-auth">
            <Link to="/login"    className="btn btn-outline btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        ) : (
          <div className="header-profile-wrap" ref={dropRef}>
            <button className="header-profile-btn" onClick={() => setDropOpen(o => !o)}>
              <div className="header-profile-avatar">{initials}</div>
              <span className="header-profile-name">{firstName}</span>
              <span className={`header-profile-chevron ${dropOpen ? "open" : ""}`}>▾</span>
            </button>

            {dropOpen && (
              <div className="header-dropdown">
                <div className="header-dropdown-user">
                  <p className="header-dropdown-user-name">{supervisor?.name}</p>
                  <p className="header-dropdown-user-email">{supervisor?.email}</p>
                </div>
                <div className="header-dropdown-items">
                  {PROFILE_ITEMS.map(({ to, label, icon }) => (
                    <Link key={to} to={to} className="header-dropdown-item"
                      onClick={() => setDropOpen(false)}>
                      <span className="header-dropdown-icon">{icon}</span>
                      {label}
                    </Link>
                  ))}
                  <div className="header-dropdown-divider" />
                  <button className="header-dropdown-item danger" onClick={handleLogout}>
                    <span className="header-dropdown-icon">⇥</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button className={`header-hamburger ${mobileOpen ? "open" : ""}`}
          onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </header>

      {mobileOpen && (
        <nav className="header-mobile-nav">
          {(isLoggedIn ? PRIVATE_LINKS : PUBLIC_LINKS).map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `header-mobile-link ${isActive ? "active" : ""}`}>
              {label}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <>
              <div className="header-mobile-divider" />
              <Link to="/login"    className="header-mobile-link" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/register" className="header-mobile-link" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <div className="header-mobile-divider" />
              <p className="header-mobile-user">{supervisor?.name}</p>
              <Link to="/ChangePasswordPage" className="header-mobile-link" onClick={() => setMobileOpen(false)}>✎ Edit profile</Link>
              <button className="header-mobile-link danger" onClick={handleLogout}>⇥ Logout</button>
            </>
          )}
        </nav>
      )}
    </>
  );
}