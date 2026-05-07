import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {registerSupervisor} from "../api/auth.api";
import { verifyOtp } from "../api/auth.api";
import OtpInput from "../components/auth/OtpInput";
import "../components/auth/AuthLayout.css";
import "../styles/components.css";

export default function VerifyOtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [success, setSuccess] = useState("");
  const { email, flow } = location.state || {};
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      const res = await registerSupervisor({email});

      if (res.data.success) {
        setError(""); 
        setSuccess("OTP sent successfully");
      } else {
        setError(res.data.message);
      }

    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  const handleComplete = async (otp) => {
    setError(""); setLoading(true);
    try {
      const res=await verifyOtp(email, otp);
      if(res.data.success){
        if (flow === "register") navigate("/create-password", { state: { email } });
        else navigate("/dashboard");
      }
      else{
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
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
          {[1,2,3,4].map(i => <div key={i} className={`auth-progress-seg ${i <= 2 ? "active" : ""}`} />)}
        </div>
        <button className="auth-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <p className="auth-step">Step 2 of 4</p>
        <h1 className="auth-title">Enter OTP</h1>
        <p className="auth-subtitle">We sent a 6-digit code to <strong style={{fontWeight:500}}>{email}</strong></p>
        <OtpInput length={6} onComplete={handleComplete} onResend={handleResend}/>
        {error && <p className="form-error" style={{marginBottom:"0.75rem"}}>{error}</p>}
        {loading && <p style={{fontSize:13,color:"var(--clr-text-muted)"}}>Verifying...</p>}
      </div>
    </div>
  );
}
