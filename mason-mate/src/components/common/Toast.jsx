import React, { useEffect } from "react";
import "../../styles/components.css";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>{message}</div>
    </div>
  );
}
