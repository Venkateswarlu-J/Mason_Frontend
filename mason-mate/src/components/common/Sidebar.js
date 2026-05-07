/* src/components/common/Sidebar.js */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/dashboard',  label: 'Dashboard',  icon: <IconDashboard /> },
  { path: '/workers',    label: 'Workers',    icon: <IconWorkers /> },
  { path: '/projects',   label: 'Projects',   icon: <IconProjects /> },
  { path: '/attendance', label: 'Attendance', icon: <IconAttendance /> },
  { path: '/payments',   label: 'Payments',   icon: <IconPayments /> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white"/>
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white"/>
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
          </svg>
        </div>
        <span className="sidebar-brand-name">Mason-Mate</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {getInitials(user?.name || user?.email || 'S')}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username || user?.email || 'Supervisor'}</div>
            <div className="sidebar-user-role">Supervisor</div>
          </div>
        </div>
        <button className="nav-link" style={{ width: '100%' }} onClick={handleLogout}>
          <IconLogout />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

/* ── Inline SVG icons ─────────────────────────────── */
function IconDashboard() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <rect x="2" y="2" width="6" height="6" rx="1.5"/>
      <rect x="10" y="2" width="6" height="6" rx="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="1.5"/>
    </svg>
  );
}

function IconWorkers() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <circle cx="7" cy="6" r="3"/>
      <path d="M1 16c0-3.314 2.686-6 6-6"/>
      <circle cx="14" cy="7" r="2.5"/>
      <path d="M10 16c0-2.761 1.79-5 4-5"/>
    </svg>
  );
}

function IconProjects() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <rect x="2" y="2" width="14" height="14" rx="2"/>
      <path d="M6 9h6M6 12h4"/>
    </svg>
  );
}

function IconAttendance() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <rect x="2" y="4" width="14" height="12" rx="2"/>
      <path d="M6 2v3M12 2v3M2 8h14"/>
      <path d="M6 12l1.5 1.5L12 10"/>
    </svg>
  );
}

function IconPayments() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <rect x="2" y="5" width="14" height="10" rx="2"/>
      <path d="M2 9h14"/>
      <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="nav-icon" viewBox="0 0 18 18">
      <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3"/>
      <path d="M12 12l3-3-3-3M15 9H7"/>
    </svg>
  );
}
