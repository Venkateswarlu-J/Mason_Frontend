import React, { useEffect, useState, useCallback } from "react";
import { getAllWorkers } from "../api/workers.api";
import { markAttendance, getWeeklyAttendance } from "../api/attendance.api"; // adjust path as needed
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./AttendancePage.css";

const STATUS_OPTIONS = [
  { value: "PRESENT",  label: "Present",  color: "#22c55e" },
  { value: "ABSENT",   label: "Absent",   color: "#ef4444" },
  { value: "HALF_DAY", label: "Half day", color: "#f59e0b" },
];

// Returns today's date string as YYYY-MM-DD
const todayStr = () => new Date().toISOString().split("T")[0];

export default function AttendancePage() {
  const [workers, setWorkers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [weekDays, setWeekDays]         = useState({}); // workerId -> daysPresent since Monday
  const [attendance, setAttendance]     = useState({}); // workerId -> "PRESENT"|"ABSENT"|"HALF_DAY"
  const [saving, setSaving]             = useState({}); // workerId -> bool
  const [saved, setSaved]               = useState({});  // workerId -> bool (tick flash)
  const { toast, showToast, clearToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [workersRes, weekRes] = await Promise.all([
        getAllWorkers(),
        // getWeeklyAttendance(),          // returns { workerId: daysPresent, ... }
      ]);
      console.log("hello");
      console.log(workersRes);
console.log(workersRes.data);
      const ws = workersRes.data || [];
      console.log(ws);
      setWorkers(ws);
      setWeekDays(weekRes.data || {});

      // Pre-fill today's attendance if already marked
      const initialAtt = {};
      ws.forEach((w) => {
        if (weekRes.data?.[w.workerId]?.todayStatus) {
          initialAtt[w.workerId] = weekRes.data[w.workerId].todayStatus;
        }
      });
      setAttendance(initialAtt);
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatus = (workerId, status) => {
    setAttendance((prev) => ({ ...prev, [workerId]: status }));
  };

  const handleMark = async (worker) => {
    const status = attendance[worker.workerId];
    if (!status) {
      showToast("Please select a status first", "error");
      return;
    }
    setSaving((prev) => ({ ...prev, [worker.workerId]: true }));
    try {
      await markAttendance({
        workerId: worker.workerId,
        date: todayStr(),
        status,
      });
      setSaved((prev) => ({ ...prev, [worker.workerId]: true }));
      setTimeout(() => setSaved((prev) => ({ ...prev, [worker.workerId]: false })), 2000);
      showToast(`Marked ${worker.workerName} as ${status.replace("_", " ").toLowerCase()}`, "success");
      // Refresh weekly count
      const weekRes = await getWeeklyAttendance();
      setWeekDays(weekRes.data || {});
    } catch (err) {
      showToast(err.response?.data || "Failed to mark attendance", "error");
    } finally {
      setSaving((prev) => ({ ...prev, [worker.workerId]: false }));
    }
  };

  const formatCat = (val) => {
    if (!val) return "—";
    return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getDaysInfo = (workerId) => {
    const entry = weekDays[workerId];
    if (entry == null) return "—";
    if (typeof entry === "object") return entry.daysPresent ?? "—";
    return entry;
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="page-header">
        <h1>Attendance</h1>
        <span className="att-date-badge">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</span>
      </div>

      {loading ? (
        <Spinner fullPage />
      ) : workers.length === 0 ? (
        <EmptyState icon="📋" title="No workers found" message="Add workers first to mark attendance." />
      ) : (
        <div className="card table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Category</th>
                <th style={{ textAlign: "center" }}>Days this week</th>
                <th style={{ textAlign: "center" }}>Today's status</th>
                <th></th>
              </tr>
            </thead>
            
            <tbody>
              {workers.map((w) => {
                const current = attendance[w.workerId];
                const isSaving = saving[w.workerId];
                const isSaved  = saved[w.workerId];

                return (
                    
                  <tr key={w.workerId}>
                    {/* Worker name + avatar */}
                    <td>
                      <div className="worker-name-cell">
                        <div className="worker-avatar">{w.workerName?.[0]?.toUpperCase()}</div>
                        <div>
                          <div>{w.workerName}</div>
                          <div style={{ fontSize: 12, color: "var(--clr-text-secondary)", fontFamily: "var(--font-mono)" }}>
                            {w.workerPhone || ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ color: "var(--clr-text-secondary)" }}>
                      {formatCat(w.workerCat)}
                    </td>

                    {/* Days present since Monday */}
                    <td style={{ textAlign: "center" }}>
                      <span className="days-badge">{getDaysInfo(w.workerId)} / 6</span>
                    </td>

                    {/* Status toggle */}
                    <td>
                      <div className="status-group">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            className={`status-btn ${current === opt.value ? "status-btn--active" : ""}`}
                            style={current === opt.value ? { "--status-color": opt.color } : {}}
                            onClick={() => handleStatus(w.workerId, opt.value)}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Mark button */}
                    <td>
                      {isSaved ? (
                        <span className="mark-saved">✓ Saved</span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={isSaving || !current}
                          onClick={() => handleMark(w)}
                        >
                          {isSaving ? "Marking…" : "Mark"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}