import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllWorkers } from "../api/workers.api";
import { getAllProjects } from "../api/projects.api";
import { getTodayAttendance } from "../api/attendance.api";
import { getWeeklySummary } from "../api/payments.api";
import Spinner from "../components/common/Spinner";
import { formatINR } from "../utils/currency";
import { formatDate } from "../utils/date";
import "./DashboardPage.css";
import "../styles/components.css";

export default function DashboardPage() {
  const { supervisor } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllWorkers(), getAllProjects(), getTodayAttendance(), getWeeklySummary()])
      .then(([w, p, a, pay]) => {
        setStats({
          workers: w.data?.length || 0,
          projects: p.data?.length || 0,
          presentToday: a.data?.filter(r => r.status === "PRESENT").length || 0,
          totalToday: a.data?.length || 0,
          weeklyPaid: pay.data?.totalPaid || 0,
          weeklyPending: pay.data?.totalPending || 0,
        });
      })
      .catch(() => setStats({ workers:0, projects:0, presentToday:0, totalToday:0, weeklyPaid:0, weeklyPending:0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage />;

  const today = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-container">
          <h1>Welcome back, {supervisor?.sup_name?.split(" ")[0] || "Supervisor"}</h1>
          <h1>“Leadership is the ability to inspire confidence, create opportunities, and lead every challenge toward success.”</h1>
          <p className="dashboard-date">{today}</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Total workers</p>
          <p className="stat-value">{stats.workers}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active projects</p>
          <p className="stat-value">{stats.projects}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Present today</p>
          <p className="stat-value">{stats.presentToday}<span className="stat-sub"> / {stats.totalToday}</span></p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Weekly paid</p>
          <p className="stat-value">{formatINR(stats.weeklyPaid)}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Weekly pending</p>
          <p className="stat-value" style={{color:"var(--clr-warning)"}}>{formatINR(stats.weeklyPending)}</p>
        </div>
      </div>

      <div className="dashboard-notice card">
        <p style={{fontSize:13, color:"var(--clr-text-secondary)"}}>
          Attendance resets daily at <strong style={{fontWeight:500}}>12:00 PM</strong>. Submit attendance before noon for accurate records.
        </p>
      </div>
    </div>
  );
}
