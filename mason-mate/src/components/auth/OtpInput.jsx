import React, { useState, useRef, useEffect } from "react";
import {registerSupervisor} from "../../api/auth.api";
import "./OtpInput.css";

export default function OtpInput({ length = 6, onComplete, onResend }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const [timer, setTimer]   = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[i] = val;
    setValues(next);
    if (val && i < length - 1) inputs.current[i + 1]?.focus();
    if (next.every(v => v !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !values[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleResend = async() => { 
    try{
      // await registerSupervisor(localStorage.getItem("email"));
      setTimer(5*60);
      setValues(Array(length).fill("")); 
      onResend?.(); 
    }
    catch(err){
      console.log(err);
    } 
  };

  return (
    <>
      <div className="otp-grid">
        {values.map((v, i) => (
          <input key={i} ref={el => (inputs.current[i] = el)}
            className={`otp-box ${v ? "filled" : ""}`}
            type="text" inputMode="numeric" maxLength={1} value={v}
            onChange={e => handleChange(e, i)} onKeyDown={e => handleKeyDown(e, i)}
            autoFocus={i === 0}
          />
        ))}
      </div>
      <div className="otp-resend-row">
        {timer > 0
          ? <span className="otp-timer">Resend in {timer}s</span>
          : <span className="otp-timer"></span>
        }
        <button className="otp-resend-btn" onClick={handleResend}
          disabled={timer > 0} style={{ opacity: timer > 0 ? 0.3 : 1, color: "var(--clr-text-primary)" }}>
          Resend code
        </button>
      </div>
    </>
  );
}
