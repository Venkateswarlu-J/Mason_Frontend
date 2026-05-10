import React, { useEffect, useState, useCallback } from "react";
import { getAllWorkers, addWorker, removeWorker ,updateWorker ,getWorkers ,getRemovedWorkers } from "../api/workers.api";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./WorkersPage.css";

// Matches backend enum Categories exactly
const CATEGORIES = [
  { value: "ELECTRICIAN",   label: "Electrician"   },
  { value: "MASON_MESTRI",  label: "Mason Mestri"  },
  { value: "MASON_COOLIE",  label: "Mason Coolie"  },
  { value: "WOOD_WORKER",   label: "Wood Worker"   },
  { value: "WOOD_MESTRI",   label: "Wood Mestri"   },
  { value: "TILES_MESTRI",  label: "Tiles Mestri"  },
  { value: "TILES_WORKER",  label: "Tiles Worker"  },
];

const EMPTY_FORM = {
  workerName:  "",
  workerPhone: "",
  workerCat:   "",
  payPerDay:   "",
  email:       "",
};

export default function WorkersPage() {
  const [workers, setWorkers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, showToast, clearToast } = useToast();
  const [editingId,setEditingId] =useState(null);
  const [removedView, setRemovedView] = useState(false);

  const fetchWorkers = useCallback(() => {
    setLoading(true);
    getWorkers()
      .then(res => setWorkers(res.data || []))
      .catch(() => showToast("Failed to load workers", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if(editingId){
        await updateWorker(editingId,form);
        showToast("Worker Updated Successfully");
      }
      else{
        const res=await addWorker(form);
        showToast("Worker added successfully", "success");
      }
      closeModal();
      fetchWorkers();
      // await getAllWorkers();
    } catch (err) {
      const message=err.response?.data||"Failed to add worker.";
      showToast(message,"error");
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id, name) => {
    const action=removedView?"Adding":"Removing";
    if (!window.confirm(`${action} ${name}`)) return;
    try {
      const res=await removeWorker(id);
      if(removedView){
        showToast(res.data,"success");
        handleRemovedWorkers();
      }
      else{
        fetchWorkers();
        showToast(res.data, "success");
      }
    } catch(err) {
      showToast(err.response?.data||"Failed to remove worker", "error");
    }
  };

  const handleRemovedWorkers = async (e) => {
    try {
      setLoading(true);
      const res=await getRemovedWorkers();
      setWorkers(res.data||[]);
      showToast("Removed workers", "info");
    } catch (err){
      showToast(err.response?.data||"Failed to get workers", "error");
    }
    finally{
      setLoading(false);
    }
  };

  const handleUpdate = async (worker) => {
    setEditingId(worker.workerId);
    setForm({
      workerCat:worker.workerCat||"",
      workerPhone:worker.workerPhone||"",
      workerName:worker.workerName||"",
      payPerDay:worker.payPerDay||"",

    });
    setShowModal(true);
  };

  // Format enum value for display: MASON_MESTRI → Mason Mestri
  const formatCat = (val) => {
    if (!val) return "—";
    const found = CATEGORIES.find(c => c.value === val);
    return found ? found.label : val;
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="page-header">
        <h1>Workers</h1>
        <div
            style={{
              display: "flex",
              gap: "0.75rem"
            }}
        >
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add worker</button>
          <button className="btn btn-primary" onClick={() => {if(removedView){
            fetchWorkers();
            setRemovedView(false);
          }
          else{
            handleRemovedWorkers();
            setRemovedView(true);
          }}
          }>{!removedView?"Removed workers":"Active Workers"}</button>
        </div>
      </div>

      {loading ? (
        <Spinner fullPage />
      ) : workers.length === 0 ?(removedView?(<EmptyState icon="⬡" title="All are active" message="Boom your work."/>):(
        <EmptyState icon="⬡" title="No workers yet" message="Add your first worker to get started."
          action={<button className="btn btn-primary" onClick={() => setShowModal(true)}>Add worker</button>} />
      ) ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker id</th>
                <th>Name</th>
                <th>Category</th>
                <th>Daily wage</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.workerId}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {w.workerId || "—"}
                  </td>
                  <td>
                    <div className="worker-name-cell">
                      <div className="worker-avatar">{w.workerName?.[0]?.toUpperCase()}</div>
                      {w.workerName}
                    </div>
                  </td>
                  <td style={{ color: "var(--clr-text-secondary)" }}>
                    {formatCat(w.workerCat)}
                  </td>
                  
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    ₹{w.payPerDay || "—"}
                    
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {w.workerPhone || "—"}
                  </td>
                  <td>
                    <button className="btn btn-outline"
                      onClick={() => handleUpdate(w)}>
                      Edit/Update
                    </button>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(w.workerId, w.workerName)}>
                      {removedView?"Activate":"Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      )}

      {showModal && (
        <Modal title={editingId?"Update Worker":"Add worker"} onClose={closeModal}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div className="form-field">
              <label className="form-label">Full name *</label>
              <input className="form-input" name="workerName"
                placeholder="Suresh Kumar"
                value={form.workerName} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Category *</label>
              <select className="form-select" name="workerCat"
                value={form.workerCat} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Phone number *</label>
              <input className="form-input" name="workerPhone"
                placeholder="+91 98765 43210"
                value={form.workerPhone} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Daily wage (₹) *</label>
              <input className="form-input" name="payPerDay" type="number"
                placeholder="600"
                value={form.payPerDay} onChange={handleChange} required />
            </div>

            {!editingId&&(<div className="form-field">
              <label className="form-label">Email (optional)</label>
              <input className="form-input" name="email" type="email"
                placeholder="worker@email.com"
                value={form.email} onChange={handleChange} />
              <p className="form-hint">
                If no email provided, default password <strong>worker1234</strong> will be set.
              </p>
            </div>
            )}

            {formError && <p className="form-error">{formError}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : editingId?"Update worker":"Add worker"}
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}