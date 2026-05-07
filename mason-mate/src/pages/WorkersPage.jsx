import React, { useEffect, useState, useCallback } from "react";
import { getAllWorkers, addWorker, removeWorker } from "../api/workers.api";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./WorkersPage.css";

const EMPTY_FORM = { name: "", phone: "", role: "", dailyWage: "", email: "" };

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, showToast, clearToast } = useToast();

  const fetchWorkers = useCallback(() => {
    setLoading(true);
    getAllWorkers()
      .then(res => setWorkers(res.data || []))
      .catch(() => showToast("Failed to load workers", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError(""); setSaving(true);
    try {
      await addWorker(form);
      showToast("Worker added successfully", "success");
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchWorkers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add worker.");
    } finally { setSaving(false); }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove ${name} from the team?`)) return;
    try {
      await removeWorker(id);
      showToast("Worker removed", "info");
      fetchWorkers();
    } catch { showToast("Failed to remove worker", "error"); }
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
      <div className="page-header">
        <h1>Workers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add worker</button>
      </div>

      {loading ? <Spinner fullPage /> : workers.length === 0 ? (
        <EmptyState icon="⬡" title="No workers yet" message="Add your first worker to get started."
          action={<button className="btn btn-primary" onClick={() => setShowModal(true)}>Add worker</button>} />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Role</th><th>Phone</th><th>Daily wage</th><th></th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="worker-name-cell">
                      <div className="worker-avatar">{w.name?.[0]?.toUpperCase()}</div>
                      {w.name}
                    </div>
                  </td>
                  <td style={{color:"var(--clr-text-secondary)"}}>{w.role || "—"}</td>
                  <td style={{fontFamily:"var(--font-mono)",fontSize:13}}>{w.phone || "—"}</td>
                  <td style={{fontFamily:"var(--font-mono)",fontSize:13}}>₹{w.dailyWage || "—"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleRemove(w.id, w.name)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title="Add worker" onClose={() => { setShowModal(false); setForm(EMPTY_FORM); setFormError(""); }}>
          <form onSubmit={handleAdd} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div className="form-field">
              <label className="form-label">Full name *</label>
              <input className="form-input" name="name" placeholder="Suresh Kumar" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label className="form-label">Role / Trade</label>
              <input className="form-input" name="role" placeholder="Mason, Helper, Electrician..." value={form.role} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label className="form-label">Phone number *</label>
              <input className="form-input" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label className="form-label">Daily wage (₹) *</label>
              <input className="form-input" name="dailyWage" type="number" placeholder="600" value={form.dailyWage} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label className="form-label">Email (optional — sends login credentials)</label>
              <input className="form-input" name="email" type="email" placeholder="worker@email.com" value={form.email} onChange={handleChange} />
              <p className="form-hint">If no email, default password <strong>worker1234</strong> will be set.</p>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:"0.5rem"}}>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Add worker"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
