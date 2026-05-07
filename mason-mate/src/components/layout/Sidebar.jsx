import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard",  label: "Dashboard",  icon: "▦" },
  { to: "/workers",    label: "Workers",     icon: "⬡" },
  { to: "/projects",   label: "Projects",    icon: "◫" },
  { to: "/attendance", label: "Attendance",  icon: "◷" },
  { to: "/payments",   label: "Payments",    icon: "◈" },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { supervisor, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  const initials = supervisor?.name
    ? supervisor.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
    : "SV";

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">M</div>
          <span className="sidebar-brand-name">Mason-Mate</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
              <span className="sidebar-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user">
            <p className="sidebar-user-name">{supervisor?.name || "Supervisor"}</p>
            <p className="sidebar-user-role">Supervisor</p>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">⇥</button>
        </div>
      </aside>
    </>
  );
}
