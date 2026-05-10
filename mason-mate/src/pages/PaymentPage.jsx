import React, { useEffect, useState, useCallback } from "react";
import { getAllWorkers } from "../api/workers.api";
import { getWeeklyAttendance } from "../api/attendance.api";
import { processPayment } from "../api/payments.api"; // adjust path as needed
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./PaymentPage.css";

const PAY_MODES = [
  { value: "CASH", label: "💵 Cash" },
  { value: "UPI",  label: "📲 UPI"  },
];

export default function PaymentPage() {
  const [workers, setWorkers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [weekDays, setWeekDays]         = useState({});  // workerId -> daysPresent
  const [payMode, setPayMode]           = useState({});  // workerId -> "CASH"|"UPI"
  const [paying, setPaying]             = useState({});  // workerId -> bool
  const [paid, setPaid]                 = useState({});  // workerId -> bool
  const { toast, showToast, clearToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [workersRes, weekRes] = await Promise.all([
        getAllWorkers(),
        // getWeeklyAttendance(),
      ]);
      setWorkers(workersRes.data || []);
      setWeekDays(weekRes.data || {});
    } catch {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getDays = (workerId) => {
    const entry = weekDays[workerId];
    if (entry == null) return 0;
    if (typeof entry === "object") return entry.daysPresent ?? 0;
    return entry;
  };

  const calcAmount = (worker) => {
    const days = getDays(worker.workerId);
    const rate  = parseFloat(worker.payPerDay) || 0;
    return (days * rate).toFixed(0);
  };

  const handlePayMode = (workerId, mode) => {
    setPayMode((prev) => ({ ...prev, [workerId]: mode }));
  };

  const handlePay = async (worker) => {
    const mode = payMode[worker.workerId];
    if (!mode) { showToast("Select a payment mode first", "error"); return; }
    const amount = calcAmount(worker);
    if (Number(amount) === 0) { showToast("Amount is ₹0 — nothing to pay", "error"); return; }

    setPaying((prev) => ({ ...prev, [worker.workerId]: true }));
    try {
      await processPayment({
        workerId: worker.workerId,
        amount:   Number(amount),
        mode,
        weekStart: getMondayStr(),
      });
      setPaid((prev) => ({ ...prev, [worker.workerId]: true }));
      showToast(`Paid ₹${amount} to ${worker.workerName} via ${mode}`, "success");
    } catch (err) {
      showToast(err.response?.data || "Payment failed", "error");
    } finally {
      setPaying((prev) => ({ ...prev, [worker.workerId]: false }));
    }
  };

  const getMondayStr = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  const formatCat = (val) => {
    if (!val) return "—";
    return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const totalPayable = workers.reduce((sum, w) => sum + Number(calcAmount(w)), 0);

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="page-header">
        <h1>Payment</h1>
        <div className="pay-week-badge">
          Week of {new Date(getMondayStr()).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </div>
      </div>

      {/* Summary bar */}
      {!loading && workers.length > 0 && (
        <div className="pay-summary-bar">
          <div className="pay-summary-item">
            <span className="pay-summary-label">Workers</span>
            <span className="pay-summary-value">{workers.length}</span>
          </div>
          <div className="pay-summary-item">
            <span className="pay-summary-label">Total payable</span>
            <span className="pay-summary-value pay-summary-amount">₹{totalPayable.toLocaleString("en-IN")}</span>
          </div>
          <div className="pay-summary-item">
            <span className="pay-summary-label">Already paid</span>
            <span className="pay-summary-value">{Object.values(paid).filter(Boolean).length}</span>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner fullPage />
      ) : workers.length === 0 ? (
        <EmptyState icon="💰" title="No workers found" message="Add workers first to process payments." />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Category</th>
                <th style={{ textAlign: "center" }}>Days worked</th>
                <th style={{ textAlign: "right" }}>Daily wage</th>
                <th style={{ textAlign: "right" }}>Amount due</th>
                <th style={{ textAlign: "center" }}>Pay via</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => {
                const days    = getDays(w.workerId);
                const amount  = calcAmount(w);
                const mode    = payMode[w.workerId];
                const isPaying = paying[w.workerId];
                const isPaid   = paid[w.workerId];

                return (
                  <tr key={w.workerId} className={isPaid ? "pay-row--paid" : ""}>
                    {/* Worker */}
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

                    {/* Days worked */}
                    <td style={{ textAlign: "center" }}>
                      <span className="days-pill">{days} day{days !== 1 ? "s" : ""}</span>
                    </td>

                    {/* Daily wage */}
                    <td style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      ₹{w.payPerDay || "—"}
                    </td>

                    {/* Amount due */}
                    <td style={{ textAlign: "right" }}>
                      <span className={`amount-due ${Number(amount) === 0 ? "amount-zero" : ""}`}>
                        ₹{Number(amount).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Pay mode toggle */}
                    <td>
                      <div className="paymode-group">
                        {PAY_MODES.map((pm) => (
                          <button
                            key={pm.value}
                            className={`paymode-btn ${mode === pm.value ? "paymode-btn--active" : ""}`}
                            onClick={() => handlePayMode(w.workerId, pm.value)}
                            disabled={isPaid}
                          >
                            {pm.label}
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Pay action */}
                    <td>
                      {isPaid ? (
                        <span className="pay-done">✓ Paid</span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={isPaying || !mode || Number(amount) === 0}
                          onClick={() => handlePay(w)}
                        >
                          {isPaying ? "Processing…" : "Pay"}
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