import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AppShell.css";

const TITLES = { "/dashboard": "Dashboard", "/workers": "Workers", "/projects": "Projects", "/attendance": "Attendance", "/payments": "Payments" };

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="app-shell">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Topbar title={TITLES[location.pathname] || "Mason-Mate"} onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content"><Outlet /></main>
      </div>
    </div>
  );
}
