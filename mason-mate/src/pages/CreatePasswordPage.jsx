import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPassword } from "../api/auth.api";
import PasswordStrength from "../components/auth/PasswordStrength";
import "../components/auth/AuthLayout.css";
import "../styles/components.css";

export default function CreatePasswordPage() {
  const navigate = useNavigate();
  const { email } = useLocation().state || {};
  const [pw, setPw]     = useState("");
  const [cpw, setCpw]   = useState("");
  const [show, setShow] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const match   = pw === cpw && cpw.length > 0;
  const canSubmit = pw.length >= 6 && match;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError(""); setLoading(true);
    try {
      const res=await createPassword({ username:localStorage.getItem("username"),phone:localStorage.getItem("phone"),email:email, password: pw });
      // alert(res.data);
      // console.log(res.data.success);
      if(res.data.success){
        alert("Account created succesfully!!");
        navigate("/login", { state: { registered: true } });
      }else {
        setError(res.data.data || "Failed to create account");
      }
    } catch (err) {
      console.log("hi");
      setError(err.response?.data?.data || "Failed to set password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">M</div>
          <span className="auth-brand-name">Mason-Mate</span>
        </div>
        <div className="auth-progress">
          {[1,2,3,4].map(i => <div key={i} className={`auth-progress-seg ${i <= 3 ? "active" : ""}`} />)}
        </div>
        <p className="auth-step">Step 3 of 4</p>
        <h1 className="auth-title">Create a password</h1>
        <p className="auth-subtitle">Choose a strong password for your supervisor account.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Password</label>
            <div style={{position:"relative"}}>
              <input className="form-input" type={show ? "text" : "password"} placeholder="Min 6 characters"
                value={pw} onChange={e => setPw(e.target.value)} style={{paddingRight:52}} />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:11,fontFamily:"var(--font-mono)",color:"var(--clr-text-muted)",letterSpacing:"0.05em"}}>
                {show ? "HIDE" : "SHOW"}
              </button>
            </div>
            <PasswordStrength password={pw} />
          </div>
          <div className="form-field">
            <label className="form-label">Confirm password</label>
            <input className="form-input" type={show ? "text" : "password"} placeholder="Re-enter password"
              value={cpw} onChange={e => setCpw(e.target.value)} />
            {cpw.length > 0 && (
              <p style={{fontSize:12, color: match ? "var(--clr-success)" : "var(--clr-danger)"}}>
                {match ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={!canSubmit || loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </form>
      </div>
    </div>
  );
}
