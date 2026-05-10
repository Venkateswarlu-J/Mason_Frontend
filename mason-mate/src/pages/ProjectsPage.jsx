import React, { useEffect, useState, useCallback } from "react";
import { getAllProjects, addProject, updateStatus, updateProject } from "../api/projects.api";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./WorkersPage.css";

// Matches backend enum Categories exactly
const STATUS = [
  { value: "RUNNING",   label: "Running"   },
  { value: "COMPLETED",  label: "Completed"  },
  { value: "NOT_STARTED",  label: "Not Started"  },
];

const EMPTY_FORM = {
  projectName:  "",
  projectLocation: "",
  projectStatus:   "",
  projectOwner:"",
  ownerPhone:"",

};

export default function ProjectPage() {
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, showToast, clearToast } = useToast();
  const [editingId, setEditingId] = useState(null);

  const fetchProjects = useCallback(() => {
    setLoading(true);
    getAllProjects()
      .then(res => setProjects(res.data || []))
      .catch(() => showToast("Failed to load projects", "error"))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError("");
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if(editingId){
        await updateProject(editingId,form);
        showToast("Project updated successfully","success");
      }
      else{
        await addProject(form);

        showToast("Project added successfully", "success");
      }
      closeModal();
      fetchProjects();
      // await getAllProjects();
    } catch (err) {
      const message=err.response?.data||"Failed to save the project.";
      // setFormError(err.response?.data?.message || "Failed to add project.");
      showToast(message,"error");
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (project) => {
    // if (!window.confirm(`Remove ${name} from the projects?`)) return;
    setEditingId(project.projectId);
    setForm({
      projName:project.projectName||"",
      projectOwner:project.projectOwner||"",
      ownerPhone:project.ownerPhone||"",
      projLocation:project.Location||"",
      projStatus:project.status||"",
    });
    // console.log("hello setting form",project.projName);
    setShowModal(true);
  };

  const handleStatus = async (id, name ,isActive) => {
    const action=isActive?"Deactivate":"Activate";
    if (!window.confirm(`${action} ${name} from the projects?`)) return;
    try {
      const res=await updateStatus(id);
      showToast(res?.data, "success");
      fetchProjects();
    } catch(err) {
      showToast(err.response?.data||"Failed to Update", "error");
    }
  };

  // Format enum value for display: MASON_MESTRI → Mason Mestri
  const formatCat = (val) => {
    if (!val) return "—";
    const found = STATUS.find(c => c.value === val);
    return found ? found.label : val;
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="page-header">
        <h1>Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Project</button>
      </div>

      {loading ? (
        <Spinner fullPage />
      ) : projects.length === 0 ? (
        <EmptyState icon="⬡" title="No projects yet" message="Add your first project to get started."
          action={<button className="btn btn-primary" onClick={() => setShowModal(true)}>Add project</button>} />
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project No</th>
                <th>Project Name</th>
                <th>Owner</th>
                <th>Owner phone</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created At</th>
                <th>isActive</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.projectId}>


                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.projectId || "—"}
                  </td>

                  <td>
                    <div className="worker-name-cell">
                      <div className="worker-avatar">{p.projectName?.[0]?.toUpperCase()}</div>
                      {p.projectName}
                    </div>
                  </td>


                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.projectOwner || "—"}
                  </td>

                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.ownerPhone || "—"}
                  </td>

                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.Location || "—"}
                  </td>


                  <td style={{ color: "var(--clr-text-secondary)" }}>
                    {formatCat(p.status)}
                  </td>

                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.startDate || "—"}
                  </td>

                  <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                    {p.active?"Active":"Inactive"}      
                    {/*The field is isActive but the json serialize as active */}
                  </td>

                  <td>
                    <button className="btn btn-outline"
                      onClick={() => handleUpdate(p)}>
                      Edit/Update
                    </button>
                  </td>
                  
                  <td>
                    <button className={`btn btn-sm ${
                        p.active
                          ? "btn-danger"
                          : "btn-success"
                      }`}
                      onClick={() => handleStatus(p.projectId, p.projectName, p.active)}>
                      {p.active?"Deactivate":"Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal title={editingId?"Update project":"Add Project"} onClose={closeModal}>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div className="form-field">
              <label className="form-label">Project name *</label>
              <input className="form-input" name="projName"
                placeholder="Suresh Kumar Building"
                value={form.projName} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Project owner name *</label>
              <input className="form-input" name="projectOwner"
                placeholder="Suresh"
                value={form.projectOwner} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Owner Phone number *</label>
              <input className="form-input" name="ownerPhone"
                placeholder="+91 98765 43210"
                value={form.ownerPhone} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Project Location *</label>
              <input className="form-input" name="projLocation"
                placeholder="Rama Puram"
                value={form.projLocation} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label className="form-label">Status *</label>
              <select className="form-select" name="projStatus"
                value={form.projStatus} onChange={handleChange} required>
                <option value="">Select a category</option>
                {STATUS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save project"}
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}